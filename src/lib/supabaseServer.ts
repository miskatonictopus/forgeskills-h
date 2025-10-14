// lib/supabaseServer.ts
import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export function supabaseServer() {
  // cookies() es sin await, pero el tipo puede confundir a TS en Next 15
  const cookieStore = cookies() as unknown as import("next/dist/server/web/spec-extension/adapters/request-cookies").ReadonlyRequestCookies;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: "", ...options, maxAge: 0 });
        },
      },
    }
  );

  return supabase;
}
