// src/app/api/cursos/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return new NextResponse("No autorizado", { status: 401 });
  }

  const { data, error } = await supabase
    .from("cursos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return new NextResponse(error.message, { status: 400 });
  }

  return NextResponse.json(data ?? []);
}

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return new NextResponse("No autorizado", { status: 401 });
  }

  const body = await req.json().catch(() => null);

  if (!body?.nombre || typeof body.nombre !== "string") {
    return new NextResponse("Nombre de curso requerido", { status: 400 });
  }

  const { data, error } = await supabase
    .from("cursos")
    .insert({
      nombre: body.nombre,
      user_id: user.id, // 👈 ligado al usuario
    })
    .select()
    .single();

  if (error) {
    return new NextResponse(error.message, { status: 400 });
  }

  return NextResponse.json(data);
}
