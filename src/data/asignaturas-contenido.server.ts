import "server-only";
import { supabaseServer } from "@/lib/supabaseServer";

export type RA = { id: string; asignatura_id: string; codigo: string; titulo: string | null; descripcion: string };
export type CE = { id: string; ra_id: string; codigo: string; descripcion: string };

const RAW_URL =
  "https://raw.githubusercontent.com/miskatonictopus/asignaturas_fp/main/asignaturas_FP.json";

/** Garantiza que la asignatura base exista (id/nombre/color opcional). */
export async function ensureAsignaturaBase(id: string, nombre?: string | null, color?: string | null) {
  const sb = await supabaseServer();
  await sb
    .from("asignaturas")
    .upsert({ id, nombre: nombre ?? id, color: color ?? null }, { onConflict: "id" });
}

/** Busca la entrada de esa asignatura en el JSON remoto. */
export async function fetchAsignaturaFromJSON(codigo: string) {
  const res = await fetch(RAW_URL, { cache: "no-store" });
  if (!res.ok) return null;
  const json: any = await res.json();
  if (Array.isArray(json)) {
    return json.find(
      (x: any) => String(x?.codigo ?? x?.id ?? "").padStart(4, "0") === String(codigo)
    ) ?? null;
  }
  if (json && typeof json === "object") {
    return json[codigo] ?? json[String(+codigo)] ?? null;
  }
  return null;
}

/** Parsea RA/CE del JSON (CE 1.3 → RA1). */
export function parseRAyCE(entry: any) {
  type PRA = { codigo: string; descripcion: string; titulo?: string | null };
  type PCE = { codigo: string; raNumero: number; descripcion: string };

  const ras: PRA[] = [];
  const ces: PCE[] = [];

  if (Array.isArray(entry?.ra)) {
    entry.ra.forEach((r: any, i: number) => {
      if (typeof r === "string") ras.push({ codigo: `RA${i + 1}`, descripcion: r.trim() });
      else if (r && typeof r === "object") {
        const codigo = String(r.codigo ?? `RA${i + 1}`);
        const desc = String(r.descripcion ?? r.desc ?? "").trim();
        ras.push({ codigo, descripcion: desc, titulo: r.titulo ?? null });
      }
    });
  } else if (entry && typeof entry === "object") {
    Object.keys(entry).forEach((k) => {
      const m = /^RA\s*([0-9]+)$/i.exec(k);
      if (m && typeof entry[k] === "string") {
        ras.push({ codigo: `RA${Number(m[1])}`, descripcion: String(entry[k]).trim() });
      }
    });
  }

  const pushCE = (s: string) => {
    const m = /^CE\s*([0-9]+)\.([0-9]+)\s*[:\-–]?\s*(.+)$/i.exec(s.trim());
    if (!m) return;
    ces.push({ codigo: `CE${m[1]}.${m[2]}`, raNumero: Number(m[1]), descripcion: m[3].trim() });
  };

  if (Array.isArray(entry?.ce)) entry.ce.forEach((s: any) => typeof s === "string" && pushCE(s));
  if (Array.isArray(entry?.criterios)) entry.criterios.forEach((s: any) => typeof s === "string" && pushCE(s));
  if (entry && typeof entry === "object") {
    Object.entries(entry).forEach(([k, v]) => {
      if (/^CE\s*\d+\.\d+$/i.test(k) && typeof v === "string") pushCE(`${k}: ${v}`);
    });
  }

  if (!ras.length && ces.length) {
    const set = new Set(ces.map((c) => c.raNumero));
    [...set].sort().forEach((n) => ras.push({ codigo: `RA${n}`, descripcion: "" }));
  }

  ras.sort((a, b) => Number(a.codigo.replace(/\D/g, "")) - Number(b.codigo.replace(/\D/g, "")));
  ces.sort((a, b) => {
    const [a1, a2] = a.codigo.replace("CE", "").split(".").map(Number);
    const [b1, b2] = b.codigo.replace("CE", "").split(".").map(Number);
    return a1 - b1 || a2 - b2;
  });

  return { ras, ces };
}

/** Asegura RA/CE para una asignatura (idempotente). */
export async function ensureRAyCEEnBD(codigoAsignatura: string) {
  const sb = await supabaseServer();

  const { data: existingRA } = await sb
    .from("resultados_aprendizaje")
    .select("id,codigo")
    .eq("asignatura_id", codigoAsignatura)
    .limit(1);

  if (existingRA?.length) return; // ya existen

  const entry = await fetchAsignaturaFromJSON(codigoAsignatura);
  if (!entry) return;

  const parsed = parseRAyCE(entry);

  // Inserta RA
  const { data: insertedRA, error: raErr } = await sb
    .from("resultados_aprendizaje")
    .insert(
      parsed.ras.map((r) => ({
        asignatura_id: codigoAsignatura,
        codigo: r.codigo,
        titulo: r.titulo ?? null,
        descripcion: r.descripcion,
      }))
    )
    .select("id,codigo");
  if (raErr) throw raErr;

  const map = new Map<number, string>();
  (insertedRA ?? []).forEach((r) => {
    const n = Number(String(r.codigo).replace(/\D/g, "") || "0");
    if (n) map.set(n, r.id);
  });

  // Inserta CE
  const ceRows = parsed.ces
    .map((c) => {
      const ra_id = map.get(c.raNumero);
      return ra_id ? { ra_id, codigo: c.codigo, descripcion: c.descripcion } : null;
    })
    .filter(Boolean) as Array<{ ra_id: string; codigo: string; descripcion: string }>;

  if (ceRows.length) {
    const { error: ceErr } = await sb.from("criterios_evaluacion").insert(ceRows);
    if (ceErr) throw ceErr;
  }
}
