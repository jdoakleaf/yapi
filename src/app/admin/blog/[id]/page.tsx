import { getBlogPost } from "@/lib/cms/content-actions";
import { BlogForm } from "../blog-form";
import { notFound } from "next/navigation";


interface Props { params: Promise<{ id: string }> }

export default async function BlogEditPage({ params }: Props) {
  const { id } = await params;
  const post = await getBlogPost(id);
  if (!post) notFound();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Blog Yazısı Düzenle</h1>
        <p className="mt-1 text-sm text-gray-500">{post.title}</p>
      </div>
      <div className="max-w-3xl">
        <BlogForm post={{
          id: post.id, title: post.title, slug: post.slug,
          excerpt: post.excerpt, content: post.content, status: post.status,
          seoTitle: post.seoTitle, seoDesc: post.seoDesc,
          publishedAt: post.publishedAt, author: post.author,
        }} />
      </div>
    </div>
  );
}
