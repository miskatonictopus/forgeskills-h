"use client";

import { Suspense } from "react";
import { LoginForm } from "@/components/login-form";
import { SiteHeader } from "@/components/site-header"; // ⬅️ añade esto

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <>
      {/* Header arriba */}
      <SiteHeader />

      {/* Centro el login en toda la pantalla */}
      <div className="min-h-screen flex items-center justify-center">
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </>
  );
}
