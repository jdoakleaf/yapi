"use client";

import { useActionState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createBlogPost, updateBlogPost, updateBlogPostStatus } from "@/lib/cms/content-actions";
import type { ContentStatus } from "@prisma/client";

interface BlogData {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  status: ContentStatus;
  seoTitle: string | null;
  seoDesc: string | null;
  publishedAt: Date | null;
  author: { name: string } | null;
}

interface Props { post?: BlogData }
type FormState = { success?: boolean; errors?: Record<string, string[]> } | null;

const STATUS_OPTIONS: { value: ContentStatus; label: string }[] = [
  { value: "DRAFT", label: "Taslak" }, { value: "REVIEW", label: "İncelemede" },
  { value: "PUBLISHED", label: "Yayında" }, { value: "ARCHIVED", label: "Arşivde" },
];

export function BlogForm({ post }: Props) {
  const router = useRouter();
  const [statusPending, startStatusTransition] = useTransition();

  async function action(_prev: FormState, formData: FormData): Promise<FormState> {
    if (post) {
      const result = await updateBlogPost(post.id, formData);
      if (result.success) router.push("/admin/blog");
      return result;
    } else {
      const result = await createBlogPost(formData);
      if (result.success) router.push("/admin/blog");
      return result;
    }
  }

  const [state, formAction, isPending] = useActionState(action, null);

  function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    if (!post) return;
    startStatusTransition(async () => {
      await updateBlogPostStatus(post.id, e.target.value as ContentStatus);
      router.refresh();
    });
  }

  return (
    <form action={formAction} className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-gray-700">Yazı Bilgileri</h2>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Başlık *</Label>
            <Input id="title" name="title" defaultValue={post?.title ?? ""} required placeholder="Yazı başlığı" />
            {state?.errors?.title && <p className="text-sm text-red-600">{state.errors.title[0]}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug (URL)</Label>
            <Input id="slug" name="slug" defaultValue={post?.slug ?? ""} placeholder="Otomatik oluşturulur" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="excerpt">Özet / Excerpt</Label>
            <textarea id="excerpt" name="excerpt" defaultValue={post?.excerpt ?? ""} rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Liste ve önizlemelerde gösterilir" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">İçerik</Label>
            <textarea id="content" name="content" defaultValue={post?.content ?? ""} rows={12}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Yazı içeriği (HTML desteklenir)" />
          </div>
        </div>
      </div>

      {post && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-gray-700">Yayın Ayarları</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Durum</Label>
              <select name="status" defaultValue={post.status} onChange={handleStatusChange} disabled={statusPending}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Yazar</Label>
              <p className="rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-600">{post.author?.name ?? "—"}</p>
            </div>
          </div>
          {post.publishedAt && (
            <p className="mt-3 text-xs text-gray-400">
              Yayınlanma: {new Date(post.publishedAt).toLocaleString("tr-TR")}
            </p>
          )}
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-gray-700">SEO Ayarları</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="seoTitle">SEO Başlık</Label>
            <Input id="seoTitle" name="seoTitle" defaultValue={post?.seoTitle ?? ""} placeholder="Boş bırakırsanız başlık kullanılır" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seoDesc">Meta Açıklama</Label>
            <textarea id="seoDesc" name="seoDesc" defaultValue={post?.seoDesc ?? ""} rows={2}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="150-160 karakter önerilir" />
          </div>
        </div>
      </div>

      {state?.errors && Object.keys(state.errors).length > 0 && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">Lütfen formdaki hataları düzeltin.</div>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>{isPending ? "Kaydediliyor..." : post ? "Güncelle" : "Oluştur"}</Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/blog")}>İptal</Button>
        {post && (
          <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer"
            className="ml-auto text-sm text-blue-600 underline-offset-2 hover:underline">
            Sitede görüntüle →
          </a>
        )}
      </div>
    </form>
  );
}
