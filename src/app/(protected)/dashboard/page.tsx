// app/(protected)/dashboard/page.tsx
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { OnboardingNameCard } from "./_components/OnboardingNameCard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  const supabase = await createServerSupabase();

  // 1) Usuario autenticado
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login");

  // 2) Perfil (usamos full_name según tu esquema)
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", auth.user.id)
    .maybeSingle();

  const needsName = !profile?.full_name;

  // 3) Render
  return (
    <main className="p-6 md:p-10">
      {needsName ? (
        <OnboardingNameCard
          userId={auth.user.id}
          email={auth.user.email ?? ""} // pásalo para el upsert (email es NOT NULL)
        />
      ) : (
        <div className="text-sm text-muted-foreground">
          Bienvenido, <b>{profile!.full_name}</b>.
        </div>
      )}
    </main>
  );
}
