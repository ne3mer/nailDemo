-- Extensions and shared timestamp helper.

-- btree_gist enables exclusion constraints combining uuid equality + range overlap.
CREATE EXTENSION IF NOT EXISTS btree_gist WITH SCHEMA extensions;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = timezone('utc', now());
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.set_updated_at() IS
  'Trigger function: sets NEW.updated_at to current UTC timestamp.';
-- Core multi-tenant tables: profiles, businesses, and child entities.

-- ---------------------------------------------------------------------------
-- profiles (1:1 with auth.users)
-- ---------------------------------------------------------------------------
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  full_name text NOT NULL,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- Auto-create a profile row when a new auth user signs up.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email, 'Owner')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ---------------------------------------------------------------------------
-- businesses
-- ---------------------------------------------------------------------------
CREATE TABLE public.businesses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE RESTRICT,
  name text NOT NULL,
  slug text NOT NULL,
  description_en text,
  description_hu text,
  phone text,
  email text,
  address text,
  instagram_url text,
  logo_url text,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  CONSTRAINT businesses_slug_format CHECK (
    slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
  ),
  CONSTRAINT businesses_slug_unique UNIQUE (slug)
);

CREATE INDEX businesses_owner_id_idx ON public.businesses (owner_id);

CREATE TRIGGER businesses_set_updated_at
  BEFORE UPDATE ON public.businesses
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- Ownership helper (defined after businesses exists).
CREATE OR REPLACE FUNCTION public.is_business_owner(p_business_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.businesses AS b
    WHERE b.id = p_business_id
      AND b.owner_id = auth.uid()
  );
$$;

COMMENT ON FUNCTION public.is_business_owner(uuid) IS
  'Returns true when auth.uid() owns the given business.';

REVOKE ALL ON FUNCTION public.is_business_owner(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_business_owner(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_business_owner(uuid) TO anon;

-- ---------------------------------------------------------------------------
-- services
-- ---------------------------------------------------------------------------
CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES public.businesses (id) ON DELETE CASCADE,
  name_en text NOT NULL,
  name_hu text NOT NULL,
  description_en text,
  description_hu text,
  price numeric(12, 2) NOT NULL,
  currency text NOT NULL DEFAULT 'HUF',
  duration_minutes integer NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  CONSTRAINT services_price_non_negative CHECK (price >= 0),
  CONSTRAINT services_duration_positive CHECK (duration_minutes > 0),
  CONSTRAINT services_currency_not_blank CHECK (char_length(trim(currency)) > 0)
);

CREATE INDEX services_business_id_idx ON public.services (business_id);
CREATE INDEX services_business_id_is_active_idx
  ON public.services (business_id, is_active);

CREATE TRIGGER services_set_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- working_hours (multiple intervals per weekday supported)
-- day_of_week: 0=Sunday … 6=Saturday
-- Times are wall-clock local times for Europe/Budapest (not timestamptz).
-- ---------------------------------------------------------------------------
CREATE TABLE public.working_hours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES public.businesses (id) ON DELETE CASCADE,
  day_of_week integer NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  CONSTRAINT working_hours_day_of_week_range CHECK (
    day_of_week >= 0 AND day_of_week <= 6
  ),
  CONSTRAINT working_hours_time_order CHECK (end_time > start_time)
);

CREATE INDEX working_hours_business_id_idx ON public.working_hours (business_id);
CREATE INDEX working_hours_business_id_day_idx
  ON public.working_hours (business_id, day_of_week);

CREATE TRIGGER working_hours_set_updated_at
  BEFORE UPDATE ON public.working_hours
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- blocked_times
-- ---------------------------------------------------------------------------
CREATE TABLE public.blocked_times (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES public.businesses (id) ON DELETE CASCADE,
  start_at timestamptz NOT NULL,
  end_at timestamptz NOT NULL,
  reason text,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  CONSTRAINT blocked_times_range_valid CHECK (end_at > start_at)
);

CREATE INDEX blocked_times_business_id_idx ON public.blocked_times (business_id);
CREATE INDEX blocked_times_business_id_start_at_idx
  ON public.blocked_times (business_id, start_at);

CREATE TRIGGER blocked_times_set_updated_at
  BEFORE UPDATE ON public.blocked_times
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- appointments
-- ---------------------------------------------------------------------------
CREATE TABLE public.appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES public.businesses (id) ON DELETE CASCADE,
  service_id uuid NOT NULL REFERENCES public.services (id) ON DELETE RESTRICT,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_email text,
  notes text,
  start_at timestamptz NOT NULL,
  end_at timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  CONSTRAINT appointments_status_allowed CHECK (
    status IN ('pending', 'confirmed', 'cancelled', 'completed')
  ),
  CONSTRAINT appointments_range_valid CHECK (end_at > start_at),
  CONSTRAINT appointments_customer_name_not_blank CHECK (
    char_length(trim(customer_name)) > 0
  ),
  CONSTRAINT appointments_customer_phone_not_blank CHECK (
    char_length(trim(customer_phone)) > 0
  )
);

CREATE INDEX appointments_business_id_idx ON public.appointments (business_id);
CREATE INDEX appointments_business_id_start_at_idx
  ON public.appointments (business_id, start_at);
CREATE INDEX appointments_service_id_idx ON public.appointments (service_id);
CREATE INDEX appointments_business_id_status_idx
  ON public.appointments (business_id, status);

-- Prevent overlapping active bookings for the same business (DB-level).
-- Cancelled/completed do not block new bookings; pending/confirmed do.
CREATE EXTENSION IF NOT EXISTS btree_gist WITH SCHEMA extensions;

