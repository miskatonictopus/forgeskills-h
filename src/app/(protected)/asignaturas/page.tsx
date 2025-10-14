// app/(protected)/asignaturas/page.tsx
import AsignaturasGrid from "@/components/dashboard/AsignaturasGrid";
import { supabaseServer } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AsignaturasIndexPage() {
  const supabase = await supabaseServer();
  const { data, error } = await supabase
    .from("asignaturas")
    .select("id,codigo,nombre,color")
    .order("codigo", { ascending: true });

  if (error) {
    console.error("asignaturas.page supabase error:", error);
  }

  // adapta el shape si tu Grid lo espera distinto
  const items =
    (data ?? []).map((a) => ({
      id: String(a.id),
      nombre: a.nombre,
      codigo: a.codigo,
      color: a.color,
    })) ?? [];

  return (
    <main className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Asignaturas</h1>
      <AsignaturasGrid data={items} />
    </main>
  );
}
