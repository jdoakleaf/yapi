/**
 * Tema renk doğrulama ve WCAG kontrast testleri
 */
import { describe, it, expect } from "vitest";
import {
  generateCssVariables,
  checkWcagAA,
  getContrastRatio,
  DEFAULT_THEME,
  ThemeTokensSchema,
} from "@/lib/settings/theme-utils";

describe("Tema Doğrulama Testleri", () => {
  describe("ThemeTokensSchema — HEX renk doğrulaması", () => {
    it("geçerli theme kabul edilmeli", () => {
      const result = ThemeTokensSchema.safeParse(DEFAULT_THEME);
      expect(result.success).toBe(true);
    });

    it("geçersiz HEX reddedilmeli", () => {
      const bad = { ...DEFAULT_THEME, brand_navy: "turuncu" };
      const result = ThemeTokensSchema.safeParse(bad);
      expect(result.success).toBe(false);
    });

    it("3 haneli HEX reddedilmeli (6 hane zorunlu)", () => {
      const bad = { ...DEFAULT_THEME, brand_primary: "#ABC" };
      const result = ThemeTokensSchema.safeParse(bad);
      expect(result.success).toBe(false);
    });

    it("# olmadan HEX reddedilmeli", () => {
      const bad = { ...DEFAULT_THEME, brand_accent: "1769AA" };
      const result = ThemeTokensSchema.safeParse(bad);
      expect(result.success).toBe(false);
    });

    it("turuncu (#FF6600 vb.) şema geçerse bile varsayılan tema turuncu içermemeli", () => {
      // Marka kuralı: varsayılan tema turuncu renk kullanmamalı
      const orangeShades = ["#FF6600", "#FF8800", "#FFA500", "#FF4500", "#FF7700"];
      for (const color of Object.values(DEFAULT_THEME)) {
        expect(orangeShades, `${color} turuncu olmamalı`).not.toContain(color);
      }
    });
  });

  describe("WCAG AA Kontrast testleri", () => {
    it("siyah (#000000) üzerinde beyaz (#FFFFFF) WCAG AA geçmeli", () => {
      const { passes, ratio } = checkWcagAA("#FFFFFF", "#000000");
      expect(passes).toBe(true);
      expect(ratio).toBeGreaterThanOrEqual(21);
    });

    it("çok benzer renkler WCAG AA geçmemeli", () => {
      const { passes } = checkWcagAA("#EEEEEE", "#FFFFFF");
      expect(passes).toBe(false);
    });

    it("varsayılan metni arka plan üzerinde WCAG AA geçmeli", () => {
      const { passes } = checkWcagAA(DEFAULT_THEME.text_primary, DEFAULT_THEME.surface);
      expect(passes).toBe(true);
    });

    it("kontrast oranı 1–21 arasında olmalı", () => {
      const ratio = getContrastRatio("#FFFFFF", "#000000");
      expect(ratio).toBeGreaterThanOrEqual(1);
      expect(ratio).toBeLessThanOrEqual(21);
    });
  });

  describe("generateCssVariables", () => {
    it(":root bloğu üretmeli", () => {
      const css = generateCssVariables(DEFAULT_THEME);
      expect(css).toContain(":root {");
      expect(css).toContain("}");
    });

    it("tüm token'ları içermeli", () => {
      const css = generateCssVariables(DEFAULT_THEME);
      expect(css).toContain("--brand-navy");
      expect(css).toContain("--brand-primary");
      expect(css).toContain("--brand-accent");
      expect(css).toContain("--brand-soft");
      expect(css).toContain("--surface");
      expect(css).toContain("--text-primary");
    });

    it("turuncu renk içermemeli (marka kuralı)", () => {
      const css = generateCssVariables(DEFAULT_THEME);
      // Turuncu hue aralığı: ~15-45 derece
      expect(css.toLowerCase()).not.toContain("ff6600");
      expect(css.toLowerCase()).not.toContain("ff8800");
      expect(css.toLowerCase()).not.toContain("ffa500");
    });

    it("token değerlerini HEX olarak içermeli", () => {
      const css = generateCssVariables(DEFAULT_THEME);
      expect(css).toContain(DEFAULT_THEME.brand_navy);
      expect(css).toContain(DEFAULT_THEME.brand_primary);
    });
  });
});