ALTER TABLE public.appointments
  ADD CONSTRAINT appointments_no_overlap
  EXCLUDE USING gist (
    business_id WITH =,
    tstzrange(start_at, end_at, '[)') WITH &&
  )
  WHERE (status IN ('pending', 'confirmed'));

CREATE TRIGGER appointments_set_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- Ensure service belongs to business; duration matches; public cannot book inactive services.
CREATE OR REPLACE FUNCTION public.validate_appointment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  svc public.services%ROWTYPE;
BEGIN
  SELECT *
  INTO svc
  FROM public.services
  WHERE id = NEW.service_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Service not found';
  END IF;

  IF svc.business_id IS DISTINCT FROM NEW.business_id THEN
    RAISE EXCEPTION 'service_id does not belong to business_id';
  END IF;

  IF NEW.end_at IS DISTINCT FROM (NEW.start_at + make_interval(mins => svc.duration_minutes)) THEN
    RAISE EXCEPTION 'Appointment end_at must equal start_at + service duration_minutes';
  END IF;

  IF TG_OP = 'INSERT'
     AND NOT svc.is_active
     AND NOT public.is_business_owner(NEW.business_id) THEN
    RAISE EXCEPTION 'Cannot book an inactive service';
  END IF;

  IF TG_OP = 'INSERT'
     AND NEW.status IS DISTINCT FROM 'pending'
     AND NOT public.is_business_owner(NEW.business_id) THEN
    RAISE EXCEPTION 'Public bookings must start with status pending';
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER appointments_validate
  BEFORE INSERT OR UPDATE OF business_id, service_id, start_at, end_at, status
  ON public.appointments
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_appointment();

-- ---------------------------------------------------------------------------
-- portfolio_items
-- ---------------------------------------------------------------------------
CREATE TABLE public.portfolio_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES public.businesses (id) ON DELETE CASCADE,
  title_en text,
  title_hu text,
  image_path text NOT NULL,
  category text,
  sort_order integer NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  CONSTRAINT portfolio_items_image_path_not_blank CHECK (
    char_length(trim(image_path)) > 0
  ),
  CONSTRAINT portfolio_items_category_allowed CHECK (
    category IS NULL
    OR category IN ('Haircuts', 'Coloring', 'Styling', 'Other')
  )
);

CREATE INDEX portfolio_items_business_id_idx ON public.portfolio_items (business_id);
CREATE INDEX portfolio_items_business_id_sort_order_idx
  ON public.portfolio_items (business_id, sort_order);
CREATE INDEX portfolio_items_business_id_visible_idx
  ON public.portfolio_items (business_id, is_visible);

CREATE TRIGGER portfolio_items_set_updated_at
  BEFORE UPDATE ON public.portfolio_items
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();
-- Row Level Security for multi-tenant isolation.

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.working_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_times ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;

-- Force RLS for table owners as well (defense in depth).
ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;
ALTER TABLE public.businesses FORCE ROW LEVEL SECURITY;
ALTER TABLE public.services FORCE ROW LEVEL SECURITY;
ALTER TABLE public.working_hours FORCE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_times FORCE ROW LEVEL SECURITY;
ALTER TABLE public.appointments FORCE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_items FORCE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
CREATE POLICY profiles_select_own
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY profiles_update_own
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Inserts come from handle_new_user (SECURITY DEFINER); no direct client insert policy.

-- ---------------------------------------------------------------------------
-- businesses
-- Public can read businesses (needed for slug-based public site / booking).
-- Owners manage their own rows.
-- ---------------------------------------------------------------------------
CREATE POLICY businesses_public_select
  ON public.businesses
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY businesses_owner_insert
  ON public.businesses
  FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY businesses_owner_update
  ON public.businesses
  FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY businesses_owner_delete
  ON public.businesses
  FOR DELETE
  TO authenticated
  USING (owner_id = auth.uid());

-- ---------------------------------------------------------------------------
-- services
-- ---------------------------------------------------------------------------
CREATE POLICY services_public_select_active
  ON public.services
  FOR SELECT
  TO anon, authenticated
  USING (
    is_active = true
    OR public.is_business_owner(business_id)
  );

CREATE POLICY services_owner_insert
  ON public.services
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_business_owner(business_id));

CREATE POLICY services_owner_update
  ON public.services
  FOR UPDATE
  TO authenticated
  USING (public.is_business_owner(business_id))
  WITH CHECK (public.is_business_owner(business_id));

CREATE POLICY services_owner_delete
  ON public.services
  FOR DELETE
  TO authenticated
  USING (public.is_business_owner(business_id));

-- ---------------------------------------------------------------------------
-- working_hours
-- ---------------------------------------------------------------------------
CREATE POLICY working_hours_public_select_active
  ON public.working_hours
  FOR SELECT
  TO anon, authenticated
  USING (
    is_active = true
    OR public.is_business_owner(business_id)
  );

CREATE POLICY working_hours_owner_insert
  ON public.working_hours
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_business_owner(business_id));

CREATE POLICY working_hours_owner_update
  ON public.working_hours
  FOR UPDATE
  TO authenticated
  USING (public.is_business_owner(business_id))
  WITH CHECK (public.is_business_owner(business_id));

CREATE POLICY working_hours_owner_delete
  ON public.working_hours
  FOR DELETE
  TO authenticated
  USING (public.is_business_owner(business_id));

