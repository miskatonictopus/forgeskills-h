// src/app/auth/callback/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

function parseHash(hash: string) {
  const p = new URLSearchParams((hash || "").replace(/^#/, ""));
  return {
    access_token: p.get("access_token"),
    refresh_token: p.get("refresh_token"),
    type: p.get("type"), // recovery, signup, etc.
  };
}

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      const { access_token, refresh_token } = parseHash(window.location.hash);

      // Si no viene token, lo mandamos al login
      if (!access_token || !refresh_token) {
        router.replace("/login");
        return;
      }

      const supabase = supabaseBrowser();
      const { error } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });

      if (error) {
        console.error("[setSession]", error.message);
        router.replace("/login");
        return;
      }

      // ✅ Email verificado + sesión creada → enviamos al login (o /app si quieres)
      router.replace("/login");
    };

    run();
  }, [router]);

  // Si quieres, aquí podrías poner un spinner o mensaje de "verificando..."
  return null;
}
