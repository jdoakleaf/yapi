import { prisma } from "@/lib/db";

/** Public sayfalar için site ayarlarını çeker (cache'li). */
export async function getPublicSiteSettings(): Promise<Record<string, string>> {
  const rows = await prisma.siteSetting.findMany({
    orderBy: { key: "asc" },
  });

  return Object.fromEntries(
    rows.map((r) => [
      r.key,
      typeof r.valueJson === "string"
        ? r.valueJson
        : JSON.stringify(r.valueJson),
    ]),
  );
}

export function getSetting(
  settings: Record<string, string>,
  key: string,
  fallback = "",
): string {
  return settings[key] ?? fallback;
}
