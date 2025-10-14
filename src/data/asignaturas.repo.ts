import "server-only";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export type AsignaturaDash = {
  id: string;        // id_uuid
  codigo: string;
  nombre: string;
  color?: string | null;
};

export async function listarAsignaturasDashboard(): Promise<AsignaturaDash[]> {
  const supabase = supabaseAdmin();
  const { data, error } = await supabase
    .from("asignaturas")
    .select("id_uuid, codigo, nombre, color")
    .order("codigo", { ascending: true });

  if (error) {
    console.error("asignaturas repo error:", error.message);
    return [];
  }
  return (data ?? []).map((r: any) => ({
    id: r.id_uuid,
    codigo: r.codigo,
    nombre: r.nombre,
    color: r.color ?? null,
  }));
}
