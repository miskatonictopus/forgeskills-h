// src/app/api/asignaturas/import/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const supabase = supabaseAdmin;

// Puedes sobrescribir por .env(.local): ASIGNATURAS_JSON_URL
const DEFAULT_JSON_URL =
  "https://raw.githubusercontent.com/miskatonictopus/asignaturas_fp/main/asignaturas_FP.json";

type AnyObj = Record<string, any>;
const norm = (s: string) =>
  String(s ?? "").normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();
const normCodigo = (s: string) => String(s ?? "").trim().replace(/\D/g, "").padStart(4, "0");
const pickRA = (a: AnyObj) =>
  (Array.isArray(a?.RA) && a.RA) ||
  (Array.isArray(a?.ra) && a.ra) ||
  (Array.isArray(a?.resultados_aprendizaje) && a.resultados_aprendizaje) ||
  [];
const pickCE = (ra: AnyObj) =>
  (Array.isArray(ra?.CE) && ra.CE) ||
  (Array.isArray(ra?.ce) && ra.ce) ||
  (Array.isArray(ra?.criterios) && ra.criterios) ||
  (Array.isArray(ra?.criterios_evaluacion) && ra.criterios_evaluacion) ||
  [];
const codeOfRA = (ra: AnyObj) => String(ra?.codigo ?? ra?.id ?? "").trim();
const codeOfCE = (ce: AnyObj) => String(ce?.codigo ?? ce?.id ?? "").trim();

export async function GET(req: Request) {
  const url = new URL(req.url);
  const codigo = url.searchParams.get("codigo") ?? url.searchParams.get("id") ?? url.searchParams.get("asignatura_id");
  const nombre = url.searchParams.get("nombre");
  return NextResponse.json({
    ok: true,
    hint: "POST simple { codigo|id|asignatura_id|nombre } o batch { items:[{id|codigo|nombre}...] }",
    youSent: { codigo, nombre },
  });
}

async function readInput(req: Request): Promise<{ from: "json"|"form"|"query"; body: AnyObj; }> {
  // JSON
  try {
    const j = await req.json();
    if (j && typeof j === "object") return { from: "json", body: j as AnyObj };
  } catch {}
  // Form
  try {
    const ctype = req.headers.get("content-type") ?? "";
    if (ctype.includes("application/x-www-form-urlencoded") || ctype.includes("multipart/form-data")) {
      const fd = await req.formData();
      const obj: AnyObj = {};
      fd.forEach((v, k) => (obj[k] = v));
      return { from: "form", body: obj };
    }
  } catch {}
  // Query
  const url = new URL(req.url);
  const obj: AnyObj = {};
  for (const [k, v] of url.searchParams.entries()) obj[k] = v;
  return { from: "query", body: obj };
}

async function loadCatalog(): Promise<{ lista: AnyObj[]; sourceUrl: string; }> {
  const sourceUrl =
    process.env.ASIGNATURAS_JSON_URL && process.env.ASIGNATURAS_JSON_URL.trim().length > 0
      ? process.env.ASIGNATURAS_JSON_URL
      : DEFAULT_JSON_URL;
  const res = await fetch(sourceUrl, { cache: "no-store" });
  if (!res.ok) throw new Error(`No se pudo obtener JSON (${sourceUrl})`);
  const json = await res.json();
  const lista: AnyObj[] = Array.isArray(json)
    ? json
    : Array.isArray(json?.asignaturas)
    ? json.asignaturas
    : [];
  if (!lista.length) throw new Error("JSON sin asignaturas");
  return { lista, sourceUrl };
}

function findAsignatura(lista: AnyObj[], codigoInput: string, nombreInput: string) {
  const found =
    lista.find((a) => {
      const id = String(a?.id ?? "").trim();
      const cod = String(a?.codigo ?? "").trim();
      return (
        codigoInput &&
        ((id && (id === codigoInput || normCodigo(id) === normCodigo(codigoInput))) ||
          (cod && (cod === codigoInput || normCodigo(cod) === normCodigo(codigoInput))))
      );
    }) ||
    lista.find((a) => nombreInput && norm(a?.nombre ?? "") === norm(nombreInput));
  return found;
}

