"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth/rbac";
import { generateUniqueSlug } from "@/lib/cms/slug";
import { parsePagination } from "@/lib/cms/pagination";
import { canTransition } from "@/lib/cms/status";
import type { ContentStatus, Prisma } from "@prisma/client";

// ---------------------------------------------------------------------------
// BLOG ACTIONS
// ---------------------------------------------------------------------------

const BlogSchema = z.object({
  title: z.string().min(1, "Başlık zorunludur").max(200),
  slug: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDesc: z.string().optional(),
});

interface GetBlogPostsParams {
  page?: number;
  pageSize?: number;
  status?: ContentStatus;
  search?: string;
}

export async function getBlogPosts(params: GetBlogPostsParams = {}) {
  const { page, pageSize } = parsePagination({ page: params.page, pageSize: params.pageSize });

  const where: Prisma.BlogPostWhereInput = {};
  if (params.status) where.status = params.status;
  if (params.search) {
    where.OR = [
      { title: { contains: params.search, mode: "insensitive" } },
      { excerpt: { contains: params.search, mode: "insensitive" } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        status: true,
        publishedAt: true,
        author: { select: { id: true, name: true } },
        coverMedia: { select: { storageKey: true, altText: true } },
      },
    }),
    prisma.blogPost.count({ where }),
  ]);

  return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

export async function getBlogPost(id: string) {
  return prisma.blogPost.findUnique({
    where: { id },
    include: {
      coverMedia: { select: { id: true, storageKey: true, altText: true } },
      author: { select: { id: true, name: true } },
    },
  });
}

export async function getBlogPostBySlug(slug: string) {
  return prisma.blogPost.findUnique({
    where: { slug },
    include: {
      coverMedia: { select: { storageKey: true, altText: true } },
      author: { select: { name: true } },
    },
  });
}

export async function createBlogPost(formData: FormData) {
  const session = await requireAuth();

  const raw = {
    title: formData.get("title"),
    slug: formData.get("slug") || undefined,
    excerpt: formData.get("excerpt") || undefined,
    content: formData.get("content") || undefined,
    seoTitle: formData.get("seoTitle") || undefined,
    seoDesc: formData.get("seoDesc") || undefined,
  };

  const parsed = BlogSchema.safeParse(raw);
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors };

  const data = parsed.data;
  const baseText = (data.slug && data.slug.length > 0) ? data.slug : data.title;
  const slug = await generateUniqueSlug(baseText, "blogPost");

  const post = await prisma.blogPost.create({
    data: {
      title: data.title,
      slug,
      excerpt: data.excerpt,
      content: data.content,
      seoTitle: data.seoTitle,
      seoDesc: data.seoDesc,
      authorId: session.user!.id,
    },
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  return { success: true, id: post.id };
}

export async function updateBlogPost(id: string, formData: FormData) {
  const session = await requireAuth();

  const raw = {
    title: formData.get("title"),
    slug: formData.get("slug") || undefined,
    excerpt: formData.get("excerpt") || undefined,
    content: formData.get("content") || undefined,
    seoTitle: formData.get("seoTitle") || undefined,
    seoDesc: formData.get("seoDesc") || undefined,
  };

  const parsed = BlogSchema.safeParse(raw);
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors };

  const data = parsed.data;
  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) return { success: false, errors: { title: ["Yazı bulunamadı"] } };

  let slug = existing.slug;
  if (data.slug && data.slug !== existing.slug) {
    slug = await generateUniqueSlug(data.slug, "blogPost", id);
  }

  const rawStatus = formData.get("status") as ContentStatus | null;
  let publishedAt = existing.publishedAt;
  if (rawStatus && rawStatus !== existing.status) {
    if (!canTransition(existing.status, rawStatus)) {
      return { success: false, errors: { title: ["Geçersiz durum geçişi"] } };
    }
    if (rawStatus === "PUBLISHED" && !publishedAt) publishedAt = new Date();
  }

  const updateData: Prisma.BlogPostUncheckedUpdateInput = {
    title: data.title,
    slug,
    excerpt: data.excerpt ?? null,
    content: data.content ?? null,
    seoTitle: data.seoTitle ?? null,
    seoDesc: data.seoDesc ?? null,
    authorId: session.user!.id,
  };
  if (rawStatus) { updateData.status = rawStatus; updateData.publishedAt = publishedAt; }

  await prisma.blogPost.update({ where: { id }, data: updateData });

  revalidatePath("/admin/blog");
  revalidatePath(`/admin/blog/${id}`);
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/blog");
  return { success: true };
}

