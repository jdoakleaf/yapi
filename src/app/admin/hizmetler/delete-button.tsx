"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteService } from "@/lib/cms/service-actions";
import { useRouter } from "next/navigation";

interface Props {
  id: string;
  title: string;
  leadCount: number;
}

export function ServiceDeleteButton({ id, title, leadCount }: Props) {
  const [confirm, setConfirm] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleClick() {
    setConfirm(true);
  }

  function handleConfirm() {
    startTransition(async () => {
      const result = await deleteService(id);
      if (result.success) {
        if (result.archived) {
          setMessage(`"${title}" hizmetine bağlı ${leadCount} talep var — hizmet arşivlendi.`);
          setConfirm(false);
          router.refresh();
        } else {
          router.refresh();
        }
      }
    });
  }

  if (message) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-yellow-700">{message}</span>
        <Button variant="ghost" size="sm" onClick={() => setMessage(null)}>
          Tamam
        </Button>
      </div>
    );
  }

  if (confirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-600">
          {leadCount > 0
            ? `${leadCount} talep var — arşivlenecek.`
            : `"${title}" silinsin mi?`}
        </span>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleConfirm}
          disabled={isPending}
        >
          {leadCount > 0 ? "Arşivle" : "Evet, Sil"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setConfirm(false)}
          disabled={isPending}
        >
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
