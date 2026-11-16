/**
 * src/lib/media/actions.ts
 * Medya kütüphanesi server actions — upload, list, delete.
 */

"use server";

import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth/rbac";
import {
  getStorageAdapter,
  validateUpload,
  ALLOWED_MIME_TYPES,
} from "@/lib/media/storage";
import { buildPaginatedResponse, parsePagination } from "@/lib/cms/pagination";
import type { Prisma } from "@prisma/client";

// ─── UPLOAD ──────────────────────────────────────────────────────────────────

export interface UploadMediaInput {
  file: Buffer;
  filename: string;
  mimeType: string;
  altText?: string;
  title?: string;
}

export async function uploadMedia(input: UploadMediaInput) {
  const session = await requireRole("editor");

  const { valid, error } = validateUpload(
    input.file,
    input.filename,
    input.mimeType
  );
  if (!valid) return { error };

  const adapter = getStorageAdapter();
  const result = await adapter.upload(
    input.file,
    input.filename,
    input.mimeType
  );

  const media = await prisma.media.create({
    data: {
      storageKey: result.key,
      originalFilename: result.originalName,
      mimeType: result.mimeType,
      fileSize: result.size,
      altText: input.altText ?? null,
      title: input.title ?? null,
      uploadedBy: session.user.id,
    },
  });

  return { media, url: result.url };
}

// ─── LIST ─────────────────────────────────────────────────────────────────────

export interface ListMediaInput {
  page?: number;
  pageSize?: number;
  search?: string;
  mimeType?: string;
}

export async function listMedia(input: ListMediaInput = {}) {
  await requireRole("viewer");

  const pg = parsePagination(input, { pageSize: 24 });

  const where: Prisma.MediaWhereInput = {};
  if (input.search) {
    where.OR = [
      { originalFilename: { contains: input.search } },
      { altText: { contains: input.search } },
      { title: { contains: input.search } },
    ];
  }
  if (input.mimeType) {
    where.mimeType = { startsWith: input.mimeType };
  }

  const [items, total] = await Promise.all([
    prisma.media.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: pg.skip,
      take: pg.take,
      include: { uploader: { select: { id: true, name: true } } },
    }),
    prisma.media.count({ where }),
  ]);

  return buildPaginatedResponse(items, total, pg);
}

// ─── DELETE ───────────────────────────────────────────────────────────────────

export async function deleteMedia(mediaId: string) {
  await requireRole("editor");

  const media = await prisma.media.findUnique({ where: { id: mediaId } });
  if (!media) return { error: "Medya bulunamadı." };

  // Kullanım kontrolü
  const usageCount = await prisma.projectMedia.count({ where: { mediaId } });
  if (usageCount > 0) {
    return {
      error: `Bu medya ${usageCount} projede kullanılıyor. Önce ilişkileri kaldırın.`,
    };
  }

  const adapter = getStorageAdapter();
  await adapter.delete(media.storageKey);

  await prisma.media.delete({ where: { id: mediaId } });

  return { success: true };
}

// ─── UPDATE ───────────────────────────────────────────────────────────────────

export async function updateMediaAltText(
  mediaId: string,
  altText: string,
  title?: string
) {
  await requireRole("editor");

  const media = await prisma.media.update({
    where: { id: mediaId },
    data: { altText, title: title ?? null },
  });

  return { media };
}

export { ALLOWED_MIME_TYPES };
