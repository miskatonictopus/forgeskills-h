// src/lib/supabaseBrowser.ts
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export function supabaseBrowser() {
  return createClient(url, anonKey, {
    auth: {
      persistSession: true,
    },
  });
}
