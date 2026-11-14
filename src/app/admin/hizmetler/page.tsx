import { getServices, getServiceCategories } from "@/lib/cms/service-actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Pencil } from "lucide-react";
import { ServiceDeleteButton } from "./delete-button";
import { ServiceFeaturedButton } from "./featured-button";
import { ServiceStatusBadge } from "./status-badge";
import type { ContentStatus } from "@prisma/client";

export const instant = false;

interface Props {
  searchParams: Promise<{ page?: string; categoryId?: string; status?: string }>;
}

export default async function HizmetlerPage({ searchParams }: Props) {
  const sp = await searchParams;
  const page = Number(sp.page) || 1;
  const categoryId = sp.categoryId || undefined;
  const status = sp.status as ContentStatus | undefined;

  const [result, categories] = await Promise.all([
    getServices({ page, categoryId, status }),
    getServiceCategories(),
  ]);

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hizmetler</h1>
          <p className="mt-1 text-sm text-gray-500">{result.total} hizmet</p>
        </div>
        <Link href="/admin/hizmetler/yeni">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Yeni Hizmet
          </Button>
        </Link>
      </div>

      {/* Filtreler */}
      <div className="mb-4 flex flex-wrap gap-3">
        <form method="get">
          <select
            name="categoryId"
            defaultValue={categoryId ?? ""}
            onChange={(e) => (e.target.form as HTMLFormElement | null)?.requestSubmit()}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
          >
            <option value="">Tüm Kategoriler</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            name="status"
            defaultValue={status ?? ""}
            onChange={(e) => (e.target.form as HTMLFormElement | null)?.requestSubmit()}
            className="ml-2 rounded-md border border-gray-300 px-3 py-1.5 text-sm"
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
                Hizmet
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Kategori
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Durum
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Öne Çıkan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Talepler
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
                  Henüz hizmet yok. Yeni hizmet ekleyin.
                </td>
              </tr>
            )}
            {result.items.map((svc) => (
              <tr key={svc.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{svc.title}</div>
                  <div className="mt-0.5 font-mono text-xs text-gray-400">{svc.slug}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {svc.category.name}
                </td>
                <td className="px-6 py-4">
                  <ServiceStatusBadge status={svc.status} />
                </td>
                <td className="px-6 py-4">
                  <ServiceFeaturedButton id={svc.id} isFeatured={svc.isFeatured} />
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {svc._count.leads}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/hizmetler/${svc.id}`}>
                      <Button variant="ghost" size="sm">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <ServiceDeleteButton id={svc.id} title={svc.title} leadCount={svc._count.leads} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sayfalama */}
      {result.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {result.total} sonuçtan {(page - 1) * result.pageSize + 1}–
            {Math.min(page * result.pageSize, result.total)} gösteriliyor
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link href={`?page=${page - 1}${categoryId ? `&categoryId=${categoryId}` : ""}${status ? `&status=${status}` : ""}`}>
                <Button variant="outline" size="sm">Önceki</Button>
              </Link>
            )}
            {page < result.totalPages && (
              <Link href={`?page=${page + 1}${categoryId ? `&categoryId=${categoryId}` : ""}${status ? `&status=${status}` : ""}`}>
                <Button variant="outline" size="sm">Sonraki</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
