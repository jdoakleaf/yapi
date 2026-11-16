/**
 * src/lib/auth/config.ts
 * Auth.js (NextAuth v5) yapılandırması.
 * PrismaAdapter + Credentials provider.
 */

import { PrismaAdapter } from "@auth/prisma-adapter";
import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/auth/password";
import "@/lib/auth/types";

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 saat
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "E-posta", type: "email" },
        password: { label: "Parola", type: "password" },
      },
      async authorize(credentials) {
        if (
          !credentials?.email ||
          !credentials?.password ||
          typeof credentials.email !== "string" ||
          typeof credentials.password !== "string"
        ) {
          return null;
        }

        const email = credentials.email.toLowerCase().trim();

        // Kullanıcıyı ve rollerini getir
        const user = await prisma.user.findUnique({
          where: { email },
          include: {
            userRoles: {
              include: { role: true },
            },
          },
        });

        if (!user || !user.passwordHash || !user.isActive) {
          return null;
        }

        const isValid = verifyPassword(credentials.password, user.passwordHash);
        if (!isValid) {
          return null;
        }

        // İlk rolü al (en yüksek yetkili)
        const primaryRole = user.userRoles[0]?.role?.key ?? "viewer";

        // Son giriş zamanını güncelle
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        // Audit log
        await prisma.auditLog.create({
          data: {
            userId: user.id,
            action: "LOGIN",
            entityType: "User",
            entityId: user.id,
            metadataJson: { email: user.email },
          },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: primaryRole,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "viewer";
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
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
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  trustHost: true,
};
