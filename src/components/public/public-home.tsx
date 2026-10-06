"use client";

/* eslint-disable @next/next/no-img-element */
import * as React from "react";
import Link from "next/link";
import {
  Sparkles,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  X,
  ExternalLink,
  Star,
  Clock,
  Navigation,
} from "lucide-react";

import type {
  PublicBusiness,
  PublicBarber,
  PublicService,
  PublicPortfolioItem,
  PublicWorkingHours,
} from "@/lib/public/business";
import type { InstagramMediaItem } from "@/lib/instagram/types";
import { AtelierInstagramFeed } from "@/components/public/atelier-instagram-feed";
import { AtelierPhilosophySection } from "@/components/public/atelier-philosophy-section";
import { ClientReviewsSection } from "@/components/public/client-reviews-section";
import { useLanguage } from "@/lib/i18n/context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BEAUTY_DEMO_BUSINESS,
  BEAUTY_DEMO_ARTISTS,
  BEAUTY_DEMO_SERVICES,
  BEAUTY_DEMO_PORTFOLIO,
} from "@/lib/config/beauty-demo-content";

interface PublicHomeProps {
  business: PublicBusiness;
  barbers: PublicBarber[];
  services: PublicService[];
  portfolio: PublicPortfolioItem[];
  workingHours: PublicWorkingHours[];
  instagramItems?: InstagramMediaItem[];
}

const DAY_NAMES: Record<number, { en: string; hu: string }> = {
  1: { en: "Monday", hu: "Hétfő" },
  2: { en: "Tuesday", hu: "Kedd" },
  3: { en: "Wednesday", hu: "Szerda" },
  4: { en: "Thursday", hu: "Csütörtök" },
  5: { en: "Friday", hu: "Péntek" },
  6: { en: "Saturday", hu: "Szombat" },
  0: { en: "Sunday", hu: "Vasárnap" },
};

const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

