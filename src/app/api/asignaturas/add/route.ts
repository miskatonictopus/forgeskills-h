import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const codigo = url.searchParams.get("codigo") ?? "9999";
  const nombre = url.searchParams.get("nombre") ?? "Prueba rápida 9999";
  const color  = url.searchParams.get("color");

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!SUPABASE_URL || !SERVICE_ROLE) {
    return new Response(JSON.stringify({ ok:false, error:"Faltan variables SUPABASE" }), { status: 500 });
  }

  const db = createClient(SUPABASE_URL, SERVICE_ROLE, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const row = {
    id: String(codigo),            // 👈 usamos la PK
    codigo: String(codigo),
    nombre: String(nombre),
    color: color ?? null,
  };

  const { data, error } = await db
    .from("asignaturas")
    // ⚠️ QUITAMOS onConflict:"codigo" porque no es unique
    //    Deja que Postgres use la PRIMARY KEY (id)
    .upsert(row)                   // ← usa PK "id" para el conflicto
    .select("id, id_uuid, codigo, nombre, color")
    .single();

  if (error) {
    return new Response(JSON.stringify({ ok:false, error: error.message }), { status: 400 });
  }
  return new Response(JSON.stringify({ ok:true, data }), { status: 200 });
}
