import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import ProtectedShell from "@/components/ProtectedShell";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  // 🟢 DEV: bypass total
  if (process.env.NODE_ENV === "development") {
    console.log("🟢 Bypass total de autenticación en modo desarrollo");
    return <ProtectedShell variant="dev">{children}</ProtectedShell>;
  }

  // 🔐 PROD/PREVIEW
  const supabase = await createServerSupabase();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login?next=/dashboard");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", auth.user.id)
    .maybeSingle();

  const fullName = profile?.full_name ?? "Sin nombre definido";
  const userEmail = auth.user.email ?? "sin_email";

  return (
    <ProtectedShell variant="prod" fullName={fullName} userEmail={userEmail}>
      {children}
    </ProtectedShell>
  );
}