export function PublicHome({
  barbers,
  services,
  workingHours,
  instagramItems = [],
}: PublicHomeProps) {
  const { lang, t } = useLanguage();
  const [selectedGalleryCategory, setSelectedGalleryCategory] = React.useState<string>("all");
  const [selectedServiceCategory, setSelectedServiceCategory] = React.useState<string>("all");
  const [lightboxImg, setLightboxImg] = React.useState<{ url: string; title?: string } | null>(null);

  // Gallery Categories
  const galleryCategories = ["all", "Nail Art", "Gel & BIAB", "Gel-X", "Spa Pedicure"];

  const filteredPortfolio = React.useMemo(() => {
    if (selectedGalleryCategory === "all") return BEAUTY_DEMO_PORTFOLIO;
    return BEAUTY_DEMO_PORTFOLIO.filter((item) => item.category === selectedGalleryCategory);
  }, [selectedGalleryCategory]);

  // Service Filter Categories
  const serviceCategories = ["all", "Manicure & BIAB", "Nail Art", "Pedicure & Care", "Rituals & Care"];

  const filteredServices = React.useMemo(() => {
    if (selectedServiceCategory === "all") return BEAUTY_DEMO_SERVICES;
    return BEAUTY_DEMO_SERVICES.filter((s) => s.category === selectedServiceCategory);
  }, [selectedServiceCategory]);

  // Check if live DB services are non-beauty (e.g. from existing haircut database)
  const isHaircutDatabase = React.useMemo(() => {
    if (!services || services.length === 0) return false;
    return services.some((s) => {
      const name = (s.name_en || "").toLowerCase();
      return name.includes("cut") || name.includes("fade") || name.includes("beard") || name.includes("shave");
    });
  }, [services]);

  const heroFeaturedImage =
    "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="flex flex-col gap-20 sm:gap-28 pb-24 w-full min-w-0 max-w-full">
      {/* 1. 12-Column Airy Editorial Hero Section */}
      <section className="relative overflow-hidden border-b border-border/80 py-12 sm:py-20 lg:py-28 bg-gradient-to-b from-background via-secondary/30 to-background w-full max-w-full">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 min-w-0">
          <div className="grid gap-12 lg:gap-16 lg:grid-cols-12 lg:items-center min-w-0">
            {/* Left 7-Cols */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8 min-w-0">
              <div className="inline-flex items-center gap-2.5 rounded-full border border-primary/20 bg-secondary/80 px-4 py-1.5 text-xs font-medium text-primary shadow-2xs">
                <Sparkles className="size-3.5 shrink-0 text-primary" />
                <span className="tracking-[0.14em] uppercase text-[11px] font-sans">
                  {lang === "hu" ? "BUDAPEST · KÖRÖM- ÉS SZÉPSÉGSTÚDIÓ" : "BUDAPEST · NAIL & BEAUTY STUDIO"}
                </span>
              </div>

              <h1 className="text-4xl xs:text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight text-foreground font-serif leading-[1.05] sm:leading-[1.02] break-words min-w-0">
                {lang === "hu" ? (
                  <>
                    Gyönyörű körmök.
                    <br />
                    <span className="italic font-light text-primary">Egy nyugodt pillanat</span>
                    <br />
                    Önnek.
                  </>
                ) : (
                  <>
                    Beautiful nails.
                    <br />
                    <span className="italic font-light text-primary">A moment</span>
                    <br />
                    for you.
                  </>
                )}
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl font-normal">
                {lang === "hu" ? BEAUTY_DEMO_BUSINESS.heroSubtitleHu : BEAUTY_DEMO_BUSINESS.heroSubtitleEn}
              </p>

              <div className="flex flex-col xs:flex-row flex-wrap items-stretch xs:items-center gap-3.5 sm:gap-4 pt-2 w-full min-w-0">
                <Link href="/book" className="w-full xs:w-auto">
                  <Button size="lg" className="w-full xs:w-auto min-h-[52px] group gap-3 px-8 text-xs font-medium tracking-[0.1em] rounded-full shadow-md">
                    <span>{t.heroPrimaryCta}</span>
                    <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="#services" className="w-full xs:w-auto">
                  <Button size="lg" variant="outline" className="w-full xs:w-auto min-h-[52px] px-8 text-xs font-medium tracking-[0.1em] rounded-full border-border hover:bg-secondary/60">
                    {t.heroSecondaryCta}
                  </Button>
                </Link>
              </div>

              {/* Social Proof Mini Bar */}
              <div className="flex flex-wrap items-center gap-6 pt-5 border-t border-border/80 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <div className="flex text-primary">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="size-3.5 fill-primary text-primary" />
                    ))}
                  </div>
                  <span className="font-medium text-foreground">{BEAUTY_DEMO_BUSINESS.rating}</span>
                  <span>({BEAUTY_DEMO_BUSINESS.reviewCount}+ {lang === "hu" ? "értékelés" : "reviews"})</span>
                </div>
                <div className="hidden sm:block h-3.5 w-px bg-border" />
                <div className="flex items-center gap-1.5">
                  <MapPin className="size-3.5 text-primary" />
                  <span>Andrássy út 28 · District VI</span>
                </div>
                <div className="hidden sm:block h-3.5 w-px bg-border" />
                <div className="flex items-center gap-1.5">
                  <Clock className="size-3.5 text-primary" />
                  <span>Mon–Sat 09:00–19:00</span>
                </div>
              </div>
            </div>

            {/* Right 5-Cols */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-4/5 overflow-hidden rounded-3xl border border-border/80 bg-card p-2.5 shadow-xl">
                <img
                  src={heroFeaturedImage}
                  alt="Maison Rose Nail Artistry"
                  className="h-full w-full object-cover rounded-2xl transition-transform duration-700 hover:scale-[1.02]"
                />
                <div className="absolute inset-5 rounded-2xl border border-white/20 pointer-events-none" />
                <div className="absolute bottom-6 left-6 right-6 p-4.5 rounded-2xl bg-card/90 backdrop-blur-md border border-border/80 text-foreground flex items-center justify-between shadow-lg">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.16em] text-primary font-medium block">
                      BUDAPEST STUDIO
                    </span>
                    <span className="font-serif text-sm tracking-wide text-foreground">
                      Andrássy út 28
                    </span>
                  </div>
                  <Link href="/book">
                    <span className="text-xs uppercase tracking-wider font-medium text-primary hover:underline flex items-center gap-1">
                      <span>{lang === "hu" ? "Időpont" : "Book"}</span>
                      <ArrowRight className="size-3" />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE STUDIO PHILOSOPHY & PILLARS */}
      <AtelierPhilosophySection />

      {/* 3. MEET THE NAIL ARTISTS / TEAM */}
      <section id="barbers" className="mx-auto max-w-7xl px-4 sm:px-6 w-full scroll-mt-24 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/80 pb-6">
          <div className="space-y-2">
            <span className="eyebrow">{lang === "hu" ? "KÖRÖMMŰVÉSZEINK" : "OUR NAIL ARTISTS"}</span>
            <h2 className="text-3xl sm:text-5xl font-normal tracking-tight text-foreground font-serif">
              {lang === "hu" ? "Ismerje meg szakembereinket" : "Meet The Studio Artists"}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground font-normal max-w-xl">
              {lang === "hu"
                ? "Nemzetközi tapasztalattal rendelkező, finomkezű körömszakemberek, akik elkötelezettek a természetes köröm egészsége és az egyedi díszítés iránt."
                : "Experienced artisans dedicated to meticulous Russian cuticle care, BIAB strengthening, and delicate hand-painted fine-line nail art."}
            </p>
          </div>
          <Link href="/book">
            <Button variant="outline" size="sm" className="group gap-2 rounded-full text-xs font-medium border-border hover:bg-secondary/60">
              <span>{lang === "hu" ? "FOGLALÁS MŰVÉSZNÉL" : "BOOK WITH ARTIST"}</span>
              <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {BEAUTY_DEMO_ARTISTS.map((artist, idx) => {
            // Check if there is a corresponding database barber to link booking directly
            const dbBarber = barbers[idx] || (barbers.length > 0 ? barbers[0] : null);
            const bookingHref = dbBarber ? `/book?barber=${dbBarber.id}` : "/book";

            const role = lang === "hu" ? artist.roleHu : artist.roleEn;
            const bio = lang === "hu" ? artist.bioHu : artist.bioEn;
            const specialties = lang === "hu" ? artist.specialtiesHu : artist.specialtiesEn;

            return (
              <div
                key={artist.id}
                className="group rounded-3xl border border-border/80 bg-card p-6 sm:p-7 flex flex-col justify-between hover:border-primary/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="space-y-5">
                  <div className="relative aspect-4/5 rounded-2xl overflow-hidden border border-border/80 bg-secondary/30">
                    <img
                      src={artist.photoUrl}
                      alt={artist.name}
                      className="size-full object-cover transition-transform duration-700 group-hover:scale-104"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent p-5 flex flex-col justify-end">
                      <Badge variant="outline" className="self-start text-[10px] text-white border-white/30 bg-black/40 backdrop-blur-xs py-0.5 px-2.5 rounded-full font-normal">
                        {role}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="text-2xl font-normal font-serif text-foreground group-hover:text-primary transition-colors">
                        {artist.name}
                      </h3>
                      <span className="text-xs text-muted-foreground font-sans">
                        Budapest
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed font-normal line-clamp-3">
                      {bio}
                    </p>

                    {/* Specialties Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {specialties.map((spec) => (
                        <span
                          key={spec}
                          className="text-[11px] bg-secondary/70 border border-primary/10 px-2.5 py-0.5 rounded-full text-foreground/80 font-normal"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-border/50 flex items-center justify-between gap-3">
                  <Link href={bookingHref} className="flex-1">
                    <Button className="w-full group gap-2 text-xs font-medium tracking-wide rounded-full shadow-xs">
                      <span>{lang === "hu" ? `Foglalás nála` : `Book with ${artist.name}`}</span>
                      <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. EDITORIAL SERVICES & PRICING MENU */}
      <section id="services" className="mx-auto max-w-7xl px-4 sm:px-6 w-full scroll-mt-24 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/80 pb-6">
          <div className="space-y-2">
            <span className="eyebrow">{t.servicesSubtitle}</span>
            <h2 className="text-3xl sm:text-5xl font-normal tracking-tight text-foreground font-serif">
              {t.servicesTitle}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground font-normal max-w-xl">
              {lang === "hu"
                ? "Minden manikűr és ápoló rituálénk tartalmazza a személyre szabott konzultációt, a kíméletes orosz gépi előkészítést és a tápláló növényi olajos ápolást."
                : "Every treatment includes a bespoke natural nail assessment, meticulous dry cuticle care, and nourishing botanical hand treatment."}
            </p>
          </div>

          {/* Service Category Switcher */}
          <div className="flex flex-wrap items-center gap-2">
            {serviceCategories.map((cat) => {
              const label =
                cat === "all"
                  ? lang === "hu" ? "Összes" : "All Treatments"
                  : cat === "Manicure & BIAB"
                  ? lang === "hu" ? "Manikűr & BIAB" : "Manicure & BIAB"
                  : cat === "Nail Art"
                  ? lang === "hu" ? "Körömdíszítés" : "Nail Art"
                  : cat === "Pedicure & Care"
                  ? lang === "hu" ? "Pedikűr" : "Pedicure"
                  : lang === "hu" ? "Rituálék" : "Rituals";

              return (
                <Button
                  key={cat}
                  variant={selectedServiceCategory === cat ? "default" : "outline"}
                  size="xs"
                  onClick={() => setSelectedServiceCategory(cat)}
                  className="text-xs rounded-full font-medium tracking-wide border-border"
                >
                  {label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Demo Beauty Services Menu */}
        <div className="divide-y divide-border/60 border-t border-b border-border/80">
          {filteredServices.map((svc, idx) => {
            const name = lang === "hu" ? svc.nameHu : svc.nameEn;
            const desc = lang === "hu" ? svc.descriptionHu : svc.descriptionEn;
            const indexStr = String(idx + 1).padStart(2, "0");

            return (
              <div
                key={svc.id}
                className="group flex flex-col md:flex-row md:items-center justify-between gap-6 py-6 px-3 sm:px-4 transition-colors duration-200 hover:bg-secondary/30 rounded-xl"
              >
                <div className="flex items-start gap-5 sm:gap-7 min-w-0">
                  <span className="text-xs font-serif font-medium text-primary/70 pt-1 shrink-0">
                    {indexStr}
                  </span>

                  <div className="space-y-1.5 max-w-2xl min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="text-xl sm:text-2xl font-normal tracking-tight text-foreground font-serif group-hover:text-primary transition-colors">
                        {name}
                      </h3>
                      {svc.isPopular && (
                        <Badge variant="outline" className="text-[10px] border-primary/30 text-primary py-0 px-2 rounded-full font-normal bg-secondary/50">
                          <Sparkles className="size-2.5 mr-1" />
                          Signature Choice
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-normal">
                      {desc}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 sm:gap-8 pt-3 md:pt-0 border-t md:border-t-0 border-border/40 shrink-0">
                  <div className="text-left md:text-right shrink-0">
                    <div className="text-xs text-muted-foreground flex items-center md:justify-end gap-1">
                      <Clock className="size-3 text-primary/70" />
                      <span>{svc.durationMinutes} {t.duration}</span>
                    </div>
                    <div className="text-lg font-serif font-medium text-foreground mt-0.5">
                      €{svc.priceEur}
                      <span className="text-xs font-sans text-muted-foreground ml-1.5 font-normal">
                        · {new Intl.NumberFormat("hu-HU").format(svc.priceHuf)} HUF
                      </span>
                    </div>
                  </div>

                  <Link href="/book">
                    <Button size="sm" variant="outline" className="rounded-full text-xs font-medium group-hover:bg-primary group-hover:text-primary-foreground border-border transition-colors">
                      <span>{t.bookService}</span>
                      <ArrowRight className="size-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Informational note about demo content & live booking synchronization */}
        {isHaircutDatabase && (
          <div className="p-4 rounded-2xl border border-primary/20 bg-secondary/40 text-xs text-muted-foreground space-y-1">
            <div className="flex items-center gap-2 font-medium text-foreground">
              <Sparkles className="size-3.5 text-primary" />
              <span>{lang === "hu" ? "Stúdió Adatbázis Megjegyzés" : "Studio Database Notice"}</span>
            </div>
            <p>
              {lang === "hu"
                ? "A fenti menü a Maison Rose hivatalos köröm- és szépségápolási demó kínálatát mutatja be. A foglalási folyamatban az Ön adatbázisában konfigurált aktív szolgáltatások hitelesen, változatlanul jelennek meg."
                : "The menu above represents the curated Maison Rose beauty treatment demo. In the booking flow, your active database services are rendered truthfully without disguise."}
            </p>
          </div>
        )}
      </section>

      {/* 5. ASYMMETRIC EDITORIAL NAIL GALLERY */}
      <section id="portfolio" className="mx-auto max-w-7xl px-4 sm:px-6 w-full scroll-mt-24 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/80 pb-6">
          <div className="space-y-2">
            <span className="eyebrow">{t.portfolioSubtitle}</span>
            <h2 className="text-3xl sm:text-5xl font-normal tracking-tight text-foreground font-serif">
              {t.portfolioTitle}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground font-normal max-w-xl">
              {lang === "hu"
                ? "Válogatás a stúdióban készült legfrissebb gépi manikűrjeinkből, krómfényű díszítéseinkből és BIAB szettjeinkből."
                : "A curated collection of precision Russian manicures, glazed chrome finishes, and fine-line hand-painted nail artistry."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {galleryCategories.map((cat) => {
              const label =
                cat === "all"
                  ? t.allCategories
                  : cat === "Nail Art"
                  ? lang === "hu" ? "Körömdíszítés" : "Nail Art"
                  : cat === "Gel & BIAB"
                  ? "Gel & BIAB"
                  : cat === "Gel-X"
                  ? "Gel-X"
                  : lang === "hu" ? "Spa Pedikűr" : "Spa Pedicure";

              return (
                <Button
                  key={cat}
                  variant={selectedGalleryCategory === cat ? "default" : "outline"}
                  size="xs"
                  onClick={() => setSelectedGalleryCategory(cat)}
                  className="text-xs rounded-full font-medium border-border"
                >
                  {label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Asymmetric Gallery Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-12">
          {filteredPortfolio.map((item, idx) => {
            const title = lang === "hu" ? item.titleHu : item.titleEn;
            const styleTag = lang === "hu" ? item.styleTagHu : item.styleTagEn;

            const colSpanClass =
              idx === 0
                ? "lg:col-span-8 aspect-16/10"
                : idx === 1
                ? "lg:col-span-4 aspect-4/3 lg:aspect-auto"
                : "lg:col-span-4 aspect-4/3";

            return (
              <div
                key={item.id}
                onClick={() => setLightboxImg({ url: item.imageUrl, title })}
                className={`group relative overflow-hidden rounded-3xl border border-border/80 bg-card cursor-pointer shadow-xs hover:shadow-lg transition-all duration-300 ${colSpanClass}`}
              >
                <img
                  src={item.imageUrl}
                  alt={title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-104"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 flex flex-col justify-end text-white">
                  <span className="text-lg font-normal font-serif tracking-wide">
                    {title}
                  </span>
                  <div className="flex items-center gap-2 mt-1 text-xs text-white/90">
                    <span className="text-secondary font-medium uppercase tracking-wider text-[11px]">
                      {item.artistName}
                    </span>
                    <span>·</span>
                    <span className="text-white/80">
                      {styleTag}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxImg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in">
          <button
            type="button"
            onClick={() => setLightboxImg(null)}
            className="absolute top-6 right-6 rounded-full bg-white/10 p-2.5 text-white hover:bg-white/20 transition-colors"
            aria-label="Close image preview"
          >
            <X className="size-6" />
          </button>
          <div className="max-h-[90vh] max-w-[90vw] flex flex-col items-center">
            <img
              src={lightboxImg.url}
              alt={lightboxImg.title || "Enlarged view"}
              className="max-h-[80vh] max-w-[90vw] object-contain rounded-2xl border border-white/20 shadow-2xl"
            />
            {lightboxImg.title && (
              <p className="mt-3 text-sm text-white/90 font-serif tracking-wide">
                {lightboxImg.title}
              </p>
            )}
          </div>
        </div>
      )}

      {/* 6. CLIENT REVIEWS & SOCIAL PROOF */}
      <ClientReviewsSection />

      {/* 7. OPENING HOURS & BUDAPEST LOCATION */}
      <section id="hours" className="mx-auto max-w-7xl px-4 sm:px-6 w-full scroll-mt-24">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Left Column: Opening Hours */}
          <div className="space-y-8 border-b lg:border-b-0 lg:border-r border-border/80 pb-12 lg:pb-0 lg:pr-12">
            <div className="space-y-2 border-b border-border/80 pb-6">
              <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-primary">
                <Clock className="size-3.5" />
                <span>{lang === "hu" ? "NYITVATARTÁS" : "HOURS & SCHEDULE"}</span>
              </div>
              <h3 className="text-3xl font-normal tracking-tight text-foreground font-serif">
                {t.hoursTitle}
              </h3>
              <p className="text-xs text-muted-foreground font-normal">
                {lang === "hu"
                  ? "Időpontjaink előre foglalhatók online a garantált várakozásmentes, nyugodt élményért."
                  : "Appointments are scheduled in advance to ensure an unhurried, private sanctuary experience."}
              </p>
            </div>

            <div className="space-y-3">
              {DAY_ORDER.map((dayNum) => {
                const dayName = DAY_NAMES[dayNum][lang];
                const dayRow = workingHours.find((wh) => wh.day_of_week === dayNum && wh.is_active);
                const isToday = new Date().getDay() === dayNum;

                // Sunday closed by default for serene sanctuary rest
                const isSunday = dayNum === 0;

                return (
                  <div
                    key={dayNum}
                    className={`flex items-center justify-between text-sm py-2.5 px-3.5 rounded-xl border transition-colors ${
                      isToday
                        ? "bg-secondary/70 border-primary/30"
                        : "border-border/40"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`font-normal ${isToday ? "text-primary font-medium" : "text-foreground"}`}>
                        {dayName}
                      </span>
                      {isToday && (
                        <Badge variant="outline" className="text-[10px] text-primary border-primary/30 py-0 px-2 font-normal rounded-full bg-secondary/50">
                          {lang === "hu" ? "MA" : "TODAY"}
                        </Badge>
                      )}
                    </div>
                    {isSunday || !dayRow ? (
                      <Badge variant="outline" className="text-xs font-normal border-border/60 text-muted-foreground rounded-full">
                        {t.closed}
                      </Badge>
                    ) : (
                      <div className="text-right text-xs font-sans font-medium text-foreground">
                        {dayRow.start_time.slice(0, 5)} – {dayRow.end_time.slice(0, 5)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Location & Contact Info */}
          <div className="space-y-8">
            <div className="space-y-2 border-b border-border/80 pb-6">
              <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-primary">
                <Navigation className="size-3.5" />
                <span>{BEAUTY_DEMO_BUSINESS.district}</span>
              </div>
              <h3 className="text-3xl font-normal tracking-tight text-foreground font-serif">
                {t.locationTitle}
              </h3>
              <p className="text-xs text-muted-foreground font-normal">
                {lang === "hu" ? BEAUTY_DEMO_BUSINESS.landmarkHu : BEAUTY_DEMO_BUSINESS.landmarkEn}
              </p>
            </div>

            <div className="space-y-5 text-sm">
              <div className="flex items-start gap-4 p-5 rounded-2xl border border-border/80 bg-card shadow-xs">
                <div className="p-2.5 rounded-xl bg-secondary text-primary border border-primary/15 shrink-0">
                  <MapPin className="size-4" />
                </div>
                <div>
                  <span className="eyebrow block mb-1">{t.address}</span>
                  <span className="font-medium text-foreground text-base block">{BEAUTY_DEMO_BUSINESS.address}</span>
                  <span className="text-xs text-muted-foreground block mt-0.5">{BEAUTY_DEMO_BUSINESS.district}</span>
                  <span className="text-xs text-primary/80 block mt-1">
                    {lang === "hu" ? BEAUTY_DEMO_BUSINESS.transitHu : BEAUTY_DEMO_BUSINESS.transitEn}
                  </span>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3 p-4 rounded-2xl border border-border/80 bg-card shadow-xs">
                  <div className="p-2 rounded-xl bg-secondary text-primary border border-primary/15 shrink-0">
                    <Phone className="size-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="eyebrow block mb-0.5">{t.phone}</span>
                    <a
                      href={`tel:${BEAUTY_DEMO_BUSINESS.phone}`}
                      className="text-sm text-foreground hover:text-primary transition-colors block truncate font-medium"
                    >
                      {BEAUTY_DEMO_BUSINESS.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-2xl border border-border/80 bg-card shadow-xs">
                  <div className="p-2 rounded-xl bg-secondary text-primary border border-primary/15 shrink-0">
                    <Mail className="size-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="eyebrow block mb-0.5">{t.email}</span>
                    <a
                      href={`mailto:${BEAUTY_DEMO_BUSINESS.email}`}
                      className="text-xs text-foreground hover:text-primary transition-colors block truncate font-medium"
                    >
                      {BEAUTY_DEMO_BUSINESS.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Google Maps link */}
              <div className="pt-2">
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(BEAUTY_DEMO_BUSINESS.address + " Budapest")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full"
                >
                  <Button variant="outline" className="w-full gap-2 text-xs rounded-full font-medium border-border hover:bg-secondary/60">
                    <Navigation className="size-3.5 text-primary" />
                    <span>{lang === "hu" ? "Megnyitás a Google Térképen" : "Open in Google Maps"}</span>
                    <ExternalLink className="size-3 text-muted-foreground ml-auto" />
                  </Button>
                </a>
              </div>
            </div>

            <div className="pt-2">
              <Link href="/book">
                <Button className="group w-full gap-3 py-6 text-xs uppercase tracking-[0.12em] font-medium rounded-full shadow-md">
                  <span>{t.heroPrimaryCta}</span>
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FROM THE ATELIER - INSTAGRAM FEED (Hides if inappropriate) */}
      <AtelierInstagramFeed items={instagramItems} />

      {/* 9. FINAL EDITORIAL BOOKING CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 w-full min-w-0">
        <div className="rounded-3xl border border-border/80 bg-gradient-to-b from-card via-secondary/20 to-card p-8 sm:p-20 text-center space-y-6 sm:space-y-8 relative overflow-hidden shadow-xl min-w-0">
          <div className="space-y-3 min-w-0">
            <span className="eyebrow block">
              {lang === "hu" ? "MAISON ROSE · ANDRÁSSY ÚT 28 · BUDAPEST" : "MAISON ROSE · ANDRÁSSY ÚT 28 · BUDAPEST"}
            </span>
            <h2 className="text-3xl sm:text-6xl lg:text-7xl font-light tracking-tight font-serif max-w-3xl mx-auto leading-[1.05] break-words">
              {lang === "hu" ? (
                <>
                  Gyönyörű körmök.
                  <br />
                  <span className="italic font-light text-primary">Egy pillanat</span> Önnek.
                </>
              ) : (
                <>
                  Beautiful nails.
                  <br />
                  <span className="italic font-light text-primary">A moment</span> for you.
                </>
              )}
            </h2>
          </div>

          <p className="text-sm sm:text-lg text-muted-foreground max-w-md mx-auto font-normal leading-relaxed">
            {lang === "hu"
              ? "Válasszon művészt és foglalja le kényelmesen időpontját online pár kattintással a garantált nyugalomért."
              : "Reserve your personal Russian manicure, BIAB strengthening, or spa pedicure online in Budapest."}
          </p>

          <div className="pt-2 sm:pt-4">
            <Link href="/book" className="inline-block w-full xs:w-auto">
              <Button size="lg" className="w-full xs:w-auto group gap-3 px-10 text-xs font-medium tracking-[0.14em] rounded-full shadow-lg min-h-[52px]">
                <span>{t.bookNow}</span>
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
