// src/app/login/page.tsx
"use client";

import { Suspense } from "react";
import { LoginForm } from "@/components/login-form";
import { SiteHeader } from "@/components/site-header";

export default function LoginPage() {
  return (
    <>
      <SiteHeader />
      <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4">
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </>
  );
}
