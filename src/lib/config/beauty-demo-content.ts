/**
 * Presentation-Only Demo Content & Configuration for "Maison Rose — Nail & Beauty Studio".
 * 
 * Strictly isolated presentation configuration for the luxury beauty/nail salon demo.
 * Does not overwrite backend database seeding contracts or Barbod production data.
 */

export interface BeautyArtist {
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
}

export interface BeautyService {
  id: string;
  nameEn: string;
  nameHu: string;
  descriptionEn: string;
  descriptionHu: string;
  category: "Manicure & BIAB" | "Nail Art" | "Pedicure & Care" | "Rituals & Care";
  durationMinutes: number;
  priceEur: number;
  priceHuf: number;
  isPopular?: boolean;
}

export interface BeautyPortfolioItem {
  id: string;
  titleEn: string;
  titleHu: string;
  category: "Nail Art" | "Gel & BIAB" | "Gel-X" | "Spa Pedicure";
  styleTagEn: string;
  styleTagHu: string;
  imageUrl: string;
  artistName: string;
}

export interface BeautyReview {
  id: string;
  authorName: string;
  origin: string;
  rating: number;
  serviceNameEn: string;
  serviceNameHu: string;
  artistName: string;
  commentEn: string;
  commentHu: string;
}

export interface BeautyPillar {
  titleEn: string;
  titleHu: string;
  descEn: string;
  descHu: string;
  tag: string;
}

export const BEAUTY_DEMO_BUSINESS = {
  name: "Maison Rose — Nail & Beauty Studio",
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
  address: "Andrássy út 28, 1st Floor",
  district: "1061 Budapest, District VI",
  country: "Hungary",
  landmarkEn: "Opposite the Hungarian State Opera House",
  landmarkHu: "A Magyar Állami Operaházzal szemben",
  transitEn: "M1 Opera station (1 min walk) · Deák Ferenc tér (5 min walk)",
  transitHu: "M1 Opera megálló (1 perc séta) · Deák Ferenc tér (5 perc séta)",
  phone: "+36 1 458 9200",
  email: "bonjour",
  instagramHandle: "",
  rating: 4.98,
  reviewCount: 210,
  disclaimerEn: "Concept & Demo Identity · Fictional Luxury Showcase",
  disclaimerHu: "Koncepció & Demó Megjelenés · Fiktív Prémium Bemutató",
};

export const BEAUTY_DEMO_ARTISTS: BeautyArtist[] = [
  {
    id: "artist-camille",
    name: "Camille Laurent",
    roleEn: "Creative Director & Lead Nail Artist",
    roleHu: "Kreatív Igazgató & Vezető Körömművész",
    bioEn:
      "Trained in Paris and Tokyo, Camille specializes in high-precision Russian manicures, delicate hand-painted micro art, and editorial chrome finishes.",
    bioHu:
      "Párizsban és Tokióban képzett művész; specialitása a precíziós orosz manikűr, a finom kézzel festett mikrominták és az editorial krómfények.",
    specialtiesEn: ["Russian E-File", "Editorial Micro Art", "Chrome Glazes"],
    specialtiesHu: ["Orosz gépi manikűr", "Kézzel festett mikrominták", "Krómfények"],
    photoUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    instagramHandle: "",
  },
  {
    id: "artist-eva",
    name: "Éva Molnár",
    roleEn: "Senior BIAB & Gel-X Specialist",
    roleHu: "Senior BIAB & Gel-X Specialista",
    bioEn:
      "A master of natural nail rehabilitation. Éva works with builder-in-a-bottle overlays and soft Gel-X extensions to create resilient, slender silhouettes.",
    bioHu:
      "A természetes körmök megerősítésének szakértője. BIAB építőzselével és kíméletes Gel-X hosszabbítással varázsol kecses formákat.",
    specialtiesEn: ["BIAB Strengthening", "Soft Gel-X", "Natural Nail Health"],
    specialtiesHu: ["BIAB körömerősítés", "Soft Gel-X", "Természetes körömápolás"],
    photoUrl:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80",
    instagramHandle: "",
  },
  {
    id: "artist-sophie",
    name: "Sophie Dubois",
    roleEn: "Pedicure Artisan & Spa Therapist",
    roleHu: "Pedikűr Művész & Spa Terapeuta",
    bioEn:
      "Dedicated to restorative botanical foot care and Japanese beeswax rituals, Sophie turns routine nail care into a soothing meditative experience.",
    bioHu:
      "A növényi kivonatos lábápolás és a japán méhviaszos rituálék mestere; a körömápolást pihentető, meditatív élménnyé alakítja.",
    specialtiesEn: ["Rose Spa Pedicure", "Japanese Manicure", "Aroma Therapy"],
    specialtiesHu: ["Rózsás spa pedikűr", "Japán manikűr", "Aromaterápia"],
    photoUrl:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
    instagramHandle: "",
  },
];

