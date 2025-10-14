import "server-only";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { type AsignaturaSSR, type UUID } from "@/types/asignaturas";

const normCodigo = (s: string) => String(s ?? "").trim().replace(/\D/g, "");

export async function getAsignaturaByCodigoServer(codigoInput: string): Promise<AsignaturaSSR | null> {
  const raw = normCodigo(codigoInput);
  if (!raw) return null;
  const padded = raw.padStart(4, "0");
  const noPad = String(Number(raw));

  const db = supabaseAdmin();
  const { data, error } = await db
    .from("asignaturas")
    .select("id_uuid, codigo, nombre, color, duracion, horas, horas_totales, descripcion")
    .or(`codigo.eq.${padded},codigo.eq.${noPad}`)
    .maybeSingle();

  if (error) { console.error("getAsignaturaByCodigoServer:", error.message); return null; }
  if (!data) return null;

  return {
    asignatura_id: data.id_uuid as UUID,
    codigo: data.codigo,
    nombre: data.nombre,
    color: data.color,
    duracion: data.duracion as string | number | null,
    horas: data.horas as number | null,
    horas_totales: data.horas_totales as number | null,
    descripcion: data.descripcion ?? undefined,
  };
}
