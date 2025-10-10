import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { DynamicBreadcrumbs } from "@/components/dynamic-breadcrumbs";

import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ThemeSwitch } from "@/components/ui/ThemeSwitch";
import { LogoutButton } from "./dashboard/LogoutButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  // 🟢 BYPASS TOTAL EN LOCAL (no toca Supabase ni headers)
  if (process.env.NODE_ENV === "development") {
    console.log("🟢 Bypass total de autenticación en modo desarrollo");
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          {/* HEADER */}
          <header className="relative z-50 flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <DynamicBreadcrumbs
              map={{
                dashboard: "Dashboard",
                cursos: "Mis cursos",
              }}
            />
            <div className="ml-auto flex items-center gap-3">
              <ThemeSwitch />
            </div>
          </header>

          {/* MAIN */}
          <main className="flex flex-1 flex-col gap-4 p-4">{children}</main>

          {/* FOOTER */}
          <footer className="border-t px-4 py-2 text-sm text-muted-foreground flex justify-between items-center">
            <div>
              <b>Invitado (dev)</b> — autenticación desactivada
            </div>
            <span className="text-xs text-muted-foreground/70">
              ForgeSkills © {new Date().getFullYear()}
            </span>
          </footer>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  // 🔐 En producción / preview (Server-side)
  const supabase = await createServerSupabase();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login?next=/dashboard");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", auth.user.id)
    .maybeSingle();

  const fullName = profile?.full_name ?? "Sin nombre definido";
  const userEmail = auth.user.email ?? "sin_email";

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* HEADER */}
        <header className="relative z-50 flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <DynamicBreadcrumbs
            map={{
              dashboard: "Dashboard",
              cursos: "Mis cursos",
            }}
          />
          <div className="ml-auto flex items-center gap-3">
            <ThemeSwitch />
            <Separator orientation="vertical" className="h-6 data-[orientation=vertical]:h-6 mx-2" />
            <LogoutButton />
          </div>
        </header>

        {/* MAIN */}
        <main className="flex flex-1 flex-col gap-4 p-4">{children}</main>

        {/* FOOTER */}
        <footer className="border-t px-4 py-2 text-sm text-muted-foreground flex justify-between items-center">
          <div>
            <b>{fullName}</b> — {userEmail}
          </div>
          <span className="text-xs text-muted-foreground/70">
            ForgeSkills © {new Date().getFullYear()}
          </span>
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
