"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updatePage } from "@/lib/cms/page-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Save, Globe } from "lucide-react";

interface PageMetaFormProps {
  page: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    status: string;
    seoTitle: string | null;
    seoDesc: string | null;
  };
}

const STATUS_OPTIONS = [
  { value: "DRAFT", label: "Taslak" },
  { value: "REVIEW", label: "İncelemede" },
  { value: "PUBLISHED", label: "Yayına Al" },
  { value: "ARCHIVED", label: "Arşivle" },
];

export function PageMetaForm({ page }: PageMetaFormProps) {
  const [status, setStatus] = useState(page.status);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("status", status);

    startTransition(async () => {
      const result = await updatePage(page.id, formData);
      if (result.success) {
        toast({ title: "Sayfa güncellendi" });
        router.refresh();
      } else {
        toast({
          title: "Hata",
          description: result.error ?? JSON.stringify(result.fieldErrors),
          variant: "destructive",
        });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="title">Başlık *</Label>
          <Input
            id="title"
            name="title"
            defaultValue={page.title}
            required
            disabled={isPending}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="slug">Slug (URL)</Label>
          <div className="flex items-center gap-1.5">
            <span className="text-sm text-[var(--text-muted)]">/</span>
            <Input
              id="slug"
              name="slug"
              defaultValue={page.slug}
              placeholder="url-adresi"
              disabled={isPending}
              className="font-mono"
            />
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="excerpt">Özet (opsiyonel)</Label>
        <Input
          id="excerpt"
          name="excerpt"
          defaultValue={page.excerpt ?? ""}
          placeholder="Kısa açıklama"
          disabled={isPending}
        />
      </div>

      <div className="border-t border-[var(--border)] pt-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
          SEO
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="seoTitle">SEO Başlığı</Label>
            <Input
              id="seoTitle"
              name="seoTitle"
              defaultValue={page.seoTitle ?? ""}
              placeholder="Arama motoru başlığı"
              disabled={isPending}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="seoDesc">SEO Açıklaması</Label>
            <Input
              id="seoDesc"
              name="seoDesc"
              defaultValue={page.seoDesc ?? ""}
              placeholder="Meta description (max 160 karakter)"
              disabled={isPending}
              maxLength={160}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-[var(--border)] pt-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-[var(--text-muted)]" />
          <span className="text-sm text-[var(--text-muted)]">Durum:</span>
          <div className="flex gap-1">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setStatus(opt.value)}
                disabled={isPending}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  status === opt.value
                    ? "bg-[var(--brand-primary)] text-white"
                    : "bg-[var(--surface-muted)] text-[var(--text-muted)] hover:bg-[var(--brand-soft)]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <Button type="submit" disabled={isPending} className="gap-2">
          <Save className="h-4 w-4" />
          {isPending ? "Kaydediliyor..." : "Kaydet"}
        </Button>
      </div>
    </form>
  );
}
