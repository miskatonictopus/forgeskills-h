// src/app/login/page.tsx
import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { LoginForm } from "@/components/login-form";
import { SiteHeader } from "@/components/site-header";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Si ya está logueado, que no vea el login → directo al panel
  if (session) {
    redirect("/app");
  }

  return (
    <>
      <SiteHeader />
      <div className="min-h-[calc(100vh-56px)] flex items-center justify-center">
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </>
  );
}
