import { getBlogPostBySlug } from "@/lib/cms/content-actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

interface Props { params: Promise<{ slug: string }> }

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
export const instant = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post || post.status !== "PUBLISHED") return { title: "Yazı Bulunamadı" };
  const coverUrl = post.coverMedia ? `${BASE_URL}/${post.coverMedia.storageKey}` : undefined;
  return {
    title: post.seoTitle ?? post.title,
    description: post.seoDesc ?? post.excerpt ?? undefined,
    openGraph: { title: post.seoTitle ?? post.title, description: post.seoDesc ?? post.excerpt ?? undefined, images: coverUrl ? [coverUrl] : [] },
  };
}

export default async function BlogDetayPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post || post.status !== "PUBLISHED") notFound();

  const coverUrl = post.coverMedia ? `${BASE_URL}/${post.coverMedia.storageKey}` : null;

  return (
    <main className="min-h-screen bg-white">
      {coverUrl && (
        <div className="relative h-64 overflow-hidden bg-blue-900 md:h-80">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={coverUrl} alt={post.coverMedia?.altText ?? post.title} className="h-full w-full object-cover opacity-50" />
        </div>
      )}

      <section className={`${!coverUrl ? "bg-blue-900 py-12 text-white" : "pt-10"}`}>
        <div className="mx-auto max-w-3xl px-4">
          {!coverUrl && (
            <div className="mb-2 text-sm text-blue-300">
              <Link href="/" className="hover:text-white">Ana Sayfa</Link>{" / "}
              <Link href="/blog" className="hover:text-white">Blog</Link>
            </div>
          )}
          {coverUrl && (
            <div className="mb-3 text-sm text-gray-500">
              <Link href="/" className="hover:text-blue-600">Ana Sayfa</Link>{" / "}
              <Link href="/blog" className="hover:text-blue-600">Blog</Link>
            </div>
          )}
          <h1 className={`text-3xl font-bold md:text-4xl ${!coverUrl ? "text-white" : "text-gray-900"}`}>{post.title}</h1>
          <div className={`mt-3 flex items-center gap-4 text-sm ${!coverUrl ? "text-blue-200" : "text-gray-400"}`}>
            {post.author && <span>✍️ {post.author.name}</span>}
            {post.publishedAt && (
              <span>📅 {new Date(post.publishedAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}</span>
            )}
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="mx-auto max-w-3xl px-4">
          {post.excerpt && (
            <p className="mb-8 text-lg font-medium leading-relaxed text-gray-600 border-l-4 border-blue-600 pl-4">{post.excerpt}</p>
          )}
          {post.content ? (
            <div className="prose prose-blue max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
          ) : (
            <p className="text-gray-400">Bu yazı henüz içerik eklenmemiş.</p>
          )}

          <div className="mt-10 border-t border-gray-200 pt-6">
            <Link href="/blog" className="text-sm font-medium text-blue-600 hover:underline">← Tüm Yazılar</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