-- ---------------------------------------------------------------------------
-- blocked_times (owner only — not exposed to public clients)
-- Availability using blocked times should be computed server-side in later phases.
-- ---------------------------------------------------------------------------
CREATE POLICY blocked_times_owner_select
  ON public.blocked_times
  FOR SELECT
  TO authenticated
  USING (public.is_business_owner(business_id));

CREATE POLICY blocked_times_owner_insert
  ON public.blocked_times
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_business_owner(business_id));

CREATE POLICY blocked_times_owner_update
  ON public.blocked_times
  FOR UPDATE
  TO authenticated
  USING (public.is_business_owner(business_id))
  WITH CHECK (public.is_business_owner(business_id));

CREATE POLICY blocked_times_owner_delete
  ON public.blocked_times
  FOR DELETE
  TO authenticated
  USING (public.is_business_owner(business_id));

-- ---------------------------------------------------------------------------
-- appointments
-- Public: insert pending bookings only.
-- Owners: full manage for their business.
-- No public SELECT (protects customer PII).
-- ---------------------------------------------------------------------------
CREATE POLICY appointments_public_insert
  ON public.appointments
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    status = 'pending'
    AND EXISTS (
      SELECT 1
      FROM public.services AS s
      WHERE s.id = service_id
        AND s.business_id = business_id
        AND s.is_active = true
    )
  );

CREATE POLICY appointments_owner_select
  ON public.appointments
  FOR SELECT
  TO authenticated
  USING (public.is_business_owner(business_id));

CREATE POLICY appointments_owner_insert
  ON public.appointments
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_business_owner(business_id));

CREATE POLICY appointments_owner_update
  ON public.appointments
  FOR UPDATE
  TO authenticated
  USING (public.is_business_owner(business_id))
  WITH CHECK (public.is_business_owner(business_id));

CREATE POLICY appointments_owner_delete
  ON public.appointments
  FOR DELETE
  TO authenticated
  USING (public.is_business_owner(business_id));

-- ---------------------------------------------------------------------------
-- portfolio_items
-- ---------------------------------------------------------------------------
CREATE POLICY portfolio_items_public_select_visible
  ON public.portfolio_items
  FOR SELECT
  TO anon, authenticated
  USING (
    is_visible = true
    OR public.is_business_owner(business_id)
  );

CREATE POLICY portfolio_items_owner_insert
  ON public.portfolio_items
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_business_owner(business_id));

CREATE POLICY portfolio_items_owner_update
  ON public.portfolio_items
  FOR UPDATE
  TO authenticated
  USING (public.is_business_owner(business_id))
  WITH CHECK (public.is_business_owner(business_id));

CREATE POLICY portfolio_items_owner_delete
  ON public.portfolio_items
  FOR DELETE
  TO authenticated
  USING (public.is_business_owner(business_id));
-- Portfolio storage bucket and policies.
-- Object path convention: businesses/{business_id}/portfolio/{filename}

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio',
  'portfolio',
  true,
  10485760, -- 10 MiB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE
SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Extract business_id from object path: businesses/<uuid>/portfolio/<file>
CREATE OR REPLACE FUNCTION public.portfolio_object_business_id(object_name text)
RETURNS uuid
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  parts text[];
  business_id uuid;
BEGIN
  parts := string_to_array(object_name, '/');

  IF array_length(parts, 1) < 4 THEN
    RETURN NULL;
  END IF;

  IF parts[1] IS DISTINCT FROM 'businesses' THEN
    RETURN NULL;
  END IF;

  IF parts[3] IS DISTINCT FROM 'portfolio' THEN
    RETURN NULL;
  END IF;

  BEGIN
    business_id := parts[2]::uuid;
  EXCEPTION
    WHEN invalid_text_representation THEN
      RETURN NULL;
  END;

  RETURN business_id;
END;
$$;

COMMENT ON FUNCTION public.portfolio_object_business_id(text) IS
  'Parses business UUID from portfolio storage path businesses/{id}/portfolio/{file}.';

REVOKE ALL ON FUNCTION public.portfolio_object_business_id(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.portfolio_object_business_id(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.portfolio_object_business_id(text) TO anon;

-- Public read (bucket is also marked public for CDN/public URL access).
CREATE POLICY portfolio_storage_public_select
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'portfolio');

-- Owners may upload only under their business folder.
CREATE POLICY portfolio_storage_owner_insert
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'portfolio'
    AND public.is_business_owner(
      public.portfolio_object_business_id(name)
    )
  );

CREATE POLICY portfolio_storage_owner_update
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'portfolio'
    AND public.is_business_owner(
      public.portfolio_object_business_id(name)
    )
  )
  WITH CHECK (
    bucket_id = 'portfolio'
    AND public.is_business_owner(
      public.portfolio_object_business_id(name)
    )
  );

CREATE POLICY portfolio_storage_owner_delete
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'portfolio'
    AND public.is_business_owner(
      public.portfolio_object_business_id(name)
    )
  );
-- Explicit grants for Supabase API roles (reproducible across local/remote).

GRANT USAGE ON SCHEMA public TO anon, authenticated;

GRANT SELECT ON TABLE public.businesses TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.businesses TO authenticated;

GRANT SELECT ON TABLE public.services TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.services TO authenticated;

GRANT SELECT ON TABLE public.working_hours TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.working_hours TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.blocked_times TO authenticated;

GRANT INSERT ON TABLE public.appointments TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON TABLE public.appointments TO authenticated;

GRANT SELECT ON TABLE public.portfolio_items TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.portfolio_items TO authenticated;

