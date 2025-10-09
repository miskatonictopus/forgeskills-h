import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function POST(req: Request) {
  // Verifica cabecera
  const contentType = req.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json(
      { error: "Content-Type must be application/json" },
      { status: 415 }
    );
  }

  // Parseo del body
  let body: { email?: string; password?: string } | null = null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const email = body?.email?.trim() ?? "";
  const password = body?.password ?? "";

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }
  if (!password) {
    return NextResponse.json({ error: "Password is required" }, { status: 400 });
  }

  // Configura cookies (nuevo API Supabase SSR)
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (error) {
            console.error("Error al establecer cookies:", error);
          }
        },
      },
    }
  );

  // Login
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("[LOGIN_ERROR]", error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // OK → devuelve userId y deja cookies listas
  return NextResponse.json({
    ok: true,
    userId: data.user?.id ?? null,
  });
}
