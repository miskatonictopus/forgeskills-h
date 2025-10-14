import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type InCriterio = { codigo: string; descripcion: string };
type InRA = {
  codigo: string;
  titulo?: string | null;
  descripcion: string;
  criterios?: InCriterio[];
};
type InBody =
  | { codigo: string; nombre?: string; color?: string | null; ra: InRA[] }
  | { items: { codigo: string; nombre?: string; color?: string | null; ra: InRA[] }[] }
  | { seed: true; codigo: string }; // semilla de prueba rápida

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const normCodigo = (s: string) => String(s ?? "").trim().replace(/\D/g, "");

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as InBody;

    // Normalizar payload a un array de items
    const items =
      "items" in body && Array.isArray(body.items)
        ? body.items
        : "codigo" in body && "ra" in body && Array.isArray((body as any).ra)
        ? [{ codigo: body.codigo, nombre: (body as any).nombre, color: (body as any).color, ra: (body as any).ra }]
        : "seed" in body && body.seed && "codigo" in body
        ? [
            {
              codigo: body.codigo,
              nombre: `Asignatura ${body.codigo}`,
              color: null,
              ra: [
                {
                  codigo: "RA1",
                  titulo: "RA de prueba",
                  descripcion: "Descripción RA de prueba",
                  criterios: [
                    { codigo: "CE1", descripcion: "Criterio de prueba 1" },
                    { codigo: "CE2", descripcion: "Criterio de prueba 2" },
                  ],
                },
              ],
            },
          ]
        : [];

    if (!items.length) {
      return NextResponse.json({ ok: false, error: "Payload vacío o inválido" }, { status: 400 });
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const service = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const db = createClient(url, service, { auth: { persistSession: false, autoRefreshToken: false } });

    const results: any[] = [];

    for (const item of items) {
      const raw = normCodigo(item.codigo);
      const padded = raw.padStart(4, "0");
      const noPad = String(Number(raw));

      // 1) Asegurar asignatura (si no existe, crearla mínimamente)
      let { data: asg } = await db
        .from("asignaturas")
        .select("id_uuid, codigo, nombre")
        .or(`codigo.eq.${padded},codigo.eq.${noPad}`)
        .maybeSingle();

      if (!asg) {
        const { data: ins, error: errIns } = await db
          .from("asignaturas")
          .insert({
            id: padded, // tu tabla tiene PK text 'id' — OK
            codigo: padded,
            nombre: item?.nombre ?? padded,
            color: item?.color ?? null,
          })
          .select("id_uuid, codigo, nombre")
          .maybeSingle();

        if (errIns) {
          results.push({ codigo: item.codigo, ok: false, step: "insert_asignatura", error: errIns.message });
          continue;
        }
        asg = ins!;
      }

      const asignaturaUuid = asg.id_uuid as string;

      // 2) Limpiar RA/CE existentes de esa asignatura (opción simple y segura)
      const { data: existingRas } = await db
        .from("resultados_aprendizaje")
        .select("id")
        .eq("asignatura_id", asignaturaUuid);

        if (existingRas?.length) {
            const raIds = existingRas.map((r: { id: string }) => r.id);
            await db.from("criterios_evaluacion").delete().in("ra_id", raIds);
            await db.from("resultados_aprendizaje").delete().eq("asignatura_id", asignaturaUuid);
          }

      // 3) Insertar RAs
      const raRows = (item.ra ?? []).map((r: InRA) => ({
        codigo: r.codigo,
        titulo: r.titulo ?? null,
        descripcion: r.descripcion ?? "",
        asignatura_id: asignaturaUuid,
      }));

      const { data: raIns, error: eRa } = await db
        .from("resultados_aprendizaje")
        .insert(raRows)
        .select("id, codigo");

      if (eRa) {
        results.push({ codigo: item.codigo, ok: false, step: "insert_ras", error: eRa.message });
        continue;
      }

      // 4) Insertar CEs mapeando por código de RA
      const mapRaIdByCode = new Map<string, string>(
        (raIns ?? []).map((r) => [String(r.codigo), String(r.id)])
      );

      const ceRows: { ra_id: string; codigo: string; descripcion: string }[] = [];
      for (const r of item.ra ?? []) {
        const ra_id = mapRaIdByCode.get(r.codigo);
        if (!ra_id) continue;
        for (const ce of r.criterios ?? []) {
          ceRows.push({
            ra_id,
            codigo: ce.codigo,
            descripcion: ce.descripcion,
          });
        }
      }

      if (ceRows.length) {
        const { error: eCe } = await db.from("criterios_evaluacion").insert(ceRows);
        if (eCe) {
          results.push({ codigo: item.codigo, ok: false, step: "insert_ces", error: eCe.message });
          continue;
        }
      }

      results.push({
        codigo: item.codigo,
        ok: true,
        asignatura_id: asignaturaUuid,
        inserted_ras: raIns?.length ?? 0,
        inserted_ces: ceRows.length,
      });
    }

    return NextResponse.json({ ok: true, results }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? String(e) }, { status: 500 });
  }
}
