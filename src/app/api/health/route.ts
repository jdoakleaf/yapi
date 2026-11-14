import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * GET /api/health
 * Uygulama ve veritabanı sağlık kontrolü.
 * Yük dengeleyici / uptime monitörü için kullanılır.
 */
export async function GET() {
  const start = Date.now();
  const checks: Record<string, { status: "ok" | "error"; latencyMs?: number; detail?: string }> =
    {};

  // DB sağlık kontrolü
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = { status: "ok", latencyMs: Date.now() - start };
  } catch (err) {
    checks.database = {
      status: "error",
      detail: err instanceof Error ? err.message : "DB bağlantı hatası",
    };
  }

  // Ortam değişkeni kontrolleri
  const requiredEnvs = ["DATABASE_URL", "AUTH_SECRET", "NEXT_PUBLIC_APP_URL"];
  const missingEnvs = requiredEnvs.filter((k) => !process.env[k]);
  checks.environment = missingEnvs.length === 0
    ? { status: "ok" }
    : { status: "error", detail: `Eksik env: ${missingEnvs.join(", ")}` };

  const allOk = Object.values(checks).every((c) => c.status === "ok");
  const statusCode = allOk ? 200 : 503;

  return NextResponse.json(
    {
      status: allOk ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      checks,
      version: process.env.APP_VERSION ?? "0.1.0",
    },
    { status: statusCode },
  );
}
