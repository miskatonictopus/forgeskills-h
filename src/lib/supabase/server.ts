import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

/** Cliente Supabase (SSR) usando getAll/setAll tipado y compatible con Next */
export async function createServerSupabase() {
  const store = await cookies();

  // Tipo de opciones que espera Next para cookies().set
  type NextCookieOptions = Parameters<typeof store.set>[2];

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return store.getAll().map((c) => ({ name: c.name, value: c.value }));
        },
        async setAll(
          list: { name: string; value: string; options?: CookieOptions }[]
        ) {
          list.forEach(({ name, value, options }) => {
            // ✅ overload posicional + adaptación de tipos a lo que espera Next
            store.set(name, value, options as NextCookieOptions);
          });
        },
      },
    }
  );
}
