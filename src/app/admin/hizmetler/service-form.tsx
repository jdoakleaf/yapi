"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createService, updateService, updateServiceStatus } from "@/lib/cms/service-actions";
import { useTransition } from "react";
import type { ContentStatus } from "@prisma/client";

interface Category {
  id: string;
  name: string;
}

interface ServiceData {
  id: string;
  categoryId: string;
  title: string;
  slug: string;
  shortDescription: string | null;
  content: string | null;
  isFeatured: boolean;
  sortOrder: number;
  status: ContentStatus;
  seoTitle: string | null;
  seoDesc: string | null;
}

interface Props {
  service?: ServiceData;
  categories: Category[];
}

type FormState = {
  success?: boolean;
  errors?: Record<string, string[]>;
} | null;

const STATUS_OPTIONS: { value: ContentStatus; label: string }[] = [
  { value: "DRAFT", label: "Taslak" },
  { value: "REVIEW", label: "İncelemede" },
  { value: "PUBLISHED", label: "Yayında" },
  { value: "ARCHIVED", label: "Arşivde" },
];

export function ServiceForm({ service, categories }: Props) {
  const router = useRouter();
  const [statusPending, startStatusTransition] = useTransition();

  async function action(_prev: FormState, formData: FormData): Promise<FormState> {
    if (service) {
      const result = await updateService(service.id, formData);
      if (result.success) {
        router.push("/admin/hizmetler");
      }
      return result;
    } else {
      const result = await createService(formData);
      if (result.success) {
        router.push("/admin/hizmetler");
      }
      return result;
    }
  }

  const [state, formAction, isPending] = useActionState(action, null);

  function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    if (!service) return;
    const newStatus = e.target.value as ContentStatus;
    startStatusTransition(async () => {
      await updateServiceStatus(service.id, newStatus);
      router.refresh();
    });
  }

  return (
    <form action={formAction} className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-gray-700">Temel Bilgiler</h2>

        {/* Kategori */}
        <div className="space-y-2">
          <Label htmlFor="categoryId">Kategori *</Label>
          <select
            id="categoryId"
            name="categoryId"
            defaultValue={service?.categoryId ?? ""}
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Kategori seçin...</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {state?.errors?.categoryId && (
            <p className="text-sm text-red-600">{state.errors.categoryId[0]}</p>
          )}
        </div>

        {/* Başlık */}
        <div className="mt-4 space-y-2">
          <Label htmlFor="title">Hizmet Başlığı *</Label>
          <Input
            id="title"
            name="title"
            defaultValue={service?.title ?? ""}
            placeholder="ör. Boya & Badana Hizmetleri"
            required
          />
          {state?.errors?.title && (
            <p className="text-sm text-red-600">{state.errors.title[0]}</p>
          )}
        </div>

        {/* Slug */}
        <div className="mt-4 space-y-2">
          <Label htmlFor="slug">Slug (URL)</Label>
          <Input
            id="slug"
            name="slug"
            defaultValue={service?.slug ?? ""}
            placeholder="Boş bırakırsanız otomatik oluşturulur"
          />
          <p className="text-xs text-gray-500">Türkçe karakter ve boşluk içermemeli.</p>
        </div>

        {/* Kısa Açıklama */}
        <div className="mt-4 space-y-2">
          <Label htmlFor="shortDescription">Kısa Açıklama</Label>
          <textarea
            id="shortDescription"
            name="shortDescription"
            defaultValue={service?.shortDescription ?? ""}
            rows={2}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Kart ve liste görünümlerinde kullanılır (150 karakter önerilir)"
          />
        </div>

        {/* İçerik */}
        <div className="mt-4 space-y-2">
          <Label htmlFor="content">Detaylı İçerik</Label>
          <textarea
            id="content"
            name="content"
            defaultValue={service?.content ?? ""}
            rows={8}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Hizmet detay sayfasında gösterilir. HTML desteklenir."
          />
        </div>
      </div>

      {/* Ayarlar */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-gray-700">Ayarlar</h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sortOrder">Sıralama</Label>
            <Input
              id="sortOrder"
              name="sortOrder"
              type="number"
              min="0"
              defaultValue={String(service?.sortOrder ?? 0)}
            />
          </div>

          {service && (
            <div className="space-y-2">
              <Label htmlFor="statusSelect">Durum</Label>
              <select
                id="statusSelect"
                name="status"
                defaultValue={service.status}
                onChange={handleStatusChange}
                disabled={statusPending}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center gap-3">
          <input
            id="isFeatured"
            name="isFeatured"
            type="checkbox"
            defaultChecked={service?.isFeatured ?? false}
            onChange={(e) => {
              const hidden = document.getElementById("isFeaturedValue") as HTMLInputElement;
              if (hidden) hidden.value = e.target.checked ? "true" : "false";
            }}
            className="h-4 w-4 rounded border-gray-300"
          />
          <input
            type="hidden"
            id="isFeaturedValue"
            name="isFeatured"
            value={service?.isFeatured ? "true" : "false"}
          />
          <Label htmlFor="isFeatured">Öne çıkan hizmet olarak işaretle</Label>
        </div>
      </div>

      {/* SEO */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-gray-700">SEO Ayarları</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="seoTitle">SEO Başlık</Label>
            <Input
              id="seoTitle"
              name="seoTitle"
              defaultValue={service?.seoTitle ?? ""}
              placeholder="Boş bırakırsanız hizmet başlığı kullanılır"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seoDesc">Meta Açıklama</Label>
            <textarea
              id="seoDesc"
              name="seoDesc"
              defaultValue={service?.seoDesc ?? ""}
              rows={2}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="150-160 karakter önerilir"
            />
          </div>
        </div>
      </div>

      {state?.errors && Object.keys(state.errors).length > 0 && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          Lütfen formdaki hataları düzeltin.
        </div>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Kaydediliyor..." : service ? "Güncelle" : "Oluştur"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/hizmetler")}
        >
          İptal
        </Button>
        {service && (
          <a
            href={`/hizmetler/${service.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto text-sm text-blue-600 underline-offset-2 hover:underline"
          >
            Sitede görüntüle →
          </a>
        )}
      </div>
    </form>
  );
}
