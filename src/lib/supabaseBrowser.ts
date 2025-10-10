import { createBrowserClient } from "@supabase/ssr";

export const supabaseBrowser = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,     // no guarda ni busca sesión
        autoRefreshToken: false,   // no refresca tokens
        detectSessionInUrl: false, // ignora callbacks OAuth
      },
    }
  );
