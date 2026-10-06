import { APP_NAME } from "@/config/app";
import { isSupabaseConfigured } from "@/lib/env";
import { LoginForm } from "@/components/admin/login-form";
import { Info } from "lucide-react";

export const metadata = {
  title: "Admin login | Maison Rose",
};

export default function AdminLoginPage() {
  const configured = isSupabaseConfigured();

  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center">
        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
          {APP_NAME}
        </p>
        <h1 className="text-2xl font-medium tracking-tight">Admin sign in</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Sign in to manage appointments, services, and your studio.
        </p>
      </div>

      {!configured && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-xs text-amber-900 dark:text-amber-200 space-y-1.5">
          <div className="flex items-center gap-2 font-medium">
            <Info className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <span>Isolated Demo Mode Notice</span>
          </div>
          <p className="leading-relaxed opacity-90">
            A dedicated Supabase project is not yet linked. Admin authentication will be enabled once your isolated database credentials (<code className="font-mono text-[11px]">NEXT_PUBLIC_SUPABASE_URL</code>) are supplied.
          </p>
        </div>
      )}

      <LoginForm isConfigured={configured} />
    </div>
  );
}