export const BEAUTY_DEMO_SERVICES: BeautyService[] = [
  {
    id: "beauty-svc-1",
    nameEn: "Signature Russian Gel Manicure",
    nameHu: "Prémium Orosz Gépi Géllakk",
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
    id: "beauty-svc-2",
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
    id: "beauty-svc-3",
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
    id: "beauty-svc-4",
    nameEn: "Soft Gel-X™ Sculpted Extensions",
    nameHu: "Soft Gel-X™ Körömhosszabbítás",
    descriptionEn:
      "Gentle full-cover soft gel tips applied without harsh primers or odorous acrylics, shaped into elegant almond, coffin, or natural oval silhouettes.",
    descriptionHu:
      "Kíméletes teljes fedésű zselés tippek kellemetlen szagú akril nélkül, elegáns mandula vagy lágy ovális formára kialakítva.",
    category: "Nail Art",
    durationMinutes: 105,
    priceEur: 95,
    priceHuf: 37500,
  },
  {
    id: "beauty-svc-5",
    nameEn: "Luxury Rose Petal Spa Pedicure",
    nameHu: "Luxus Rózsa-Spa Pedikűr",
    descriptionEn:
      "Warm organic rose petal soak, gentle apricot seed exfoliation, cuticle detailing, deep hydration massage, and durable gel pedicure finish.",
    descriptionHu:
      "Meleg bio rózsaszirmos áztatás, sárgabarackmagos bőrradír, pedikűr, mélyhidratáló masszázs és tartós zselés lakkozás.",
    category: "Pedicure & Care",
    durationMinutes: 60,
    priceEur: 70,
    priceHuf: 27500,
  },
  {
    id: "beauty-svc-6",
    nameEn: "Japanese Keratin & Beeswax Ritual",
    nameHu: "Japán Méhviaszos Körömápoló Rituálé",
    descriptionEn:
      "Centuries-old restorative treatment buffing nutrient-rich natural beeswax and pearl powder into damaged nail plates for a healthy pearlescent glow.",
    descriptionHu:
      "Hagyományos japán regeneráló kezelés természetes méhviasszal és gyöngyfény porral a sérült körmök természetes ragyogásáért.",
    category: "Rituals & Care",
    durationMinutes: 45,
    priceEur: 50,
    priceHuf: 19500,
  },
];

export const BEAUTY_DEMO_PORTFOLIO: BeautyPortfolioItem[] = [
  {
    id: "port-1",
    titleEn: "Glazed Rose & Pearl Dust",
    titleHu: "Rózsa-króm & Gyöngyfény",
    category: "Nail Art",
    styleTagEn: "Chrome Finish · Russian Prep",
    styleTagHu: "Krómfény · Gépi előkészítés",
    imageUrl:
      "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=1200&q=80",
    artistName: "Camille Laurent",
  },
  {
    id: "port-2",
    titleEn: "Minimalist Fine-Line French",
    titleHu: "Minimalista Finomvonalas Francia",
    category: "Gel & BIAB",
    styleTagEn: "BIAB Base · Micro Tips",
    styleTagHu: "BIAB Alap · Finom végek",
    imageUrl:
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1200&q=80",
    artistName: "Éva Molnár",
  },
  {
    id: "port-3",
    titleEn: "Cashmere Rose Nude Overlay",
    titleHu: "Kasmír Rózsa Nude Megerősítés",
    category: "Gel & BIAB",
    styleTagEn: "Natural Silhouette · High Shine",
    styleTagHu: "Természetes forma · Magas fény",
    imageUrl:
      "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=1200&q=80",
    artistName: "Éva Molnár",
  },
  {
    id: "port-4",
    titleEn: "Soft Gel-X Almond Elegance",
    titleHu: "Soft Gel-X Mandula Elegancia",
    category: "Gel-X",
    styleTagEn: "Sculpted Length · Sheer Blush",
    styleTagHu: "Hosszabbított forma · Finom pír",
    imageUrl:
      "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=1200&q=80",
    artistName: "Camille Laurent",
  },
  {
    id: "port-5",
    titleEn: "Botanical Petal Accents",
    titleHu: "Botanikus Szirom Részletek",
    category: "Nail Art",
    styleTagEn: "Hand-Painted · Matte Velvet",
    styleTagHu: "Kézzel festett · Matt bársony",
    imageUrl:
      "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=1200&q=80",
    artistName: "Camille Laurent",
  },
  {
    id: "port-6",
    titleEn: "Champagne Leaf & Soft Milky Glaze",
    titleHu: "Pezsgőfüst & Tejes Fény",
    category: "Nail Art",
    styleTagEn: "Gold Accents · Milky Base",
    styleTagHu: "Aranyfény · Tejes alap",
    imageUrl:
      "https://images.unsplash.com/photo-1576426863848-c21f53c60b19?auto=format&fit=crop&w=1200&q=80",
    artistName: "Sophie Dubois",
  },
];

