// src/data/cursos_relacionados.server.ts
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function getCursosRelacionados(asignaturaId: string) {
  const supabase = supabaseAdmin as SupabaseClient;

  // 1) lee relaciones
  const { data: rels, error: relErr } = await supabase
    .from("curso_asignaturas")
    .select("curso_id")
    .eq("asignatura_id", asignaturaId);

  if (relErr) {
    console.error("❌ curso_asignaturas error:", relErr.message);
    return [];
  }

  const ids = (rels ?? [])
    .map((r: any) => r.curso_id)
    .filter((v: any) => typeof v === "string" && v.length > 0);

  if (ids.length === 0) return [];

  // 2) trae cursos por IN
  const { data: cursos, error: cErr } = await supabase
    .from("cursos")
    .select("id, acronimo, nombre, nivel, grado")
    .in("id", ids);

  if (cErr) {
    console.error("❌ cursos error:", cErr.message);
    return [];
  }

  return cursos ?? [];
}
