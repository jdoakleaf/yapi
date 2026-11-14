/**
 * Güvenlik testleri: Parola hash ve doğrulama (scrypt, timing-safe)
 */
import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "@/lib/auth/password";

describe("Parola Hash Güvenlik Testleri", () => {
  describe("hashPassword", () => {
    it("hash boş olmamalı", () => {
      const hash = hashPassword("GucluParola123!");
      expect(hash).toBeTruthy();
      expect(hash.length).toBeGreaterThan(0);
    });

    it("hash 'salt:hash' formatında olmalı", () => {
      const hash = hashPassword("test1234");
      expect(hash).toContain(":");
      const parts = hash.split(":");
      expect(parts).toHaveLength(2);
      expect(parts[0].length).toBeGreaterThan(0); // salt
      expect(parts[1].length).toBeGreaterThan(0); // hash
    });

    it("aynı parola iki kez hashlenince farklı sonuç vermeli (salt)", () => {
      const h1 = hashPassword("AyniParola!");
      const h2 = hashPassword("AyniParola!");
      expect(h1).not.toBe(h2);
    });

    it("boş string hashlenebilmeli", () => {
      expect(() => hashPassword("")).not.toThrow();
    });
  });

  describe("verifyPassword", () => {
    it("doğru parola doğrulanmalı", () => {
      const password = "GucluParola123!";
      const hash = hashPassword(password);
      expect(verifyPassword(password, hash)).toBe(true);
    });

    it("yanlış parola reddedilmeli", () => {
      const hash = hashPassword("DogruParola");
      expect(verifyPassword("YanlisParola", hash)).toBe(false);
    });

    it("boş parola kayıtlı hash ile eşleşmemeli", () => {
      const hash = hashPassword("DogruParola");
      expect(verifyPassword("", hash)).toBe(false);
    });

    it("bozuk hash formatı false dönmeli (crash yok)", () => {
      expect(verifyPassword("parola", "bozukformat")).toBe(false);
      expect(verifyPassword("parola", ":")).toBe(false);
      expect(verifyPassword("parola", "")).toBe(false);
    });

    it("hash'i parola olarak verince false dönmeli", () => {
      const hash = hashPassword("parola");
      expect(verifyPassword(hash, hash)).toBe(false);
    });

    it("büyük/küçük harf farkı reddedilmeli", () => {
      const hash = hashPassword("Parola123");
      expect(verifyPassword("parola123", hash)).toBe(false);
      expect(verifyPassword("PAROLA123", hash)).toBe(false);
    });

    it("unicode karakter desteği", () => {
      const password = "şifrem123İ";
      const hash = hashPassword(password);
      expect(verifyPassword(password, hash)).toBe(true);
      expect(verifyPassword("sifrem123I", hash)).toBe(false);
    });
  });
});
