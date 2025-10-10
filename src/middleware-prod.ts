import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";

  // Libre SOLO en local
  const isLocal = /(localhost|127\.0\.0\.1)(:\d+)?$/i.test(host);
  if (isLocal) return NextResponse.next();

  const { pathname } = req.nextUrl;

  // Permitir estáticos/health sin auth
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

  // Basic Auth para TODO lo demás (prod + preview + cualquier host no local)
  const user = process.env.BASIC_AUTH_USER || "";
  const pass = process.env.BASIC_AUTH_PASS || "";
  if (!user || !pass) {
    return new NextResponse("Basic auth not configured", { status: 500 });
  }

  const auth = req.headers.get("authorization");
  const expected = Buffer.from(`${user}:${pass}`).toString("base64");

  if (!auth || !auth.startsWith("Basic ")) {
    return unauthorized();
  }

  const value = auth.slice(6).trim();

  // Comparación constante compatible con Edge
  function safeEqual(a: string, b: string) {
    if (a.length !== b.length) return false;
    let res = 0;
    for (let i = 0; i < a.length; i++) res |= a.charCodeAt(i) ^ b.charCodeAt(i);
    return res === 0;
  }

  const valid = safeEqual(value, expected);
  if (!valid) return unauthorized();

  return NextResponse.next();
}

function unauthorized() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Protected", charset="UTF-8"' },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
