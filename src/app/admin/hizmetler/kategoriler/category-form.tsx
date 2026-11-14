"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createServiceCategory, updateServiceCategory } from "@/lib/cms/service-actions";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
  seoTitle: string | null;
  seoDesc: string | null;
}

interface Props {
  category?: Category;
}

type FormState = {
  success?: boolean;
  errors?: Record<string, string[]>;
  id?: string;
} | null;

export function CategoryForm({ category }: Props) {
  const router = useRouter();

  async function action(_prev: FormState, formData: FormData): Promise<FormState> {
    if (category) {
      const result = await updateServiceCategory(category.id, formData);
      if (result.success) {
        router.push("/admin/hizmetler/kategoriler");
      }
      return result;
    } else {
      const result = await createServiceCategory(formData);
      if (result.success) {
        router.push("/admin/hizmetler/kategoriler");
      }
      return result;
    }
  }

  const [state, formAction, isPending] = useActionState(action, null);

  return (
    <form action={formAction} className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      {/* İsim */}
      <div className="space-y-2">
        <Label htmlFor="name">Kategori Adı *</Label>
        <Input
          id="name"
          name="name"
          defaultValue={category?.name ?? ""}
          placeholder="ör. Boya & Badana"
          required
        />
        {state?.errors?.name && (
          <p className="text-sm text-red-600">{state.errors.name[0]}</p>
        )}
      </div>

      {/* Slug */}
      <div className="space-y-2">
        <Label htmlFor="slug">Slug (URL)</Label>
        <Input
          id="slug"
          name="slug"
          defaultValue={category?.slug ?? ""}
          placeholder="Boş bırakırsanız otomatik oluşturulur"
        />
        <p className="text-xs text-gray-500">Türkçe karakter ve boşluk içermemeli.</p>
      </div>

      {/* Açıklama */}
      <div className="space-y-2">
        <Label htmlFor="description">Açıklama</Label>
        <textarea
          id="description"
          name="description"
          defaultValue={category?.description ?? ""}
          rows={3}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Kategori hakkında kısa bir açıklama..."
        />
      </div>

      {/* Sıra */}
      <div className="space-y-2">
        <Label htmlFor="sortOrder">Sıralama</Label>
        <Input
          id="sortOrder"
          name="sortOrder"
          type="number"
          min="0"
          defaultValue={String(category?.sortOrder ?? 0)}
        />
      </div>

      {/* Aktif */}
      <div className="flex items-center gap-3">
        <input
          id="isActive"
          name="isActive"
          type="checkbox"
          defaultChecked={category ? category.isActive : true}
          onChange={(e) => {
            const hidden = document.getElementById("isActiveValue") as HTMLInputElement;
            if (hidden) hidden.value = e.target.checked ? "true" : "false";
          }}
          className="h-4 w-4 rounded border-gray-300"
        />
        <input type="hidden" id="isActiveValue" name="isActive" value={category ? (category.isActive ? "true" : "false") : "true"} />
        <Label htmlFor="isActive">Aktif (sitede görünsün)</Label>
      </div>

      {/* SEO */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="mb-4 text-sm font-semibold text-gray-700">SEO Ayarları</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="seoTitle">SEO Başlık</Label>
            <Input
              id="seoTitle"
              name="seoTitle"
              defaultValue={category?.seoTitle ?? ""}
              placeholder="Boş bırakırsanız kategori adı kullanılır"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seoDesc">Meta Açıklama</Label>
            <textarea
              id="seoDesc"
              name="seoDesc"
              defaultValue={category?.seoDesc ?? ""}
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
          {isPending ? "Kaydediliyor..." : category ? "Güncelle" : "Oluştur"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/hizmetler/kategoriler")}
        >
          İptal
        </Button>
      </div>
    </form>
  );
}