export async function deleteBlogPost(id: string) {
  await requireAuth();
  await prisma.blogPost.delete({ where: { id } });
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  return { success: true };
}

export async function updateBlogPostStatus(id: string, status: ContentStatus) {
  const session = await requireAuth();
  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) return { success: false };
  if (!canTransition(existing.status, status)) return { success: false, error: "Geçersiz durum" };

  const publishedAt = status === "PUBLISHED" && !existing.publishedAt ? new Date() : existing.publishedAt;
  await prisma.blogPost.update({
    where: { id },
    data: { status, publishedAt, authorId: session.user!.id },
  });

  revalidatePath("/admin/blog");
  revalidatePath(`/admin/blog/${id}`);
  revalidatePath("/blog");
  return { success: true };
}

// ---------------------------------------------------------------------------
// FAQ ACTIONS
// ---------------------------------------------------------------------------

const FAQSchema = z.object({
  question: z.string().min(1, "Soru zorunludur"),
  answer: z.string().min(1, "Yanıt zorunludur"),
  serviceId: z.string().optional(),
  sortOrder: z.coerce.number().int().min(0).default(0),
  isPublished: z.boolean().default(false),
});

export async function getFAQs(serviceId?: string) {
  return prisma.fAQ.findMany({
    where: serviceId ? { serviceId } : {},
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    include: { service: { select: { id: true, title: true } } },
  });
}

export async function createFAQ(formData: FormData) {
  await requireAuth();

  const raw = {
    question: formData.get("question"),
    answer: formData.get("answer"),
    serviceId: formData.get("serviceId") || undefined,
    sortOrder: formData.get("sortOrder") || 0,
    isPublished: formData.get("isPublished") === "true",
  };

  const parsed = FAQSchema.safeParse(raw);
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors };

  const faq = await prisma.fAQ.create({
    data: {
      question: parsed.data.question,
      answer: parsed.data.answer,
      serviceId: parsed.data.serviceId || null,
      sortOrder: parsed.data.sortOrder,
      isPublished: parsed.data.isPublished,
    },
  });

  revalidatePath("/admin/sss");
  return { success: true, id: faq.id };
}

export async function updateFAQ(id: string, formData: FormData) {
  await requireAuth();

  const raw = {
    question: formData.get("question"),
    answer: formData.get("answer"),
    serviceId: formData.get("serviceId") || undefined,
    sortOrder: formData.get("sortOrder") || 0,
    isPublished: formData.get("isPublished") === "true",
  };

  const parsed = FAQSchema.safeParse(raw);
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors };

  await prisma.fAQ.update({
    where: { id },
    data: {
      question: parsed.data.question,
      answer: parsed.data.answer,
      serviceId: parsed.data.serviceId || null,
      sortOrder: parsed.data.sortOrder,
      isPublished: parsed.data.isPublished,
    },
  });

  revalidatePath("/admin/sss");
  return { success: true };
}

export async function deleteFAQ(id: string) {
  await requireAuth();
  await prisma.fAQ.delete({ where: { id } });
  revalidatePath("/admin/sss");
  return { success: true };
}

export async function toggleFAQPublished(id: string) {
  await requireAuth();
  const existing = await prisma.fAQ.findUnique({ where: { id } });
  if (!existing) return { success: false };
  await prisma.fAQ.update({ where: { id }, data: { isPublished: !existing.isPublished } });
  revalidatePath("/admin/sss");
  return { success: true };
}

// ---------------------------------------------------------------------------
// TESTIMONIAL ACTIONS
// ---------------------------------------------------------------------------

const TestimonialSchema = z.object({
  displayName: z.string().min(1, "İsim zorunludur"),
  companyOrLocation: z.string().optional(),
  quote: z.string().min(1, "Yorum zorunludur"),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  sortOrder: z.coerce.number().int().min(0).default(0),
  isPublished: z.boolean().default(false),
});

export async function getTestimonials(publishedOnly = false) {
  return prisma.testimonial.findMany({
    where: publishedOnly ? { isPublished: true } : {},
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    include: { media: { select: { storageKey: true, altText: true } } },
  });
}

export async function createTestimonial(formData: FormData) {
  await requireAuth();

  const raw = {
    displayName: formData.get("displayName"),
    companyOrLocation: formData.get("companyOrLocation") || undefined,
    quote: formData.get("quote"),
    rating: formData.get("rating") || undefined,
    sortOrder: formData.get("sortOrder") || 0,
    isPublished: formData.get("isPublished") === "true",
  };

  const parsed = TestimonialSchema.safeParse(raw);
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors };

  const t = await prisma.testimonial.create({
    data: {
      displayName: parsed.data.displayName,
      companyOrLocation: parsed.data.companyOrLocation,
      quote: parsed.data.quote,
      rating: parsed.data.rating ?? null,
      sortOrder: parsed.data.sortOrder,
      isPublished: parsed.data.isPublished,
    },
  });

  revalidatePath("/admin/yorumlar");
  return { success: true, id: t.id };
}

