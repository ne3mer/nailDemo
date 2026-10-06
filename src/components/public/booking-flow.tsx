"use client";

/* eslint-disable @next/next/no-img-element */
import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Sparkles,
  Check,
} from "lucide-react";

import type { PublicBusiness, PublicBarber, PublicService } from "@/lib/public/business";
import type { AvailableSlot } from "@/lib/booking/availability";
import { useLanguage } from "@/lib/i18n/context";
import { getLocalizedField } from "@/lib/i18n/translations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  fetchAvailableSlotsAction,
  createPublicBookingAction,
} from "@/app/(site)/book/actions";
import { DEMO_SERVICES } from "@/lib/config/demo-content";
import { BEAUTY_DEMO_BUSINESS } from "@/lib/config/beauty-demo-content";

function getServiceCategory(svc: PublicService): string {
  const match = DEMO_SERVICES.find(
    (ds) => ds.id === svc.id || ds.nameEn.toLowerCase() === svc.name_en.toLowerCase()
  );
  if (match) return match.category;
  const name = svc.name_en.toLowerCase();
  if (name.includes("manicure") || name.includes("biab") || name.includes("nail")) return "Nail Care";
  if (name.includes("pedicure") || name.includes("foot")) return "Pedicure";
  if (name.includes("art") || name.includes("extension") || name.includes("gel")) return "Nail Art";
  if (name.includes("beard") || name.includes("shave")) return "Beard";
  if (name.includes("package") || name.includes("experience") || name.includes("grooming")) return "Packages";
  return "Services";
}

export type ConfirmedBookingSummary = {
  id: string;
  barberName: string;
  serviceNameEn: string;
  serviceNameHu: string;
  durationMinutes: number;
  price: number;
  currency: string;
  dateStr: string;
  startTimeStr: string;
  customerName: string;
  status: string;
};

interface BookingFlowProps {
  business: PublicBusiness;
  barbers: PublicBarber[];
  services: PublicService[];
  barberServicesMap: Record<string, string[]>;
}

