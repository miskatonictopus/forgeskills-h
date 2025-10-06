import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";

export default async function Home() {
  const sb = await supabaseServer();
  const { data } = await sb.auth.getSession();
  redirect(data.session ? "/dashboard" : "/login");
}
