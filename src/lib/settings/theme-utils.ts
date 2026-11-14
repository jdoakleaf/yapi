/**
 * Tema yardımcı fonksiyonları — saf (pure), asenkron değil.
 * Hem server hem client tarafından import edilebilir.
 */

import { z } from "zod/v4";

const HexColor = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, "Geçerli bir HEX renk girin (#RRGGBB)");

export const ThemeTokensSchema = z.object({
  brand_navy: HexColor,
  brand_primary: HexColor,
  brand_accent: HexColor,
  brand_soft: HexColor,
  surface: HexColor,
  surface_muted: HexColor,
  text_primary: HexColor,
  text_muted: HexColor,
  border: HexColor,
});

export type ThemeTokens = z.infer<typeof ThemeTokensSchema>;

export const DEFAULT_THEME: ThemeTokens = {
  brand_navy: "#101F33",
  brand_primary: "#1769AA",
  brand_accent: "#2589D8",
  brand_soft: "#DCEEFF",
  surface: "#FFFFFF",
  surface_muted: "#F4F8FC",
  text_primary: "#182433",
  text_muted: "#657386",
  border: "#E2E8F0",
};

function getLuminance(hex: string): number {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;
  const toLinear = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

export function getContrastRatio(hex1: string, hex2: string): number {
  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function checkWcagAA(
  foreground: string,
  background: string
): { passes: boolean; ratio: number } {
  const ratio = getContrastRatio(foreground, background);
  return { passes: ratio >= 4.5, ratio: Math.round(ratio * 100) / 100 };
}

export function generateCssVariables(tokens: ThemeTokens): string {
  const lines = [
    `  --brand-navy: ${tokens.brand_navy};`,
    `  --brand-primary: ${tokens.brand_primary};`,
    `  --brand-accent: ${tokens.brand_accent};`,
    `  --brand-soft: ${tokens.brand_soft};`,
    `  --surface: ${tokens.surface};`,
    `  --surface-muted: ${tokens.surface_muted};`,
    `  --text-primary: ${tokens.text_primary};`,
    `  --text-muted: ${tokens.text_muted};`,
    `  --border: ${tokens.border};`,
  ];
  return `:root {\n${lines.join("\n")}\n}`;
}
