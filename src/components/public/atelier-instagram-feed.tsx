"use client";

/* eslint-disable @next/next/no-img-element */
import * as React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Eye } from "lucide-react";
import type { InstagramMediaItem } from "@/lib/instagram/types";
import { useLanguage } from "@/lib/i18n/context";

interface AtelierInstagramFeedProps {
  items: InstagramMediaItem[];
}

export function AtelierInstagramFeed({ items }: AtelierInstagramFeedProps) {
  const { lang } = useLanguage();

  if (!items || items.length === 0) {
    return null;
  }

  const displayItems = items.slice(0, 6);

  const tBadge = lang === "hu" ? "MŰTERMI VÁLOGATÁS" : "ATELIER CURATION";
  const tTitle = lang === "hu" ? "Inspirációs Galéria" : "Studio Inspiration Gallery";
  const tSubtitle =
    lang === "hu"
      ? "Válogatott körömesztétika, precíziós mikrominták és megújító szépségrituálék a Maison Rose stúdióból."
      : "Curated editorial nail aesthetics, precision micro-art concepts, and restorative beauty rituals from Maison Rose.";
  const tCta = lang === "hu" ? "Időpont foglalása" : "Book an Appointment";
  const tCardLabel = lang === "hu" ? "Koncepció részletei" : "View Concept";

  return (
    <section id="gallery" className="mx-auto max-w-7xl px-4 sm:px-6 w-full min-w-0 scroll-mt-24 space-y-8 sm:space-y-12">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/80 pb-6 min-w-0">
        <div className="space-y-2 min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-secondary/60 px-3.5 py-1 text-xs font-medium text-primary">
            <Sparkles className="size-3.5 shrink-0" />
            <span>{tBadge}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-normal tracking-tight text-foreground font-serif break-words">
            {tTitle}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground font-normal max-w-xl leading-relaxed">
            {tSubtitle}
          </p>
        </div>

        <Link
          href="/book"
          className="shrink-0 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-secondary/80 px-5 py-2 text-xs font-medium text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200"
        >
          <span>{tCta}</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 min-w-0">
        {displayItems.map((item) => {
          return (
            <Link
              key={item.id}
              href="/book"
              className="group relative aspect-square overflow-hidden rounded-xl border border-border/80 bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all duration-300 shadow-xs hover:shadow-md"
            >
              <img
                src={item.media_url}
                alt={item.caption || "Maison Rose Inspiration"}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3 flex flex-col justify-end text-white">
                <p className="text-[11px] font-sans line-clamp-2 leading-tight text-white/90 mb-1">
                  {item.caption || "Maison Rose Editorial"}
                </p>
                <span className="text-[10px] font-medium flex items-center gap-1 text-primary-foreground">
                  <Eye className="size-3" />
                  <span>{tCardLabel}</span>
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