GRANT SELECT, UPDATE ON TABLE public.profiles TO authenticated;

-- Sequences / defaults (uuid generated via gen_random_uuid; no serials required).
-- RPC function for public availability calculations.
-- Bypasses direct SELECT on private appointments and blocked_times tables
-- while returning ONLY anonymized start_at and end_at timestamps.

CREATE OR REPLACE FUNCTION public.get_occupied_intervals(
  p_business_id uuid,
  p_start_at timestamptz,
  p_end_at timestamptz
)
RETURNS TABLE (
  start_at timestamptz,
  end_at timestamptz
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  -- Verify target business exists
  IF NOT EXISTS (SELECT 1 FROM public.businesses WHERE id = p_business_id) THEN
    RETURN;
  END IF;

  RETURN QUERY
  -- 1. Active appointments (pending & confirmed block availability)
  SELECT a.start_at, a.end_at
  FROM public.appointments AS a
  WHERE a.business_id = p_business_id
    AND a.status IN ('pending', 'confirmed')
    AND a.start_at < p_end_at
    AND a.end_at > p_start_at

  UNION ALL

  -- 2. Internal blocked times
  SELECT b.start_at, b.end_at
  FROM public.blocked_times AS b
  WHERE b.business_id = p_business_id
    AND b.start_at < p_end_at
    AND b.end_at > p_start_at;
END;
$$;

COMMENT ON FUNCTION public.get_occupied_intervals(uuid, timestamptz, timestamptz) IS
  'Returns anonymized start_at and end_at timestamps for active appointments and blocked times without exposing customer PII or notes.';

REVOKE ALL ON FUNCTION public.get_occupied_intervals(uuid, timestamptz, timestamptz) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_occupied_intervals(uuid, timestamptz, timestamptz) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_occupied_intervals(uuid, timestamptz, timestamptz) TO anon;
-- Migration: 20261001010000_multi_barber_schema.sql
-- Multi-barber & multi-staff platform evolution

-- 1. Create barbers table
CREATE TABLE IF NOT EXISTS public.barbers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES public.businesses (id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.profiles (id) ON DELETE SET NULL,
  name text NOT NULL,
  profile_photo_url text,
  bio_en text,
  bio_hu text,
  is_active boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS barbers_business_id_idx ON public.barbers (business_id);
CREATE INDEX IF NOT EXISTS barbers_user_id_idx ON public.barbers (user_id);
CREATE INDEX IF NOT EXISTS barbers_business_id_is_active_idx ON public.barbers (business_id, is_active);

CREATE TRIGGER barbers_set_updated_at
  BEFORE UPDATE ON public.barbers
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- 2. Create barber_services junction table
CREATE TABLE IF NOT EXISTS public.barber_services (
  barber_id uuid NOT NULL REFERENCES public.barbers (id) ON DELETE CASCADE,
  service_id uuid NOT NULL REFERENCES public.services (id) ON DELETE CASCADE,
  PRIMARY KEY (barber_id, service_id)
);

CREATE INDEX IF NOT EXISTS barber_services_service_id_idx ON public.barber_services (service_id);

-- 3. Add barber_id (nullable initial) to working_hours, blocked_times, appointments, portfolio_items
ALTER TABLE public.working_hours ADD COLUMN IF NOT EXISTS barber_id uuid REFERENCES public.barbers (id) ON DELETE CASCADE;
ALTER TABLE public.blocked_times ADD COLUMN IF NOT EXISTS barber_id uuid REFERENCES public.barbers (id) ON DELETE CASCADE;
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS barber_id uuid REFERENCES public.barbers (id) ON DELETE RESTRICT;
ALTER TABLE public.portfolio_items ADD COLUMN IF NOT EXISTS barber_id uuid REFERENCES public.barbers (id) ON DELETE CASCADE;

-- 4. Safely create primary barber for each existing business
INSERT INTO public.barbers (id, business_id, user_id, name, bio_en, bio_hu, is_active, display_order)
SELECT
  gen_random_uuid(),
  b.id,
  b.owner_id,
  COALESCE(p.full_name, 'Barbod Barber'),
  b.description_en,
  b.description_hu,
  true,
  0
FROM public.businesses b
LEFT JOIN public.profiles p ON p.id = b.owner_id
WHERE NOT EXISTS (
  SELECT 1 FROM public.barbers bar WHERE bar.business_id = b.id
);

-- 5. Backfill all existing records
-- Backfill working_hours
UPDATE public.working_hours wh
SET barber_id = bar.id
FROM public.barbers bar
WHERE wh.business_id = bar.business_id AND wh.barber_id IS NULL;

-- Backfill blocked_times
UPDATE public.blocked_times bt
SET barber_id = bar.id
FROM public.barbers bar
WHERE bt.business_id = bar.business_id AND bt.barber_id IS NULL;

-- Backfill appointments
UPDATE public.appointments a
SET barber_id = bar.id
FROM public.barbers bar
WHERE a.business_id = bar.business_id AND a.barber_id IS NULL;

-- Backfill portfolio_items
UPDATE public.portfolio_items pi
SET barber_id = bar.id
FROM public.barbers bar
WHERE pi.business_id = bar.business_id AND pi.barber_id IS NULL;

-- Backfill barber_services (assign existing services to the primary barber)
INSERT INTO public.barber_services (barber_id, service_id)
SELECT bar.id, s.id
FROM public.services s
JOIN public.barbers bar ON bar.business_id = s.business_id
ON CONFLICT DO NOTHING;

-- 6. Enforce NOT NULL constraints (after backfill)
ALTER TABLE public.working_hours ALTER COLUMN barber_id SET NOT NULL;
ALTER TABLE public.blocked_times ALTER COLUMN barber_id SET NOT NULL;
ALTER TABLE public.appointments ALTER COLUMN barber_id SET NOT NULL;
ALTER TABLE public.portfolio_items ALTER COLUMN barber_id SET NOT NULL;

-- 7. Add indexes for barber_id
CREATE INDEX IF NOT EXISTS working_hours_barber_id_idx ON public.working_hours (barber_id);
CREATE INDEX IF NOT EXISTS blocked_times_barber_id_idx ON public.blocked_times (barber_id);
CREATE INDEX IF NOT EXISTS appointments_barber_id_idx ON public.appointments (barber_id);
CREATE INDEX IF NOT EXISTS portfolio_items_barber_id_idx ON public.portfolio_items (barber_id);

-- 8. Replace business-level overlap constraint with barber-level overlap protection
ALTER TABLE public.appointments DROP CONSTRAINT IF EXISTS appointments_no_overlap;

ALTER TABLE public.appointments
  ADD CONSTRAINT appointments_no_overlap
  EXCLUDE USING gist (
    barber_id WITH =,
    tstzrange(start_at, end_at, '[)') WITH &&
  )
  WHERE (status IN ('pending', 'confirmed'));

-- 9. Helper functions for RLS
CREATE OR REPLACE FUNCTION public.get_authenticated_barber_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.barbers
  WHERE user_id = auth.uid() AND is_active = true
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.is_barber_owner_or_self(p_barber_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.barbers AS bar
    JOIN public.businesses AS b ON b.id = bar.business_id
    WHERE bar.id = p_barber_id
      AND (b.owner_id = auth.uid() OR bar.user_id = auth.uid())
  );
$$;

-- 10. Update validate_appointment trigger function
CREATE OR REPLACE FUNCTION public.validate_appointment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  svc public.services%ROWTYPE;
  bar public.barbers%ROWTYPE;
BEGIN
  -- Verify service exists
  SELECT * INTO svc FROM public.services WHERE id = NEW.service_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Service not found';
  END IF;

  IF svc.business_id IS DISTINCT FROM NEW.business_id THEN
    RAISE EXCEPTION 'service_id does not belong to business_id';
  END IF;

  -- Verify barber exists and belongs to business
  SELECT * INTO bar FROM public.barbers WHERE id = NEW.barber_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Barber not found';
  END IF;

  IF bar.business_id IS DISTINCT FROM NEW.business_id THEN
    RAISE EXCEPTION 'barber_id does not belong to business_id';
  END IF;

  -- Verify barber offers service
  IF NOT EXISTS (
    SELECT 1 FROM public.barber_services
    WHERE barber_id = NEW.barber_id AND service_id = NEW.service_id
  ) THEN
    RAISE EXCEPTION 'Selected barber does not offer this service';
  END IF;

  IF NEW.end_at IS DISTINCT FROM (NEW.start_at + make_interval(mins => svc.duration_minutes)) THEN
    RAISE EXCEPTION 'Appointment end_at must equal start_at + service duration_minutes';
  END IF;

  -- Public checks
  IF TG_OP = 'INSERT' AND NOT public.is_business_owner(NEW.business_id) THEN
    IF NOT svc.is_active THEN
      RAISE EXCEPTION 'Cannot book an inactive service';
    END IF;

    IF NOT bar.is_active THEN
      RAISE EXCEPTION 'Cannot book an inactive barber';
    END IF;

    IF NEW.status IS DISTINCT FROM 'pending' THEN
      RAISE EXCEPTION 'Public bookings must start with status pending';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- 11. Enable and Force RLS on new tables
ALTER TABLE public.barbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.barber_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.barbers FORCE ROW LEVEL SECURITY;
ALTER TABLE public.barber_services FORCE ROW LEVEL SECURITY;

-- 12. RLS Policies for barbers
CREATE POLICY barbers_public_select_active
  ON public.barbers FOR SELECT TO anon, authenticated
  USING (is_active = true OR public.is_barber_owner_or_self(id));

CREATE POLICY barbers_owner_insert
  ON public.barbers FOR INSERT TO authenticated
  WITH CHECK (public.is_business_owner(business_id));

CREATE POLICY barbers_owner_or_self_update
  ON public.barbers FOR UPDATE TO authenticated
  USING (public.is_barber_owner_or_self(id))
  WITH CHECK (public.is_barber_owner_or_self(id));

CREATE POLICY barbers_owner_delete
  ON public.barbers FOR DELETE TO authenticated
  USING (public.is_business_owner(business_id));

-- 13. RLS Policies for barber_services
CREATE POLICY barber_services_public_select
  ON public.barber_services FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY barber_services_owner_or_self_manage
  ON public.barber_services FOR ALL TO authenticated
  USING (public.is_barber_owner_or_self(barber_id))
  WITH CHECK (public.is_barber_owner_or_self(barber_id));

-- 14. Update RLS policies for working_hours, blocked_times, appointments, portfolio_items
DROP POLICY IF EXISTS working_hours_public_select_active ON public.working_hours;
DROP POLICY IF EXISTS working_hours_owner_insert ON public.working_hours;
DROP POLICY IF EXISTS working_hours_owner_update ON public.working_hours;
DROP POLICY IF EXISTS working_hours_owner_delete ON public.working_hours;

CREATE POLICY working_hours_public_select_active
  ON public.working_hours FOR SELECT TO anon, authenticated
  USING (is_active = true OR public.is_barber_owner_or_self(barber_id));

CREATE POLICY working_hours_owner_or_self_insert
  ON public.working_hours FOR INSERT TO authenticated
  WITH CHECK (public.is_barber_owner_or_self(barber_id));

CREATE POLICY working_hours_owner_or_self_update
  ON public.working_hours FOR UPDATE TO authenticated
  USING (public.is_barber_owner_or_self(barber_id))
  WITH CHECK (public.is_barber_owner_or_self(barber_id));

CREATE POLICY working_hours_owner_or_self_delete
  ON public.working_hours FOR DELETE TO authenticated
  USING (public.is_barber_owner_or_self(barber_id));

-- blocked_times:
DROP POLICY IF EXISTS blocked_times_owner_select ON public.blocked_times;
DROP POLICY IF EXISTS blocked_times_owner_insert ON public.blocked_times;
DROP POLICY IF EXISTS blocked_times_owner_update ON public.blocked_times;
DROP POLICY IF EXISTS blocked_times_owner_delete ON public.blocked_times;

CREATE POLICY blocked_times_owner_or_self_select
  ON public.blocked_times FOR SELECT TO authenticated
  USING (public.is_barber_owner_or_self(barber_id));

CREATE POLICY blocked_times_owner_or_self_insert
  ON public.blocked_times FOR INSERT TO authenticated
  WITH CHECK (public.is_barber_owner_or_self(barber_id));

CREATE POLICY blocked_times_owner_or_self_update
  ON public.blocked_times FOR UPDATE TO authenticated
  USING (public.is_barber_owner_or_self(barber_id))
  WITH CHECK (public.is_barber_owner_or_self(barber_id));

CREATE POLICY blocked_times_owner_or_self_delete
  ON public.blocked_times FOR DELETE TO authenticated
  USING (public.is_barber_owner_or_self(barber_id));

-- appointments:
DROP POLICY IF EXISTS appointments_public_insert ON public.appointments;
DROP POLICY IF EXISTS appointments_owner_select ON public.appointments;
DROP POLICY IF EXISTS appointments_owner_insert ON public.appointments;
DROP POLICY IF EXISTS appointments_owner_update ON public.appointments;
DROP POLICY IF EXISTS appointments_owner_delete ON public.appointments;

CREATE POLICY appointments_public_insert
  ON public.appointments FOR INSERT TO anon, authenticated
  WITH CHECK (
    status = 'pending'
    AND EXISTS (
      SELECT 1 FROM public.barbers b
      JOIN public.services s ON s.business_id = b.business_id
      JOIN public.barber_services bs ON bs.barber_id = b.id AND bs.service_id = s.id
      WHERE b.id = appointments.barber_id
        AND s.id = appointments.service_id
        AND b.business_id = appointments.business_id
        AND b.is_active = true
        AND s.is_active = true
    )
  );

CREATE POLICY appointments_owner_or_self_select
  ON public.appointments FOR SELECT TO authenticated
  USING (public.is_barber_owner_or_self(barber_id));

CREATE POLICY appointments_owner_or_self_insert
  ON public.appointments FOR INSERT TO authenticated
  WITH CHECK (public.is_barber_owner_or_self(barber_id));

CREATE POLICY appointments_owner_or_self_update
  ON public.appointments FOR UPDATE TO authenticated
  USING (public.is_barber_owner_or_self(barber_id))
  WITH CHECK (public.is_barber_owner_or_self(barber_id));

CREATE POLICY appointments_owner_or_self_delete
  ON public.appointments FOR DELETE TO authenticated
  USING (public.is_barber_owner_or_self(barber_id));

-- portfolio_items:
DROP POLICY IF EXISTS portfolio_items_public_select_visible ON public.portfolio_items;
DROP POLICY IF EXISTS portfolio_items_owner_insert ON public.portfolio_items;
DROP POLICY IF EXISTS portfolio_items_owner_update ON public.portfolio_items;
DROP POLICY IF EXISTS portfolio_items_owner_delete ON public.portfolio_items;

CREATE POLICY portfolio_items_public_select_visible
  ON public.portfolio_items FOR SELECT TO anon, authenticated
  USING (is_visible = true OR public.is_barber_owner_or_self(barber_id));

CREATE POLICY portfolio_items_owner_or_self_insert
  ON public.portfolio_items FOR INSERT TO authenticated
  WITH CHECK (public.is_barber_owner_or_self(barber_id));

CREATE POLICY portfolio_items_owner_or_self_update
  ON public.portfolio_items FOR UPDATE TO authenticated
  USING (public.is_barber_owner_or_self(barber_id))
  WITH CHECK (public.is_barber_owner_or_self(barber_id));

CREATE POLICY portfolio_items_owner_or_self_delete
  ON public.portfolio_items FOR DELETE TO authenticated
  USING (public.is_barber_owner_or_self(barber_id));

-- 15. Update RPC function get_occupied_intervals to be barber-scoped
DROP FUNCTION IF EXISTS public.get_occupied_intervals(uuid, timestamptz, timestamptz);

CREATE OR REPLACE FUNCTION public.get_occupied_intervals(
  p_barber_id uuid,
  p_start_at timestamptz,
  p_end_at timestamptz
)
RETURNS TABLE (
  start_at timestamptz,
  end_at timestamptz
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  -- Verify target barber exists
  IF NOT EXISTS (SELECT 1 FROM public.barbers WHERE id = p_barber_id) THEN
    RETURN;
  END IF;

  RETURN QUERY
  -- 1. Active appointments for this barber (pending & confirmed block availability)
  SELECT a.start_at, a.end_at
  FROM public.appointments AS a
  WHERE a.barber_id = p_barber_id
    AND a.status IN ('pending', 'confirmed')
    AND a.start_at < p_end_at
    AND a.end_at > p_start_at

  UNION ALL

  -- 2. Internal blocked times for this barber
  SELECT b.start_at, b.end_at
  FROM public.blocked_times AS b
  WHERE b.barber_id = p_barber_id
    AND b.start_at < p_end_at
    AND b.end_at > p_start_at;
END;
$$;

COMMENT ON FUNCTION public.get_occupied_intervals(uuid, timestamptz, timestamptz) IS
  'Returns anonymized start_at and end_at timestamps for active appointments and blocked times for a given barber.';

REVOKE ALL ON FUNCTION public.get_occupied_intervals(uuid, timestamptz, timestamptz) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_occupied_intervals(uuid, timestamptz, timestamptz) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_occupied_intervals(uuid, timestamptz, timestamptz) TO anon;
-- Migration: 20261001020000_storage_barber_profiles.sql
-- Storage bucket and policies for barber profile photos.
-- Object path convention: {business_id}/{barber_id}/{filename}

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'barber-profiles',
  'barber-profiles',
  true,
  5242880, -- 5 MiB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE
SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Extract barber_id from object path: {business_id}/{barber_id}/{filename}
CREATE OR REPLACE FUNCTION public.barber_profile_object_barber_id(object_name text)
RETURNS uuid
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  parts text[];
  barber_id uuid;
BEGIN
  parts := string_to_array(object_name, '/');

  IF array_length(parts, 1) < 3 THEN
    RETURN NULL;
  END IF;

  BEGIN
    IF array_length(parts, 1) >= 4 AND parts[1] = 'barber-profiles' THEN
      barber_id := parts[3]::uuid;
    ELSE
      barber_id := parts[2]::uuid;
    END IF;
  EXCEPTION
    WHEN invalid_text_representation THEN
      RETURN NULL;
  END;

  RETURN barber_id;
END;
$$;

COMMENT ON FUNCTION public.barber_profile_object_barber_id(text) IS
  'Parses barber UUID from profile photo storage path {business_id}/{barber_id}/{filename}.';

REVOKE ALL ON FUNCTION public.barber_profile_object_barber_id(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.barber_profile_object_barber_id(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.barber_profile_object_barber_id(text) TO anon;

-- Storage Policies for barber-profiles bucket

DROP POLICY IF EXISTS barber_profiles_storage_public_select ON storage.objects;
DROP POLICY IF EXISTS barber_profiles_storage_owner_or_self_insert ON storage.objects;
DROP POLICY IF EXISTS barber_profiles_storage_owner_or_self_update ON storage.objects;
DROP POLICY IF EXISTS barber_profiles_storage_owner_or_self_delete ON storage.objects;

-- 1. Public Read
CREATE POLICY barber_profiles_storage_public_select
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'barber-profiles');

-- 2. Owner & Staff Insert
CREATE POLICY barber_profiles_storage_owner_or_self_insert
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'barber-profiles'
    AND public.is_barber_owner_or_self(
      public.barber_profile_object_barber_id(name)
    )
  );

-- 3. Owner & Staff Update
CREATE POLICY barber_profiles_storage_owner_or_self_update
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'barber-profiles'
    AND public.is_barber_owner_or_self(
      public.barber_profile_object_barber_id(name)
    )
  )
  WITH CHECK (
    bucket_id = 'barber-profiles'
    AND public.is_barber_owner_or_self(
      public.barber_profile_object_barber_id(name)
    )
  );

-- 4. Owner & Staff Delete
CREATE POLICY barber_profiles_storage_owner_or_self_delete
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'barber-profiles'
    AND public.is_barber_owner_or_self(
      public.barber_profile_object_barber_id(name)
    )
  );
-- Migration: 20261001020000_unique_barber_user_id.sql
-- Guarantee 1:1 user_id relationship on barbers table

CREATE UNIQUE INDEX IF NOT EXISTS barbers_user_id_unique_idx ON public.barbers (user_id) WHERE user_id IS NOT NULL;
-- Migration: Notification Jobs System for Transactional Email & Reminders

-- Create notification_jobs table
CREATE TABLE IF NOT EXISTS public.notification_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE CASCADE,
    barber_id UUID REFERENCES public.barbers(id) ON DELETE CASCADE,
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    recipient_email TEXT NOT NULL,
    recipient_type TEXT NOT NULL CHECK (recipient_type IN ('customer', 'barber', 'owner')),
    notification_type TEXT NOT NULL CHECK (
        notification_type IN (
            'appointment_booked',
            'appointment_confirmed',
            'appointment_cancelled',
            'appointment_rescheduled',
            'customer_reminder_24h',
            'customer_reminder_2h',
            'barber_new_appointment',
            'barber_cancellation',
            'barber_reschedule',
            'barber_daily_digest'
        )
    ),
    scheduled_for TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'sent', 'failed', 'cancelled')),
    attempts INT NOT NULL DEFAULT 0,
    last_error TEXT,
    sent_at TIMESTAMPTZ,
    provider_message_id TEXT,
    locale TEXT NOT NULL DEFAULT 'hu' CHECK (locale IN ('en', 'hu')),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for efficient querying by worker and admin dashboard
