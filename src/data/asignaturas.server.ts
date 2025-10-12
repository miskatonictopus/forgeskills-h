import "server-only";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export type AsignaturaSSR = {
  asignatura_id: string; // UUID real (para joins RA/CE)
  codigo: string | null; // p.ej. "1665"
  nombre: string;
  color?: string | null;
  duracion?: string | number | null;
  horas?: number | null;
  horas_totales?: number | null;
  descripcion?: any;
};

const normCodigo = (s: string) =>
  String(s ?? "").trim().replace(/\D/g, "").padStart(4, "0");

export async function getAsignaturaByCodigoServer(codigoInput: string) {
  const codigo = normCodigo(codigoInput);

  // 1️⃣ Primero intentamos desde la vista "asignaturas_dashboard"
  const { data: vData, error: vError } = await supabaseAdmin
    .from("asignaturas_dashboard")
    .select(
      `
      asignatura_id,
      codigo,
      nombre,
      color,
      duracion,
      horas,
      horas_totales,
      descripcion
      `
    )
    .eq("codigo", codigo)
    .maybeSingle();

  if (vError) console.warn("⚠️ Error en vista asignaturas_dashboard:", vError.message);

  if (vData) {
    return {
      asignatura_id: vData.asignatura_id,
      codigo: vData.codigo,
      nombre: vData.nombre,
      color: vData.color,
      duracion: vData.duracion,
      horas: vData.horas,
      horas_totales: vData.horas_totales,
      descripcion: vData.descripcion,
    } as AsignaturaSSR;
  }

  // 2️⃣ Fallback a la tabla base "asignaturas"
  const { data, error } = await supabaseAdmin
    .from("asignaturas")
    .select(
      `
      id,
      codigo,
      nombre,
      color,
      duracion,
      horas,
      horas_totales,
      descripcion
      `
    )
    .eq("codigo", codigo)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    asignatura_id: data.id,
    codigo: data.codigo,
    nombre: data.nombre,
    color: data.color,
    duracion: data.duracion,
    horas: data.horas,
    horas_totales: data.horas_totales,
    descripcion: data.descripcion,
  } as AsignaturaSSR;
}
