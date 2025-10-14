import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env } from "@/env";

let _client: SupabaseClient | null = null;

export function supabaseAdmin(): SupabaseClient {
  if (_client) return _client;
  _client = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _client;
}
