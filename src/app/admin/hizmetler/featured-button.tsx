"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Star, StarOff } from "lucide-react";
import { toggleServiceFeatured } from "@/lib/cms/service-actions";

interface Props {
  id: string;
  isFeatured: boolean;
}

export function ServiceFeaturedButton({ id, isFeatured }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      await toggleServiceFeatured(id);
    });
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      disabled={isPending}
      title={isFeatured ? "Öne çıkarmayı kaldır" : "Öne çıkar"}
    >
      {isFeatured ? (
        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      ) : (
        <StarOff className="h-4 w-4 text-gray-400" />
      )}
    </Button>
  );
}