export async function updateTestimonial(id: string, formData: FormData) {
  await requireAuth();

  const raw = {
    displayName: formData.get("displayName"),
    companyOrLocation: formData.get("companyOrLocation") || undefined,
    quote: formData.get("quote"),
    rating: formData.get("rating") || undefined,
    sortOrder: formData.get("sortOrder") || 0,
    isPublished: formData.get("isPublished") === "true",
  };

  const parsed = TestimonialSchema.safeParse(raw);
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors };

  await prisma.testimonial.update({
    where: { id },
    data: {
      displayName: parsed.data.displayName,
      companyOrLocation: parsed.data.companyOrLocation ?? null,
      quote: parsed.data.quote,
      rating: parsed.data.rating ?? null,
      sortOrder: parsed.data.sortOrder,
      isPublished: parsed.data.isPublished,
    },
  });

  revalidatePath("/admin/yorumlar");
  return { success: true };
}

export async function deleteTestimonial(id: string) {
  await requireAuth();
  await prisma.testimonial.delete({ where: { id } });
  revalidatePath("/admin/yorumlar");
  return { success: true };
}

export async function toggleTestimonialPublished(id: string) {
  await requireAuth();
  const existing = await prisma.testimonial.findUnique({ where: { id } });
  if (!existing) return { success: false };
  await prisma.testimonial.update({ where: { id }, data: { isPublished: !existing.isPublished } });
  revalidatePath("/admin/yorumlar");
  return { success: true };
}

// ---------------------------------------------------------------------------
// MENU ACTIONS
// ---------------------------------------------------------------------------

export async function getMenus() {
  return prisma.menu.findMany({
    orderBy: { name: "asc" },
    include: {
      items: {
        orderBy: { sortOrder: "asc" },
        where: { parentId: null },
        include: {
          children: { orderBy: { sortOrder: "asc" } },
        },
      },
    },
  });
}

export async function getMenu(key: string) {
  return prisma.menu.findUnique({
    where: { key },
    include: {
      items: {
        orderBy: { sortOrder: "asc" },
        where: { parentId: null },
        include: {
          children: { orderBy: { sortOrder: "asc" } },
        },
      },
    },
  });
}

export async function upsertMenu(name: string, key: string) {
  await requireAuth();
  const menu = await prisma.menu.upsert({
    where: { key },
    create: { name, key },
    update: { name },
  });
  revalidatePath("/admin/menuler");
  return { success: true, id: menu.id };
}

export async function addMenuItem(
  menuId: string,
  data: { label: string; url: string; target?: string; parentId?: string }
) {
  await requireAuth();

  const maxOrder = await prisma.menuItem.aggregate({
    where: { menuId, parentId: data.parentId ?? null },
    _max: { sortOrder: true },
  });

  await prisma.menuItem.create({
    data: {
      menuId,
      parentId: data.parentId ?? null,
      label: data.label,
      url: data.url,
      target: data.target ?? "_self",
      sortOrder: (maxOrder._max.sortOrder ?? -1) + 1,
    },
  });

  revalidatePath("/admin/menuler");
  return { success: true };
}

export async function updateMenuItem(
  id: string,
  data: { label: string; url: string; target?: string; isActive?: boolean }
) {
  await requireAuth();
  await prisma.menuItem.update({
    where: { id },
    data: {
      label: data.label,
      url: data.url,
      target: data.target ?? "_self",
      isActive: data.isActive ?? true,
    },
  });
  revalidatePath("/admin/menuler");
  return { success: true };
}

export async function deleteMenuItem(id: string) {
  await requireAuth();
  // Alt öğeleri cascade ile silinir (SetNull ile parent ayarı kaldırılır)
  await prisma.menuItem.deleteMany({ where: { parentId: id } });
  await prisma.menuItem.delete({ where: { id } });
  revalidatePath("/admin/menuler");
  return { success: true };
}

export async function reorderMenuItems(orderedIds: string[]) {
  await requireAuth();
  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.menuItem.update({ where: { id }, data: { sortOrder: index } })
    )
  );
  revalidatePath("/admin/menuler");
  return { success: true };
}
