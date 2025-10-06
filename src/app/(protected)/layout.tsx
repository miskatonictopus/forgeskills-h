// app/(protected)/layout.tsx
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const sb = await supabaseServer();
  const { data } = await sb.auth.getSession();
  if (!data.session) redirect("/login");
  return <div className="min-h-screen p-6">{children}</div>;
}