CREATE INDEX IF NOT EXISTS idx_notification_jobs_status_scheduled ON public.notification_jobs(status, scheduled_for);
CREATE INDEX IF NOT EXISTS idx_notification_jobs_appointment_id ON public.notification_jobs(appointment_id);
CREATE INDEX IF NOT EXISTS idx_notification_jobs_barber_id ON public.notification_jobs(barber_id);
CREATE INDEX IF NOT EXISTS idx_notification_jobs_business_id ON public.notification_jobs(business_id);

-- Idempotency protection: UNIQUE constraint for appointment-specific notifications
CREATE UNIQUE INDEX IF NOT EXISTS idx_uniq_appointment_notification 
ON public.notification_jobs (appointment_id, recipient_email, notification_type);


-- Idempotency protection for daily digests (one per barber per day)
CREATE UNIQUE INDEX IF NOT EXISTS idx_uniq_barber_daily_digest
ON public.notification_jobs (barber_id, notification_type, (CAST(scheduled_for AT TIME ZONE 'UTC' AS DATE)))
WHERE notification_type = 'barber_daily_digest' AND barber_id IS NOT NULL;


-- RLS Policies
ALTER TABLE public.notification_jobs ENABLE ROW LEVEL SECURITY;

-- Owner can view and manage all notification jobs for their business
CREATE POLICY "Owners can manage notification jobs for their business"
ON public.notification_jobs
FOR ALL
TO authenticated
USING (
    business_id IN (
        SELECT id FROM public.businesses WHERE owner_id = auth.uid()
    )
)
WITH CHECK (
    business_id IN (
        SELECT id FROM public.businesses WHERE owner_id = auth.uid()
    )
);

