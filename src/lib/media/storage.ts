/**
 * src/lib/media/storage.ts
 * Medya depolama adaptörü — LOCAL ve S3 soyutlaması.
 * Üretimde STORAGE_PROVIDER=s3 ile S3'e geçilir.
 */

import path from "node:path";
import fs from "node:fs/promises";
import { randomUUID } from "node:crypto";

// İzin verilen MIME türleri
export const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "application/pdf",
]);

// Dosya uzantısı → MIME eşlemesi
const EXT_TO_MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  svg: "image/svg+xml",
  pdf: "application/pdf",
};

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export interface UploadResult {
  key: string;       // Depolama anahtarı (path veya S3 key)
  url: string;       // Public erişim URL'i
  size: number;      // Byte cinsinden boyut
  mimeType: string;
  originalName: string;
  width?: number;
  height?: number;
}

export interface StorageAdapter {
  upload(file: Buffer, filename: string, mimeType: string): Promise<UploadResult>;
  delete(key: string): Promise<void>;
  getUrl(key: string): string;
}

// ─── LOCAL ADAPTER ──────────────────────────────────────────────────────────

class LocalStorageAdapter implements StorageAdapter {
  private uploadDir: string;
  private baseUrl: string;

  constructor() {
    this.uploadDir = path.join(process.cwd(), "public", "uploads");
    this.baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  }

  async upload(
    file: Buffer,
    filename: string,
    mimeType: string
  ): Promise<UploadResult> {
    await fs.mkdir(this.uploadDir, { recursive: true });

    const ext = filename.split(".").pop()?.toLowerCase() ?? "bin";
    const safeName = `${randomUUID()}.${ext}`;
    const filePath = path.join(/*turbopackIgnore: true*/ this.uploadDir, safeName);

    await fs.writeFile(filePath, file);

    return {
      key: `uploads/${safeName}`,
      url: `${this.baseUrl}/uploads/${safeName}`,
      size: file.length,
      mimeType,
      originalName: filename,
    };
  }

  async delete(key: string): Promise<void> {
    const filePath = path.join(process.cwd(), "public", key);
    try {
      await fs.unlink(filePath);
    } catch (e) {
      // Dosya zaten silinmişse yoksay
      if ((e as NodeJS.ErrnoException).code !== "ENOENT") throw e;
    }
  }

  getUrl(key: string): string {
    const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    return `${base}/${key}`;
  }
}

// ─── ADAPTER FACTORY ─────────────────────────────────────────────────────────

function createStorageAdapter(): StorageAdapter {
  const provider = process.env.STORAGE_PROVIDER ?? "local";

  if (provider === "s3") {
    // S3 adapter Faz 14'te eklenecek
    throw new Error("S3 storage adapter henüz implement edilmedi.");
  }

  return new LocalStorageAdapter();
}

// Singleton
let _adapter: StorageAdapter | null = null;
export function getStorageAdapter(): StorageAdapter {
  if (!_adapter) _adapter = createStorageAdapter();
  return _adapter;
}

// ─── DOĞRULAMA ────────────────────────────────────────────────────────────────

export function validateUpload(
  file: Buffer,
  filename: string,
  mimeType: string
): { valid: boolean; error?: string } {
  if (file.length > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `Dosya boyutu ${MAX_FILE_SIZE / 1024 / 1024} MB limitini aşıyor.`,
    };
  }

  if (!ALLOWED_MIME_TYPES.has(mimeType)) {
    return {
      valid: false,
      error: `İzin verilmeyen dosya türü: ${mimeType}. İzin verilenler: ${[...ALLOWED_MIME_TYPES].join(", ")}`,
    };
  }

  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  const expectedMime = EXT_TO_MIME[ext];
  if (expectedMime && expectedMime !== mimeType) {
    return {
      valid: false,
      error: "Dosya uzantısı ile MIME türü eşleşmiyor.",
    };
  }

  return { valid: true };
}
