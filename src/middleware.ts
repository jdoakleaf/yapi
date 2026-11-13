/**
 * src/middleware.ts
 * Admin route'larını korur — Edge Runtime uyumlu.
 * Ağır Node.js modülleri (crypto, prisma) içermeyen edge-config kullanır.
 */

import NextAuth from "next-auth";
import { edgeAuthConfig } from "@/lib/auth/edge-config";

export const { auth: middleware } = NextAuth(edgeAuthConfig);

export default middleware;

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
