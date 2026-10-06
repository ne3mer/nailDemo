import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import type { Tables } from "@/types/database";
import {
  DEMO_BUSINESS,
  DEMO_BARBERS,
  DEMO_SERVICES,
  DEMO_PORTFOLIO,
  DEMO_WORKING_HOURS,
} from "@/lib/config/demo-content";

export type PublicBusiness = Tables<"businesses">;
export type PublicBarber = Tables<"barbers">;
export type PublicService = Tables<"services">;
export type PublicPortfolioItem = Tables<"portfolio_items">;
export type PublicWorkingHours = Tables<"working_hours">;

const FALLBACK_BUSINESS: PublicBusiness = {
  id: "dc7cca34-20ea-47f5-a579-12b90f9003bb",
  owner_id: "2bdf4ebb-54bf-42c5-a39e-5216a05b6759",
  name: DEMO_BUSINESS.name,
  slug: DEMO_BUSINESS.slug,
  description_en: DEMO_BUSINESS.descriptionEn,
  description_hu: DEMO_BUSINESS.descriptionHu,
  phone: DEMO_BUSINESS.phone,
  email: DEMO_BUSINESS.email,
  address: `${DEMO_BUSINESS.address}, ${DEMO_BUSINESS.district}`,
  instagram_url: DEMO_BUSINESS.instagramUrl,
  logo_url: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export async function getPublicBusiness(slug = "maison-rose"): Promise<PublicBusiness | null> {
  if (!isSupabaseConfigured()) {
    return FALLBACK_BUSINESS;
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("businesses")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error || !data) {
      if (error) console.warn("[Demo Mode] Falling back to default studio profile:", error.message);
      return FALLBACK_BUSINESS;
    }

    return {
      ...data,
      name: data.name || DEMO_BUSINESS.name,
      description_en: data.description_en || DEMO_BUSINESS.descriptionEn,
      description_hu: data.description_hu || DEMO_BUSINESS.descriptionHu,
      phone: data.phone || DEMO_BUSINESS.phone,
      email: data.email || DEMO_BUSINESS.email,
      address: data.address || `${DEMO_BUSINESS.address}, ${DEMO_BUSINESS.district}`,
      instagram_url: data.instagram_url || DEMO_BUSINESS.instagramUrl,
    };
  } catch (err: unknown) {
    console.warn("[Demo Mode] Database client error, using fallback studio:", err instanceof Error ? err.message : String(err));
    return FALLBACK_BUSINESS;
  }
}

export async function getPublicBarbers(businessId: string): Promise<PublicBarber[]> {
  const fallbackBarbers: PublicBarber[] = DEMO_BARBERS.map((b) => ({
    id: b.id,
    business_id: businessId,
    user_id: null,
    name: b.name,
    profile_photo_url: b.photoUrl,
    bio_en: b.bioEn,
    bio_hu: b.bioHu,
    is_active: true,
    display_order: b.displayOrder,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));

  if (!isSupabaseConfigured()) {
    return fallbackBarbers;
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("barbers")
      .select("*")
      .eq("business_id", businessId)
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error || !data || data.length === 0) {
      return fallbackBarbers;
    }

    return data;
  } catch {
    return fallbackBarbers;
  }
}

export async function getPublicBarberServicesMap(): Promise<Record<string, string[]>> {
  if (!isSupabaseConfigured()) {
    // Return all services available for all demo artists
    const map: Record<string, string[]> = {};
    for (const b of DEMO_BARBERS) {
      map[b.id] = DEMO_SERVICES.map((s) => s.id);
    }
    return map;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("barber_services")
      .select("barber_id, service_id");

    if (error || !data || data.length === 0) {
      const map: Record<string, string[]> = {};
      for (const b of DEMO_BARBERS) {
        map[b.id] = DEMO_SERVICES.map((s) => s.id);
      }
      return map;
    }

    const map: Record<string, string[]> = {};
    for (const item of data ?? []) {
      if (!map[item.barber_id]) map[item.barber_id] = [];
      map[item.barber_id].push(item.service_id);
    }
    return map;
  } catch {
    const map: Record<string, string[]> = {};
    for (const b of DEMO_BARBERS) {
      map[b.id] = DEMO_SERVICES.map((s) => s.id);
    }
    return map;
  }
}

