export type Language = "en" | "hu";

export const translations = {
  en: {
    // Navigation & Header
    brand: "Maison Rose",
    brandSubtitle: "Nail & Beauty Studio",
    navServices: "Treatments",
    navBarbers: "Artists",
    navPortfolio: "Gallery",
    navReviews: "Reviews",
    navAbout: "Philosophy",
    navHours: "Hours & Location",
    bookNow: "Book an Appointment",

    // Hero
    heroTagline: "MAISON ROSE · NAIL & BEAUTY STUDIO",
    heroTitle: "Beautiful nails. A moment for you.",
    heroSubtitle:
      "An unhurried sanctuary dedicated to Russian e-file manicures, BIAB nail strengthening, and bespoke hand-painted artistry in the heart of Budapest.",
    heroPrimaryCta: "Book an appointment",
    heroSecondaryCta: "Explore Treatments",

    // Services Section
    servicesTitle: "Treatments & Pricing",
    servicesSubtitle:
      "Every manicure and beauty ritual includes a consultation, natural nail health assessment, and nourishing botanical care.",
    duration: "mins",
    bookService: "Select Treatment",

    // Portfolio Section
    portfolioTitle: "Nail Artistry & Gallery",
    portfolioSubtitle: "A curated collection of recent Russian manicures, glazed chrome finishes, and fine-line hand-painted art.",
    allCategories: "All Works",

    // About Section
    aboutTitle: "The Philosophy",
    aboutText:
      "Maison Rose is dedicated to healthy natural nails, surgical gentleness, and clean editorial aesthetics. We take time to elevate every detail in an airy, soothing atmosphere.",

    // Hours & Location Section
    hoursTitle: "Studio Hours",
    locationTitle: "Location & Sanctuary",
    closed: "Closed",
    address: "Address",
    phone: "Phone",
    email: "Email",
    instagram: "Instagram",

    // Booking Flow
    bookingTitle: "Book Your Appointment",
    step1Title: "1. Select Artist",
    step2Title: "2. Choose Treatment",
    step3Title: "3. Choose Date & Time",
    step4Title: "4. Your Information",
    step5Title: "5. Review & Confirm",
    stepSuccessTitle: "Appointment Confirmed",

    nextStep: "Continue",
    prevStep: "Back",
    confirmBooking: "Confirm Booking",
    submittingBooking: "Reserving Slot...",

    selectDatePrompt: "Select a date to view available time slots",
    noSlotsAvailable:
      "No available time slots for this date. Please choose another day.",
    loadingSlots: "Calculating available slots...",

    // Form Labels
    fullName: "Full Name",
    fullNamePlaceholder: "e.g. Elena Kovács",
    phoneNumber: "Phone Number",
    phonePlaceholder: "+36 30 123 4567",
    emailAddress: "Email Address (Optional)",
    emailPlaceholder: "elena@example.com",
    notesLabel: "Notes / Nail Art Requests (Optional)",
    notesPlaceholder: "e.g. Desired length, nail art ideas, or sensitive cuticles...",

    // Success Screen
    successHeadline: "Appointment Request Received",
    successMessage:
      "Thank you! Your beauty appointment has been recorded in our system as pending confirmation.",
    bookingDetails: "Booking Summary",
    statusBadgePending: "Pending Confirmation",
    backToHome: "Return to Homepage",
    bookAnother: "Book Another Appointment",

    // Errors
    errorRequiredFields: "Please fill out all required fields.",
    errorConflict: "This time slot is no longer available. Please choose another time.",
    errorPastBooking: "Cannot book an appointment in the past.",
    errorServiceUnavailable: "Selected treatment is not active or available.",
    errorGeneric: "An error occurred while creating your booking. Please try again.",

    // Labels & UI text
    stepOf: "Step",
    of: "of",
    selectedServiceLabel: "Selected Treatment",
    changeService: "Change Treatment",
    dateLabel: "Date (Europe/Budapest Time)",
    serviceLabel: "Treatment",
    dateTimeLabel: "Date & Time",
    durationLabel: "Duration",
    customerLabel: "Guest",
    priceLabel: "Price",
    followInstagram: "Follow on Instagram",
    readyTitle: "Beautiful nails. A moment for you.",
    readySubtitle:
      "Reserve your personal manicure or restorative treatment online in just a moment.",
    timezoneNotice: "Europe/Budapest Timezone",
    defaultServiceDesc: "Signature nail care and restorative beauty treatment.",
    adminLogin: "Studio Login",
  },

  hu: {
    // Navigation & Header
    brand: "Maison Rose",
    brandSubtitle: "Köröm- és Szépségstúdió",
    navServices: "Kezelések",
    navBarbers: "Művészek",
    navPortfolio: "Galéria",
    navReviews: "Vélemények",
    navAbout: "Filozófia",
    navHours: "Nyitvatartás & Helyszín",
    bookNow: "Időpontfoglalás",

    // Hero
    heroTagline: "MAISON ROSE · KÖRÖM- ÉS SZÉPSÉGSTÚDIÓ",
    heroTitle: "Gyönyörű körmök. Egy pillanat Önnek.",
    heroSubtitle:
      "Nyugodt, légies szentély a gépi orosz manikűr, a BIAB körömerősítés és az egyedi kézzel festett körömdíszítés számára Budapest szívében.",
    heroPrimaryCta: "Időpont foglalása",
    heroSecondaryCta: "Kezelések megtekintése",

    // Services Section
    servicesTitle: "Kezelések & Árak",
    servicesSubtitle:
      "Minden manikűr és ápolási rituálé személyre szabott konzultációt, kíméletes körömelőkészítést és tápláló növényi olajos ápolást tartalmaz.",
    duration: "perc",
    bookService: "Kezelés kiválasztása",

    // Portfolio Section
    portfolioTitle: "Körömművészet & Galéria",
    portfolioSubtitle: "Válogatás a legfrissebb gépi manikűrjeinkből, krómfényű felületeinkből és finom kézzel festett mintáinkból.",
    allCategories: "Összes munka",

    // About Section
    aboutTitle: "A Filozófia",
    aboutText:
      "A Maison Rose küldetése a természetes körmök egészsége, a kíméletes precizitás és a letisztult editorial esztétika. Egy nyugodt, légies környezetben figyelünk minden részletre.",

    // Hours & Location Section
    hoursTitle: "Nyitvatartás",
    locationTitle: "Helyszín & Stúdió",
    closed: "Zárva",
    address: "Cím",
    phone: "Telefon",
    email: "E-mail",
    instagram: "Instagram",

    // Booking Flow
    bookingTitle: "Időpontfoglalás",
    step1Title: "1. Művész kiválasztása",
    step2Title: "2. Kezelés kiválasztása",
    step3Title: "3. Időpont kiválasztása",
    step4Title: "4. Az Ön adatai",
    step5Title: "5. Áttekintés & Megerősítés",
    stepSuccessTitle: "Foglalás Megerősítve",

    nextStep: "Tovább",
    prevStep: "Vissza",
    confirmBooking: "Foglalás megerősítése",
    submittingBooking: "Foglalás feldolgozása...",

    selectDatePrompt: "Válasszon dátumot a szabad időpontok megtekintéséhez",
    noSlotsAvailable:
      "Ezen a napon nincsenek szabad időpontok. Kérjük, válasszon másik napot.",
    loadingSlots: "Szabad időpontok kiszámítása...",

    // Form Labels
    fullName: "Teljes Név",
    fullNamePlaceholder: "pl. Kovács Elena",
    phoneNumber: "Telefonszám",
    phonePlaceholder: "+36 30 123 4567",
    emailAddress: "E-mail cím (Opcionális)",
    emailPlaceholder: "elena@example.com",
    notesLabel: "Megjegyzés / Kérések (Opcionális)",
    notesPlaceholder: "pl. Kívánt forma, díszítési ötletek vagy érzékeny körömágy...",

    // Success Screen
    successHeadline: "Foglalási Igény Rögzítve",
    successMessage:
      "Köszönjük! Szépségápolási időpontfoglalási igényét rögzítettük rendszerünkben.",
    bookingDetails: "Foglalás Részletei",
    statusBadgePending: "Függőben lévő visszaigazolás",
    backToHome: "Vissza a főoldalra",
    bookAnother: "Új időpont foglalása",

    // Errors
    errorRequiredFields: "Kérjük, töltse ki az összes kötelező mezőt.",
    errorConflict: "Ez az időpont már nem elérhető. Kérjük, válasszon másik időpontot.",
    errorPastBooking: "Múltbéli időpontra nem lehet foglalást leadni.",
    errorServiceUnavailable: "A kiválasztott kezelés jelenleg nem érhető el.",
    errorGeneric: "Hiba történt a foglalás során. Kérjük, próbálja újra.",

    // Labels & UI text
    stepOf: "lépés /",
    of: "/",
    selectedServiceLabel: "Kiválasztott kezelés",
    changeService: "Másik kezelés",
    dateLabel: "Dátum (Európa/Budapest idő)",
    serviceLabel: "Kezelés",
    dateTimeLabel: "Dátum & Időpont",
    durationLabel: "Időtartam",
    customerLabel: "Vendég",
    priceLabel: "Ár",
    followInstagram: "Kövessen Instagramon",
    readyTitle: "Gyönyörű körmök. Egy pillanat Önnek.",
    readySubtitle:
      "Foglalja le manikűr vagy kényeztető spa kezelését online, kényelmesen pár perc alatt.",
    timezoneNotice: "Európa/Budapest időzóna",
    defaultServiceDesc: "Prémium körömápoló és regeneráló szépségkezelés.",
    adminLogin: "Stúdió Belépés",
  },
} as const;

export type TranslationKeys = {
  [K in keyof typeof translations.en]: string;
};

export function getLocalizedField(
  obj: Record<string, unknown>,
  fieldBase: string,
  lang: Language
): string {
  const primaryKey = `${fieldBase}_${lang}`;
  const fallbackKey = fieldBase === "name" || fieldBase === "description" ? `${fieldBase}_en` : fieldBase;
  const val = obj[primaryKey] || obj[fallbackKey];
  return typeof val === "string" ? val : "";
}
