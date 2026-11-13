"use server";

/**
 * src/app/admin/login/actions.ts
 * Login server action — rate limiting + audit log.
 */

import { signIn, signOut } from "@/lib/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";

// Basit in-memory rate limiter (üretimde Redis kullanın)
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 dakika

function getRateLimitKey(ip: string, email: string) {
  return `${ip}:${email}`;
}

function checkRateLimit(key: string): { allowed: boolean } {
  const now = Date.now();
  const record = loginAttempts.get(key);

  if (!record || now > record.resetAt) {
    loginAttempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true };
  }

  if (record.count >= MAX_ATTEMPTS) {
    return { allowed: false };
  }

  record.count++;
  return { allowed: true };
}

function resetRateLimit(key: string) {
  loginAttempts.delete(key);
}

export async function loginAction(_prev: unknown, formData: FormData): Promise<{ error: string } | undefined> {
  const email = formData.get("email")?.toString().toLowerCase().trim() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  if (!email || !password) {
    return { error: "E-posta ve parola gereklidir." };
  }

  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headersList.get("x-real-ip") ??
    "unknown";

  const rateLimitKey = getRateLimitKey(ip, email);
  const { allowed } = checkRateLimit(rateLimitKey);

  if (!allowed) {
    await prisma.auditLog.create({
      data: {
        action: "LOGIN_RATE_LIMITED",
        entityType: "User",
        entityId: "unknown",
        metadataJson: { email, ip },
      },
    });
    return {
      error: "Çok fazla başarısız deneme. 15 dakika sonra tekrar deneyin.",
    };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    resetRateLimit(rateLimitKey);
  } catch (error) {
    if (error instanceof AuthError) {
      await prisma.auditLog.create({
        data: {
          action: "LOGIN_FAILED",
          entityType: "User",
          entityId: "unknown",
          metadataJson: { email, ip, reason: error.type },
        },
      });
      return { error: "E-posta veya parola hatalı." };
    }
    throw error;
  }

  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await signOut({ redirect: false });
  redirect("/admin/login");
}
