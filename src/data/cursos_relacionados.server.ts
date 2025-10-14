// src/data/cursos_relacionados.server.ts
import { supabaseServer } from "@/lib/supabaseServer";
// si tienes este tipo branded:
export type UUID = string & { readonly __brand: "uuid" };

export async function getCursosRelacionados(asignaturaId: string | UUID) {
  const sb = await supabaseServer();
  const id = String(asignaturaId); // normalizamos a string

  const { data, error } = await sb
    .from("curso_asignaturas")
    .select("cursos:id_curso ( id, acronimo, nombre, nivel, grado )")
    .eq("id_asignatura", id);

  if (error) throw error;

  // adapta al shape que uses
  const cursos =
    (data ?? []).map((row: any) => ({
      id: row.cursos.id,
      acronimo: row.cursos.acronimo,
      nombre: row.cursos.nombre,
      nivel: row.cursos.nivel,
      grado: row.cursos.grado,
    })) ?? [];

  return cursos;
}
