import { NextResponse } from "next/server";
import { createServerClient, type CookieMethodsServer } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST() {
  const store = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return store.get(name)?.value;
        },
        getAll() {
          return store.getAll().map((c) => ({ name: c.name, value: c.value }));
        },
        set(name: string, value: string, options?: any) {
          (store as any).set(name, value, options);
        },
        remove(name: string, options?: any) {
          if (typeof (store as any).delete === "function") {
            (store as any).delete(name);
          } else {
            (store as any).set(name, "", { ...options, maxAge: 0 });
          }
        },
      } as CookieMethodsServer,
    }
  );

  const { error } = await supabase.auth.signOut();
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ success: true });
}
