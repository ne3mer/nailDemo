-- ==============================================================================
-- MAISON ROSE — NAIL & BEAUTY STUDIO SEED SCRIPT
-- Isolated beauty salon demo database seed for new Supabase project.
-- Safe, fictional demo records only. No production client data copied.
-- ==============================================================================

DO $$
DECLARE
  v_business_id UUID := 'dc7cca34-20ea-47f5-a579-12b90f9003bb';
  v_owner_id UUID := '2bdf4ebb-54bf-42c5-a39e-5216a05b6759';
  
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
    'barbod-barber', -- Preserves default internal slug contract for compatibility
    'An unhurried sanctuary dedicated to Russian e-file manicures, BIAB nail strengthening, and bespoke hand-painted artistry in the heart of Budapest.',
    'Nyugodt, légies szentély a gépi orosz manikűr, a BIAB körömerősítés és az egyedi kézzel festett körömdíszítés számára Budapest szívében.',
    '+36 1 458 9200',
    'bonjour@maisonrose-studio.hu',
    'Andrássy út 28, District VI, Budapest',
    'https://instagram.com/maisonrose.budapest',
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description_en = EXCLUDED.description_en,
    description_hu = EXCLUDED.description_hu,
    phone = EXCLUDED.phone,
    email = EXCLUDED.email,
    address = EXCLUDED.address,
    instagram_url = EXCLUDED.instagram_url,
    updated_at = NOW();

  -- 2. Insert Artists (Staff)
  INSERT INTO public.barbers (
    id,
    business_id,
    name,
    bio_en,
    bio_hu,
    profile_photo_url,
    display_order,
    is_active,
    created_at,
    updated_at
  )
  VALUES
  (
    v_artist_camille,
    v_business_id,
    'Camille Laurent',
    'Trained in Paris and Tokyo, Camille specializes in high-precision Russian manicures, delicate hand-painted micro art, and editorial chrome finishes.',
    'Párizsban és Tokióban képzett művész; specialitása a precíziós orosz manikűr, a finom kézzel festett mikrominták és az editorial krómfények.',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    1,
    true,
    NOW(),
    NOW()
  ),
  (
    v_artist_eva,
    v_business_id,
    'Éva Molnár',
    'A master of natural nail rehabilitation. Éva works with builder-in-a-bottle overlays and soft Gel-X extensions to create resilient, slender silhouettes.',
    'A természetes körmök megerősítésének szakértője. BIAB építőzselével és kíméletes Gel-X hosszabbítással varázsol kecses formákat.',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80',
    2,
    true,
    NOW(),
    NOW()
  ),
  (
    v_artist_sophie,
    v_business_id,
    'Sophie Dubois',
    'Dedicated to restorative botanical foot care and Japanese beeswax rituals, Sophie turns routine nail care into a soothing meditative experience.',
    'A növényi kivonatos lábápolás és a japán méhviaszos rituálék mestere; a körömápolást pihentető, meditatív élménnyé alakítja.',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
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

  -- 3. Insert Beauty Treatments (Services)
  INSERT INTO public.services (
    id,
    business_id,
    name_en,
    name_hu,
    description_en,
    description_hu,
    duration_minutes,
    price,
    currency,
    is_active,
    created_at,
    updated_at
  )
  VALUES
  (
    v_svc_russian,
    v_business_id,
    'Signature Russian Gel Manicure',
    'Prémium Orosz Gépi Géllakk',
    'Flawless dry cuticle treatment with diamond e-file bits, strengthening base, and ultra-clean gel coat.',
    'Kíméletes száraz gépi kutikula-kezelés gyémántfejekkel, erősítő alapozással és tartós géllakkozással.',
    75,
    65.00,
    'EUR',
    true,
    NOW(),
    NOW()
  ),
  (
    v_svc_biab,
    v_business_id,
    'BIAB™ Natural Nail Strengthening',
    'BIAB™ Természetes Körömerősítés',
    'Builder-In-A-Bottle nourishing overlay engineered to reinforce weak natural nails and encourage growth.',
    'Tápláló építőzselés alapozás a természetes körmök megerősítésére, törésmentes tartóssággal.',
    90,
    75.00,
    'EUR',
    true,
    NOW(),
    NOW()
  ),
  (
    v_svc_art,
    v_business_id,
    'Bespoke Editorial Nail Art',
    'Egyedi Kézzel Festett Körömdíszítés',
    'Tailored fine-line designs, glazed donut chrome, ethereal ombré, or miniature abstract florals.',
    'Finom vonalas grafikák, krómfényű felületek, lágy ombré átmenetek vagy miniatűr virágmotívumok.',
    90,
    85.00,
    'EUR',
    true,
    NOW(),
    NOW()
  ),
  (
    v_svc_gelx,
    v_business_id,
    'Soft Gel-X™ Sculpted Extensions',
    'Soft Gel-X™ Körömhosszabbítás',
    'Gentle full-cover soft gel tips sculpted into elegant almond or natural oval silhouettes.',
    'Kíméletes teljes fedésű zselés tippek elegáns mandula vagy lágy ovális formára kialakítva.',
    105,
    95.00,
    'EUR',
    true,
    NOW(),
    NOW()
  ),
  (
    v_svc_pedicure,
    v_business_id,
    'Luxury Rose Petal Spa Pedicure',
    'Luxus Rózsa-Spa Pedikűr',
    'Warm organic rose petal soak, gentle exfoliation, cuticle detailing, deep hydration, and gel pedicure.',
    'Meleg bio rózsaszirmos áztatás, sárgabarackmagos bőrradír, pedikűr, mélyhidratáló masszázs és zselés lakkozás.',
    60,
    70.00,
    'EUR',
    true,
    NOW(),
    NOW()
  ),
  (
    v_svc_japanese,
    v_business_id,
    'Japanese Keratin & Beeswax Ritual',
    'Japán Méhviaszos Körömápoló Rituálé',
    'Restorative treatment buffing nutrient-rich natural beeswax and pearl powder into damaged nail plates.',
    'Hagyományos japán regeneráló kezelés természetes méhviasszal és gyöngyfény porral a körmök ragyogásáért.',
    45,
    50.00,
    'EUR',
    true,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_hu = EXCLUDED.name_hu,
    description_en = EXCLUDED.description_en,
    description_hu = EXCLUDED.description_hu,
    duration_minutes = EXCLUDED.duration_minutes,
    price = EXCLUDED.price,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

  -- 4. Assign Services to Artists
  -- Camille: Russian, BIAB, Nail Art, Gel-X
  INSERT INTO public.barber_services (barber_id, service_id)
  VALUES
    (v_artist_camille, v_svc_russian),
    (v_artist_camille, v_svc_biab),
    (v_artist_camille, v_svc_art),
    (v_artist_camille, v_svc_gelx)
  ON CONFLICT (barber_id, service_id) DO NOTHING;

  -- Éva: Russian, BIAB, Gel-X, Japanese
  INSERT INTO public.barber_services (barber_id, service_id)
  VALUES
    (v_artist_eva, v_svc_russian),
    (v_artist_eva, v_svc_biab),
    (v_artist_eva, v_svc_gelx),
    (v_artist_eva, v_svc_japanese)
  ON CONFLICT (barber_id, service_id) DO NOTHING;

  -- Sophie: Russian, Pedicure, Japanese, BIAB
  INSERT INTO public.barber_services (barber_id, service_id)
  VALUES
    (v_artist_sophie, v_svc_russian),
    (v_artist_sophie, v_svc_pedicure),
    (v_artist_sophie, v_svc_japanese),
    (v_artist_sophie, v_svc_biab)
  ON CONFLICT (barber_id, service_id) DO NOTHING;

  -- 5. Set Working Hours (Monday to Saturday 09:00 - 19:00, Sunday closed)
  DELETE FROM public.working_hours WHERE business_id = v_business_id;

  INSERT INTO public.working_hours (business_id, day_of_week, start_time, end_time, is_active)
  VALUES
    (v_business_id, 1, '09:00:00', '19:00:00', true),
    (v_business_id, 2, '09:00:00', '19:00:00', true),
    (v_business_id, 3, '09:00:00', '19:00:00', true),
    (v_business_id, 4, '09:00:00', '19:00:00', true),
    (v_business_id, 5, '09:00:00', '19:00:00', true),
    (v_business_id, 6, '10:00:00', '18:00:00', true),
    (v_business_id, 0, '10:00:00', '18:00:00', false); -- Sunday Closed

  -- 6. Insert Nail Portfolio Items
  INSERT INTO public.portfolio_items (
    id,
    business_id,
    barber_id,
    title_en,
    title_hu,
    category,
    image_path,
    display_order,
    created_at
  )
  VALUES
  (
    'a1111111-1111-4111-c111-111111111111',
    v_business_id,
    v_artist_camille,
    'Glazed Rose & Pearl Dust',
    'Rózsa-króm & Gyöngyfény',
    'Nail Art',
    'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=1200&q=80',
    1,
    NOW()
  ),
  (
    'a2222222-2222-4222-c222-222222222222',
    v_business_id,
    v_artist_eva,
    'Minimalist Fine-Line French',
    'Minimalista Finomvonalas Francia',
    'Manicure',
    'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1200&q=80',
    2,
    NOW()
  ),
  (
    'a3333333-3333-4333-c333-333333333333',
    v_business_id,
    v_artist_eva,
    'Cashmere Rose Nude Overlay',
    'Kasmír Rózsa Nude Megerősítés',
    'Gel & BIAB',
    'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=1200&q=80',
    3,
    NOW()
  ),
  (
    'a4444444-4444-4444-c444-444444444444',
    v_business_id,
    v_artist_camille,
    'Soft Gel-X Almond Elegance',
    'Soft Gel-X Mandula Elegancia',
    'Gel-X',
    'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=1200&q=80',
    4,
    NOW()
  ),
  (
    'a5555555-5555-4555-c555-555555555555',
    v_business_id,
    v_artist_sophie,
    'Botanical Petal Accents',
    'Botanikus Szirom Részletek',
    'Nail Art',
    'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=1200&q=80',
    5,
    NOW()
  ),
  (
    'a6666666-6666-4666-c666-666666666666',
    v_business_id,
    v_artist_sophie,
    'Champagne Leaf & Soft Milky Glaze',
    'Pezsgőfüst & Tejes Fény',
    'Nail Art',
    'https://images.unsplash.com/photo-1576426863848-c21f53c60b19?auto=format&fit=crop&w=1200&q=80',
    6,
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;

END $$;
