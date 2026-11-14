"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toggleCategoryActive } from "@/lib/cms/service-actions";
import type { ReactNode } from "react";

interface Props {
  id: string;
  isActive: boolean;
  icon: ReactNode;
}

export function CategoryToggleButton({ id, icon }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      await toggleCategoryActive(id);
    });
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleToggle} disabled={isPending}>
      {icon}
    </Button>
  );
}
