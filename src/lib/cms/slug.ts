/**
 * src/lib/cms/slug.ts
 * Slug üretimi ve çakışma kontrolü.
 */

import { prisma } from "@/lib/db";

/**
 * Metni URL-güvenli slug'a dönüştürür — Türkçe karakter desteği dahil.
 */
export function slugify(text: string): string {
  const trMap: Record<string, string> = {
    ç: "c", Ç: "c", ğ: "g", Ğ: "g",
    ı: "i", İ: "i", ö: "o", Ö: "o",
    ş: "s", Ş: "s", ü: "u", Ü: "u",
  };

  return text
    .split("")
    .map((c) => trMap[c] ?? c)
    .join("")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type SlugTable =
  | "page"
  | "blogPost"
  | "service"
  | "serviceCategory"
  | "project";

/**
 * Benzersiz slug oluşturur. Çakışırsa "-2", "-3" vb. ekler.
 */
export async function generateUniqueSlug(
  text: string,
  table: SlugTable,
  excludeId?: string
): Promise<string> {
  const base = slugify(text);
  if (!base) throw new Error("Geçersiz slug: boş metin.");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const model = (prisma as any)[table] as {
    findMany: (args: object) => Promise<{ slug: string }[]>;
  };

  const existing = await model.findMany({
    where: {
      slug: { startsWith: base },
      ...(excludeId ? { id: { not: excludeId } } : {}),
    },
    select: { slug: true },
  });

  const slugSet = new Set(existing.map((r) => r.slug));

  if (!slugSet.has(base)) return base;

  let i = 2;
  while (slugSet.has(`${base}-${i}`)) i++;
  return `${base}-${i}`;
}
