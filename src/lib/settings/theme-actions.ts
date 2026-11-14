"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth/rbac";
import { Prisma } from "@prisma/client";
import {
  ThemeTokensSchema,
  ThemeTokens,
  DEFAULT_THEME,
  checkWcagAA,
} from "@/lib/settings/theme-utils";

const THEME_KEY = "colors";

/** Mevcut tema token'larını getir */
export async function getThemeTokens(): Promise<ThemeTokens> {
  const row = await prisma.themeSetting.findUnique({
    where: { themeKey: THEME_KEY },
  });

  if (!row || !row.tokensJson || typeof row.tokensJson !== "object") {
    return { ...DEFAULT_THEME };
  }

  return { ...DEFAULT_THEME, ...(row.tokensJson as Partial<ThemeTokens>) };
}

export type SaveThemeResult = {
  success: boolean;
  errors?: Partial<Record<keyof ThemeTokens, string>>;
  contrastWarnings?: string[];
  error?: string;
};

/** Tema token'larını kaydet */
export async function saveThemeTokens(
  tokens: Partial<ThemeTokens>
): Promise<SaveThemeResult> {
  try {
    await requireAuth();

    const current = await getThemeTokens();
    const merged = { ...current, ...tokens };

    const parsed = ThemeTokensSchema.safeParse(merged);
    if (!parsed.success) {
      const errors: Partial<Record<keyof ThemeTokens, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof ThemeTokens;
        errors[key] = issue.message;
      }
      return { success: false, errors };
    }

    const data = parsed.data;

    // Kontrast kontrolleri (uyarı — bloklamaz)
    const contrastWarnings: string[] = [];
    const checks: Array<[string, string, string]> = [
      ["Birincil buton metni (beyaz) / birincil renk", "#FFFFFF", data.brand_primary],
      ["Ana metin / yüzey", data.text_primary, data.surface],
      ["İkincil metin / yüzey", data.text_muted, data.surface],
    ];
    for (const [label, fg, bg] of checks) {
      const { passes, ratio } = checkWcagAA(fg, bg);
      if (!passes) {
        contrastWarnings.push(
          `${label}: kontrast oranı ${ratio}:1 (WCAG AA için min. 4.5:1 gerekli)`
        );
      }
    }

    const jsonData = data as unknown as Prisma.InputJsonValue;
    await prisma.themeSetting.upsert({
      where: { themeKey: THEME_KEY },
      update: { tokensJson: jsonData },
      create: { themeKey: THEME_KEY, tokensJson: jsonData },
    });

    revalidatePath("/admin/ayarlar/tema");
    revalidatePath("/");

    return { success: true, contrastWarnings };
  } catch (err) {
    console.error("[saveThemeTokens]", err);
    return { success: false, error: "Tema kaydedilemedi." };
  }
}

/** Temayı varsayılana döndür */
export async function resetThemeToDefault(): Promise<SaveThemeResult> {
  return saveThemeTokens(DEFAULT_THEME);
}
