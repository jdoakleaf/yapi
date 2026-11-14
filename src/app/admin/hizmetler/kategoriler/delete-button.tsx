"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteServiceCategory } from "@/lib/cms/service-actions";

interface Props {
  id: string;
  name: string;
  serviceCount: number;
}

export function CategoryDeleteButton({ id, name, serviceCount }: Props) {
  const [confirm, setConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (serviceCount > 0) {
      setError(`Bu kategoriye bağlı ${serviceCount} hizmet var. Önce hizmetleri silin.`);
      return;
    }
    setConfirm(true);
  }

  function handleConfirm() {
    startTransition(async () => {
      const result = await deleteServiceCategory(id);
      if (!result.success && result.error) {
        setError(result.error);
        setConfirm(false);
      }
    });
  }

  if (error) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-red-600">{error}</span>
        <Button variant="ghost" size="sm" onClick={() => setError(null)}>
          Tamam
        </Button>
      </div>
    );
  }

  if (confirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-600">&quot;{name}&quot; silinsin mi?</span>
        <Button variant="destructive" size="sm" onClick={handleConfirm} disabled={isPending}>
          Evet, Sil
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setConfirm(false)} disabled={isPending}>
          İptal
        </Button>
      </div>
    );
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleClick}>
      <Trash2 className="h-4 w-4 text-red-500" />
    </Button>
  );
}
