import { getProjects } from "@/lib/cms/project-actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Pencil } from "lucide-react";
import { ProjectDeleteButton } from "./delete-button";
import { ProjectFeaturedButton } from "./featured-button";


interface Props {
  searchParams: Promise<{ page?: string; status?: string }>;
}

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Taslak",
  REVIEW: "İncelemede",
  PUBLISHED: "Yayında",
  ARCHIVED: "Arşiv",
};

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-600",
  REVIEW: "bg-yellow-100 text-yellow-700",
  PUBLISHED: "bg-green-100 text-green-700",
  ARCHIVED: "bg-red-100 text-red-600",
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export default async function ProjelerPage({ searchParams }: Props) {
  const sp = await searchParams;
  const page = Number(sp.page) || 1;
  const status = sp.status as string | undefined;

  const result = await getProjects({
    page,
    status: status as "DRAFT" | "REVIEW" | "PUBLISHED" | "ARCHIVED" | undefined,
  });

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projeler</h1>
          <p className="mt-1 text-sm text-gray-500">{result.total} proje</p>
        </div>
        <Link href="/admin/projeler/yeni">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Yeni Proje
          </Button>
        </Link>
      </div>

      {/* Filtreler */}
      <div className="mb-4">
        <form method="get">
          <select
            name="status"
            defaultValue={status ?? ""}
            onChange={(e) => (e.target.form as HTMLFormElement | null)?.requestSubmit()}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
          >
            <option value="">Tüm Durumlar</option>
            <option value="DRAFT">Taslak</option>
            <option value="REVIEW">İncelemede</option>
            <option value="PUBLISHED">Yayında</option>
            <option value="ARCHIVED">Arşivde</option>
          </select>
        </form>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Proje
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Lokasyon / Tür
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Durum
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Öne Çıkan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Galeri
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {result.items.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                  Henüz proje yok. Yeni proje ekleyin.
                </td>
              </tr>
            )}
            {result.items.map((project) => (
              <tr key={project.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {project.coverMedia ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={`${BASE_URL}/${project.coverMedia.storageKey}`}
                        alt={project.coverMedia.altText ?? project.title}
                        className="h-12 w-16 rounded object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-16 items-center justify-center rounded bg-blue-50 text-blue-200">
                        🏗️
                      </div>
                    )}
                    <div>
                      <div className="font-medium text-gray-900">{project.title}</div>
                      <div className="mt-0.5 font-mono text-xs text-gray-400">{project.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {project.locationLabel && <div>{project.locationLabel}</div>}
                  {project.projectType && (
                    <div className="text-gray-400">{project.projectType}</div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      STATUS_COLORS[project.status] ?? "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {STATUS_LABELS[project.status] ?? project.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <ProjectFeaturedButton id={project.id} isFeatured={project.isFeatured} />
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {project._count.projectMedia} görsel
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/projeler/${project.id}`}>
                      <Button variant="ghost" size="sm">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <ProjectDeleteButton id={project.id} title={project.title} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {result.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {result.total} sonuçtan {(page - 1) * result.pageSize + 1}–
            {Math.min(page * result.pageSize, result.total)} gösteriliyor
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link href={`?page=${page - 1}${status ? `&status=${status}` : ""}`}>
                <Button variant="outline" size="sm">Önceki</Button>
              </Link>
            )}
            {page < result.totalPages && (
              <Link href={`?page=${page + 1}${status ? `&status=${status}` : ""}`}>
                <Button variant="outline" size="sm">Sonraki</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
