"use client";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteBlogPost } from "@/lib/cms/content-actions";
import { useRouter } from "next/navigation";

export function BlogDeleteButton({ id, title }: { id: string; title: string }) {
  const [confirm, setConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  if (confirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-600">&quot;{title}&quot; silinsin mi?</span>
        <Button variant="destructive" size="sm" disabled={isPending}
          onClick={() => startTransition(async () => { await deleteBlogPost(id); router.refresh(); })}>
          Evet, Sil
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setConfirm(false)}>İptal</Button>
      </div>
    );
  }
  return (
    <Button variant="ghost" size="sm" onClick={() => setConfirm(true)}>
      <Trash2 className="h-4 w-4 text-red-500" />
    </Button>
  );
}
