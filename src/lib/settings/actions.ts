"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod/v4";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth/rbac";

const SiteSettingValueSchema = z.string().max(5000);

/** Birden fazla site ayarını toplu güncelle.
 *  SiteSetting.valueJson → JSON olarak saklanır (string değer JSON.stringify ile).
 */
export async function updateSiteSettings(
  settings: Record<string, string>
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAuth();

    const entries = Object.entries(settings);

    await prisma.$transaction(
      entries.map(([key, value]) => {
        const parsed = SiteSettingValueSchema.safeParse(value);
        if (!parsed.success) throw new Error(`Geçersiz değer: ${key}`);

        // valueJson → string değeri JSON olarak sakla
        const jsonValue = parsed.data;

        return prisma.siteSetting.upsert({
          where: { key },
          update: { valueJson: jsonValue },
          create: {
            key,
            valueJson: jsonValue,
          },
        });
      })
    );

    revalidatePath("/admin/ayarlar/genel");
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    console.error("[updateSiteSettings]", err);
    return { success: false, error: "Ayarlar kaydedilemedi." };
  }
}

/** Tüm site ayarlarını key→value (string) map olarak getir */
export async function getSiteSettings(): Promise<Record<string, string>> {
  const rows = await prisma.siteSetting.findMany({
    orderBy: { key: "asc" },
  });

  return Object.fromEntries(
    rows.map((r) => [
      r.key,
      typeof r.valueJson === "string" ? r.valueJson : JSON.stringify(r.valueJson),
    ])
  );
}
