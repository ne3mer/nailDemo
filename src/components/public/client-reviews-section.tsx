"use client";

import * as React from "react";
import Link from "next/link";
import { Star, Quote, ArrowRight, Sparkles, Heart } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { BEAUTY_DEMO_REVIEWS, BEAUTY_DEMO_BUSINESS } from "@/lib/config/beauty-demo-content";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function ClientReviewsSection() {
  const { lang } = useLanguage();

  return (
    <section id="reviews" className="mx-auto max-w-7xl px-4 sm:px-6 w-full scroll-mt-24 space-y-12">
      {/* Header & Rating Summary */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-border/80 pb-8">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-secondary/60 px-3.5 py-1 text-xs font-medium text-primary">
            <Sparkles className="size-3.5" />
            <span>{lang === "hu" ? "VENDÉGÉLMÉNYEK & VÉLEMÉNYEK" : "CLIENT EXPERIENCES · REVIEWS"}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-normal tracking-tight text-foreground font-serif">
            {lang === "hu" ? "Egy nyugodt pillanat," : "Words from"}
            <br />
            <span className="italic font-light text-primary">
              {lang === "hu" ? "amelyet vendégeink szeretnek." : "Our Cherished Guests."}
            </span>
          </h2>
          <p className="text-sm text-muted-foreground font-normal leading-relaxed max-w-lg">
            {lang === "hu"
              ? "Vendégeink nyugalma és elégedettsége stúdiónk legszebb visszaigazolása. Olvassa el vendégeink tapasztalatait a Maison Rose-ban."
              : "Read reflections from visitors who trust Maison Rose for delicate Russian manicures, natural nail strengthening, and serene beauty rituals."}
          </p>
          <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/80 font-normal pt-1">
            <Heart className="size-3 text-primary/70 fill-primary/20" />
            <span>{lang === "hu" ? "Minta / koncepció visszajelzések a demó bemutatásához" : "Concept & sample feedback curated for this demonstration"}</span>
          </div>
        </div>

        {/* Aggregate Social Proof Badge */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-5 rounded-2xl border border-border/80 bg-card/90 shadow-xs shrink-0">
          <div className="flex items-center gap-3">
            <div className="text-3xl font-serif font-medium text-foreground">
              {BEAUTY_DEMO_BUSINESS.rating.toFixed(2)}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-primary">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="size-3.5 fill-primary text-primary" />
                ))}
              </div>
              <span className="text-xs text-muted-foreground block font-normal">
                {BEAUTY_DEMO_BUSINESS.reviewCount}+ {lang === "hu" ? "vendégértékelés alapján" : "studio reviews"}
              </span>
            </div>
          </div>
          <div className="hidden sm:block h-8 w-px bg-border/80" />
          <Link href="/book">
            <Button size="sm" className="rounded-full gap-2 px-5 text-xs font-medium shadow-xs">
              <span>{lang === "hu" ? "Időpontfoglalás" : "Book A Visit"}</span>
              <ArrowRight className="size-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {BEAUTY_DEMO_REVIEWS.map((rev) => {
          const comment = lang === "hu" ? rev.commentHu : rev.commentEn;
          const serviceName = lang === "hu" ? rev.serviceNameHu : rev.serviceNameEn;

          return (
            <div
              key={rev.id}
              className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-6 sm:p-7 hover:border-primary/30 hover:shadow-md transition-all duration-300"
            >
              <div className="space-y-4">
                {/* Header: Stars & Demo Tag */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 text-primary">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="size-3.5 fill-primary text-primary" />
                    ))}
                  </div>

                  <Badge variant="outline" className="text-[10px] text-muted-foreground border-border bg-secondary/40 font-normal px-2 py-0.5 rounded-full">
                    {lang === "hu" ? "Koncepció Vélemény" : "Concept Review"}
                  </Badge>
                </div>

                {/* Quote Text */}
                <div className="relative">
                  <Quote className="size-6 text-primary/10 absolute -top-1 -left-1 -z-0 pointer-events-none" />
                  <p className="text-sm text-foreground/90 font-normal leading-relaxed relative z-10 italic">
                    &ldquo;{comment}&rdquo;
                  </p>
                </div>
              </div>

              {/* Footer: Author Info & Service Metadata */}
              <div className="pt-5 mt-5 border-t border-border/50 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h4 className="text-sm font-medium font-serif text-foreground truncate">
                    {rev.authorName}
                  </h4>
                  <p className="text-xs text-muted-foreground truncate">
                    {rev.origin}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs text-primary font-medium block truncate max-w-[150px]">
                    {serviceName}
                  </span>
                  <span className="text-[11px] text-muted-foreground block">
                    {lang === "hu" ? "Művész: " : "With "}
                    {rev.artistName}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
