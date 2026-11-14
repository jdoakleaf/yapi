/**
 * Slug üretimi ve Türkçe karakter testleri
 */
import { describe, it, expect } from "vitest";
import { slugify } from "@/lib/cms/slug";

describe("Slug Üretimi Testleri", () => {
  describe("Temel slug dönüşümü", () => {
    it("boşlukları tire yapar", () => {
      expect(slugify("Merhaba Dünya")).toBe("merhaba-dunya");
    });

    it("büyük harf küçülür", () => {
      expect(slugify("BÜYÜK HARFLER")).toBe("buyuk-harfler");
    });

    it("çift tire tekile indirilmeli", () => {
      expect(slugify("bir  iki   üç")).toBe("bir-iki-uc");
    });

    it("başındaki ve sonundaki tire kaldırılmalı", () => {
      expect(slugify("  test  ")).toBe("test");
    });
  });

  describe("Türkçe karakter dönüşümü", () => {
    const cases: [string, string][] = [
      ["çatı kaplama", "cati-kaplama"],
      ["ışıklı görsel", "isikli-gorsel"],
      ["şantiye yönetimi", "santiye-yonetimi"],
      ["üretim üssü", "uretim-ussu"],
      ["İzmir inşaat", "izmir-insaat"],
      ["Ğ harfi", "g-harfi"],
    ];

    for (const [input, expected] of cases) {
      it(`"${input}" → "${expected}"`, () => {
        expect(slugify(input)).toBe(expected);
      });
    }
  });

  describe("Özel karakter filtreleme (XSS / injection önleme)", () => {
    it("HTML etiketleri kaldırılmalı (< > kaldırılır, içerik kalır)", () => {
      // Slug fonksiyonu < > karakterlerini kaldırır ama alfanümerik içeriği korur
      // Bu davranış doğrudur: sluglar DB'ye Prisma ile parametre olarak geçer (SQL injection koruması Prisma'da)
      const result = slugify("<script>alert('xss')</script>");
      expect(result).not.toContain("<");
      expect(result).not.toContain(">");
      expect(result).not.toContain("'");
      // "script" kelimesi alfanümerik olduğu için kalabilir — slug sisteminin görevi değil XSS önleme
    });

    it("SQL özel karakterleri kaldırılmalı (tire kalır — normal slug karakteri)", () => {
      // '; -- => özel karakterler kaldırılır, kelimeler tire ile birleşir
      // "-" slug için geçerli karakter, kaldırılmaz
      const result = slugify("'; DROP TABLE users;--");
      expect(result).not.toContain("'");
      expect(result).not.toContain(";");
      // Tire geçerli slug karakteri — Prisma parametreli sorgu kullandığı için SQL injection riski yok
      expect(result).toMatch(/^[a-z0-9-]+$/);
    });

    it("URL özel karakterleri kaldırılmalı", () => {
      const result = slugify("test?foo=bar&baz=qux#anchor");
      expect(result).not.toMatch(/[?=&#]/);
    });

    it("dizin traversal girişimi kaldırılmalı", () => {
      const result = slugify("../../etc/passwd");
      expect(result).not.toContain("..");
      expect(result).not.toContain("/");
    });

    it("null byte ve kontrol karakterleri kaldırılmalı", () => {
      const result = slugify("test\x00hack\x1F");
      expect(result).toBe("testhack");
    });

    it("sadece özel karakter → boş string", () => {
      expect(slugify("!!!@@@###")).toBe("");
    });
  });

  describe("Edge case'ler", () => {
    it("boş string boş string döner", () => {
      expect(slugify("")).toBe("");
    });

    it("sadece boşluk boş string döner", () => {
      expect(slugify("   ")).toBe("");
    });

    it("sayılar korunur", () => {
      expect(slugify("12 Katlı Bina 2024")).toBe("12-katli-bina-2024");
    });

    it("çok uzun metin kesilmez (sadece dönüştürülür)", () => {
      const long = "a".repeat(200);
      expect(slugify(long)).toBe(long);
    });
  });
});
