import { getBlogPosts } from "@/lib/cms/content-actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Pencil } from "lucide-react";
import { BlogDeleteButton } from "./delete-button";

export const instant = false;

interface Props {
  searchParams: Promise<{ page?: string; status?: string }>;
}

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Taslak", REVIEW: "İncelemede", PUBLISHED: "Yayında", ARCHIVED: "Arşiv",
};
const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-600", REVIEW: "bg-yellow-100 text-yellow-700",
  PUBLISHED: "bg-green-100 text-green-700", ARCHIVED: "bg-red-100 text-red-600",
};

export default async function BlogListPage({ searchParams }: Props) {
  const sp = await searchParams;
  const page = Number(sp.page) || 1;
  const status = sp.status as "DRAFT" | "REVIEW" | "PUBLISHED" | "ARCHIVED" | undefined;

  const result = await getBlogPosts({ page, status });

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Yazıları</h1>
          <p className="mt-1 text-sm text-gray-500">{result.total} yazı</p>
        </div>
        <Link href="/admin/blog/yeni">
          <Button><Plus className="mr-2 h-4 w-4" />Yeni Yazı</Button>
        </Link>
      </div>

      <div className="mb-4">
        <form method="get">
          <select name="status" defaultValue={status ?? ""}
            onChange={(e) => (e.target.form as HTMLFormElement | null)?.requestSubmit()}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm">
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
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Başlık</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Yazar</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Durum</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Tarih</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {result.items.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">Henüz blog yazısı yok.</td></tr>
            )}
            {result.items.map((post) => (
              <tr key={post.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{post.title}</div>
                  <div className="mt-0.5 font-mono text-xs text-gray-400">{post.slug}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{post.author?.name ?? "—"}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[post.status] ?? "bg-gray-100 text-gray-600"}`}>
                    {STATUS_LABELS[post.status] ?? post.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString("tr-TR")
                    : "—"}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/blog/${post.id}`}>
                      <Button variant="ghost" size="sm"><Pencil className="h-4 w-4" /></Button>
                    </Link>
                    <BlogDeleteButton id={post.id} title={post.title} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {result.totalPages > 1 && (
        <div className="mt-4 flex justify-end gap-2">
          {page > 1 && <Link href={`?page=${page - 1}${status ? `&status=${status}` : ""}`}><Button variant="outline" size="sm">Önceki</Button></Link>}
          {page < result.totalPages && <Link href={`?page=${page + 1}${status ? `&status=${status}` : ""}`}><Button variant="outline" size="sm">Sonraki</Button></Link>}
        </div>
      )}
    </div>
  );
}
