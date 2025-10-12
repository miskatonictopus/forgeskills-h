import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

/**
 * Devuelve todos los cursos con sus asignaturas relacionadas.
 * Estructura:
 * [
 *   {
 *     id, acronimo, nombre, nivel, grado,
 *     asignaturas: [{ id, nombre, codigo }]
 *   },
 *   ...
 * ]
 */
export async function GET() {
  try {
    const sb = supabaseAdmin as any;

    // 1) Traer cursos
    const { data: cursos, error: cErr } = await sb
      .from("cursos")
      .select("id, acronimo, nombre, nivel, grado")
      .order("acronimo", { ascending: true });

    if (cErr) throw cErr;

    if (!cursos || cursos.length === 0) {
      return NextResponse.json({ ok: true, items: [] });
    }

    const cursoIds = cursos.map((c: any) => c.id);

    // 2) Relación curso_asignaturas
    const { data: rels, error: rErr } = await sb
      .from("curso_asignaturas")
      .select("curso_id, asignatura_id")
      .in("curso_id", cursoIds);

    if (rErr) throw rErr;

    const asignIds = Array.from(
      new Set((rels ?? []).map((r: any) => r.asignatura_id))
    ).filter(Boolean);

    // 3) Asignaturas mínimas
    let asigns: any[] = [];
    if (asignIds.length > 0) {
      const { data, error } = await sb
        .from("asignaturas")
        .select("id, nombre, codigo")
        .in("id", asignIds);
      if (error) throw error;
      asigns = data ?? [];
    }

    const asignById = new Map<string, any>(
      asigns.map(a => [a.id, a])
    );

    const grouped: Record<string, any[]> = {};
    for (const c of cursos) grouped[c.id] = [];
    for (const r of rels ?? []) {
      const a = asignById.get(r.asignatura_id);
      if (a) grouped[r.curso_id].push(a);
    }

    const items = cursos.map((c: any) => ({
      ...c,
      asignaturas: grouped[c.id] ?? [],
    }));

    return NextResponse.json({ ok: true, items });
  } catch (e: any) {
    console.error("GET /api/cursos/with-asignaturas error:", e?.message ?? e);
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Error interno" },
      { status: 500 }
    );
  }
}
