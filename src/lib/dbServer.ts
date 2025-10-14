// lib/dbServer.ts
import { supabaseAdmin } from "./supabaseAdmin";
import { supabaseServer } from "./supabaseServer";

export async function getServerDb() {
  // Si DEV_BYPASS_RLS=1 usa service role (bypass RLS). En prod usa sesión.
  if (process.env.DEV_BYPASS_RLS === "1") {
    return supabaseAdmin();
  }
  return await supabaseServer();
}