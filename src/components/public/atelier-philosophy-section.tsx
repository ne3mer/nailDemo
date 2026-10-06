"use client";

/* eslint-disable @next/next/no-img-element */
import * as React from "react";
import Link from "next/link";
import { Sparkles, ShieldCheck, Heart, Palette, Flower2, ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { Button } from "@/components/ui/button";
import { BEAUTY_DEMO_PILLARS } from "@/lib/config/beauty-demo-content";

export function AtelierPhilosophySection() {
  const { lang } = useLanguage();

  const pillarIcons = [ShieldCheck, Heart, Flower2, Palette];

  return (
    <section id="philosophy" className="mx-auto max-w-7xl px-4 sm:px-6 w-full space-y-14 scroll-mt-24">
      {/* Intro Header */}
      <div className="grid gap-8 lg:grid-cols-12 lg:items-end border-b border-border/80 pb-10">
        <div className="lg:col-span-8 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-secondary/60 px-3.5 py-1 text-xs font-medium text-primary">
            <Sparkles className="size-3.5" />
            <span>{lang === "hu" ? "A STÚDIÓ FILOZÓFIÁJA" : "STUDIO PHILOSOPHY"}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-foreground font-serif leading-[1.08]">
            {lang === "hu" ? "Több mint egy manikűr." : "More Than A Manicure."}
            <br />
            <span className="italic font-light text-primary">
              {lang === "hu" ? "Egy megújító szépségrituálé." : "A Restorative Beauty Ritual."}
            </span>
          </h2>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <p className="text-sm text-muted-foreground font-normal leading-relaxed">
            {lang === "hu"
              ? "A Maison Rose-ban a körömápolás megnyugtató, személyes rituálévá válik. Nem sietünk: a természetes köröm épségére, a sebészi tisztaságú gépi manikűrre és a káros anyagoktól mentes alapanyagokra fókuszálunk."
              : "At Maison Rose, nail care is elevated into an unhurried, mindful art. We prioritize the natural health of your nails, meticulous Russian cuticle precision, and clean 10-free formulations in a tranquil sanctuary."}
          </p>
          <Link href="/book" className="inline-block">
            <Button size="sm" className="rounded-full gap-2 px-6 text-xs font-medium tracking-wide shadow-xs">
              <span>{lang === "hu" ? "Időpont foglalása" : "Book An Appointment"}</span>
              <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {BEAUTY_DEMO_PILLARS.map((item, idx) => {
          const Icon = pillarIcons[idx % pillarIcons.length];
          const title = lang === "hu" ? item.titleHu : item.titleEn;
          const desc = lang === "hu" ? item.descHu : item.descEn;

          return (
            <div
              key={idx}
              className="group relative rounded-2xl border border-border/80 bg-card p-6 sm:p-7 flex flex-col justify-between hover:border-primary/30 hover:shadow-md transition-all duration-300"
            >
              <div className="space-y-4">
                <div className="flex size-11 items-center justify-center rounded-xl bg-secondary/80 text-primary border border-primary/10 transition-transform duration-300 group-hover:scale-105">
                  <Icon className="size-5" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-normal font-serif text-foreground group-hover:text-primary transition-colors">
                    {title}
                  </h3>
                  <p className="text-xs text-muted-foreground font-normal leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-6 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="font-sans font-medium">0{idx + 1} / 04</span>
                <span className="text-primary/80 uppercase tracking-wider text-[10px] font-medium">
                  {lang === "hu" ? "ALAPÉRTÉK" : "PILLAR"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Visual Atmosphere Showcase */}
      <div className="grid gap-5 sm:grid-cols-3">
        <div className="relative aspect-4/3 rounded-2xl overflow-hidden border border-border/80 bg-card group shadow-xs">
          <img
            src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80"
            alt="Maison Rose Studio Sanctuary Interior"
            className="size-full object-cover transition-transform duration-700 group-hover:scale-103"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent p-5 flex items-end">
            <span className="text-xs font-serif text-white tracking-wider uppercase">
              {lang === "hu" ? "Légies Szalon Enteriőr · Budapest" : "Airy Studio Sanctuary · Budapest"}
            </span>
          </div>
        </div>

        <div className="relative aspect-4/3 rounded-2xl overflow-hidden border border-border/80 bg-card group shadow-xs">
          <img
            src="https://images.unsplash.com/photo-1583001931096-959e9a1a6223?auto=format&fit=crop&w=1200&q=80"
            alt="Premium Botanical Formulations and Clean Preparations"
            className="size-full object-cover transition-transform duration-700 group-hover:scale-103"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent p-5 flex items-end">
            <span className="text-xs font-serif text-white tracking-wider uppercase">
              {lang === "hu" ? "Káros Anyagtól Mentes Formulák" : "10-Free Clean Formulations"}
            </span>
          </div>
        </div>

        <div className="relative aspect-4/3 rounded-2xl overflow-hidden border border-border/80 bg-card group shadow-xs">
          <img
            src="https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?auto=format&fit=crop&w=1200&q=80"
            alt="Restorative Botanical Hand Care and Gentle Ritual"
            className="size-full object-cover transition-transform duration-700 group-hover:scale-103"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent p-5 flex items-end">
            <span className="text-xs font-serif text-white tracking-wider uppercase">
              {lang === "hu" ? "Pihentető Kényeztetés & Rózsavíz" : "Restorative Rose Petal Care"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
