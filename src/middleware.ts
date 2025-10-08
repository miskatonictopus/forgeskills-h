// src/middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// ⚠️ Ajusta las rutas públicas y las que quieres proteger
// Este matcher EXCLUYE estáticos, API, auth y login/signup.
export const config = {
  matcher: [
    // Todo menos assets, API, login/signup y estáticos comunes
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|api/|login|signup|public/).*)",
  ],
};

export default function middleware(req: NextRequest) {
  try {
  
    

    // ✅ Ejemplo de protección vasica de /dashboard
    // (Si tienes tu propio check de sesión, colócalo aquí)
    // const hasSession = Boolean(req.cookies.get("fs_session")?.value);
    // if (pathname.startsWith("/dashboard") && !hasSession) {
    //   const url = req.nextUrl.clone();
    //   url.pathname = "/login";
    //   url.searchParams.set("next", pathname);
    //   return NextResponse.redirect(url);
    // }

    return NextResponse.next();
  } catch (err) {
    // Fail-soft: nunca caigas en 500; deja pasar la petición
    // Puedes loguear en Vercel Logs con console.error
    console.error("Middleware error:", err);
    return NextResponse.next();
  }
}
