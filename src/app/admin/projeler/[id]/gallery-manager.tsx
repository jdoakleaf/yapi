"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { removeProjectMedia } from "@/lib/cms/project-actions";
import { Trash2, GripVertical } from "lucide-react";
import { useRouter } from "next/navigation";

interface MediaItem {
  id: string;
  caption: string | null;
  sortOrder: number;
  media: {
    storageKey: string;
    altText: string | null;
    title: string | null;
  };
}

interface Props {
  projectId: string;
  items: MediaItem[];
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export function GalleryManager({ projectId, items }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleRemove(id: string) {
    startTransition(async () => {
      await removeProjectMedia(id, projectId);
      router.refresh();
    });
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-gray-700">
        Proje Galerisi ({items.length} görsel)
      </h3>

      {items.length === 0 && (
        <p className="py-4 text-center text-sm text-gray-400">
          Henüz görsel eklenmedi.
        </p>
      )}

      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 rounded-lg border border-gray-100 p-2"
          >
            <GripVertical className="h-4 w-4 flex-shrink-0 text-gray-300" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${BASE_URL}/${item.media.storageKey}`}
              alt={item.media.altText ?? item.media.title ?? "Görsel"}
              className="h-12 w-16 flex-shrink-0 rounded object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs text-gray-600">
                {item.caption ?? item.media.title ?? "—"}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemove(item.id)}
              disabled={isPending}
            >
              <Trash2 className="h-4 w-4 text-red-400" />
            </Button>
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-gray-400">
        Galeri görseli eklemek için Medya Kütüphanesi entegrasyonu Faz 11&apos;de tamamlanacak.
      </p>
    </div>
  );
}
