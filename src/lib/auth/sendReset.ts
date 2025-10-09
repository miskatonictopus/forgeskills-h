// src/lib/auth/sendReset.ts
"use client";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

export async function sendReset(email: string) {
  const supabase = supabaseBrowser();

  // Si estás en local → http://localhost:3000
  // Si estás en prod → https://forgeskills.io
  const redirectTo =
    typeof window !== "undefined"
      ? `${window.location.origin}/auth/callback`
      : "http://localhost:3000/auth/callback";

  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
  if (error) throw new Error(error.message);
}
