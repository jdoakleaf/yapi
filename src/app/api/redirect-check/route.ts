import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * GET /api/redirect-check?path=/eski-sayfa
 * Verilen yola aktif bir yönlendirme varsa {destination, statusCode} döner.
 * Middleware'den çağrılır (Edge uyumlu basit fetch).
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path");

  if (!path) {
    return NextResponse.json({ redirect: null }, { status: 400 });
  }

  try {
    const redirect = await prisma.redirect.findFirst({
      where: { sourcePath: path, isActive: true },
      select: { destinationPath: true, httpStatus: true },
    });

    if (!redirect) {
      return NextResponse.json({ redirect: null });
    }

    return NextResponse.json({
      redirect: {
        destination: redirect.destinationPath,
        statusCode: redirect.httpStatus === "REDIRECT_301" ? 301 : 302,
      },
    });
  } catch {
    return NextResponse.json({ redirect: null }, { status: 500 });
  }
}
