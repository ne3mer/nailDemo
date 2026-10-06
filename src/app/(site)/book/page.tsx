import { Suspense } from "react";
import {
  getPublicBusiness,
  getPublicServices,
  getPublicBarbers,
  getPublicBarberServicesMap,
} from "@/lib/public/business";
import { BookingFlow } from "@/components/public/booking-flow";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Book Appointment | Maison Rose — Nail & Beauty Studio Budapest",
  description:
    "Select your nail artist, choose your treatment, pick a date and time slot, and reserve your appointment online.",
};

export default async function PublicBookingPage() {
  const business = await getPublicBusiness("maison-rose");

  if (!business) {
    return (
      <div className="mx-auto max-w-lg py-20 text-center">
        <h1 className="text-2xl font-serif text-foreground">Maison Rose</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Studio booking is currently being configured.
        </p>
      </div>
    );
  }

  const [barbers, services, barberServicesMap] = await Promise.all([
    getPublicBarbers(business.id),
    getPublicServices(business.id),
    getPublicBarberServicesMap(),
  ]);

  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-3xl py-24 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading appointment schedule…</p>
        </div>
      }
    >
      <BookingFlow
        business={business}
        barbers={barbers}
        services={services}
        barberServicesMap={barberServicesMap}
      />
    </Suspense>
  );
}
