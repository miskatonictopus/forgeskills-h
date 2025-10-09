"use client";

import { Suspense } from "react";
import { LoginForm } from "@/components/login-form";

export const dynamic = "force-dynamic"; // opcional: evita problemas de prerender

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}