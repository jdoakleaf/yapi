"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deletePage } from "@/lib/cms/page-actions";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";

interface DeletePageButtonProps {
  pageId: string;
  pageTitle: string;
}

export function DeletePageButton({ pageId, pageTitle }: DeletePageButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    if (!confirm(`"${pageTitle}" sayfasını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`)) {
      return;
    }
    startTransition(async () => {
      const result = await deletePage(pageId);
      if (result.success) {
        toast({ title: "Sayfa silindi", description: `"${pageTitle}" başarıyla silindi.` });
        router.refresh();
      } else {
        toast({ title: "Hata", description: result.error, variant: "destructive" });
      }
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      title="Sil"
      disabled={isPending}
      onClick={handleDelete}
      className="text-[var(--text-muted)] hover:text-red-600 hover:bg-red-50"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
