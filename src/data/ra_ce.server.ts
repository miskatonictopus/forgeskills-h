import "server-only";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { type RAConCE, type Criterio, type UUID } from "@/types/asignaturas";

export async function getRAyCEByAsignaturaServer(asignaturaUuid: UUID): Promise<RAConCE[]> {
  const db = supabaseAdmin();

  const { data: ras, error: e1 } = await db
    .from("resultados_aprendizaje")
    .select("id, codigo, titulo, descripcion")
    .eq("asignatura_id", asignaturaUuid)
    .order("codigo", { ascending: true });

  if (e1) { console.error("RA error:", e1.message); return []; }
  if (!ras?.length) return [];

  const raIds = ras.map(r => r.id as UUID);

  const { data: ces, error: e2 } = await db
    .from("criterios_evaluacion")
    .select("id, ra_id, codigo, descripcion")
    .in("ra_id", raIds)
    .order("codigo", { ascending: true });

  if (e2) { console.error("CE error:", e2.message); return []; }

  const byRA = new Map<UUID, Criterio[]>();
  (ces ?? []).forEach(ce => {
    const key = ce.ra_id as UUID;
    const list = byRA.get(key) ?? [];
    list.push({ id: ce.id as UUID, codigo: ce.codigo, descripcion: ce.descripcion });
    byRA.set(key, list);
  });

  return ras.map(r => ({
    id: r.id as UUID,
    codigo: r.codigo,
    titulo: r.titulo ?? null,
    descripcion: r.descripcion,
    criterios_evaluacion: byRA.get(r.id as UUID) ?? [],
  }));
}
