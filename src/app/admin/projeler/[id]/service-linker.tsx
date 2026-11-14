"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { setProjectServices } from "@/lib/cms/project-actions";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

interface ServiceItem {
  id: string;
  title: string;
  categoryName: string;
}

interface Props {
  projectId: string;
  allServices: ServiceItem[];
  linkedIds: string[];
}

export function ServiceLinker({ projectId, allServices, linkedIds }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set(linkedIds));
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  function toggleService(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
    setSaved(false);
  }

  function handleSave() {
    startTransition(async () => {
      await setProjectServices(projectId, Array.from(selected));
      setSaved(true);
      router.refresh();
    });
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-gray-700">
        İlgili Hizmetler ({selected.size} seçili)
      </h3>

      {allServices.length === 0 && (
        <p className="py-2 text-sm text-gray-400">Yayınlanan hizmet yok.</p>
      )}

      <div className="max-h-64 space-y-1 overflow-y-auto">
        {allServices.map((svc) => (
          <label
            key={svc.id}
            className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 hover:bg-gray-50"
          >
            <input
              type="checkbox"
              checked={selected.has(svc.id)}
              onChange={() => toggleService(svc.id)}
              className="h-3.5 w-3.5 rounded border-gray-300"
            />
            <span className="flex-1 text-sm text-gray-700">{svc.title}</span>
            <span className="text-xs text-gray-400">{svc.categoryName}</span>
          </label>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <Button size="sm" onClick={handleSave} disabled={isPending}>
          Kaydet
        </Button>
        {saved && (
          <span className="flex items-center gap-1 text-xs text-green-600">
            <Check className="h-3.5 w-3.5" /> Kaydedildi
          </span>
        )}
      </div>
    </div>
  );
}
