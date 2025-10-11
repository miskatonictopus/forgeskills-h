import "server-only";
import { supabaseServer } from "@/lib/supabaseServer";

export type AsignaturaSSR = {
  id: string;          // código visible (p.ej. "0488")
  nombre: string;
  color?: string | null;
  codigo?: string | null;
};

export async function getAsignaturaByCodigoServer(codigo: string) {
  const supabase = await supabaseServer();

  // 1) Si tienes una vista usada en el dashboard, intenta primero ahí.
  const dash = await supabase
    .from("asignaturas_dashboard")   // si no existe, seguirá al paso 2
    .select("id,nombre,color,codigo")
    .eq("id", codigo)
    .maybeSingle();

  if (dash.data) return dash.data as AsignaturaSSR;

  // 2) Tabla base (ajusta el nombre si es distinto)
  const numeric = Number(codigo);
  const orParts = [`codigo.eq.${codigo}`, `id.eq.${codigo}`];
  if (Number.isFinite(numeric)) orParts.push(`id.eq.${numeric}`);

  const { data } = await supabase
    .from("asignaturas")
    .select("id,nombre,color,codigo")
    .or(orParts.join(","))
    .single();

  return (data as AsignaturaSSR) ?? null;
}