export async function getPublicBarberServices(barberId: string, businessId: string): Promise<PublicService[]> {
  const fallbackServices = await getPublicServices(businessId);

  if (!isSupabaseConfigured()) {
    return fallbackServices;
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("barber_services")
      .select("service_id, services(*)")
      .eq("barber_id", barberId);

    if (error || !data || data.length === 0) {
      return fallbackServices;
    }

    const services = (data ?? [])
      .map((item) => item.services)
      .filter(
        (svc): svc is PublicService =>
          svc !== null && svc.business_id === businessId && svc.is_active === true
      )
      .sort((a, b) => a.sort_order - b.sort_order);

    return services.length > 0 ? services : fallbackServices;
  } catch {
    return fallbackServices;
  }
}

export async function getPublicServices(businessId: string): Promise<PublicService[]> {
  const fallbackServices: PublicService[] = DEMO_SERVICES.map((s, idx) => ({
    id: s.id,
    business_id: businessId,
    name_en: s.nameEn,
    name_hu: s.nameHu,
    description_en: s.descriptionEn,
    description_hu: s.descriptionHu,
    price: s.priceEur,
    currency: "EUR",
    duration_minutes: s.durationMinutes,
    is_active: true,
    sort_order: idx,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));

  if (!isSupabaseConfigured()) {
    return fallbackServices;
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("business_id", businessId)
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error || !data || data.length === 0) {
      return fallbackServices;
    }

    return data;
  } catch {
    return fallbackServices;
  }
}

export async function getPublicPortfolio(businessId: string, barberId?: string): Promise<PublicPortfolioItem[]> {
  const fallbackPortfolio: PublicPortfolioItem[] = DEMO_PORTFOLIO.map((item, idx) => ({
    id: item.id,
    business_id: businessId,
    barber_id: DEMO_BARBERS[idx % DEMO_BARBERS.length].id,
    title_en: item.titleEn,
    title_hu: item.titleHu,
    category: (item.category as unknown as PublicPortfolioItem["category"]),
    image_path: item.imageUrl,
    is_visible: true,
    sort_order: idx,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));

  if (!isSupabaseConfigured()) {
    return fallbackPortfolio;
  }

  try {
    const supabase = await createClient();

    let query = supabase
      .from("portfolio_items")
      .select("*")
      .eq("business_id", businessId)
      .eq("is_visible", true);

    if (barberId) {
      query = query.eq("barber_id", barberId);
    }

    const { data, error } = await query
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return fallbackPortfolio;
    }

    return data;
  } catch {
    return fallbackPortfolio;
  }
}

export async function getPublicWorkingHours(businessId: string, barberId?: string): Promise<PublicWorkingHours[]> {
  const fallbackHours: PublicWorkingHours[] = DEMO_WORKING_HOURS.filter((wh) => !wh.isClosed).map((wh) => ({
    id: `business-wh-${wh.dayOfWeek}`,
    business_id: businessId,
    barber_id: barberId || "business",
    day_of_week: wh.dayOfWeek,
    start_time: `${wh.startTime}:00`,
    end_time: `${wh.endTime}:00`,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));

  if (!isSupabaseConfigured()) {
    return fallbackHours;
  }

  try {
    const supabase = await createClient();

    let query = supabase
      .from("working_hours")
      .select("*")
      .eq("business_id", businessId)
      .eq("is_active", true);

    if (barberId) {
      query = query.eq("barber_id", barberId);
      const { data, error } = await query
        .order("day_of_week", { ascending: true })
        .order("start_time", { ascending: true });

      if (error || !data || data.length === 0) {
        return fallbackHours;
      }

      return data;
    }

    const { data, error } = await query
      .order("day_of_week", { ascending: true })
      .order("start_time", { ascending: true });

    if (error || !data || data.length === 0) {
      return fallbackHours;
    }

    // Group by day_of_week
    const dayMap = new Map<number, PublicWorkingHours[]>();
    for (const row of data) {
      if (!dayMap.has(row.day_of_week)) {
        dayMap.set(row.day_of_week, []);
      }
      dayMap.get(row.day_of_week)!.push(row);
    }

    const businessHours: PublicWorkingHours[] = [];

    for (let day = 0; day <= 6; day++) {
      const rows = dayMap.get(day);
      if (!rows || rows.length === 0) {
        continue;
      }

      let earliestStart = rows[0].start_time;
      let latestEnd = rows[0].end_time;

      for (const r of rows) {
        if (r.start_time < earliestStart) earliestStart = r.start_time;
        if (r.end_time > latestEnd) latestEnd = r.end_time;
      }

      businessHours.push({
        id: `business-wh-${day}`,
        business_id: businessId,
        barber_id: "business",
        day_of_week: day,
        start_time: earliestStart,
        end_time: latestEnd,
        is_active: true,
        created_at: rows[0].created_at,
        updated_at: rows[0].updated_at,
      });
    }

    return businessHours;
  } catch {
    return fallbackHours;
  }
}
