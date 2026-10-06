"use client";

/* eslint-disable @next/next/no-img-element */
import * as React from "react";
import { ExternalLink, Play } from "lucide-react";
import { InstagramIcon } from "@/components/ui/icons";
import type { InstagramMediaItem } from "@/lib/instagram/types";
import { useLanguage } from "@/lib/i18n/context";
import { BEAUTY_DEMO_BUSINESS } from "@/lib/config/beauty-demo-content";

interface AtelierInstagramFeedProps {
  items: InstagramMediaItem[];
}

export function AtelierInstagramFeed({ items }: AtelierInstagramFeedProps) {
  const { lang } = useLanguage();

  // Guard: Preserve connection logic, but avoid attributing barbershop haircut content
  // to the fictional Maison Rose salon. Hide inappropriate public feed.
  const isAppropriateFeed = React.useMemo(() => {
    if (!items || items.length === 0) return false;
    // Check if feed contains barber-specific content
    const containsBarberContent = items.some((item) => {
      const text = `${item.caption || ""} ${item.username || ""}`.toLowerCase();
      return (
        text.includes("barbod") ||
        text.includes("barber") ||
        text.includes("beard") ||
        text.includes("fade") ||
        text.includes("taper")
      );
    });
    return !containsBarberContent;
  }, [items]);

  if (!isAppropriateFeed) {
    // Hide inappropriate public feed as requested
    return null;
  }

  const displayItems = items.slice(0, 6);

  const tTitle = lang === "hu" ? "PILLANATOK A STÚDIÓBÓL" : "FROM THE STUDIO";
  const tSubtitle =
    lang === "hu"
      ? `Legfrissebb körömművészet és részletek: ${BEAUTY_DEMO_BUSINESS.instagramHandle}`
      : `Recent nail artistry & details from ${BEAUTY_DEMO_BUSINESS.instagramHandle}`;
  const tFollow = lang === "hu" ? `KÖVESSE A ${BEAUTY_DEMO_BUSINESS.instagramHandle}-T ↗` : `FOLLOW ${BEAUTY_DEMO_BUSINESS.instagramHandle} ↗`;
  const tViewOnInsta = lang === "hu" ? "MEGTEKINTÉS INSTAGRAMON ↗" : "VIEW ON INSTAGRAM ↗";

  return (
    <section id="instagram" className="mx-auto max-w-7xl px-4 sm:px-6 w-full min-w-0 scroll-mt-24 space-y-8 sm:space-y-12">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/80 pb-6 min-w-0">
        <div className="space-y-2 min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-secondary/60 px-3.5 py-1 text-xs font-medium text-primary">
            <InstagramIcon className="size-3.5 shrink-0" />
            <span>{BEAUTY_DEMO_BUSINESS.instagramHandle}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-normal tracking-tight text-foreground font-serif break-words">
            {tTitle}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground font-normal max-w-xl leading-relaxed">
            {tSubtitle}
          </p>
        </div>

        <a
          href={`https://instagram.com/${BEAUTY_DEMO_BUSINESS.instagramHandle.replace("@", "")}`}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-secondary/80 px-5 py-2 text-xs font-medium text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200"
        >
          <span>{tFollow}</span>
        </a>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 min-w-0">
        {displayItems.map((item) => {
          const isReel = item.is_reel || item.media_type === "VIDEO";

          return (
            <a
              key={item.id}
              href={item.permalink}
              target="_blank"
              rel="noreferrer"
              className="group relative aspect-square overflow-hidden rounded-xl border border-border/80 bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all duration-300 shadow-xs hover:shadow-md"
            >
              <img
                src={item.media_url}
                alt={item.caption || "Maison Rose Instagram"}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />

              {isReel && (
                <div className="absolute top-2.5 left-2.5 z-10 inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[9px] font-medium text-white backdrop-blur-xs">
                  <Play className="size-2.5 fill-white text-white" />
                  <span>REEL</span>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3 flex flex-col justify-end text-white">
                <span className="text-[11px] font-medium flex items-center gap-1 text-white">
                  <span>{tViewOnInsta}</span>
                  <ExternalLink className="size-3" />
                </span>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
