"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteProject } from "@/lib/cms/project-actions";
import { useRouter } from "next/navigation";

interface Props {
  id: string;
  title: string;
}

export function ProjectDeleteButton({ id, title }: Props) {
  const [confirm, setConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleConfirm() {
    startTransition(async () => {
      await deleteProject(id);
      router.refresh();
    });
  }

  if (confirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-600">&quot;{title}&quot; silinsin mi?</span>
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
    <Button variant="ghost" size="sm" onClick={() => setConfirm(true)}>
      <Trash2 className="h-4 w-4 text-red-500" />
    </Button>
  );
}
