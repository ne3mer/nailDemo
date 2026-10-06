import { LanguageProvider } from "@/lib/i18n/context";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <div className="public-theme flex min-h-screen flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary min-w-0 max-w-full font-sans">
        <SiteHeader />
        <div className="flex flex-1 flex-col min-w-0 max-w-full">{children}</div>
        <SiteFooter />
      </div>
    </LanguageProvider>
  );
}
