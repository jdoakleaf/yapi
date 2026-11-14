/**
 * src/middleware.ts
 * Admin route'larını korur — Edge Runtime uyumlu.
 * Ağır Node.js modülleri (crypto, prisma) içermeyen edge-config kullanır.
 *
 * Ek: Public sayfalar için DB redirect lookup (via /api/redirect-check endpoint).
 */

import NextAuth from "next-auth";
import { edgeAuthConfig } from "@/lib/auth/edge-config";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const { auth } = NextAuth(edgeAuthConfig);

// Admin koruma middleware'i (NextAuth)
const adminMiddleware = auth;

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin route'ları: NextAuth middleware'ine devret
  if (pathname.startsWith("/admin")) {
    // @ts-expect-error NextAuth middleware dönen tipi uyumsuz olabilir
    return adminMiddleware(request as Parameters<typeof adminMiddleware>[0]);
  }

  // /api/ ve /_next/ için redirect kontrolü yapma
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/uploads/") ||
    /\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Public sayfalar için redirect kontrolü
  try {
    const baseUrl = request.nextUrl.origin;
    const checkUrl = `${baseUrl}/api/redirect-check?path=${encodeURIComponent(pathname)}`;
    const res = await fetch(checkUrl, {
      headers: { "x-middleware-redirect-check": "1" },
    });

    if (res.ok) {
      const data = (await res.json()) as {
        redirect: { destination: string; statusCode: number } | null;
      };
      if (data.redirect) {
        const { destination, statusCode } = data.redirect;
        const redirectUrl = destination.startsWith("http")
          ? destination
          : new URL(destination, request.nextUrl.origin).toString();
        return NextResponse.redirect(redirectUrl, { status: statusCode });
      }
    }
  } catch {
    // Redirect check başarısız olsa bile sayfaya devam et
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