-- Barbers can view notification jobs assigned to them
CREATE POLICY "Barbers can view their assigned notification jobs"
ON public.notification_jobs
FOR SELECT
TO authenticated
USING (
    barber_id IN (
        SELECT id FROM public.barbers WHERE user_id = auth.uid()
    )
);

-- RPC for Atomic Job Claiming (Concurrency & Idempotency)
CREATE OR REPLACE FUNCTION public.claim_due_notification_jobs(
    p_limit INT DEFAULT 10
)
RETURNS SETOF public.notification_jobs
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_claimed_ids UUID[];
BEGIN
    -- Select pending or retryable failed jobs due for execution
    SELECT ARRAY_AGG(id) INTO v_claimed_ids
    FROM (
        SELECT id
        FROM public.notification_jobs
        WHERE (status = 'pending' OR (status = 'failed' AND attempts < 3))
          AND scheduled_for <= NOW()
        ORDER BY scheduled_for ASC
        LIMIT p_limit
        FOR UPDATE SKIP LOCKED
    ) sub;

    IF v_claimed_ids IS NULL OR array_length(v_claimed_ids, 1) IS NULL THEN
        RETURN;
    END IF;

    -- Atomically set status to processing and increment attempts
    RETURN QUERY
    UPDATE public.notification_jobs
    SET 
        status = 'processing',
        attempts = attempts + 1,
        updated_at = NOW()
    WHERE id = ANY(v_claimed_ids)
    RETURNING *;
