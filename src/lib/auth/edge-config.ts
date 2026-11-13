/**
 * src/lib/auth/edge-config.ts
 * Edge Runtime için hafif Auth.js yapılandırması.
 * node:crypto veya Node.js-specific modül içermez.
 * Yalnızca session doğrulama / route koruma için kullanılır.
 */

import type { NextAuthConfig } from "next-auth";

export const edgeAuthConfig: NextAuthConfig = {
  providers: [], // Edge'de provider gerekmez — sadece session okuma
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isAdminRoute = pathname.startsWith("/admin");
      const isLoginPage = pathname === "/admin/login";

      if (isAdminRoute && !isLoginPage) {
        return !!auth?.user;
      }
      return true;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
};
