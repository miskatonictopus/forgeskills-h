import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware de protección básica con Basic Auth.
 * Solo se aplica en producción (dominio forgeskills.io).
 */
export function middleware(req: NextRequest) {
  const isProd =
    process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production";
  const host = req.headers.get("host") || "";
  const isProdDomain = /forgeskills\.io$/i.test(host); // incluye forgeskills.io o www.forgeskills.io

  // En desarrollo o dominios de preview: sin auth
  if (!isProd || !isProdDomain) return NextResponse.next();

  const { pathname } = req.nextUrl;

  // Permitir rutas públicas (archivos estáticos, health check, etc.)
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/img") ||
    pathname.startsWith("/fonts") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/health"
  ) {
    return NextResponse.next();
  }

  // Leer cabecera Authorization
  const auth = req.headers.get("authorization");
  const user = process.env.BASIC_AUTH_USER || "";
  const pass = process.env.BASIC_AUTH_PASS || "";

  if (!user || !pass) {
    return new NextResponse("Basic auth not configured", { status: 500 });
  }

  const expected = Buffer.from(`${user}:${pass}`).toString("base64");

  // Si no se envía la cabecera → pedir login
  if (!auth || !auth.startsWith("Basic ")) {
    return unauthorized();
  }

  const value = auth.slice(6).trim();

  // 🔒 Comparación segura compatible con Edge Runtime
  function safeEqual(a: string, b: string) {
    if (a.length !== b.length) return false;
    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return result === 0;
  }

  const valid = safeEqual(value, expected);

  if (!valid) {
    return unauthorized();
  }

  return NextResponse.next();
}

// 🔐 Helper para respuesta 401
function unauthorized() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Protected", charset="UTF-8"',
    },
  });
}

// Aplicar middleware globalmente (excepto estáticos)
export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
