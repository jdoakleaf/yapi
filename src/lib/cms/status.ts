/**
 * src/lib/cms/status.ts
 * ContentStatus yönetimi — yayınlama iş akışı.
 */

import { ContentStatus } from "@prisma/client";

export { ContentStatus };

/** Durum geçiş kuralları — hangi durumdan hangisine geçilebilir */
const TRANSITIONS: Record<ContentStatus, ContentStatus[]> = {
  DRAFT: ["REVIEW", "PUBLISHED"],
  REVIEW: ["DRAFT", "PUBLISHED"],
  PUBLISHED: ["DRAFT", "ARCHIVED"],
  ARCHIVED: ["DRAFT"],
};

export function canTransition(
  from: ContentStatus,
  to: ContentStatus
): boolean {
  return TRANSITIONS[from]?.includes(to) ?? false;
}

export function getAvailableTransitions(
  current: ContentStatus
): ContentStatus[] {
  return TRANSITIONS[current] ?? [];
}

/** Türkçe durum etiketleri */
export const STATUS_LABELS: Record<ContentStatus, string> = {
  DRAFT: "Taslak",
  REVIEW: "İncelemede",
  PUBLISHED: "Yayında",
  ARCHIVED: "Arşivlendi",
};

/** Durum badge renkleri (Tailwind class) */
export const STATUS_COLORS: Record<ContentStatus, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  REVIEW: "bg-yellow-100 text-yellow-700",
  PUBLISHED: "bg-green-100 text-green-700",
  ARCHIVED: "bg-red-100 text-red-700",
};

/**
 * Public sayfalar için yalnızca PUBLISHED içerik filtresini döndürür.
 */
export function publishedFilter() {
  return { status: ContentStatus.PUBLISHED };
}
