import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const sb = supabaseAdmin;

    const [{ data: ra }, { data: ce }, { data: asig }] = await Promise.all([
      sb.from("resultados_aprendizaje").select("count", { count: "exact", head: true }),
      sb.from("criterios_evaluacion").select("count", { count: "exact", head: true }),
      sb.from("asignaturas").select("id,nombre,created_at").order("created_at", { ascending: false }).limit(5),
    ]);

    return NextResponse.json({
      ok: true,
      totals: {
        asignaturas: asig?.length ?? 0,
        ra: ra?.length ?? (ra as any)?.count ?? 0,
        ce: ce?.length ?? (ce as any)?.count ?? 0,
      },
      latestAsignaturas: asig ?? [],
      env: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? null,
        hasServiceKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
      },
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? String(e) }, { status: 500 });
  }
}
