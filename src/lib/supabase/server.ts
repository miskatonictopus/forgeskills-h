import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/** Crea un cliente Supabase “server-side” usando getAll/setAll (recomendado) */
export async function createServerSupabase() {
  const store = await cookies(); // en Next 15 puede ser async

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return store.getAll().map((c) => ({ name: c.name, value: c.value }));
        },
        async setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            (store as any).set(name, value, options);
          });
        },
      },
    }
  );
}