async function upsertAsignaturaConRACE(asignatura: AnyObj) {
  const RA = pickRA(asignatura);
  if (!RA.length) {
    return { ok: false, reason: "Asignatura sin RA", asignatura: asignatura?.nombre ?? null };
  }

  const codAsignatura = String(asignatura?.codigo ?? asignatura?.id ?? "").trim();

  // ⏩ Campos adicionales a importar
  const duracion = asignatura?.duracion ?? null;
  const horas = asignatura?.horas ?? null;
  const horas_totales = asignatura?.horas_totales ?? null;
  const descripcion = asignatura?.descripcion ?? null;

  // === UPSERT asignatura ===
  let asignaturaId: string | undefined;
  if (codAsignatura) {
    const { data: exByCode, error: errByCode } = await supabase
      .from("asignaturas")
      .select("id")
      .eq("codigo", codAsignatura)
      .maybeSingle();
    if (errByCode) throw new Error(`exist-asig(code): ${errByCode.message}`);

    if (exByCode?.id) {
      asignaturaId = exByCode.id as string;

      // ✅ Si ya existe, actualizamos nombre/duración/horas
      const { error: updateErr } = await supabase
        .from("asignaturas")
        .update({
          nombre: asignatura.nombre,
          duracion,
          horas,
          horas_totales,
          descripcion,
        })
        .eq("id", asignaturaId);
      if (updateErr) throw new Error(`update-asig: ${updateErr.message}`);
    } else {
      // ✅ Si no existe, insertamos con duración y horas
      const { data: nueva, error: errIns } = await supabase
        .from("asignaturas")
        .insert({
          id: crypto.randomUUID(),
          codigo: codAsignatura || null,
          nombre: asignatura.nombre,
          color: "#A3E635",
          duracion,
          horas,
          horas_totales,
          descripcion,
        })
        .select("id")
        .single();
      if (errIns) throw new Error(`insert-asig: ${errIns.message}`);
      asignaturaId = nueva!.id as string;
    }
  } else {
    // fallback por nombre
    const { data: existente, error: errExist } = await supabase
      .from("asignaturas")
      .select("id")
      .eq("nombre", asignatura.nombre)
      .maybeSingle();
    if (errExist) throw new Error(`exist-asig(name): ${errExist.message}`);

    if (existente?.id) {
      asignaturaId = existente.id as string;

      // ✅ también actualizamos si existe
      const { error: updateErr } = await supabase
        .from("asignaturas")
        .update({
          duracion,
          horas,
          horas_totales,
          descripcion,
        })
        .eq("id", asignaturaId);
      if (updateErr) throw new Error(`update-asig(name): ${updateErr.message}`);
    } else {
      const { data: nueva, error: errIns } = await supabase
        .from("asignaturas")
        .insert({
          id: crypto.randomUUID(),
          nombre: asignatura.nombre,
          color: "#A3E635",
          duracion,
          horas,
          horas_totales,
          descripcion,
        })
        .select("id")
        .single();
      if (errIns) throw new Error(`insert-asig(name): ${errIns.message}`);
      asignaturaId = nueva!.id as string;
    }
  }

  // === RAs y CEs ===
  let insertedRA = 0;
  let insertedCE = 0;

  for (const ra of RA) {
    const raCodigo = codeOfRA(ra);
    if (!raCodigo) continue;

    const { data: raExist, error: raSelErr } = await supabase
      .from("resultados_aprendizaje")
      .select("id")
      .eq("asignatura_id", asignaturaId)
      .eq("codigo", raCodigo)
      .maybeSingle();
    if (raSelErr) throw new Error(`select-ra: ${raSelErr.message}`);

    let raId = raExist?.id as string | undefined;
    if (!raId) {
      const { data: nuevoRA, error: raInsErr } = await supabase
        .from("resultados_aprendizaje")
        .insert({
          id: crypto.randomUUID(),
          asignatura_id: asignaturaId!,
          codigo: raCodigo,
          titulo: ra.titulo ?? null,
          descripcion: ra.descripcion ?? "",
        })
        .select("id")
        .single();
      if (raInsErr) throw new Error(`insert-ra: ${raInsErr.message}`);
      raId = nuevoRA!.id as string;
      insertedRA++;
    }

    const CE = pickCE(ra);
    for (const ce of CE) {
      const ceCodigo = codeOfCE(ce);
      if (!ceCodigo) continue;

      const { data: ceExist, error: ceSelErr } = await supabase
        .from("criterios_evaluacion")
        .select("id")
        .eq("ra_id", raId)
        .eq("codigo", ceCodigo)
        .maybeSingle();
      if (ceSelErr) throw new Error(`select-ce: ${ceSelErr.message}`);

      if (!ceExist) {
        const { error: ceInsErr } = await supabase
          .from("criterios_evaluacion")
          .insert({
            id: crypto.randomUUID(),
            ra_id: raId!,
            codigo: ceCodigo,
            descripcion: String(ce?.descripcion ?? ""),
          });
        if (ceInsErr) throw new Error(`insert-ce: ${ceInsErr.message}`);
        insertedCE++;
      }
    }
  }

  return {
    ok: true,
    asignatura: asignatura.nombre,
    codigo: codAsignatura || null,
    duracion,
    insertedRA,
    insertedCE,
  };
}


