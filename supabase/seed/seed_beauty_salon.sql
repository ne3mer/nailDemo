-- ==============================================================================
-- MAISON ROSE — NAIL & BEAUTY STUDIO SEED SCRIPT
-- Isolated beauty salon demo database seed for new Supabase project.
-- Safe, fictional demo records only. No production client data copied.
-- ==============================================================================

DO $$
DECLARE
  -- Dynamic resolution: Use existing owner from auth.users or the verified owner UUID
  v_owner_id UUID;
  v_business_id UUID := 'dc7cca34-20ea-47f5-a579-12b90f9003bb';
  
  -- Artist UUIDs
  v_artist_camille UUID := 'e1111111-1111-4111-a111-111111111111';
  v_artist_eva UUID     := 'e2222222-2222-4222-a222-222222222222';
  v_artist_sophie UUID  := 'e3333333-3333-4333-a333-333333333333';
  
  -- Service UUIDs
  v_svc_russian UUID   := 'f1111111-1111-4111-b111-111111111111';
  v_svc_biab UUID      := 'f2222222-2222-4222-b222-222222222222';
  v_svc_art UUID       := 'f3333333-3333-4333-b333-333333333333';
  v_svc_gelx UUID      := 'f4444444-4444-4444-b444-444444444444';
  v_svc_pedicure UUID  := 'f5555555-5555-4555-b555-555555555555';
  v_svc_japanese UUID  := 'f6666666-6666-4666-b666-666666666666';
