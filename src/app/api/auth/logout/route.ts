import { NextResponse, NextRequest } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function POST() {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut({ scope: "global" }).catch(() => {});

  // limpieza extra por si quedara algo
  const store = await cookies();
  store.getAll().forEach((c) => {
    if (c.name.startsWith("sb-") || c.name.includes("supabase")) {
      (store as any).set(c.name, "", { path: "/", maxAge: 0 });
    }
  });

  return NextResponse.json({ ok: true });
}

export async function GET(req: NextRequest) {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut({ scope: "global" }).catch(() => {});
  const store = await cookies();
  store.getAll().forEach((c) => (store as any).set(c.name, "", { path: "/", maxAge: 0 }));
  return NextResponse.redirect(new URL("/", req.url));
}
