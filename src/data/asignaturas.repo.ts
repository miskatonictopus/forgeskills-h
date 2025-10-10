"use client";

import { supabaseBrowser } from "@/lib/supabaseBrowser";

export type AsignaturaDash = {
  id: string;
  nombre: string;
  cursosCount: number;
  color?: string | null;
};

export async function listarAsignaturasDashboard(): Promise<AsignaturaDash[]> {
  const supabase = supabaseBrowser();

  const { data, error } = await supabase
    .from("curso_asignaturas")
    .select("curso_id, asignatura_id, asignatura_nombre, color");

  if (error) throw error;

  const map = new Map<string, { nombre: string; cursos: Set<string>; color?: string | null }>();

  (data ?? []).forEach((r) => {
    const id = String(r.asignatura_id);
    const nombre = String(r.asignatura_nombre ?? r.asignatura_id);
    const color = (r as any).color as string | null | undefined;
    if (!map.has(id)) map.set(id, { nombre, cursos: new Set<string>(), color: color ?? null });
    const entry = map.get(id)!;
    entry.cursos.add(String(r.curso_id));
    // usa el primer color no nulo que encontremos
    if (!entry.color && color) entry.color = color;
  });

  return Array.from(map.entries()).map(([id, v]) => ({
    id,
    nombre: v.nombre,
    cursosCount: v.cursos.size,
    color: v.color ?? null,
  }));
}

export async function actualizarColorAsignatura(asignaturaId: string, color: string) {
  const supabase = supabaseBrowser();
  // actualiza TODAS las asociaciones de esa asignatura (color global)
  const { error } = await supabase
    .from("curso_asignaturas")
    .update({ color })
    .eq("asignatura_id", asignaturaId);

  if (error) throw error;
}
