"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Menu, X, Globe } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { LanguageSwitcher, useLanguage } from "@/lib/i18n/context";

export function SiteHeader() {
  const { lang, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Close menu on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full max-w-full border-b border-border/80 bg-background/90 backdrop-blur-md pt-[env(safe-area-inset-top,0px)] transition-all">
      <div className="mx-auto flex h-18 sm:h-20 max-w-7xl w-full min-w-0 items-center justify-between px-4 sm:px-6 gap-3">
        <Link
          href="/"
          className="flex items-center gap-3 text-base font-medium tracking-tight text-foreground hover:opacity-90 transition-opacity group min-w-0 shrink"
        >
          <div className="flex size-9 sm:size-10 items-center justify-center rounded-xl bg-secondary/80 text-primary border border-primary/15 shrink-0 shadow-xs transition-transform duration-300 group-hover:scale-105">
            <Sparkles className="size-4.5 text-primary" />
          </div>
          <div className="flex flex-col min-w-0 leading-tight">
            <span className="font-serif tracking-[0.08em] sm:tracking-[0.14em] text-base sm:text-lg font-normal text-foreground leading-none truncate">
              Maison Rose
            </span>
            <span className="text-[10px] sm:text-[11px] tracking-[0.18em] uppercase text-muted-foreground font-sans mt-0.5 truncate">
              Nail & Beauty Studio
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* Desktop Anchor Links */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 text-xs font-medium tracking-[0.08em] text-muted-foreground">
            <Link
              href="/#services"
              className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {t.navServices}
            </Link>
            <Link
              href="/#barbers"
              className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {t.navBarbers}
            </Link>
            <Link
              href="/#portfolio"
              className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {t.navPortfolio}
            </Link>
            <Link
              href="/#philosophy"
              className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {t.navAbout}
            </Link>
            <Link
              href="/#reviews"
              className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {t.navReviews}
            </Link>
            <Link
              href="/#hours"
              className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {t.navHours}
            </Link>
          </div>

          {/* Desktop-only Language Switcher */}
          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>

          {/* Desktop Book CTA */}
          <Link
            href="/book"
            className={`hidden md:inline-flex ${buttonVariants({ size: "sm" })} rounded-full px-5 py-2 text-xs font-medium tracking-wide shadow-xs hover:shadow-md transition-all`}
          >
            <span>{t.bookNow}</span>
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1 ml-1" />
          </Link>

          {/* Minimal Mobile Menu Trigger */}
          <Button
            variant="ghost"
            size="xs"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden size-9 p-0 text-foreground hover:bg-secondary/60 rounded-lg border border-border shrink-0"
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="size-4 text-primary" /> : <Menu className="size-4" />}
          </Button>
        </nav>
      </div>

      {/* Editorial Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background/98 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200 w-full max-w-full overflow-hidden shadow-lg">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 space-y-6">
            {/* Mobile Language Selector */}
            <div className="flex items-center justify-between border-b border-border pb-4 bg-secondary/30 p-3 rounded-xl border border-border">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <Globe className="size-3.5 text-primary shrink-0" />
                <span>{lang === "hu" ? "Nyelvválasztás" : "Language / Nyelv"}</span>
              </div>
              <LanguageSwitcher />
            </div>

            <div className="flex flex-col space-y-3 text-sm font-medium tracking-[0.06em]">
              <Link
                href="/#services"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 border-b border-border/50 text-foreground hover:text-primary transition-colors flex items-center justify-between"
              >
                <span>{t.navServices}</span>
                <ArrowRight className="size-3.5 opacity-50 text-muted-foreground" />
              </Link>
              <Link
                href="/#barbers"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 border-b border-border/50 text-foreground hover:text-primary transition-colors flex items-center justify-between"
              >
                <span>{t.navBarbers}</span>
                <ArrowRight className="size-3.5 opacity-50 text-muted-foreground" />
              </Link>
              <Link
                href="/#portfolio"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 border-b border-border/50 text-foreground hover:text-primary transition-colors flex items-center justify-between"
              >
                <span>{t.navPortfolio}</span>
                <ArrowRight className="size-3.5 opacity-50 text-muted-foreground" />
              </Link>
              <Link
                href="/#philosophy"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 border-b border-border/50 text-foreground hover:text-primary transition-colors flex items-center justify-between"
              >
                <span>{t.navAbout}</span>
                <ArrowRight className="size-3.5 opacity-50 text-muted-foreground" />
              </Link>
              <Link
                href="/#reviews"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 border-b border-border/50 text-foreground hover:text-primary transition-colors flex items-center justify-between"
              >
                <span>{t.navReviews}</span>
                <ArrowRight className="size-3.5 opacity-50 text-muted-foreground" />
              </Link>
              <Link
                href="/#hours"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 border-b border-border/50 text-foreground hover:text-primary transition-colors flex items-center justify-between"
              >
                <span>{t.navHours}</span>
                <ArrowRight className="size-3.5 opacity-50 text-muted-foreground" />
              </Link>
            </div>

            <div className="pt-2">
              <Link
                href="/book"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full"
              >
                <Button className="w-full group gap-2 text-xs uppercase tracking-[0.12em] font-medium py-5 rounded-full shadow-md">
                  <span>{t.bookNow}</span>
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
