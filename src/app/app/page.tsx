// src/app/app/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { AppDashboardClient } from "./AppDashboardClient";

type Curso = {
  id: string;
  nombre: string;
  created_at: string;
};

export const dynamic = "force-dynamic";

export default async function AppDashboardPage() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // ❌ Sin sesión → fuera al login
  if (!session) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("cursos")
    .select<"*", Curso>()
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[AppPage] error cargando cursos:", error.message);
  }

  return <AppDashboardClient initialCursos={data ?? []} />;
}
