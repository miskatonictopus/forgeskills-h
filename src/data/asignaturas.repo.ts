"use client";

import { supabaseBrowser } from "@/lib/supabaseBrowser";

export type AsignaturaDash = {
  id: string;                 // código visible (p. ej. "0488")
  nombre: string;
  color?: string | null;
  cursosCount?: number;       // opcional: nº de cursos donde aparece
};

// Fila que devuelve la vista/tabla curso_asignaturas
type CursoAsignaturaRow = {
  curso_id: string | number;
  asignatura_id: string | number;
  asignatura_nombre: string | null;
  color: string | null;
};

export async function listarAsignaturasDashboard(): Promise<AsignaturaDash[]> {
  const supabase = supabaseBrowser();

  const { data, error } = await supabase
    .from("curso_asignaturas")
    .select("curso_id, asignatura_id, asignatura_nombre, color");

  if (error) throw error;

  const rows = (data ?? []) as CursoAsignaturaRow[];

  // Map: asignatura_id -> { nombre, cursos(Set), color? }
  const map = new Map<
    string,
    { nombre: string; cursos: Set<string>; color?: string | null }
  >();

  for (const r of rows) {
    const id = String(r.asignatura_id);
    const nombre = String(r.asignatura_nombre ?? r.asignatura_id);
    const color = r.color;

    if (!map.has(id)) {
      map.set(id, { nombre, cursos: new Set<string>(), color: color ?? null });
    }

    const entry = map.get(id)!;
    entry.cursos.add(String(r.curso_id));

    // usa el primer color no nulo que encontremos
    if (!entry.color && color) entry.color = color;
  }

  return Array.from(map.entries()).map(([id, v]) => ({
    id,
    nombre: v.nombre,
    color: v.color ?? null,
    cursosCount: v.cursos.size,
  }));
}

export async function actualizarColorAsignatura(
  asignaturaId: string,
  color: string
): Promise<void> {
  const supabase = supabaseBrowser();

  const { error } = await supabase
    .from("curso_asignaturas")
    .update({ color })
    .eq("asignatura_id", asignaturaId);

  if (error) throw error;
}
