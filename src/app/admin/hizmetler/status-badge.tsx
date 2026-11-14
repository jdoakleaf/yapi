"use client";

import type { ContentStatus } from "@prisma/client";

const STATUS_MAP: Record<ContentStatus, { label: string; classes: string }> = {
  DRAFT: { label: "Taslak", classes: "bg-gray-100 text-gray-600" },
  REVIEW: { label: "İncelemede", classes: "bg-yellow-100 text-yellow-700" },
  PUBLISHED: { label: "Yayında", classes: "bg-green-100 text-green-700" },
  ARCHIVED: { label: "Arşiv", classes: "bg-red-100 text-red-600" },
};

export function ServiceStatusBadge({ status }: { status: ContentStatus }) {
  const info = STATUS_MAP[status] ?? { label: status, classes: "bg-gray-100 text-gray-600" };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${info.classes}`}>
      {info.label}
    </span>
  );
}
