// app/(protected)/layout.tsx
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";

import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { ThemeSwitch } from "@/components/ui/ThemeSwitch";
import { LogoutButton } from "./dashboard/LogoutButton";

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createServerSupabase();
  const { data } = await supabase.auth.getUser();

  if (!data.user) redirect("/login");

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Panel</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Vista</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* derecha: switch + separador + logout */}
          <div className="ml-auto flex items-center gap-3">
            <ThemeSwitch />
            <Separator
              orientation="vertical"
              className="h-6 data-[orientation=vertical]:h-6 mx-2"
            />
            <LogoutButton />
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
