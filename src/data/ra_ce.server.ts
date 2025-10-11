// src/data/ra_ce.server.ts
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function getRAyCEByAsignaturaServer(asignaturaId: string) {
  // 1️⃣ RAs
  const { data: ras, error: e1 } = await supabaseAdmin
    .from("resultados_aprendizaje")
    .select("id, codigo, titulo, descripcion")
    .eq("asignatura_id", asignaturaId)
    .order("codigo", { ascending: true });

  if (e1) throw e1;
  const raList = ras ?? [];

  if (raList.length === 0) return [];

  // 2️⃣ CEs relacionados
  const raIds = raList.map((r) => r.id);
  const { data: ces, error: e2 } = await supabaseAdmin
    .from("criterios_evaluacion")
    .select("id, ra_id, codigo, descripcion")
    .in("ra_id", raIds)
    .order("codigo", { ascending: true });

  if (e2) throw e2;

  // 3️⃣ Combinar RA + CE
  const ceByRa = new Map<string, any[]>();
  (ces ?? []).forEach((ce) => {
    const arr = ceByRa.get(ce.ra_id) ?? [];
    arr.push({ id: ce.id, codigo: ce.codigo, descripcion: ce.descripcion });
    ceByRa.set(ce.ra_id, arr);
  });

  return raList.map((ra) => ({
    ...ra,
    criterios_evaluacion: ceByRa.get(ra.id) ?? [],
  }));
}