export const BEAUTY_DEMO_PILLARS: BeautyPillar[] = [
  {
    tag: "01 / TECHNIQUE",
    titleEn: "Gentle Precision & Natural Health",
    titleHu: "Kíméletes Precizitás & Természetes Egészség",
    descEn:
      "Our Russian e-file method treats delicate cuticles with surgical gentleness. We prioritize the long-term health and strength of your natural nail plate above all else.",
    descHu:
      "Kíméletes gépi manikűr technikánk páratlan gyengédséggel ápolja a kutikulát, mindig a természetes körömlemez hosszú távú egészségét helyezve előtérbe.",
  },
  {
    tag: "02 / FORMULATION",
    titleEn: "Non-Toxic & 10-Free Formulas",
    titleHu: "Káros Anyagtól Mentes, 10-Free Formulák",
    descEn:
      "We strictly source vegan, cruelty-free builder gels, hypoallergenic pigments, and botanical botanical oils without harsh formaldehyde, toluene, or aggressive monomers.",
    descHu:
      "Kizárólag vegán, állatkísérlet-mentes építőzseléket, hipoallergén pigmenteket és növényi olajokat használunk formaldehid és agresszív monomerek nélkül.",
  },
  {
    tag: "03 / SANCTUARY",
    titleEn: "An Unhurried Moment for You",
    titleHu: "Nyugodt, Saját Pillanat Önnek",
    descEn:
      "Enjoy private editorial manicure stations, complimentary warm botanical rose tea, artisanal champagne, and a quiet ambiance designed to help you decompress.",
    descHu:
      "Élvezze privát szalonállomásainkat, díjmentes bio rózsa teánkat vagy kézműves pezsgőnket a rohanástól mentes, pihentető feltöltődésért.",
  },
  {
    tag: "04 / ARTISTRY",
    titleEn: "Bespoke Miniature Artistry",
    titleHu: "Egyedi Miniatűr Művészet",
    descEn:
      "From quiet-luxury sheer minimalism to hand-painted micro graphics and subtle chrome glazes, every appointment is tailored to your aesthetic.",
    descHu:
      "A csendes luxus letisztult nudes árnyalataitól a mikrografikákig és a diszkrét krómfényig minden részletet az Ön stílusára formálunk.",
  },
];

export const BEAUTY_DEMO_REVIEWS: BeautyReview[] = [
  {
    id: "rev-1",
    authorName: "Elena V.",
    origin: "Budapest · District V",
    rating: 5,
    serviceNameEn: "Signature Russian Gel Manicure",
    serviceNameHu: "Prémium Orosz Gépi Géllakk",
    artistName: "Camille Laurent",
    commentEn:
      "The precision and gentleness at Maison Rose is unmatched. My cuticles look impeccably clean even three weeks later, and the studio atmosphere feels like a quiet sanctuary.",
    commentHu:
      "A Maison Rose precizitása és gyengédsége felülmúlhatatlan. A körmeim még három hét elteltével is tökéletesek, a szalon hangulata pedig végtelenül megnyugtató.",
  },
  {
    id: "rev-2",
    authorName: "Zsófia K.",
    origin: "Budapest · District II",
    rating: 5,
    serviceNameEn: "BIAB™ Natural Nail Strengthening",
    serviceNameHu: "BIAB™ Természetes Körömerősítés",
    artistName: "Éva Molnár",
    commentEn:
      "After years of brittle nails from acrylics elsewhere, Éva restored my natural nails with BIAB. They are stronger than ever and look so effortlessly elegant.",
    commentHu:
      "Évekig gyengék voltak a körmeim más helyeken végzett kezelésektől, de Éva a BIAB-bal újjáélesztette őket. Erősebbek, mint valaha, és gyönyörűen természetesek.",
  },
  {
    id: "rev-3",
    authorName: "Marie L.",
    origin: "Paris & Budapest",
    rating: 5,
    serviceNameEn: "Luxury Rose Petal Spa Pedicure",
    serviceNameHu: "Luxus Rózsa-Spa Pedikűr",
    artistName: "Sophie Dubois",
    commentEn:
      "Sophie's rose petal spa pedicure is the most relaxing sixty minutes of my month. Warm botanical tea, gentle care, and a spotless finish.",
    commentHu:
      "Sophie rózsaszirmos spa pedikűrje a legpihentetőbb egy óra a hónapomban. Meleg gyógytea, figyelmes gondoskodás és makulátlan végeredmény.",
  },
];
