/**
 * Güvenlik testleri: Upload doğrulama (MIME allowlist, boyut limiti, uzantı eşleşmesi)
 */
import { describe, it, expect } from "vitest";
import {
  validateUpload,
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE,
} from "@/lib/media/storage";

// Test yardımcıları
const mb = (n: number) => Buffer.alloc(n * 1024 * 1024);
const kb = (n: number) => Buffer.alloc(n * 1024);

describe("Upload Güvenlik Testleri", () => {
  describe("MIME türü kontrolü", () => {
    it("izin verilen MIME türleri geçmeli", () => {
      for (const mime of ALLOWED_MIME_TYPES) {
        // uzantıyı MIME'den türet
        const ext = mime.split("/")[1].replace("jpeg", "jpg").replace("svg+xml", "svg");
        const result = validateUpload(kb(1), `test.${ext}`, mime);
        expect(result.valid, `${mime} geçmeli`).toBe(true);
      }
    });

    it("executable türler reddedilmeli", () => {
      const dangerous = [
        ["application/x-executable", "file.exe"],
        ["application/x-sh", "script.sh"],
        ["text/javascript", "code.js"],
        ["application/x-php", "hack.php"],
        ["application/octet-stream", "binary.bin"],
        ["text/html", "page.html"],
      ];
      for (const [mime, filename] of dangerous) {
        const result = validateUpload(kb(1), filename, mime);
        expect(result.valid, `${mime} reddedilmeli`).toBe(false);
        expect(result.error).toBeDefined();
      }
    });

    it("MIME/uzantı uyumsuzluğu reddedilmeli", () => {
      // .png uzantısı ama MIME jpeg
      const result = validateUpload(kb(1), "photo.png", "image/jpeg");
      expect(result.valid).toBe(false);
      expect(result.error).toMatch(/uzantı/i);
    });

    it(".jpg uzantısı ile image/jpeg kabul edilmeli", () => {
      const result = validateUpload(kb(1), "photo.jpg", "image/jpeg");
      expect(result.valid).toBe(true);
    });

    it("PDF kabul edilmeli", () => {
      const result = validateUpload(kb(500), "contract.pdf", "application/pdf");
      expect(result.valid).toBe(true);
    });
  });

  describe("Dosya boyutu kontrolü", () => {
    it(`${MAX_FILE_SIZE / 1024 / 1024} MB limitin altındaki dosyalar geçmeli`, () => {
      const result = validateUpload(mb(5), "image.jpg", "image/jpeg");
      expect(result.valid).toBe(true);
    });

    it("Tam 10 MB sınır geçmeli", () => {
      const result = validateUpload(mb(10), "image.jpg", "image/jpeg");
      expect(result.valid).toBe(true);
    });

    it("10 MB limitini 1 byte bile aşarsa reddedilmeli", () => {
      const oversized = Buffer.alloc(MAX_FILE_SIZE + 1);
      const result = validateUpload(oversized, "big.jpg", "image/jpeg");
      expect(result.valid).toBe(false);
      expect(result.error).toMatch(/MB/i);
    });

    it("0 byte dosya MIME geçerliyse kabul edilmeli", () => {
      const result = validateUpload(Buffer.alloc(0), "empty.png", "image/png");
      expect(result.valid).toBe(true);
    });
  });

  describe("ALLOWED_MIME_TYPES set bütünlüğü", () => {
    it("tehlikeli türler izin listesinde olmamalı", () => {
      const dangerous = [
        "text/html",
        "application/javascript",
        "application/x-executable",
        "application/x-sh",
        "image/svg", // svg+xml olmalı
      ];
      for (const mime of dangerous) {
        expect(ALLOWED_MIME_TYPES.has(mime), `${mime} izin listesinde olmamalı`).toBe(false);
      }
    });

    it("image/svg+xml izin listesinde olmalı", () => {
      expect(ALLOWED_MIME_TYPES.has("image/svg+xml")).toBe(true);
    });
  });
});
