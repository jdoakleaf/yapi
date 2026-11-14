/**
 * src/app/api/media/upload/route.ts
 * Medya upload endpoint — multipart/form-data.
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getStorageAdapter, validateUpload } from "@/lib/media/storage";
import { prisma } from "@/lib/db";

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Geçersiz form verisi." }, { status: 400 });
  }

  const fileEntry = formData.get("file");
  if (!fileEntry || typeof fileEntry === "string") {
    return NextResponse.json(
      { error: "Dosya bulunamadı. 'file' alanı gereklidir." },
      { status: 400 }
    );
  }

  const file = fileEntry as File;
  const buffer = Buffer.from(await file.arrayBuffer());
  const mimeType = file.type;
  const filename = file.name;
  const altText = formData.get("altText")?.toString() ?? undefined;
  const title = formData.get("title")?.toString() ?? undefined;

  const { valid, error } = validateUpload(buffer, filename, mimeType);
  if (!valid) {
    return NextResponse.json({ error }, { status: 422 });
  }

  const adapter = getStorageAdapter();
  const result = await adapter.upload(buffer, filename, mimeType);

  const media = await prisma.media.create({
    data: {
      storageKey: result.key,
      originalFilename: result.originalName,
      mimeType: result.mimeType,
      fileSize: result.size,
      altText: altText ?? null,
      title: title ?? null,
      uploadedBy: session.user.id,
    },
  });

  return NextResponse.json({ media, url: result.url }, { status: 201 });
}

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const pageSize = Math.min(100, Number(searchParams.get("pageSize")) || 24);
  const search = searchParams.get("search") ?? undefined;
  const mimeType = searchParams.get("mimeType") ?? undefined;

  const where = {
    ...(search
      ? {
          OR: [
            { originalFilename: { contains: search, mode: "insensitive" as const } },
            { altText: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(mimeType ? { mimeType: { startsWith: mimeType } } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.media.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.media.count({ where }),
  ]);

  return NextResponse.json({
    items,
    pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
  });
}
