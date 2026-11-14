"use client";

import { useActionState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createProject, updateProject, updateProjectStatus } from "@/lib/cms/project-actions";
import type { ContentStatus } from "@prisma/client";

interface ProjectData {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  description: string | null;
  locationLabel: string | null;
  projectType: string | null;
  completionDate: Date | null;
  isFeatured: boolean;
  status: ContentStatus;
  seoTitle: string | null;
  seoDesc: string | null;
}

interface Props {
  project?: ProjectData;
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

export function ProjectForm({ project }: Props) {
  const router = useRouter();
  const [statusPending, startStatusTransition] = useTransition();

  async function action(_prev: FormState, formData: FormData): Promise<FormState> {
    if (project) {
      const result = await updateProject(project.id, formData);
      if (result.success) router.push("/admin/projeler");
      return result;
    } else {
      const result = await createProject(formData);
      if (result.success) router.push("/admin/projeler");
      return result;
    }
  }

  const [state, formAction, isPending] = useActionState(action, null);

  function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    if (!project) return;
    const newStatus = e.target.value as ContentStatus;
    startStatusTransition(async () => {
      await updateProjectStatus(project.id, newStatus);
      router.refresh();
    });
  }

  // Format date for input[type=date]
  const completionDateValue = project?.completionDate
    ? new Date(project.completionDate).toISOString().split("T")[0]
    : "";

  return (
    <form action={formAction} className="space-y-6">
      {/* Temel Bilgiler */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-gray-700">Temel Bilgiler</h2>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Proje Başlığı *</Label>
            <Input
              id="title"
              name="title"
              defaultValue={project?.title ?? ""}
              placeholder="ör. İstanbul Rezidans Projesi"
              required
            />
            {state?.errors?.title && (
              <p className="text-sm text-red-600">{state.errors.title[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug (URL)</Label>
            <Input
              id="slug"
              name="slug"
              defaultValue={project?.slug ?? ""}
              placeholder="Boş bırakırsanız otomatik oluşturulur"
            />
            <p className="text-xs text-gray-500">Türkçe karakter ve boşluk içermemeli.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">Özet</Label>
            <textarea
              id="summary"
              name="summary"
              defaultValue={project?.summary ?? ""}
              rows={2}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Kart ve liste görünümünde kullanılır"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Detaylı Açıklama</Label>
            <textarea
              id="description"
              name="description"
              defaultValue={project?.description ?? ""}
              rows={8}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Proje detay sayfasında gösterilir. HTML desteklenir."
            />
          </div>
        </div>
      </div>

      {/* Proje Detayları */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-gray-700">Proje Detayları</h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="locationLabel">Lokasyon</Label>
            <Input
              id="locationLabel"
              name="locationLabel"
              defaultValue={project?.locationLabel ?? ""}
              placeholder="ör. İstanbul, Kadıköy"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectType">Proje Türü</Label>
            <Input
              id="projectType"
              name="projectType"
              defaultValue={project?.projectType ?? ""}
              placeholder="ör. Konut, Ticari, Endüstriyel"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="completionDate">Tamamlanma Tarihi</Label>
            <Input
              id="completionDate"
              name="completionDate"
              type="date"
              defaultValue={completionDateValue}
            />
          </div>

          {project && (
            <div className="space-y-2">
              <Label htmlFor="statusSelect">Durum</Label>
              <select
                id="statusSelect"
                name="status"
                defaultValue={project.status}
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
            defaultChecked={project?.isFeatured ?? false}
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
            value={project?.isFeatured ? "true" : "false"}
          />
          <Label htmlFor="isFeatured">Öne çıkan proje olarak işaretle</Label>
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
              defaultValue={project?.seoTitle ?? ""}
              placeholder="Boş bırakırsanız proje başlığı kullanılır"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seoDesc">Meta Açıklama</Label>
            <textarea
              id="seoDesc"
              name="seoDesc"
              defaultValue={project?.seoDesc ?? ""}
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
          {isPending ? "Kaydediliyor..." : project ? "Güncelle" : "Oluştur"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/projeler")}
        >
          İptal
        </Button>
        {project && (
          <a
            href={`/projeler/${project.slug}`}
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