BEGIN

  -- 0. Resolve owner ID exclusively from the explicitly designated Auth user
  SELECT id INTO v_owner_id FROM auth.users WHERE email = 'ne3mer@gmail.com' LIMIT 1;

  IF v_owner_id IS NULL THEN
    RAISE EXCEPTION 'Explicitly designated owner account (ne3mer@gmail.com) not found in auth.users. Create the owner user before running the seed.';
  END IF;

  -- Ensure profile exists for the owner
  INSERT INTO public.profiles (id, full_name)
  VALUES (v_owner_id, 'Camille Laurent')
  ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name;

  -- 1. Insert or Update Business: Maison Rose
  INSERT INTO public.businesses (
    id,
    owner_id,
    name,
    slug,
    description_en,
    description_hu,
    phone,
    email,
    address,
    instagram_url,
    created_at,
    updated_at
  )
  VALUES (
    v_business_id,
    v_owner_id,
    'Maison Rose — Nail & Beauty Studio',
    'maison-rose',
    'An unhurried sanctuary dedicated to Russian e-file manicures, BIAB nail strengthening, and bespoke hand-painted artistry in the heart of Budapest.',
    'Nyugodt, légies szentély a gépi orosz manikűr, a BIAB körömerősítés és az egyedi kézzel festett körömdíszítés számára Budapest szívében.',
    '+36 1 458 9200',
    'ne3mer@gmail.com',
    'Andrássy út 28, District VI, Budapest',
    '',
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    owner_id = EXCLUDED.owner_id,
    name = EXCLUDED.name,
    description_en = EXCLUDED.description_en,
    description_hu = EXCLUDED.description_hu,
    phone = EXCLUDED.phone,
    email = EXCLUDED.email,
    address = EXCLUDED.address,
    instagram_url = EXCLUDED.instagram_url,
    updated_at = NOW();

  -- 2. Insert or Update Artists
  -- Camille Laurent (Founder & Lead Artist - Linked to owner auth user)
  INSERT INTO public.barbers (
    id,
    business_id,
    user_id,
    name,
    bio_en,
    bio_hu,
    profile_photo_url,
    display_order,
    is_active,
    created_at,
    updated_at
  )
  VALUES (
    v_artist_camille,
    v_business_id,
    v_owner_id,
    'Camille Laurent',
    'Trained in Paris and Tokyo, Camille specializes in high-precision Russian manicures, delicate hand-painted micro art, and editorial chrome finishes.',
    'Párizsban és Tokióban képzett művész; specialitása a precíziós orosz manikűr, a finom kézzel festett mikrominták és az editorial krómfények.',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    1,
    true,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    user_id = EXCLUDED.user_id,
    name = EXCLUDED.name,
    bio_en = EXCLUDED.bio_en,
    bio_hu = EXCLUDED.bio_hu,
    profile_photo_url = EXCLUDED.profile_photo_url,
    display_order = EXCLUDED.display_order,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

  -- Éva Molnár (Senior BIAB & Gel Specialist)
  INSERT INTO public.barbers (
    id,
    business_id,
    user_id,
    name,
    bio_en,
    bio_hu,
    profile_photo_url,
    display_order,
    is_active,
    created_at,
    updated_at
  )
  VALUES (
    v_artist_eva,
    v_business_id,
    NULL,
    'Éva Molnár',
    'Passionate about natural nail architecture and long-term health, Éva crafts flawless structured overlays and architectural French tips.',
    'A természetes körmök anatómiájának és épségének szakértője; tökéletes építőzselés megerősítéseket és letisztult francia dizájnokat készít.',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    2,
    true,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    bio_en = EXCLUDED.bio_en,
    bio_hu = EXCLUDED.bio_hu,
    profile_photo_url = EXCLUDED.profile_photo_url,
    display_order = EXCLUDED.display_order,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

  -- Sophie Varga (Spa Specialist & Nail Care Artisan)
  INSERT INTO public.barbers (
    id,
    business_id,
    user_id,
    name,
    bio_en,
    bio_hu,
    profile_photo_url,
    display_order,
    is_active,
    created_at,
    updated_at
  )
  VALUES (
    v_artist_sophie,
    v_business_id,
    NULL,
    'Sophie Varga',
    'Combining reflexology techniques with Japanese organic buffing, Sophie delivers deeply restorative treatments for hands and feet.',
    'Reflexológiai technikákkal és japán organikus méhviaszos kezelésekkel nyújt mélyen relaxáló élményt a kezeknek és lábaknak.',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80',
    3,
    true,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    bio_en = EXCLUDED.bio_en,
    bio_hu = EXCLUDED.bio_hu,
    profile_photo_url = EXCLUDED.profile_photo_url,
    display_order = EXCLUDED.display_order,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

  -- 3. Insert or Update Services
  -- Russian E-File Manicure
  INSERT INTO public.services (
    id, business_id, name_en, name_hu, description_en, description_hu,
    duration_minutes, price, currency, is_active, sort_order, created_at, updated_at
  ) VALUES (
    v_svc_russian, v_business_id,
    'Signature Russian E-File Manicure', 'Signature Orosz Gépi Manikűr',
    'Flawless dry cuticle treatment with fine diamond e-file bits, followed by a strengthening base and ultra-clean gel coat close to the eponychium.',
    'Kíméletes száraz gépi kutikula-kezelés gyémántfejekkel, erősítő alapozással és tartós, precíz géllakkozással.',
    75, 65, 'EUR', true, 0, NOW(), NOW()
  ) ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en, name_hu = EXCLUDED.name_hu,
    description_en = EXCLUDED.description_en, description_hu = EXCLUDED.description_hu,
    duration_minutes = EXCLUDED.duration_minutes, price = EXCLUDED.price, updated_at = NOW();

  -- BIAB Natural Strengthening
  INSERT INTO public.services (
    id, business_id, name_en, name_hu, description_en, description_hu,
    duration_minutes, price, currency, is_active, sort_order, created_at, updated_at
  ) VALUES (
    v_svc_biab, v_business_id,
    'BIAB™ Natural Nail Strengthening', 'BIAB™ Természetes Körömerősítés',
    'Builder-In-A-Bottle nourishing overlay engineered to reinforce weak natural nails, encourage healthy growth, and deliver weeks of chip-free wear.',
    'Tápláló építőzselés alapozás a természetes körmök megerősítésére, törésmentes tartóssággal és egészséges növekedéssel.',
    90, 75, 'EUR', true, 1, NOW(), NOW()
  ) ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en, name_hu = EXCLUDED.name_hu,
    description_en = EXCLUDED.description_en, description_hu = EXCLUDED.description_hu,
    duration_minutes = EXCLUDED.duration_minutes, price = EXCLUDED.price, updated_at = NOW();

  -- Bespoke Editorial Nail Art
  INSERT INTO public.services (
    id, business_id, name_en, name_hu, description_en, description_hu,
    duration_minutes, price, currency, is_active, sort_order, created_at, updated_at
  ) VALUES (
    v_svc_art, v_business_id,
    'Bespoke Editorial Nail Art', 'Egyedi Kézzel Festett Körömdíszítés',
    'Tailored fine-line designs, glazed donut chrome, ethereal ombré, or miniature abstract florals painted individually for each guest.',
    'Finom vonalas grafikák, krómfényű felületek, lágy ombré átmenetek vagy miniatűr virágmotívumok személyre szabottan festve.',
    90, 85, 'EUR', true, 2, NOW(), NOW()
  ) ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en, name_hu = EXCLUDED.name_hu,
    description_en = EXCLUDED.description_en, description_hu = EXCLUDED.description_hu,
    duration_minutes = EXCLUDED.duration_minutes, price = EXCLUDED.price, updated_at = NOW();

  -- Gel-X Soft Gel Extensions
  INSERT INTO public.services (
    id, business_id, name_en, name_hu, description_en, description_hu,
    duration_minutes, price, currency, is_active, sort_order, created_at, updated_at
  ) VALUES (
    v_svc_gelx, v_business_id,
    'Gel-X™ Soft Gel Extensions', 'Gel-X™ Puha Zselé Hosszabbítás',
    'Full-cover soft gel tips applied without harsh chemicals, delivering instant natural length and flawless symmetry.',
    'Teljes felületű puha zselé tipek vegyszermentes rögzítéssel, természetes hosszúsággal és tökéletes formával.',
    105, 95, 'EUR', true, 3, NOW(), NOW()
  ) ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en, name_hu = EXCLUDED.name_hu,
    description_en = EXCLUDED.description_en, description_hu = EXCLUDED.description_hu,
    duration_minutes = EXCLUDED.duration_minutes, price = EXCLUDED.price, updated_at = NOW();

  -- Rose Petal Spa Pedicure
  INSERT INTO public.services (
    id, business_id, name_en, name_hu, description_en, description_hu,
    duration_minutes, price, currency, is_active, sort_order, created_at, updated_at
  ) VALUES (
    v_svc_pedicure, v_business_id,
    'Rose Petal Luxury Spa Pedicure', 'Rózsavizes Luxus Spa Pedikűr',
    'Warm rosewater soak, gentle sea-salt exfoliation, meticulous e-file callus smoothing, and nourishing botanical massage.',
    'Meleg rózsavizes lábfürdő, tengeri sós peeling, gyengéd gépi bőrkeményedés-eltávolítás és tápláló növényi olajos masszázs.',
    75, 70, 'EUR', true, 4, NOW(), NOW()
  ) ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en, name_hu = EXCLUDED.name_hu,
    description_en = EXCLUDED.description_en, description_hu = EXCLUDED.description_hu,
    duration_minutes = EXCLUDED.duration_minutes, price = EXCLUDED.price, updated_at = NOW();

  -- Japanese Organic Nail Restoration
  INSERT INTO public.services (
    id, business_id, name_en, name_hu, description_en, description_hu,
    duration_minutes, price, currency, is_active, sort_order, created_at, updated_at
  ) VALUES (
    v_svc_japanese, v_business_id,
    'Japanese Organic Nail Restoration', 'Japán Organikus Méhviaszos Körömápolás',
    'Chemical-free restorative treatment using beeswax paste and diatomaceous powder to impart a high natural shine and stimulate keratin synthesis.',
    'Természetes méhviaszos és kovaföldes polírozás, amely vegyszermentes fényt ad és serkenti a köröm saját keratintermelését.',
    60, 55, 'EUR', true, 5, NOW(), NOW()
  ) ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en, name_hu = EXCLUDED.name_hu,
    description_en = EXCLUDED.description_en, description_hu = EXCLUDED.description_hu,
    duration_minutes = EXCLUDED.duration_minutes, price = EXCLUDED.price, updated_at = NOW();

  -- 4. Assign Services to Artists
  DELETE FROM public.barber_services WHERE barber_id IN (v_artist_camille, v_artist_eva, v_artist_sophie);

  -- Camille offers all manicure and nail art services
  INSERT INTO public.barber_services (barber_id, service_id) VALUES
    (v_artist_camille, v_svc_russian),
    (v_artist_camille, v_svc_biab),
    (v_artist_camille, v_svc_art),
    (v_artist_camille, v_svc_gelx),
    (v_artist_camille, v_svc_japanese);

  -- Éva specializes in BIAB, Russian Manicure, and Gel-X
  INSERT INTO public.barber_services (barber_id, service_id) VALUES
    (v_artist_eva, v_svc_russian),
    (v_artist_eva, v_svc_biab),
    (v_artist_eva, v_svc_art),
    (v_artist_eva, v_svc_gelx);

  -- Sophie specializes in Spa Pedicures, Russian Manicure, and Japanese Care
  INSERT INTO public.barber_services (barber_id, service_id) VALUES
    (v_artist_sophie, v_svc_russian),
    (v_artist_sophie, v_svc_pedicure),
    (v_artist_sophie, v_svc_japanese);

  -- 5. Standard Working Hours (Monday-Saturday, Sunday Closed)
  DELETE FROM public.working_hours WHERE business_id = v_business_id;

  -- Camille: Mon-Fri 09:00 - 18:00, Sat 10:00 - 16:00
  INSERT INTO public.working_hours (business_id, barber_id, day_of_week, start_time, end_time, is_active) VALUES
    (v_business_id, v_artist_camille, 1, '09:00:00', '18:00:00', true),
    (v_business_id, v_artist_camille, 2, '09:00:00', '18:00:00', true),
    (v_business_id, v_artist_camille, 3, '09:00:00', '18:00:00', true),
    (v_business_id, v_artist_camille, 4, '09:00:00', '18:00:00', true),
    (v_business_id, v_artist_camille, 5, '09:00:00', '18:00:00', true),
    (v_business_id, v_artist_camille, 6, '10:00:00', '16:00:00', true);

  -- Éva: Tue-Sat 10:00 - 19:00
  INSERT INTO public.working_hours (business_id, barber_id, day_of_week, start_time, end_time, is_active) VALUES
    (v_business_id, v_artist_eva, 2, '10:00:00', '19:00:00', true),
    (v_business_id, v_artist_eva, 3, '10:00:00', '19:00:00', true),
    (v_business_id, v_artist_eva, 4, '10:00:00', '19:00:00', true),
    (v_business_id, v_artist_eva, 5, '10:00:00', '19:00:00', true),
    (v_business_id, v_artist_eva, 6, '10:00:00', '18:00:00', true);

  -- Sophie: Mon-Fri 10:00 - 18:00, Sat 10:00 - 15:00
  INSERT INTO public.working_hours (business_id, barber_id, day_of_week, start_time, end_time, is_active) VALUES
    (v_business_id, v_artist_sophie, 1, '10:00:00', '18:00:00', true),
    (v_business_id, v_artist_sophie, 2, '10:00:00', '18:00:00', true),
    (v_business_id, v_artist_sophie, 3, '10:00:00', '18:00:00', true),
    (v_business_id, v_artist_sophie, 4, '10:00:00', '18:00:00', true),
    (v_business_id, v_artist_sophie, 5, '10:00:00', '18:00:00', true),
    (v_business_id, v_artist_sophie, 6, '10:00:00', '15:00:00', true);

END $$;
