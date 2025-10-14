// src/app/api/db-check/route.ts
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const sb = await supabaseServer(); // ✅ invocar, devuelve SupabaseClient

  const [raRes, ceRes, asigRes] = await Promise.all([
    sb.from("resultados_aprendizaje").select("*", { count: "exact", head: true }),
    sb.from("criterios_evaluacion").select("*", { count: "exact", head: true }),
    sb
      .from("asignaturas")
      .select("id,nombre,created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const anyError = raRes.error || ceRes.error || asigRes.error;
  if (anyError) {
    return NextResponse.json(
      {
        ok: false,
        errors: [raRes.error, ceRes.error, asigRes.error].filter(Boolean),
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    raCount: raRes.count ?? 0,
    ceCount: ceRes.count ?? 0,
    lastAsignaturas: asigRes.data ?? [],
  });
}
