import { getServiceCategories } from "@/lib/cms/service-actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Eye, EyeOff } from "lucide-react";
import { CategoryDeleteButton } from "./delete-button";
import { CategoryToggleButton } from "./toggle-button";


export default async function KategorilerPage() {
  const categories = await getServiceCategories();

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hizmet Kategorileri</h1>
          <p className="mt-1 text-sm text-gray-500">
            {categories.length} kategori
          </p>
        </div>
        <Link href="/admin/hizmetler/kategoriler/yeni">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Yeni Kategori
          </Button>
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Sıra
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Kategori
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Slug
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Hizmet Sayısı
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Durum
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {categories.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                  Henüz kategori yok. Yeni kategori ekleyin.
                </td>
              </tr>
            )}
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-500">{cat.sortOrder}</td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{cat.name}</div>
                  {cat.description && (
                    <div className="mt-0.5 text-sm text-gray-500 line-clamp-1">
                      {cat.description}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 font-mono text-sm text-gray-500">
                  {cat.slug}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {cat._count.services} hizmet
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      cat.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {cat.isActive ? "Aktif" : "Pasif"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <CategoryToggleButton
                      id={cat.id}
                      isActive={cat.isActive}
                      icon={cat.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    />
                    <Link href={`/admin/hizmetler/kategoriler/${cat.id}`}>
                      <Button variant="ghost" size="sm">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <CategoryDeleteButton id={cat.id} name={cat.name} serviceCount={cat._count.services} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {categories.length > 0 && (
        <p className="mt-4 text-sm text-gray-500">
          Sıralama için her kategorinin sıra numarasını düzenle sayfasından güncelleyebilirsiniz.
        </p>
      )}
    </div>
  );
}
