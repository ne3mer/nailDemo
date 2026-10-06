import {
  getPublicBusiness,
  getPublicServices,
  getPublicPortfolio,
  getPublicWorkingHours,
  getPublicBarbers,
} from "@/lib/public/business";
import { fetchInstagramFeed } from "@/lib/instagram/client";
import { PublicHome } from "@/components/public/public-home";

export const metadata = {
  title: "Maison Rose — Nail & Beauty Studio | Budapest",
  description:
    "An unhurried sanctuary dedicated to Russian e-file manicures, BIAB nail strengthening, and bespoke hand-painted artistry in the heart of Budapest.",
  openGraph: {
    title: "Maison Rose — Nail & Beauty Studio | Budapest",
    description:
      "Russian e-file manicures, BIAB nail strengthening, and bespoke hand-painted nail art in Budapest. Book online.",
    type: "website",
  },
};

export default async function HomePage() {
  const business = await getPublicBusiness("maison-rose");

  if (!business) {
    return (
      <div className="mx-auto max-w-lg py-20 text-center">
        <h1 className="text-2xl font-serif text-foreground">Maison Rose</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Studio details are currently being configured.
        </p>
      </div>
    );
  }

  const [barbers, services, portfolio, workingHours, instagramFeed] = await Promise.all([
    getPublicBarbers(business.id),
    getPublicServices(business.id),
    getPublicPortfolio(business.id),
    getPublicWorkingHours(business.id),
    fetchInstagramFeed(false, business.id),
  ]);

  return (
    <PublicHome
      business={business}
      barbers={barbers}
      services={services}
      portfolio={portfolio}
      workingHours={workingHours}
      instagramItems={instagramFeed.data}
    />
  );
}
