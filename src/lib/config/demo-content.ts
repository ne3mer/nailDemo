/**
 * Centralized Demo Content & Configuration for Maison Rose — Nail & Beauty Studio.
 * 
 * Fictional luxury beauty demo content used for fallbacks and initial previews.
 */

export interface DemoBarber {
  id: string;
  name: string;
  roleEn: string;
  roleHu: string;
  bioEn: string;
  bioHu: string;
  specialtiesEn: string[];
  specialtiesHu: string[];
  photoUrl: string;
  instagramHandle: string;
  instagramUrl: string;
  displayOrder: number;
}

export interface DemoService {
  id: string;
  nameEn: string;
  nameHu: string;
  descriptionEn: string;
  descriptionHu: string;
  category: "Manicure & BIAB" | "Nail Art" | "Pedicure & Care" | "Rituals & Care" | "Haircut" | "Beard" | "Grooming Packages";
  durationMinutes: number;
  priceEur: number;
  priceHuf: number;
  isPopular?: boolean;
}

export interface DemoPortfolioItem {
  id: string;
  titleEn: string;
  titleHu: string;
  category: "Nail Art" | "Gel & BIAB" | "Gel-X" | "Spa Pedicure" | "Haircuts" | "Coloring" | "Styling" | "Other";
  styleTagEn: string;
  styleTagHu: string;
  imageUrl: string;
  barberName: string;
}

export interface DemoReview {
  id: string;
  authorName: string;
  origin: string;
  avatarUrl?: string;
  rating: number;
  dateStr: string;
  serviceNameEn: string;
  serviceNameHu: string;
  barberName: string;
  commentEn: string;
  commentHu: string;
  isVerified: boolean;
}

export interface DemoWorkingDay {
  dayOfWeek: number;
  dayNameEn: string;
  dayNameHu: string;
  startTime: string;
  endTime: string;
  isClosed?: boolean;
}

export const DEMO_BUSINESS = {
  name: "Maison Rose — Nail & Beauty Studio",
  slug: "maison-rose",
  shortName: "Maison Rose",
  taglineEn: "Airy Editorial Nail & Beauty Sanctuary in Budapest",
  taglineHu: "Légies Köröm- és Szépségápolási Műhely Budapesten",
  heroTitle: "Beautiful nails. A moment for you.",
  heroTitleHu: "Gyönyörű körmök. Egy pillanat Önnek.",
  heroSubtitleEn:
    "An unhurried sanctuary dedicated to Russian e-file manicures, BIAB nail strengthening, and bespoke hand-painted artistry in the heart of Budapest.",
  heroSubtitleHu:
    "Nyugodt, légies szentély a gépi orosz manikűr, a BIAB körömerősítés és az egyedi kézzel festett körömdíszítés számára Budapest szívében.",
  ctaPrimaryEn: "Book an appointment",
  ctaPrimaryHu: "Időpont foglalása",
  ctaSecondaryEn: "Explore Treatments",
  ctaSecondaryHu: "Kezelések megtekintése",
  descriptionEn:
    "An unhurried sanctuary dedicated to Russian e-file manicures, BIAB nail strengthening, and bespoke hand-painted artistry in the heart of Budapest.",
  descriptionHu:
    "Nyugodt, légies szentély a gépi orosz manikűr, a BIAB körömerősítés és az egyedi kézzel festett körömdíszítés számára Budapest szívében.",
  address: "Andrássy út 28, 1st Floor",
  district: "1061 Budapest, District VI",
  phone: "+36 1 458 9200",
  email: "bonjour",
  instagramUrl: "",
  instagramHandle: "",
  rating: 4.98,
  reviewCount: 210,
  disclaimerEn: "Concept & Demo Identity · Fictional Luxury Showcase",
  disclaimerHu: "Koncepció & Demó Megjelenés · Fiktív Prémium Bemutató",
};