END;
$$;
-- Migration: Optional Supabase pg_cron Reference for Notification Worker Engine
-- NOTE: Vercel Cron (vercel.json) is the SINGLE primary production scheduler for Barbod Barber.
-- Do NOT run active pg_cron schedules simultaneously with Vercel Cron in production.

-- Optional helper function if external database triggering is desired in non-Vercel environments:
CREATE OR REPLACE FUNCTION public.process_due_notifications_cron()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Optional pg_cron schedule template (uncomment ONLY if hosting outside Vercel):
    -- SELECT cron.schedule('notification-worker-every-2-min', '*/2 * * * *', 'SELECT public.claim_due_notification_jobs(20);');
    NULL;
END;
$$;
-- Migration: Create instagram_connections table for owner-initiated Instagram OAuth
CREATE TABLE IF NOT EXISTS public.instagram_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    instagram_user_id TEXT NOT NULL,
    username TEXT NOT NULL,
    encrypted_access_token TEXT NOT NULL,
    token_expires_at TIMESTAMPTZ,
    connected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_business_instagram UNIQUE (business_id)
);

-- RLS: Enable RLS
ALTER TABLE public.instagram_connections ENABLE ROW LEVEL SECURITY;

-- Owner policies: ONLY Business Owners can view/manage their business connection record
CREATE POLICY "Owners can view their business instagram connection"
    ON public.instagram_connections
    FOR SELECT
    TO authenticated
    USING (
        business_id IN (
            SELECT id FROM public.businesses WHERE owner_id = auth.uid()
        )
    );

CREATE POLICY "Owners can insert their business instagram connection"
    ON public.instagram_connections
    FOR INSERT
    TO authenticated
    WITH CHECK (
        business_id IN (
            SELECT id FROM public.businesses WHERE owner_id = auth.uid()
        )
    );

CREATE POLICY "Owners can update their business instagram connection"
    ON public.instagram_connections
    FOR UPDATE
    TO authenticated
    USING (
        business_id IN (
            SELECT id FROM public.businesses WHERE owner_id = auth.uid()
        )
    )
    WITH CHECK (
        business_id IN (
            SELECT id FROM public.businesses WHERE owner_id = auth.uid()
        )
    );

CREATE POLICY "Owners can delete their business instagram connection"
    ON public.instagram_connections
    FOR DELETE
    TO authenticated
    USING (
        business_id IN (
            SELECT id FROM public.businesses WHERE owner_id = auth.uid()
        )
    );
