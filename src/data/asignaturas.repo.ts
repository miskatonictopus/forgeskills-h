// src/data/asignaturas.repo.ts
"use client";

import { supabaseBrowser } from "@/lib/supabaseBrowser";

export type AsignaturaDash = {
  id: string;          // asignatura_id
  nombre: string;      // asignatura_nombre
  cursosCount: number; // nº de cursos donde está asociada
};

export async function listarAsignaturasDashboard(): Promise<AsignaturaDash[]> {
  const supabase = supabaseBrowser();

  // Traemos asociaciones curso-asignatura y reducimos en el cliente
  const { data, error } = await supabase
    .from("curso_asignaturas")
    .select("curso_id, asignatura_id, asignatura_nombre");

  if (error) throw error;

  const map = new Map<string, { nombre: string; cursos: Set<string> }>();

  (data ?? []).forEach((r) => {
    const id = String(r.asignatura_id);
    const nombre = String(r.asignatura_nombre ?? r.asignatura_id);
    if (!map.has(id)) map.set(id, { nombre, cursos: new Set<string>() });
    map.get(id)!.cursos.add(String(r.curso_id));
  });

  return Array.from(map.entries()).map(([id, v]) => ({
    id,
    nombre: v.nombre,
    cursosCount: v.cursos.size,
  }));
}