export const DEMO_BARBERS: DemoBarber[] = [
  {
    id: "e1111111-1111-4111-a111-111111111111",
    name: "Camille Laurent",
    roleEn: "Creative Director & Lead Nail Artist",
    roleHu: "Kreatív Igazgató & Vezető Körömművész",
    bioEn:
      "Trained in Paris and Tokyo, Camille specializes in high-precision Russian manicures, delicate hand-painted micro art, and editorial chrome glazes.",
    bioHu:
      "Párizsban és Tokióban képzett művész; specialitása a precíziós orosz manikűr, a finom kézzel festett mikrominták és az editorial krómfények.",
    specialtiesEn: ["Russian E-File", "Editorial Micro Art", "Chrome Glazes"],
    specialtiesHu: ["Orosz gépi manikűr", "Kézzel festett mikrominták", "Krómfények"],
    photoUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    instagramHandle: "",
    instagramUrl: "",
    displayOrder: 1,
  },
  {
    id: "e2222222-2222-4222-a222-222222222222",
    name: "Éva Molnár",
    roleEn: "Senior BIAB & Gel Specialist",
    roleHu: "Senior BIAB & Zselé Specialista",
    bioEn:
      "Passionate about natural nail architecture and long-term health, Éva crafts flawless structured overlays and architectural French tips.",
    bioHu:
      "A természetes körmök anatómiájának és épségének szakértője; tökéletes építőzselés megerősítéseket és letisztult francia dizájnokat készít.",
    specialtiesEn: ["BIAB™ Strengthening", "Architectural French", "Dry Cuticle Care"],
    specialtiesHu: ["BIAB™ körömerősítés", "Épített francia vég", "Száraz kutikula-ápolás"],
    photoUrl:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
    instagramHandle: "",
    instagramUrl: "",
    displayOrder: 2,
  },
  {
    id: "e3333333-3333-4333-a333-333333333333",
    name: "Sophie Varga",
    roleEn: "Spa Specialist & Nail Care Artisan",
    roleHu: "Spa Specialista & Körömápoló",
    bioEn:
      "Combining reflexology techniques with Japanese organic buffing, Sophie delivers deeply restorative treatments for hands and feet.",
    bioHu:
      "Reflexológiai technikákkal és japán organikus méhviaszos kezelésekkel nyújt mélyen relaxáló élményt a kezeknek és lábaknak.",
    specialtiesEn: ["Japanese Organic Care", "Luxury Pedicure", "Aromatherapy Hand Spa"],
    specialtiesHu: ["Japán organikus ápolás", "Luxus pedikűr", "Aromaterápiás kézfürdő"],
    photoUrl:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80",
    instagramHandle: "",
    instagramUrl: "",
    displayOrder: 3,
  },
];

export const DEMO_SERVICES: DemoService[] = [
  {
    id: "f1111111-1111-4111-b111-111111111111",
    nameEn: "Signature Russian E-File Manicure",
    nameHu: "Signature Orosz Gépi Manikűr",
    descriptionEn:
      "Flawless dry cuticle treatment with fine diamond e-file bits, followed by a strengthening base and ultra-clean gel coat close to the eponychium.",
    descriptionHu:
      "Kíméletes száraz gépi kutikula-kezelés gyémántfejekkel, erősítő alapozással és tartós, precíz géllakkozással.",
    category: "Manicure & BIAB",
    durationMinutes: 75,
    priceEur: 65,
    priceHuf: 25500,
    isPopular: true,
  },
  {
    id: "f2222222-2222-4222-b222-222222222222",
    nameEn: "BIAB™ Natural Nail Strengthening",
    nameHu: "BIAB™ Természetes Körömerősítés",
    descriptionEn:
      "Builder-In-A-Bottle nourishing overlay engineered to reinforce weak natural nails, encourage healthy growth, and deliver weeks of chip-free wear.",
    descriptionHu:
      "Tápláló építőzselés alapozás a természetes körmök megerősítésére, törésmentes tartóssággal és egészséges növekedéssel.",
    category: "Manicure & BIAB",
    durationMinutes: 90,
    priceEur: 75,
    priceHuf: 29500,
    isPopular: true,
  },
  {
    id: "f3333333-3333-4333-b333-333333333333",
    nameEn: "Bespoke Editorial Nail Art",
    nameHu: "Egyedi Kézzel Festett Körömdíszítés",
    descriptionEn:
      "Tailored fine-line designs, glazed donut chrome, ethereal ombré, or miniature abstract florals painted individually for each guest.",
    descriptionHu:
      "Finom vonalas grafikák, krómfényű felületek, lágy ombré átmenetek vagy miniatűr virágmotívumok személyre szabottan festve.",
    category: "Nail Art",
    durationMinutes: 90,
    priceEur: 85,
    priceHuf: 33500,
    isPopular: true,
  },
  {
    id: "f4444444-4444-4444-b444-444444444444",
    nameEn: "Gel-X™ Soft Gel Extensions",
    nameHu: "Gel-X™ Puha Zselé Hosszabbítás",
    descriptionEn:
      "Full-cover soft gel tips applied without harsh chemicals, delivering instant natural length and flawless symmetry.",
    descriptionHu:
      "Teljes felületű puha zselé tipek vegyszermentes rögzítéssel, természetes hosszúsággal és tökéletes formával.",
    category: "Nail Art",
    durationMinutes: 105,
    priceEur: 95,
    priceHuf: 37500,
  },
  {
    id: "f5555555-5555-4555-b555-555555555555",
    nameEn: "Rose Petal Luxury Spa Pedicure",
    nameHu: "Rózsavizes Luxus Spa Pedikűr",
    descriptionEn:
      "Warm rosewater soak, gentle sea-salt exfoliation, meticulous e-file callus smoothing, and nourishing botanical massage.",
    descriptionHu:
      "Meleg rózsavizes lábfürdő, tengeri sós peeling, gyengéd gépi bőrkeményedés-eltávolítás és tápláló növényi olajos masszázs.",
    category: "Pedicure & Care",
    durationMinutes: 75,
    priceEur: 70,
    priceHuf: 27500,
  },
  {
    id: "f6666666-6666-4666-b666-666666666666",
    nameEn: "Japanese Organic Nail Restoration",
    nameHu: "Japán Organikus Méhviaszos Körömápolás",
    descriptionEn:
      "Chemical-free restorative treatment using beeswax paste and diatomaceous powder to impart a high natural shine and stimulate keratin synthesis.",
    descriptionHu:
      "Természetes méhviaszos és kovaföldes polírozás, amely vegyszermentes fényt ad és serkenti a köröm saját keratintermelését.",
    category: "Rituals & Care",
    durationMinutes: 60,
    priceEur: 55,
    priceHuf: 21500,
  },
];

