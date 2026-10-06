"use client";

import Link from "next/link";
import { Sparkles, Heart } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { BEAUTY_DEMO_BUSINESS } from "@/lib/config/beauty-demo-content";

export function SiteFooter() {
  const { lang, t } = useLanguage();

  return (
    <footer className="mt-auto border-t border-border/80 bg-card/60 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          <div className="space-y-3 max-w-md">
            <Link
              href="/"
              className="flex items-center gap-2.5 text-base font-medium tracking-tight text-foreground hover:opacity-90 transition-opacity"
            >
              <div className="flex size-7 items-center justify-center rounded-lg bg-secondary text-primary border border-primary/10">
                <Sparkles className="size-3.5" />
              </div>
              <span className="font-serif tracking-[0.1em] text-lg font-normal">
                Maison Rose
              </span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {lang === "hu"
                ? "Budapest, Magyarország · Légies gépi orosz manikűr, BIAB körömerősítés és prémium szépségápolási rituálék."
                : "Budapest, Hungary · Airy Russian e-file manicures, BIAB strengthening, and bespoke beauty rituals."}
            </p>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-secondary/50 px-3 py-1 text-[11px] font-medium text-primary">
              <Heart className="size-3 text-primary/80 fill-primary/20" />
              <span>{lang === "hu" ? BEAUTY_DEMO_BUSINESS.disclaimerHu : BEAUTY_DEMO_BUSINESS.disclaimerEn}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-medium tracking-wide text-muted-foreground">
            <Link href="/#services" className="hover:text-primary transition-colors">
              {t.navServices}
            </Link>
            <Link href="/#barbers" className="hover:text-primary transition-colors">
              {t.navBarbers}
            </Link>
            <Link href="/#portfolio" className="hover:text-primary transition-colors">
              {t.navPortfolio}
            </Link>
            <Link href="/#philosophy" className="hover:text-primary transition-colors">
              {t.navAbout}
            </Link>
            <Link href="/#reviews" className="hover:text-primary transition-colors">
              {t.navReviews}
            </Link>
            <Link href="/#hours" className="hover:text-primary transition-colors">
              {t.navHours}
            </Link>
            <Link href="/admin/login" className="hover:text-primary transition-colors">
              {t.adminLogin}
            </Link>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-3">
          <p>© {new Date().getFullYear()} Maison Rose — Nail & Beauty Studio. All rights reserved.</p>
          <p className="text-xs text-muted-foreground/80 font-sans">Andrássy út 28, Budapest · Europe/Budapest</p>
        </div>
      </div>
    </footer>
  );
}
