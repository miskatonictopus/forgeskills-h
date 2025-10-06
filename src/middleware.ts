import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Rutas a proteger / y rutas de auth públicas
const isProtected = (pathname: string) =>
  pathname.startsWith("/dashboard");

const isAuthPage = (pathname: string) =>
  pathname === "/login" || pathname === "/register";

export async function middleware(req: NextRequest) {
  // Siempre creamos una respuesta base donde el SDK escribirá cookies
  const res = NextResponse.next();

  // Cliente Supabase para middleware usando getAll/setAll
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll().map((c) => ({ name: c.name, value: c.value }));
        },
        setAll(cookies) {
          cookies.forEach(({ name, value, options }) => {
            res.cookies.set({ name, value, ...options });
          });
        },
      },
    }
  );

  const { data } = await supabase.auth.getUser();
  const { pathname } = req.nextUrl;

  // 1) Sin sesión intentando entrar a una ruta protegida
  if (isProtected(pathname) && !data.user) {
    const redirectUrl = new URL("/login", req.url);
    const redirectRes = NextResponse.redirect(redirectUrl);
    // copia cookies que el SDK haya escrito en `res`
    res.cookies.getAll().forEach((c) => redirectRes.cookies.set(c));
    return redirectRes;
  }

  // 2) Con sesión entrando a /login o /register
  if (isAuthPage(pathname) && data.user) {
    const redirectUrl = new URL("/dashboard", req.url);
    const redirectRes = NextResponse.redirect(redirectUrl);
    res.cookies.getAll().forEach((c) => redirectRes.cookies.set(c));
    return redirectRes;
  }

  // 3) Deja pasar
  return res;
}

// Aplica solo donde interesa (y evita estáticos)
export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
