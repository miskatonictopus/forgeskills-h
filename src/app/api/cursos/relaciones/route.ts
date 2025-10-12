import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// GET /api/cursos/relaciones?ids=cursoId1,cursoId2,...
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const idsParam = url.searchParams.get("ids") || "";
    const cursoIds = idsParam.split(",").map(s => s.trim()).filter(Boolean);

    if (cursoIds.length === 0) {
      return NextResponse.json({ ok: true, data: {} });
    }

    const supabase = supabaseAdmin as any;

    // 1) relaciones
    const { data: rels, error: relErr } = await supabase
      .from("curso_asignaturas")
      .select("curso_id, asignatura_id")
      .in("curso_id", cursoIds);

    if (relErr) throw relErr;

    const asignaturaIds = Array.from(
      new Set((rels ?? []).map((r: any) => r.asignatura_id))
    ).filter(Boolean);

    let asigns: any[] = [];
    if (asignaturaIds.length > 0) {
      const { data, error } = await supabase
        .from("asignaturas")
        .select("id, nombre, codigo")
        .in("id", asignaturaIds);
      if (error) throw error;
      asigns = data ?? [];
    }

    const byAsignId = new Map<string, any>(
      asigns.map(a => [a.id, a])
    );

    const grouped: Record<string, Array<{id:string; nombre:string; codigo?:string|null}>> = {};
    for (const id of cursoIds) grouped[id] = [];
    for (const r of rels ?? []) {
      const a = byAsignId.get(r.asignatura_id);
      if (a) grouped[r.curso_id].push(a);
    }

    return NextResponse.json({ ok: true, data: grouped });
  } catch (e: any) {
    console.error("GET /api/cursos/relaciones error:", e?.message ?? e);
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Error interno" },
      { status: 500 }
    );
  }
}