export function BookingFlow({
  business,
  barbers,
  services,
  barberServicesMap,
}: BookingFlowProps) {
  const { lang, t } = useLanguage();
  const searchParams = useSearchParams();

  // URL Params pre-selection
  const initialBarber = React.useMemo(() => {
    const barberParam = searchParams.get("barber");
    if (barberParam && barbers.length > 0) {
      return barbers.find((b) => b.id === barberParam) || null;
    }
    return barbers.length === 1 ? barbers[0] : null;
  }, [searchParams, barbers]);

  const initialService = React.useMemo(() => {
    const serviceParam = searchParams.get("service");
    if (serviceParam && services.length > 0) {
      return services.find((s) => s.id === serviceParam) || null;
    }
    return null;
  }, [searchParams, services]);

  // Steps: 1=Artist, 2=Treatment, 3=Date & Time, 4=Details, 5=Review, 6=Success
  const [step, setStep] = React.useState<number>(() => {
    if (initialBarber && initialService) return 3;
    if (initialBarber) return 2;
    return 1;
  });

  // Selected State
  const [selectedBarber, setSelectedBarber] = React.useState<PublicBarber | null>(initialBarber);
  const [selectedService, setSelectedService] = React.useState<PublicService | null>(initialService);
  const [selectedDate, setSelectedDate] = React.useState<string>(
    () => new Date().toISOString().split("T")[0]
  );
  const [selectedSlot, setSelectedSlot] = React.useState<AvailableSlot | null>(null);

  // Customer Form State (Preserved across back navigation)
  const [customerName, setCustomerName] = React.useState("");
  const [customerPhone, setCustomerPhone] = React.useState("");
  const [customerEmail, setCustomerEmail] = React.useState("");
  const [notes, setNotes] = React.useState("");

  // Slots loading & error states
  const [availableSlots, setAvailableSlots] = React.useState<AvailableSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  // Confirmed booking summary state
  const [confirmedBooking, setConfirmedBooking] = React.useState<ConfirmedBookingSummary | null>(null);

  // Category filter state for Step 2
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");

  // Dual pricing calculation helper
  const formatDualPrice = React.useCallback((eur: number) => {
    const huf = Math.round((eur * 395) / 500) * 500;
    return {
      eur: `€${eur}`,
      huf: `${new Intl.NumberFormat("hu-HU").format(huf)} HUF`,
    };
  }, []);

  // Upcoming 7 days quick chips
  const upcomingDays = React.useMemo(() => {
    const days = [];
    const now = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      const iso = d.toISOString().split("T")[0];
      const weekday = d.toLocaleDateString(lang === "hu" ? "hu-HU" : "en-US", { weekday: "short" });
      const dayNum = d.getDate();
      const month = d.toLocaleDateString(lang === "hu" ? "hu-HU" : "en-US", { month: "short" });
      days.push({
        iso,
        title: i === 0 ? (lang === "hu" ? "Ma" : "Today") : i === 1 ? (lang === "hu" ? "Holnap" : "Tomorrow") : weekday,
        sub: `${dayNum} ${month}`,
      });
    }
    return days;
  }, [lang]);

  // Filter available services for selected barber/artist
  const availableServicesForBarber = React.useMemo(() => {
    if (!selectedBarber) return [];
    const assignedIds = barberServicesMap[selectedBarber.id] || [];
    if (assignedIds.length === 0 && barbers.length === 1) {
      return services;
    }
    return services.filter((s) => assignedIds.includes(s.id));
  }, [selectedBarber, services, barberServicesMap, barbers]);

  // Available categories for selected artist
  const categoriesForBarber = React.useMemo(() => {
    const cats = new Set<string>();
    availableServicesForBarber.forEach((s) => {
      const cat = getServiceCategory(s);
      if (cat) cats.add(cat);
    });
    return Array.from(cats);
  }, [availableServicesForBarber]);

  // Filtered services based on selected category
  const filteredServices = React.useMemo(() => {
    if (selectedCategory === "all") return availableServicesForBarber;
    return availableServicesForBarber.filter(
      (s) => getServiceCategory(s).toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [availableServicesForBarber, selectedCategory]);

  // Load available slots asynchronously when artist, treatment, or date changes
  React.useEffect(() => {
    if (!selectedBarber || !selectedService || !selectedDate) return;
    let isMounted = true;

    const loadSlots = async () => {
      setLoadingSlots(true);
      setErrorMsg(null);
      setSelectedSlot(null);

      const res = await fetchAvailableSlotsAction(
        selectedBarber.id,
        selectedService.id,
        selectedDate
      );
      if (!isMounted) return;

      setLoadingSlots(false);
      if (res.error) {
        setErrorMsg(res.error);
        setAvailableSlots([]);
      } else {
        setAvailableSlots(res.slots);
      }
    };

    loadSlots();

    return () => {
      isMounted = false;
    };
  }, [selectedBarber, selectedService, selectedDate]);

  const handleSelectBarber = (barber: PublicBarber) => {
    setSelectedBarber(barber);
    const assignedIds = barberServicesMap[barber.id] || [];
    if (selectedService) {
      if (assignedIds.length > 0 && !assignedIds.includes(selectedService.id)) {
        setSelectedService(null);
        setStep(2);
      } else {
        // Pre-selected service is offered by this artist; jump directly to Date & Time
        setStep(3);
      }
    } else {
      setStep(2);
    }
    setErrorMsg(null);
  };

  const handleSelectService = (svc: PublicService) => {
    setSelectedService(svc);
    setErrorMsg(null);
    setStep(3);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleSelectSlot = (slot: AvailableSlot) => {
    setSelectedSlot(slot);
    setErrorMsg(null);
  };

  const handleDetailsNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMsg(t.errorRequiredFields);
      return;
    }
    setErrorMsg(null);
    setStep(5);
  };

  const handleConfirmSubmit = async () => {
    if (!selectedBarber || !selectedService || !selectedDate || !selectedSlot) return;

    setSubmitting(true);
    setErrorMsg(null);

    const res = await createPublicBookingAction({
      businessSlug: business.slug,
      barberId: selectedBarber.id,
      serviceId: selectedService.id,
      dateStr: selectedDate,
      startTimeStr: selectedSlot.timeStr,
      customerName,
      customerPhone,
      customerEmail,
      notes,
    });

    setSubmitting(false);

    if (res.error) {
      if (res.errorCode === "DEMO_MODE") {
        setErrorMsg(res.error);
      } else if (res.errorCode === "SLOT_UNAVAILABLE") {
        setErrorMsg(t.errorConflict);
      } else if (res.errorCode === "REQUIRED_FIELDS") {
        setErrorMsg(t.errorRequiredFields);
      } else if (res.errorCode === "PAST_DATE") {
        setErrorMsg(t.errorPastBooking);
      } else if (res.errorCode === "SERVICE_UNAVAILABLE") {
        setErrorMsg(t.errorServiceUnavailable);
      } else {
        setErrorMsg(t.errorGeneric);
      }
    } else if (res.success && res.booking) {
      setConfirmedBooking(res.booking as ConfirmedBookingSummary);
      setStep(6);
    }
  };

  const todayStr = new Date().toISOString().split("T")[0];

  const stepTitles = [
    lang === "hu" ? "Művész kiválasztása" : "Choose Artist",
    lang === "hu" ? "Kezelés" : "Select Treatment",
    lang === "hu" ? "Dátum és Idő" : "Date & Time",
    lang === "hu" ? "Személyes adatok" : "Your Details",
    lang === "hu" ? "Foglalás megerősítése" : "Review & Confirm",
  ];

  return (
    <div className="mx-auto max-w-4xl w-full min-w-0 px-4 py-6 sm:px-6 sm:py-12 space-y-6 sm:space-y-10">
      {/* 1. Header */}
      <div className="flex flex-col xs:flex-row xs:items-center justify-between border-b border-border/80 pb-4 sm:pb-6 gap-3 min-w-0">
        <div className="flex flex-col min-w-0">
          <span className="font-serif tracking-[0.1em] text-lg sm:text-xl font-medium text-foreground leading-none">
            Maison Rose
          </span>
          <span className="text-[11px] tracking-[0.16em] uppercase text-muted-foreground font-sans mt-1 truncate">
            {BEAUTY_DEMO_BUSINESS.taglineEn} · {t.bookingTitle}
          </span>
        </div>

        <Link
          href="/"
          className="text-xs uppercase tracking-wider font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 py-1 px-3 rounded-full hover:bg-secondary/60 shrink-0 self-start xs:self-auto border border-border/60"
        >
          <ArrowLeft className="size-3.5" />
          <span className="hidden xs:inline">{lang === "hu" ? "Vissza a stúdióba" : "Return to studio"}</span>
          <span className="xs:hidden">{lang === "hu" ? "Vissza" : "Back"}</span>
        </Link>
      </div>

      {/* 2. Responsive Progress Indicator */}
      {step < 6 && (
        <div className="space-y-3 border-b border-border/80 pb-4">
          {/* Mobile Step Header (<640px) */}
          <div className="sm:hidden flex items-center justify-between">
            <span className="text-xs font-sans font-medium uppercase tracking-wider text-primary">
              {lang === "hu" ? `0${step} / 05 LÉPÉS` : `STEP 0${step} OF 05`}
            </span>
            <span className="text-xs font-serif font-medium text-foreground">
              {stepTitles[step - 1]}
            </span>
          </div>

          {/* Visual Progress Line (Mobile & Desktop) */}
          <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden flex">
            <div
              className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>

          {/* Desktop Step Labels (>=640px) */}
          <div className="hidden sm:grid grid-cols-5 gap-2 pt-1">
            {[1, 2, 3, 4, 5].map((sNum) => {
              const isActive = step === sNum;
              const isCompleted = step > sNum;

              return (
                <div
                  key={sNum}
                  className={`text-center py-1 transition-all ${
                    isActive
                      ? "text-primary font-medium border-b-2 border-primary"
                      : isCompleted
                      ? "text-foreground font-normal"
                      : "text-muted-foreground/50 font-normal"
                  }`}
                >
                  <span className="text-[11px] tracking-wide block truncate">
                    0{sNum}. {stepTitles[sNum - 1]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Contextual Error Alert */}
      {errorMsg && (
        <div className="flex items-center gap-3 rounded-2xl bg-destructive/10 p-4 text-xs sm:text-sm font-medium text-destructive border border-destructive/20 animate-in fade-in">
          <AlertCircle className="size-4 shrink-0 text-destructive" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* STEP 1: CHOOSE ARTIST */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="space-y-1">
            <span className="eyebrow">{lang === "hu" ? "1. LÉPÉS" : "STEP 01"}</span>
            <h2 className="text-2xl sm:text-3xl font-normal text-foreground font-serif">
              {lang === "hu" ? "Válasszon művészt" : "Choose Your Artist"}
            </h2>
          </div>

          <div className="grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2">
            {barbers.map((barber) => {
              const bio = getLocalizedField(barber, "bio", lang);
              const isSelected = selectedBarber?.id === barber.id;

              return (
                <div
                  key={barber.id}
                  onClick={() => handleSelectBarber(barber)}
                  className={`group relative rounded-2xl border p-5 sm:p-6 cursor-pointer transition-all duration-200 active:scale-[0.99] ${
                    isSelected
                      ? "border-primary bg-secondary/70 shadow-md ring-1 ring-primary/40"
                      : "border-border/80 bg-card hover:border-primary/40 hover:bg-secondary/20 shadow-2xs"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="relative size-14 sm:size-16 shrink-0 rounded-full overflow-hidden border border-border/80 bg-secondary/50 flex items-center justify-center">
                      {barber.profile_photo_url ? (
                        <img
                          src={barber.profile_photo_url}
                          alt={barber.name}
                          className="size-full object-cover"
                        />
                      ) : (
                        <User className="size-7 text-primary/70" />
                      )}
                    </div>

                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-lg sm:text-xl font-normal font-serif text-foreground group-hover:text-primary transition-colors truncate">
                          {barber.name}
                        </h3>
                        {isSelected && (
                          <CheckCircle2 className="size-5 text-primary shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground font-normal line-clamp-3 leading-relaxed">
                        {bio || (lang === "hu" ? "Prémium körömművész és ápoló specialista." : "Dedicated nail artist specializing in gentle Russian care & bespoke art.")}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-border/50 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground text-[11px] font-sans">
                      {lang === "hu" ? "ELÉRHETŐ" : "AVAILABLE"}
                    </span>
                    <Button
                      size="sm"
                      variant={isSelected ? "default" : "outline"}
                      className="min-h-[38px] px-4 font-medium text-xs rounded-full border-border"
                    >
                      {lang === "hu" ? "Kiválasztás" : "Select"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 2: SELECT TREATMENT */}
      {step === 2 && selectedBarber && (
        <div className="space-y-6">
          {/* Selected Artist Banner */}
          <div className="flex items-center justify-between rounded-2xl border border-border/80 bg-card p-4 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full overflow-hidden border border-border/80 bg-secondary/50 flex items-center justify-center">
                {selectedBarber.profile_photo_url ? (
                  <img src={selectedBarber.profile_photo_url} alt={selectedBarber.name} className="size-full object-cover" />
                ) : (
                  <User className="size-5 text-primary" />
                )}
              </div>
              <div>
                <span className="eyebrow block text-[10px]">{lang === "hu" ? "KIVÁLASZTOTT MŰVÉSZ" : "SELECTED ARTIST"}</span>
                <h3 className="text-base font-serif text-foreground font-medium">
                  {selectedBarber.name}
                </h3>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStep(1)}
              className="gap-1 text-xs text-muted-foreground hover:text-primary rounded-full min-h-[36px]"
            >
              <ArrowLeft className="size-3.5" />
              <span>{lang === "hu" ? "Módosít" : "Change"}</span>
            </Button>
          </div>

          <div className="space-y-1">
            <span className="eyebrow">{lang === "hu" ? "2. LÉPÉS" : "STEP 02"}</span>
            <h2 className="text-2xl sm:text-3xl font-normal text-foreground font-serif">
              {t.step1Title}
            </h2>
          </div>

          {/* Category Tabs */}
          {categoriesForBarber.length > 1 && (
            <div className="flex flex-wrap gap-2 pb-1">
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-sans tracking-wide transition-all ${
                  selectedCategory === "all"
                    ? "bg-primary text-primary-foreground font-medium shadow-xs"
                    : "bg-secondary/60 text-muted-foreground hover:bg-secondary border border-border"
                }`}
              >
                {lang === "hu" ? "Összes" : "All"} ({availableServicesForBarber.length})
              </button>
              {categoriesForBarber.map((cat) => {
                const count = availableServicesForBarber.filter((s) => getServiceCategory(s).toLowerCase() === cat.toLowerCase()).length;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat.toLowerCase())}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-sans tracking-wide transition-all ${
                      selectedCategory === cat.toLowerCase()
                        ? "bg-primary text-primary-foreground font-medium shadow-xs"
                        : "bg-secondary/60 text-muted-foreground hover:bg-secondary border border-border"
                    }`}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>
          )}

          <div className="divide-y divide-border/60 border-t border-b border-border/80">
            {filteredServices.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground font-normal">
                {lang === "hu" ? "Nincs elérhető kezelés ebben a kategóriában." : "No treatments found in this category."}
              </div>
            ) : (
              filteredServices.map((svc, idx) => {
                const name = getLocalizedField(svc, "name", lang);
                const desc = getLocalizedField(svc, "description", lang);
                const isSelected = selectedService?.id === svc.id;
                const category = getServiceCategory(svc);
                const { eur, huf } = formatDualPrice(svc.price);
                const indexStr = String(idx + 1).padStart(2, "0");

                return (
                  <div
                    key={svc.id}
                    onClick={() => handleSelectService(svc)}
                    className={`group flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5 px-3 sm:px-4 cursor-pointer transition-all duration-200 rounded-xl ${
                      isSelected
                        ? "bg-secondary/70 border-l-4 border-primary"
                        : "hover:bg-secondary/20"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-xs font-serif font-medium text-primary/70 pt-1 shrink-0">
                        {indexStr}
                      </span>

                      <div className="space-y-1 max-w-lg">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-lg sm:text-xl font-normal text-foreground font-serif group-hover:text-primary transition-colors">
                            {name}
                          </h3>
                          {category && (
                            <Badge variant="outline" className="text-[10px] border-border text-muted-foreground py-0 px-2 rounded-full font-normal bg-secondary/40">
                              {category}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed font-normal">
                          {desc || t.defaultServiceDesc}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
                      <div className="text-left sm:text-right">
                        <div className="text-xs text-muted-foreground">
                          {svc.duration_minutes} {t.duration}
                        </div>
                        <div className="text-base font-serif font-medium text-foreground mt-0.5">
                          {eur}
                          <span className="text-xs font-sans text-muted-foreground ml-1.5 font-normal">
                            · {huf}
                          </span>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant={isSelected ? "default" : "outline"}
                        className="min-h-[40px] px-5 text-xs font-medium rounded-full border-border shrink-0"
                      >
                        {t.nextStep}
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* STEP 3: SELECT DATE & TIME SLOT */}
      {step === 3 && selectedBarber && selectedService && (
        <div className="space-y-6">
          {/* Summary Banner */}
          <div className="flex flex-wrap items-center justify-between rounded-2xl border border-border/80 bg-card p-4 gap-3 shadow-2xs">
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <div>
                <span className="eyebrow block text-[10px]">{lang === "hu" ? "MŰVÉSZ" : "ARTIST"}</span>
                <p className="text-sm font-serif text-foreground font-medium">{selectedBarber.name}</p>
              </div>
              <div className="hidden sm:block h-6 w-px bg-border" />
              <div>
                <span className="eyebrow block text-[10px]">{t.selectedServiceLabel}</span>
                <p className="text-sm font-serif text-foreground font-medium">
                  {getLocalizedField(selectedService, "name", lang)} ({selectedService.duration_minutes}m · {formatDualPrice(selectedService.price).eur})
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStep(2)}
              className="gap-1 text-xs text-muted-foreground hover:text-primary rounded-full min-h-[36px]"
            >
              <ArrowLeft className="size-3.5" />
              <span>{t.changeService}</span>
            </Button>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Date Selector */}
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-normal text-foreground font-serif">
                {t.step2Title}
              </h2>

              <div className="space-y-3">
                <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {t.dateLabel}
                </Label>

                {/* Quick Date Chips */}
                <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-4 gap-2">
                  {upcomingDays.map((day) => {
                    const isDaySelected = selectedDate === day.iso;
                    return (
                      <button
                        key={day.iso}
                        type="button"
                        onClick={() => setSelectedDate(day.iso)}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          isDaySelected
                            ? "border-primary bg-primary text-primary-foreground shadow-sm font-medium"
                            : "border-border/80 bg-card hover:border-primary/40 text-foreground hover:bg-secondary/30"
                        }`}
                      >
                        <span className="block text-[11px] uppercase tracking-wider">
                          {day.title}
                        </span>
                        <span className={`block text-xs mt-0.5 ${isDaySelected ? "text-primary-foreground/90" : "text-muted-foreground"}`}>
                          {day.sub}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2">
                  <Input
                    id="date_picker"
                    type="date"
                    min={todayStr}
                    value={selectedDate}
                    onChange={handleDateChange}
                    className="w-full text-base h-11 bg-card border-border/80 focus:border-primary px-3 rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Time Slot Picker */}
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-normal text-foreground font-serif">
                {t.step3Title}
              </h2>

              {loadingSlots ? (
                <div className="flex items-center justify-center p-12 border border-border/80 rounded-2xl bg-card">
                  <Loader2 className="size-5 animate-spin text-primary mr-2" />
                  <span className="text-xs text-muted-foreground">
                    {t.loadingSlots}
                  </span>
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="p-10 border border-dashed border-border/80 rounded-2xl text-center bg-card">
                  <p className="text-xs sm:text-sm text-muted-foreground font-normal">
                    {t.noSlotsAvailable}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-2.5 max-h-[360px] overflow-y-auto pr-1">
                  {availableSlots.map((slot) => {
                    const isSelected = selectedSlot?.timeStr === slot.timeStr;
                    return (
                      <button
                        key={slot.timeStr}
                        type="button"
                        onClick={() => handleSelectSlot(slot)}
                        className={`min-h-[46px] rounded-xl border px-3 py-2 text-sm font-sans font-medium transition-all active:scale-95 flex items-center justify-center gap-1.5 ${
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground shadow-sm font-semibold"
                            : "border-border/80 bg-card text-foreground hover:border-primary/40 hover:bg-secondary/30"
                        }`}
                      >
                        <span>{slot.formattedTime}</span>
                        {isSelected && <Check className="size-4 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-border/80 gap-4">
            <Button
              variant="outline"
              onClick={() => setStep(2)}
              className="gap-2 min-h-[46px] px-6 text-xs font-medium rounded-full border-border"
            >
              <ArrowLeft className="size-4" />
              <span>{t.prevStep}</span>
            </Button>

            <Button
              onClick={() => setStep(4)}
              disabled={!selectedSlot}
              className="gap-2 min-h-[46px] px-8 text-xs font-medium rounded-full shadow-md"
            >
              <span>{t.nextStep}</span>
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 4: CUSTOMER DETAILS */}
      {step === 4 && (
        <form onSubmit={handleDetailsNext} className="space-y-6 sm:space-y-8">
          <div className="space-y-1">
            <span className="eyebrow">{lang === "hu" ? "4. LÉPÉS" : "STEP 04"}</span>
            <h2 className="text-2xl sm:text-3xl font-normal text-foreground font-serif">
              {t.step4Title}
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="cust_name" className="text-xs uppercase tracking-wider font-medium text-muted-foreground">
                {t.fullName} *
              </Label>
              <Input
                id="cust_name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder={t.fullNamePlaceholder}
                className="h-12 text-base bg-card border-border/80 rounded-xl"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cust_phone" className="text-xs uppercase tracking-wider font-medium text-muted-foreground">
                {t.phoneNumber} *
              </Label>
              <Input
                id="cust_phone"
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder={t.phonePlaceholder}
                className="h-12 text-base bg-card border-border/80 rounded-xl"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cust_email" className="text-xs uppercase tracking-wider font-medium text-muted-foreground">
              {t.emailAddress}
            </Label>
            <Input
              id="cust_email"
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder={t.emailPlaceholder}
              className="h-12 text-base bg-card border-border/80 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cust_notes" className="text-xs uppercase tracking-wider font-medium text-muted-foreground">
              {t.notesLabel}
            </Label>
            <Textarea
              id="cust_notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t.notesPlaceholder}
              className="bg-card border-border/80 rounded-xl focus:border-primary p-3 text-base sm:text-sm"
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-border/80 gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(3)}
              className="gap-2 min-h-[46px] px-6 text-xs font-medium rounded-full border-border"
            >
              <ArrowLeft className="size-4" />
              <span>{t.prevStep}</span>
            </Button>

            <Button
              type="submit"
              className="gap-2 min-h-[46px] px-8 text-xs font-medium rounded-full shadow-md"
            >
              <span>{t.nextStep}</span>
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </form>
      )}

      {/* STEP 5: REVIEW & CONFIRM */}
      {step === 5 && selectedBarber && selectedService && selectedSlot && (
        <div className="space-y-6 sm:space-y-8">
          <div className="space-y-1">
            <span className="eyebrow">{lang === "hu" ? "5. LÉPÉS" : "STEP 05"}</span>
            <h2 className="text-2xl sm:text-3xl font-normal text-foreground font-serif">
              {t.step5Title}
            </h2>
          </div>

          {/* Ticket-Style Summary Receipt */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
              <Sparkles className="size-24 text-primary" />
            </div>

            <div className="border-b border-border/80 pb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="eyebrow text-[10px]">{t.serviceLabel}</span>
                <h3 className="text-2xl font-normal text-foreground font-serif mt-0.5">
                  {getLocalizedField(selectedService, "name", lang)}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-2xl font-medium font-serif text-foreground">
                  {formatDualPrice(selectedService.price).eur}
                </span>
                <span className="block text-xs font-sans text-muted-foreground mt-0.5">
                  {formatDualPrice(selectedService.price).huf}
                </span>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 text-sm">
              <div className="space-y-1">
                <span className="eyebrow block text-[10px]">{lang === "hu" ? "MŰVÉSZ" : "ARTIST"}</span>
                <span className="font-serif text-lg font-normal text-foreground flex items-center gap-2">
                  <User className="size-4 text-primary shrink-0" />
                  {selectedBarber.name}
                </span>
              </div>

              <div className="space-y-1">
                <span className="eyebrow block text-[10px]">{t.dateTimeLabel}</span>
                <span className="font-medium text-foreground flex items-center gap-2 text-base">
                  <CalendarIcon className="size-4 text-primary shrink-0" />
                  {selectedDate} · {selectedSlot.formattedTime}
                </span>
              </div>

              <div className="space-y-1">
                <span className="eyebrow block text-[10px]">{t.durationLabel}</span>
                <span className="font-medium text-foreground flex items-center gap-2 text-base">
                  <Clock className="size-4 text-primary shrink-0" />
                  {selectedService.duration_minutes} {t.duration}
                </span>
              </div>

              <div className="space-y-1">
                <span className="eyebrow block text-[10px]">{t.customerLabel}</span>
                <span className="font-normal text-foreground flex items-center gap-2">
                  <User className="size-4 text-primary shrink-0" />
                  {customerName}
                </span>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <span className="eyebrow block text-[10px]">{t.phoneNumber}</span>
                <span className="font-normal text-foreground flex items-center gap-2">
                  <Phone className="size-4 text-primary shrink-0" />
                  {customerPhone}
                </span>
              </div>
            </div>

            {notes && (
              <div className="border-t border-border/60 pt-4 text-xs">
                <span className="eyebrow block mb-1 text-[10px]">{t.notesLabel}</span>
                <p className="mt-1 text-foreground bg-secondary/40 p-3 rounded-xl border border-border/60 font-normal">
                  {notes}
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-border/80 gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(4)}
              className="gap-2 min-h-[46px] px-6 text-xs font-medium rounded-full border-border"
            >
              <ArrowLeft className="size-4" />
              <span>{t.prevStep}</span>
            </Button>

            <Button
              onClick={handleConfirmSubmit}
              disabled={submitting}
              className="gap-2.5 min-h-[50px] px-8 sm:px-10 text-xs sm:text-sm font-medium rounded-full shadow-lg"
            >
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>{t.submittingBooking}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="size-4" />
                  <span>{t.confirmBooking}</span>
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* STEP 6: SUCCESS SCREEN */}
      {step === 6 && confirmedBooking && (
        <div className="py-8 sm:py-12 space-y-6 sm:space-y-8 text-center max-w-xl mx-auto animate-in fade-in zoom-in-95 duration-300">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="rounded-full bg-secondary/80 p-5 text-primary border border-primary/20 shadow-md">
              <CheckCircle2 className="size-12" />
            </div>
            <Badge variant="outline" className="px-3 py-1 text-xs rounded-full border-primary/30 text-primary bg-secondary/50 font-normal">
              {t.statusBadgePending}
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-normal text-foreground font-serif">
              {t.successHeadline}
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md font-normal">
              {t.successMessage}
            </p>
          </div>

          <div className="rounded-3xl border border-border/80 bg-card p-6 text-left space-y-4 shadow-xl">
            <h3 className="eyebrow border-b border-border/60 pb-3 text-[11px]">
              {t.bookingDetails}
            </h3>

            <div className="flex justify-between text-sm py-1 border-b border-border/40">
              <span className="text-muted-foreground">{lang === "hu" ? "Művész" : "Artist"}:</span>
              <span className="font-serif font-medium text-foreground">
                {confirmedBooking.barberName}
              </span>
            </div>

            <div className="flex justify-between text-sm py-1 border-b border-border/40">
              <span className="text-muted-foreground">{t.serviceLabel}:</span>
              <span className="font-serif font-medium text-foreground">
                {lang === "hu"
                  ? confirmedBooking.serviceNameHu || confirmedBooking.serviceNameEn
                  : confirmedBooking.serviceNameEn}
              </span>
            </div>

            <div className="flex justify-between text-sm py-1 border-b border-border/40">
              <span className="text-muted-foreground">{t.dateTimeLabel}:</span>
              <span className="font-medium text-primary">
                {confirmedBooking.dateStr} · {confirmedBooking.startTimeStr}
              </span>
            </div>

            <div className="flex justify-between text-sm py-1 border-b border-border/40">
              <span className="text-muted-foreground">{t.customerLabel}:</span>
              <span className="font-normal text-foreground">
                {confirmedBooking.customerName}
              </span>
            </div>

            <div className="flex justify-between text-sm py-1">
              <span className="text-muted-foreground">{t.priceLabel}:</span>
              <span className="font-serif font-medium text-foreground text-base">
                €{confirmedBooking.price}
                <span className="text-xs font-sans font-normal text-muted-foreground ml-1.5">
                  · {formatDualPrice(confirmedBooking.price).huf}
                </span>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link href="/" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto min-h-[46px] rounded-full text-xs font-medium px-6 border-border">
                {t.backToHome}
              </Button>
            </Link>
            <Button
              onClick={() => {
                setSelectedBarber(barbers.length === 1 ? barbers[0] : null);
                setSelectedService(null);
                setSelectedDate(todayStr);
                setSelectedSlot(null);
                setCustomerName("");
                setCustomerPhone("");
                setCustomerEmail("");
                setNotes("");
                setStep(1);
              }}
              className="w-full sm:w-auto min-h-[46px] rounded-full text-xs font-medium px-6 shadow-md"
            >
              {t.bookAnother}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
