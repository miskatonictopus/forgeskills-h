// src/lib/supabaseBrowser.ts
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// 👇 Estas dos pueden ser undefined a nivel de tipo
const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const rawAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

// 🔥 Validaciones en runtime (por si algún día falta algo en .env / Vercel)
if (!rawUrl) {
  throw new Error("❌ Missing env: NEXT_PUBLIC_SUPABASE_URL");
}
if (!rawAnonKey) {
  throw new Error(
    "❌ Missing env: NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY"
  );
}

// ✅ A partir de aquí ya son strings seguros para TypeScript
const url: string = rawUrl;
const anonKey: string = rawAnonKey;

// 🟢 Singleton para evitar “Multiple GoTrueClient instances…”
let browserClient: SupabaseClient | null = null;

export function supabaseBrowser(): SupabaseClient {
  if (!browserClient) {
    browserClient = createClient(url, anonKey, {
      auth: {
        persistSession: true,
      },
    });
  }
  return browserClient;
}
