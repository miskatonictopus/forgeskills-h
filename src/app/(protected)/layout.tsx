import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import ProtectedShell from "@/components/ProtectedShell";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const DEV_NO_AUTH =
  process.env.NODE_ENV === "development" ||
  process.env.NEXT_PUBLIC_DEV_NO_AUTH === "1";

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  // 🟢 DEV / BYPASS: sin sesión ni RLS estricta
  if (DEV_NO_AUTH) {
    return <ProtectedShell variant="dev">{children}</ProtectedShell>;
  }

  // 🔐 PROD/PREVIEW: exigir sesión
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.auth.getUser();
  const user = data?.user ?? null;

  if (error || !user) {
    // podrías construir el "next" dinámico con la ruta actual si quieres
    redirect("/login?next=/dashboard");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  const fullName = profile?.full_name ?? "Sin nombre definido";
  const userEmail = user.email ?? "sin_email";

  return (
    <ProtectedShell variant="prod" fullName={fullName} userEmail={userEmail}>
      {children}
    </ProtectedShell>
  );
}
