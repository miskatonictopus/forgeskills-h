// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

type LoginResponse =
  | { ok: true; userId: string | null }
  | { ok: false; error: string };

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json<LoginResponse>(
        { ok: false, error: "Faltan email o password." },
        { status: 400 }
      );
    }

    const supabase = createRouteHandlerClient({ cookies });

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("[LOGIN] auth error:", error);

      const status =
        error.message === "Invalid login credentials" ? 401 : 400;

      return NextResponse.json<LoginResponse>(
        { ok: false, error: error.message },
        { status }
      );
    }

    return NextResponse.json<LoginResponse>({
      ok: true,
      userId: data.user?.id ?? null,
    });
  } catch (err) {
    console.error("[LOGIN] unexpected error:", err);
    return NextResponse.json<LoginResponse>(
      { ok: false, error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
