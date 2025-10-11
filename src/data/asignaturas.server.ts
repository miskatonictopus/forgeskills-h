// src/data/asignaturas.server.ts
import "server-only";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export type AsignaturaSSR = {
  asignatura_id: string;   // UUID real (para joins RA/CE)
  codigo: string | null;   // p.ej. "1665"
  nombre: string;
  color?: string | null;
};

const normCodigo = (s: string) =>
  String(s ?? "").trim().replace(/\D/g, "").padStart(4, "0");

export async function getAsignaturaByCodigoServer(codigoInput: string) {
  const codigo = normCodigo(codigoInput);

  // Si tienes una vista que expone el UUID real, úsala:
  // Asegúrate de que la vista tenga una columna 'asignatura_id' (UUID)
  const { data: vData } = await supabaseAdmin
    .from("asignaturas_dashboard")
    .select("asignatura_id, codigo, nombre, color")
    .eq("codigo", codigo)
    .maybeSingle();

  if (vData) {
    return {
      asignatura_id: vData.asignatura_id,
      codigo: vData.codigo,
      nombre: vData.nombre,
      color: vData.color,
    } as AsignaturaSSR;
  }

  // Tabla base
  const { data, error } = await supabaseAdmin
    .from("asignaturas")
    .select("id, codigo, nombre, color")
    .eq("codigo", codigo)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    asignatura_id: data.id,
    codigo: data.codigo,
    nombre: data.nombre,
    color: data.color,
  } as AsignaturaSSR;
}
