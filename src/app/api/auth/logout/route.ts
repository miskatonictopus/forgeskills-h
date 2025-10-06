import { NextResponse, NextRequest } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { cookies } from "next/headers";
// import type { CookieOptions } from "@supabase/ssr";

async function nukeSupabaseCookies() {
  const store = await cookies();
  store.getAll().forEach((c) => {
    if (c.name.startsWith("sb-") || c.name.includes("supabase")) {
      // ✅ usa el overload posicional: (name, value, options)
      store.set(c.name, "", { path: "/", maxAge: 0 });
    }
  });
}

export async function POST() {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut({ scope: "global" }).catch(() => {});
  await nukeSupabaseCookies();
  return NextResponse.json({ ok: true });
}

export async function GET(req: NextRequest) {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut({ scope: "global" }).catch(() => {});
  await nukeSupabaseCookies();
  return NextResponse.redirect(new URL("/", req.url));
}
