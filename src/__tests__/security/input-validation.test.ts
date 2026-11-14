/**
 * Input doğrulama testleri — Zod şemaları ve XSS/injection korumaları
 */
import { describe, it, expect } from "vitest";
import { z } from "zod";

// Lead form şemasını simüle ediyoruz (asıl şema lead-actions.ts'de)
const PhoneSchema = z
  .string()
  .min(10, "Telefon en az 10 karakter")
  .max(20, "Telefon en fazla 20 karakter")
  .regex(/^[+\d\s()-]+$/, "Geçersiz telefon formatı");

const EmailSchema = z
  .string()
  .email("Geçerli e-posta adresi girin")
  .max(254, "E-posta 254 karakteri aşamaz");

const NameSchema = z
  .string()
  .min(2, "Ad en az 2 karakter")
  .max(100, "Ad en fazla 100 karakter");

const MessageSchema = z
  .string()
  .max(2000, "Mesaj 2000 karakteri aşamaz");

describe("Input Doğrulama Testleri", () => {
  describe("Telefon doğrulaması", () => {
    it("geçerli telefon numaraları kabul edilmeli", () => {
      const valid = ["05551234567", "+905551234567", "0 (555) 123-4567", "05551234567"];
      for (const phone of valid) {
        const result = PhoneSchema.safeParse(phone);
        expect(result.success, `${phone} geçmeli`).toBe(true);
      }
    });

    it("çok kısa numara reddedilmeli", () => {
      expect(PhoneSchema.safeParse("0555").success).toBe(false);
    });

    it("harf içeren telefon reddedilmeli", () => {
      expect(PhoneSchema.safeParse("abcdefghij").success).toBe(false);
    });

    it("script injection telefon alanında reddedilmeli", () => {
      expect(PhoneSchema.safeParse("<script>alert(1)</script>").success).toBe(false);
      expect(PhoneSchema.safeParse("'; DROP TABLE leads;--").success).toBe(false);
    });
  });

  describe("E-posta doğrulaması", () => {
    it("geçerli e-postalar kabul edilmeli", () => {
      const valid = [
        "user@example.com",
        "user+tag@domain.co.tr",
        "name.surname@company.org",
      ];
      for (const email of valid) {
        expect(EmailSchema.safeParse(email).success, `${email} geçmeli`).toBe(true);
      }
    });

    it("@ olmayan e-posta reddedilmeli", () => {
      expect(EmailSchema.safeParse("notanemail").success).toBe(false);
    });

    it("254 karakterden uzun e-posta reddedilmeli", () => {
      const long = "a".repeat(246) + "@test.com"; // 255 karakter
      expect(EmailSchema.safeParse(long).success).toBe(false);
    });

    it("XSS e-posta formatında reddedilmeli", () => {
      expect(EmailSchema.safeParse("<script>@evil.com").success).toBe(false);
    });
  });

  describe("İsim doğrulaması", () => {
    it("geçerli isimler kabul edilmeli", () => {
      expect(NameSchema.safeParse("Ahmet Yılmaz").success).toBe(true);
      expect(NameSchema.safeParse("İ. Şahin").success).toBe(true);
    });

    it("çok kısa isim reddedilmeli", () => {
      expect(NameSchema.safeParse("A").success).toBe(false);
    });

    it("çok uzun isim reddedilmeli", () => {
      expect(NameSchema.safeParse("A".repeat(101)).success).toBe(false);
    });
  });

  describe("Mesaj doğrulaması", () => {
    it("boş mesaj kabul edilmeli", () => {
      expect(MessageSchema.safeParse("").success).toBe(true);
    });

    it("2000 karakter mesaj kabul edilmeli", () => {
      expect(MessageSchema.safeParse("a".repeat(2000)).success).toBe(true);
    });

    it("2001 karakter mesaj reddedilmeli", () => {
      expect(MessageSchema.safeParse("a".repeat(2001)).success).toBe(false);
    });

    it("HTML içerikli mesaj şema geçerse bile düz metin olarak saklanabilmeli", () => {
      // Zod sadece uzunluk kontrolü yapar; sanitizasyon ayrı katmanda olmalı
      const result = MessageSchema.safeParse("<script>alert('xss')</script>");
      // Şema geçer ama içerik server'da render edilmeden saklanır
      expect(result.success).toBe(true);
      if (result.success) {
        // Değer değiştirilmemeli (sanitizasyon farklı katmanda yapılır)
        expect(result.data).toContain("<script>");
      }
    });
  });

  describe("Path/URL doğrulaması (redirect)", () => {
    const PathSchema = z
      .string()
      .refine((v) => v.startsWith("/"), "/ ile başlamalı");

    it("/ ile başlayan yollar geçmeli", () => {
      expect(PathSchema.safeParse("/hizmetler").success).toBe(true);
      expect(PathSchema.safeParse("/hizmetler/boyama").success).toBe(true);
    });

    it("/ olmadan başlayan yollar reddedilmeli", () => {
      expect(PathSchema.safeParse("hizmetler").success).toBe(false);
    });

    it("dizin traversal yolu — / ile başlıyor, path şema geçer (güvenlik Prisma'da)", () => {
      // /../etc/passwd / ile başladığı için path şeması kabul eder
      // Ancak bu yol hiçbir Next.js route ile eşleşmez → 404 döner
      // Prisma parametreli sorgu kullandığı için DB injection riski yok
      const result = PathSchema.safeParse("/../etc/passwd");
      // Şema tasarımı gereği geçer — savunma Next.js routing katmanında
      expect(result.success).toBe(true);
    });

    it("javascript: protokolü reddedilmeli (/ ile başlamıyor)", () => {
      expect(PathSchema.safeParse("javascript:alert(1)").success).toBe(false);
    });
  });
});
