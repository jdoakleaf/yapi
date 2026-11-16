import { getBlogPosts } from "@/lib/cms/content-actions";
import Link from "next/link";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Blog",
  description: "Yapı ve inşaat sektöründen haberler, ipuçları ve projelerimiz",
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export default async function BlogListPage() {
  const result = await getBlogPosts({ status: "PUBLISHED", pageSize: 12 });

  return (
    <main className="min-h-screen bg-white">
      <section className="bg-blue-900 py-14 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-2 text-sm text-blue-300">
            <Link href="/" className="hover:text-white">Ana Sayfa</Link>{" / "}<span>Blog</span>
          </div>
          <h1 className="mt-2 text-4xl font-bold">Blog</h1>
          <p className="mt-3 text-lg text-blue-200">Sektör haberleri, proje notları ve ipuçları.</p>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-6xl px-4">
          {result.items.length === 0 && (
            <p className="py-20 text-center text-gray-400">Yakında blog yazıları yayınlanacak.</p>
          )}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {result.items.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
                {post.coverMedia ? (
                  <div className="aspect-video overflow-hidden bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`${BASE_URL}/${post.coverMedia.storageKey}`}
                      alt={post.coverMedia.altText ?? post.title}
                      className="h-full w-full object-cover transition group-hover:scale-105" />
                  </div>
                ) : (
                  <div className="flex aspect-video items-center justify-center bg-blue-50 text-4xl text-blue-200">📰</div>
                )}
                <div className="flex flex-1 flex-col p-5">
                  <h2 className="font-bold text-gray-900 group-hover:text-blue-700 line-clamp-2">{post.title}</h2>
                  {post.excerpt && <p className="mt-2 line-clamp-3 text-sm text-gray-500">{post.excerpt}</p>}
                  <div className="mt-auto flex items-center justify-between pt-4 text-xs text-gray-400">
                    <span>{post.author?.name ?? ""}</span>
                    {post.publishedAt && (
                      <span>{new Date(post.publishedAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