export const DEMO_PORTFOLIO: DemoPortfolioItem[] = [
  {
    id: "port-1",
    titleEn: "Glazed Rose & Pearl Dust",
    titleHu: "Rózsa-króm & Gyöngyfény",
    category: "Nail Art",
    styleTagEn: "Chrome Finish · Russian Prep",
    styleTagHu: "Krómfény · Gépi előkészítés",
    imageUrl: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=1200&q=80",
    barberName: "Camille Laurent",
  },
  {
    id: "port-2",
    titleEn: "Minimalist Fine-Line French",
    titleHu: "Minimalista Finomvonalas Francia",
    category: "Gel & BIAB",
    styleTagEn: "BIAB Base · Micro Tips",
    styleTagHu: "BIAB Alap · Finom végek",
    imageUrl: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1200&q=80",
    barberName: "Éva Molnár",
  },
  {
    id: "port-3",
    titleEn: "Cashmere Rose Nude Overlay",
    titleHu: "Kasmír Rózsa Nude Megerősítés",
    category: "Gel & BIAB",
    styleTagEn: "Natural Silhouette · High Shine",
    styleTagHu: "Természetes forma · Magas fény",
    imageUrl: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=1200&q=80",
    barberName: "Éva Molnár",
  },
  {
    id: "port-4",
    titleEn: "Soft Gel-X Almond Elegance",
    titleHu: "Soft Gel-X Mandula Elegancia",
    category: "Gel-X",
    styleTagEn: "Sculpted Length · Sheer Blush",
    styleTagHu: "Hosszabbított forma · Finom pír",
    imageUrl: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=1200&q=80",
    barberName: "Camille Laurent",
  },
  {
    id: "port-5",
    titleEn: "Sheer Milky Rose with Micro Gold Flakes",
    titleHu: "Tejes Rózsa Mikró Aranyfüsttel",
    category: "Nail Art",
    styleTagEn: "Micro Art · 24k Accent",
    styleTagHu: "Mikrodíszítés · 24k arany akcentus",
    imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80",
    barberName: "Camille Laurent",
  },
  {
    id: "port-6",
    titleEn: "Japanese Organic Buff & Cuticle Ritual",
    titleHu: "Japán Organikus Méhviaszos Polírozás",
    category: "Spa Pedicure",
    styleTagEn: "Chemical Free · Pure Keratin",
    styleTagHu: "Vegyszermentes · Tiszta keratin",
    imageUrl: "https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?auto=format&fit=crop&w=1200&q=80",
    barberName: "Sophie Varga",
  },
];

