import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type InItem = { codigo: string; nombre: string; color?: string | null };

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const items: InItem[] = Array.isArray(body?.items)
      ? body.items
      : body?.codigo && body?.nombre
      ? [{ codigo: String(body.codigo), nombre: String(body.nombre), color: body.color ?? null }]
      : [];

    if (!items.length) {
      return NextResponse.json({ ok:false, error:"Payload vacío o inválido" }, { status: 400 });
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const service = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const db = createClient(url, service, { auth: { persistSession: false, autoRefreshToken: false } });

    const rows = items.map(it => ({
      id: String(it.codigo),               // 👈 PK
      codigo: String(it.codigo),
      nombre: String(it.nombre ?? it.codigo),
      color: it.color ?? null,
    }));

    const { data, error } = await db
      .from("asignaturas")
      .upsert(rows)                        // ← sin onConflict; usa PK "id"
      .select("id, id_uuid, codigo, nombre, color");

    if (error) return NextResponse.json({ ok:false, error: error.message }, { status: 400 });

    return NextResponse.json({ ok:true, count: data?.length ?? 0, data }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ ok:false, error: String(e?.message ?? e) }, { status: 500 });
  }
}
