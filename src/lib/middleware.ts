// src/middleware.ts (solo para desarrollo)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";
  const isLocal = /(localhost|127\.0\.0\.1)(:\d+)?$/i.test(host);
  if (isLocal) {
    // bypass total en local
    return NextResponse.next();
  }
  return NextResponse.next();
}

export const config = { matcher: ["/((?!_next/static|_next/image).*)"] };
