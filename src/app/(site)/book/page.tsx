import {
  getPublicBusiness,
  getPublicServices,
  getPublicBarbers,
  getPublicBarberServicesMap,
} from "@/lib/public/business";
import { BookingFlow } from "@/components/public/booking-flow";

export const metadata = {
  title: "Book Appointment | Maison Rose — Nail & Beauty Studio Budapest",
  description:
    "Select your nail artist, choose your treatment, pick a date and time slot, and reserve your appointment online.",
};

export default async function PublicBookingPage() {
  const business = await getPublicBusiness("barbod-barber");

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
    <BookingFlow
      business={business}
      barbers={barbers}
      services={services}
      barberServicesMap={barberServicesMap}
    />
  );
}