export const DEMO_REVIEWS: DemoReview[] = [
  {
    id: "rev-1",
    authorName: "Zsófia Horváth",
    origin: "Budapest · District V",
    rating: 5,
    dateStr: "Yesterday",
    serviceNameEn: "Signature Russian E-File Manicure",
    serviceNameHu: "Signature Orosz Gépi Manikűr",
    barberName: "Camille Laurent",
    commentEn:
      "Camille's attention to cuticle precision is unmatched in Budapest. My cuticles remained pristine for four weeks and the studio feels like a Parisian retreat.",
    commentHu:
      "Camille precizitása páratlan Budapesten. A kutikulám négy hétig hibátlan maradt, a szalon pedig olyan nyugodt, mintha egy párizsi oázisban lennék.",
    isVerified: true,
  },
  {
    id: "rev-2",
    authorName: "Claire Dumont",
    origin: "Vienna, Austria",
    rating: 5,
    dateStr: "3 days ago",
    serviceNameEn: "BIAB™ Natural Nail Strengthening",
    serviceNameHu: "BIAB™ Természetes Körömerősítés",
    barberName: "Éva Molnár",
    commentEn:
      "I travel from Vienna to Budapest regularly. Éva gave me the best BIAB overlay I've had in Central Europe. Zero chipping after three full weeks.",
    commentHu:
      "Bécsből járok Budapestre rendszeresen. Éva készítette a legszebb BIAB megerősítést, amit valaha kaptam. Három hét után is teljesen lepattogzásmentes.",
    isVerified: true,
  },
  {
    id: "rev-3",
    authorName: "Anna Takács",
    origin: "Budapest · District II",
    rating: 5,
    dateStr: "1 week ago",
    serviceNameEn: "Bespoke Editorial Nail Art",
    serviceNameHu: "Egyedi Kézzel Festett Körömdíszítés",
    barberName: "Camille Laurent",
    commentEn:
      "The hand-painted chrome details were breathtaking. An unhurried, mindful experience where you are welcomed with iced rose tea and total tranquility.",
    commentHu:
      "A kézzel festett króm részletek egyszerűen lélegzetelállítóak. Nyugodt, figyelmes élmény: jeges rózsateával és teljes békével fogadtak.",
    isVerified: true,
  },
  {
    id: "rev-4",
    authorName: "Elena Varga",
    origin: "Budapest · District VI",
    rating: 5,
    dateStr: "2 weeks ago",
    serviceNameEn: "Rose Petal Luxury Spa Pedicure",
    serviceNameHu: "Rózsavizes Luxus Spa Pedikűr",
    barberName: "Sophie Varga",
    commentEn:
      "The spa pedicure with fresh rose petals and organic oils was deeply restorative. My feet have never felt so soft. Sophie is wonderful.",
    commentHu:
      "A friss rózsaszirmos spa pedikűr és az organikus olajok hihetetlenül feltöltöttek. A lábam még sosem volt ilyen puha. Sophie csodás szakember.",
    isVerified: true,
  },
];

export const DEMO_WORKING_HOURS: DemoWorkingDay[] = [
  { dayOfWeek: 1, dayNameEn: "Monday", dayNameHu: "Hétfő", startTime: "09:00", endTime: "20:00" },
  { dayOfWeek: 2, dayNameEn: "Tuesday", dayNameHu: "Kedd", startTime: "09:00", endTime: "20:00" },
  { dayOfWeek: 3, dayNameEn: "Wednesday", dayNameHu: "Szerda", startTime: "09:00", endTime: "20:00" },
  { dayOfWeek: 4, dayNameEn: "Thursday", dayNameHu: "Csütörtök", startTime: "09:00", endTime: "20:00" },
  { dayOfWeek: 5, dayNameEn: "Friday", dayNameHu: "Péntek", startTime: "09:00", endTime: "20:00" },
  { dayOfWeek: 6, dayNameEn: "Saturday", dayNameHu: "Szombat", startTime: "10:00", endTime: "18:00" },
  { dayOfWeek: 0, dayNameEn: "Sunday", dayNameHu: "Vasárnap", startTime: "", endTime: "", isClosed: true },
];

export const DEMO_ATELIER_EXPERIENCE = [
  {
    titleEn: "Bespoke Cuticle & Nail Analysis",
    titleHu: "Egyéni Köröm- és Bőranalízis",
    descEn: "We inspect your nail architecture, plate thickness, and lifestyle routine before choosing formulations.",
    descHu: "Alaposan felmérjük a körömlemezek vastagságát és állapotát a legmegfelelőbb anyagok kiválasztásához.",
  },
  {
    titleEn: "Sterilized Medical-Grade Instruments",
    titleHu: "Orvosi Tisztaságú Sterilizálás",
    descEn: "Hospital-grade autoclaved diamond e-file bits and single-use disposable files for unconditional hygiene.",
    descHu: "Autoklávban sterilizált gyémántcsiszoló fejek és egyszer használatos reszelők a maximális higiéniáért.",
  },
  {
    titleEn: "Artisanal Refreshments & Tea",
    titleHu: "Prémium Rózsa- és Zöldteák",
    descEn: "Complimentary French sparkling rosewater, organic loose-leaf herbal teas, and artisan espresso.",
    descHu: "Díjmentes francia rózsavíz, prémium szálas bioszálas teák és friss eszpresszó minden vendégünknek.",
  },
  {
    titleEn: "Ergonomic Treatment Lounges",
    titleHu: "Ergonomikus Pihentető Fotelek",
    descEn: "Plush, cloud-soft seating designed for effortless spinal relaxation during restorative appointments.",
    descHu: "Kényelmes, puha fotelkialakítás a teljes ellazulásért a szépítő kezelések ideje alatt.",
  },
];
