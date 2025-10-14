import { NextResponse } from "next/server";
import { getAsignaturaByCodigoServer } from "@/data/asignaturas.server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const codigo = searchParams.get("codigo");
  if (!codigo) {
    return NextResponse.json({ ok: false, error: "Código no proporcionado" }, { status: 400 });
  }

  try {
    const data = await getAsignaturaByCodigoServer(codigo);
    return NextResponse.json({ ok: true, data });
  } catch (err: any) {
    console.error("API by-codigo error:", err);
    return NextResponse.json({ ok: false, error: err.message ?? "Error interno" }, { status: 500 });
  }
}