export async function POST(req: Request) {
  let where = "start";
  try {
    const { from, body } = await readInput(req);

    // Soportar modo batch: { items: [{ id|codigo|nombre }...] }
    const items = Array.isArray(body?.items) ? (body.items as AnyObj[]) : null;

    // Cargar catálogo una sola vez
    where = "fetch-json";
    const { lista, sourceUrl } = await loadCatalog();

    // === Batch ===
    if (items && items.length > 0) {
      where = "batch";
      const results = [];
      for (const it of items) {
        const codigoInputRaw = it?.codigo ?? it?.id ?? it?.asignatura_id ?? "";
        const nombreInputRaw = it?.nombre ?? "";

        const codigoInput = typeof codigoInputRaw === "string"
          ? codigoInputRaw.trim()
          : String(codigoInputRaw ?? "").trim();

        const nombreInput = typeof nombreInputRaw === "string"
          ? nombreInputRaw.trim()
          : "";

        if (!codigoInput && !nombreInput) {
          results.push({ ok: false, error: "Falta 'codigo' o 'nombre' en item", item: it });
          continue;
        }

        const asignatura = findAsignatura(lista, codigoInput, nombreInput);
        if (!asignatura) {
          results.push({ ok: false, error: "Asignatura no encontrada", item: it });
          continue;
        }

        try {
          const r = await upsertAsignaturaConRACE(asignatura);
          results.push(r);
        } catch (e: any) {
          results.push({ ok: false, error: e?.message || String(e), item: it });
        }
      }
      return NextResponse.json({ ok: true, mode: "batch", sourceUrl, results });
    }

    // === Simple ===
    where = "simple";
    const codigoInputRaw = body?.codigo ?? body?.id ?? body?.asignatura_id ?? "";
    const nombreInputRaw = body?.nombre ?? "";
    const codigoInput = typeof codigoInputRaw === "string"
      ? codigoInputRaw.trim()
      : String(codigoInputRaw ?? "").trim();
    const nombreInput = typeof nombreInputRaw === "string" ? nombreInputRaw.trim() : "";

    if (!codigoInput && !nombreInput) {
      return NextResponse.json(
        { ok: false, error: "Falta 'codigo' o 'nombre'.", where, from, received: body },
        { status: 400 }
      );
    }

    const asignatura = findAsignatura(lista, codigoInput, nombreInput);
    if (!asignatura) {
      const ejemplo = lista.slice(0, 10).map(a => ({ id: a?.id, codigo: a?.codigo, nombre: a?.nombre }));
      return NextResponse.json(
        { ok: false, error: "Asignatura no encontrada", where, received: body, ejemplo },
        { status: 404 }
      );
    }

    const result = await upsertAsignaturaConRACE(asignatura);
return NextResponse.json({ mode: "single", ...result });


  } catch (err: any) {
    console.error("❌ import error:", err, "where:", where);
    return NextResponse.json({ ok: false, error: err?.message || String(err), where }, { status: 500 });
  }
}
