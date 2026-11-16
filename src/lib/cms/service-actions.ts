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
// SCHEMAS
// ---------------------------------------------------------------------------

const CategorySchema = z.object({
  name: z.string().min(1, "Kategori adı zorunludur").max(100),
  slug: z.string().optional(),
  description: z.string().optional(),
  iconKey: z.string().optional(),
  sortOrder: z.coerce.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
  seoTitle: z.string().optional(),
  seoDesc: z.string().optional(),
});

const ServiceSchema = z.object({
  categoryId: z.string().min(1, "Kategori seçimi zorunludur"),
  title: z.string().min(1, "Hizmet başlığı zorunludur").max(200),
  slug: z.string().optional(),
  shortDescription: z.string().optional(),
  content: z.string().optional(),
  isFeatured: z.boolean().default(false),
  sortOrder: z.coerce.number().int().min(0).default(0),
  seoTitle: z.string().optional(),
  seoDesc: z.string().optional(),
});

// ---------------------------------------------------------------------------
// SERVICE CATEGORY ACTIONS
// ---------------------------------------------------------------------------

export async function getServiceCategories() {
  return prisma.serviceCategory.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      _count: { select: { services: true } },
    },
  });
}

export async function getServiceCategory(id: string) {
  return prisma.serviceCategory.findUnique({
    where: { id },
    include: {
      _count: { select: { services: true } },
    },
  });
}

export async function createServiceCategory(formData: FormData) {
  const session = await requireAuth();

  const raw = {
    name: formData.get("name"),
    slug: formData.get("slug") || undefined,
    description: formData.get("description") || undefined,
    iconKey: formData.get("iconKey") || undefined,
    sortOrder: formData.get("sortOrder") || 0,
    isActive: formData.get("isActive") === "true",
    seoTitle: formData.get("seoTitle") || undefined,
    seoDesc: formData.get("seoDesc") || undefined,
  };

  const parsed = CategorySchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;
  const baseText = (data.slug && data.slug.length > 0) ? data.slug : data.name;
  const slug = await generateUniqueSlug(baseText, "serviceCategory");

  const category = await prisma.serviceCategory.create({
    data: {
      name: data.name,
      slug,
      description: data.description,
      sortOrder: data.sortOrder,
      isActive: data.isActive,
      seoTitle: data.seoTitle,
      seoDesc: data.seoDesc,
    },
  });

  void session; // audit log için ileride kullanılabilir

  revalidatePath("/admin/hizmetler/kategoriler");
  return { success: true, id: category.id };
}

export async function updateServiceCategory(id: string, formData: FormData) {
  await requireAuth();

  const raw = {
    name: formData.get("name"),
    slug: formData.get("slug") || undefined,
    description: formData.get("description") || undefined,
    iconKey: formData.get("iconKey") || undefined,
    sortOrder: formData.get("sortOrder") || 0,
    isActive: formData.get("isActive") === "true",
    seoTitle: formData.get("seoTitle") || undefined,
    seoDesc: formData.get("seoDesc") || undefined,
  };

  const parsed = CategorySchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;

  // Slug değiştiyse yeniden üret
  const existing = await prisma.serviceCategory.findUnique({ where: { id } });
  if (!existing) return { success: false, errors: { name: ["Kategori bulunamadı"] } };

  let slug = existing.slug;
  if (data.slug && data.slug !== existing.slug) {
    slug = await generateUniqueSlug(data.slug, "serviceCategory", id);
  }

  await prisma.serviceCategory.update({
    where: { id },
    data: {
      name: data.name,
      slug,
      description: data.description ?? null,
      sortOrder: data.sortOrder,
      isActive: data.isActive,
      seoTitle: data.seoTitle ?? null,
      seoDesc: data.seoDesc ?? null,
    },
  });

  revalidatePath("/admin/hizmetler/kategoriler");
  revalidatePath(`/admin/hizmetler/kategoriler/${id}`);
  return { success: true };
}

export async function deleteServiceCategory(id: string) {
  await requireAuth();

  const count = await prisma.service.count({ where: { categoryId: id } });
  if (count > 0) {
    return {
      success: false,
      error: `Bu kategoriye bağlı ${count} hizmet var. Önce hizmetleri silin veya başka kategoriye taşıyın.`,
    };
  }

  await prisma.serviceCategory.delete({ where: { id } });
  revalidatePath("/admin/hizmetler/kategoriler");
  return { success: true };
}

export async function reorderCategories(orderedIds: string[]) {
  await requireAuth();

  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.serviceCategory.update({
        where: { id },
        data: { sortOrder: index },
      })
    )
  );

  revalidatePath("/admin/hizmetler/kategoriler");
  return { success: true };
}

export async function toggleCategoryActive(id: string) {
  await requireAuth();

  const existing = await prisma.serviceCategory.findUnique({ where: { id } });
  if (!existing) return { success: false };

  await prisma.serviceCategory.update({
    where: { id },
    data: { isActive: !existing.isActive },
  });

  revalidatePath("/admin/hizmetler/kategoriler");
  return { success: true };
}

// ---------------------------------------------------------------------------
// SERVICE ACTIONS
// ---------------------------------------------------------------------------

interface GetServicesParams {
  page?: number;
  pageSize?: number;
  categoryId?: string;
  status?: ContentStatus;
  search?: string;
  isFeatured?: boolean;
}

export async function getServices(params: GetServicesParams = {}) {
  const { page, pageSize } = parsePagination({ page: params.page, pageSize: params.pageSize });

  const where: Prisma.ServiceWhereInput = {};
  if (params.categoryId) where.categoryId = params.categoryId;
  if (params.status) where.status = params.status;
  if (typeof params.isFeatured === "boolean") where.isFeatured = params.isFeatured;
  if (params.search) {
    where.OR = [
      { title: { contains: params.search } },
      { shortDescription: { contains: params.search } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.service.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        category: { select: { id: true, name: true } },
        _count: { select: { leads: true } },
      },
    }),
    prisma.service.count({ where }),
  ]);

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getService(id: string) {
  return prisma.service.findUnique({
    where: { id },
    include: {
      category: true,
      cardMedia: true,
      coverMedia: true,
      _count: { select: { leads: true } },
    },
  });
}

export async function getServiceBySlug(slug: string) {
  return prisma.service.findUnique({
    where: { slug },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      cardMedia: { select: { storageKey: true, altText: true } },
      coverMedia: { select: { storageKey: true, altText: true } },
      faqs: { orderBy: { sortOrder: "asc" } },
    },
  });
}

export async function createService(formData: FormData) {
  const session = await requireAuth();

  const raw = {
    categoryId: formData.get("categoryId"),
    title: formData.get("title"),
    slug: formData.get("slug") || undefined,
    shortDescription: formData.get("shortDescription") || undefined,
    content: formData.get("content") || undefined,
    isFeatured: formData.get("isFeatured") === "true",
    sortOrder: formData.get("sortOrder") || 0,
    seoTitle: formData.get("seoTitle") || undefined,
    seoDesc: formData.get("seoDesc") || undefined,
  };

  const parsed = ServiceSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;
  const baseText = (data.slug && data.slug.length > 0) ? data.slug : data.title;
  const slug = await generateUniqueSlug(baseText, "service");

  const userId = session.user!.id;

  const service = await prisma.service.create({
    data: {
      categoryId: data.categoryId,
      title: data.title,
      slug,
      shortDescription: data.shortDescription,
      content: data.content,
      isFeatured: data.isFeatured,
      sortOrder: data.sortOrder,
      seoTitle: data.seoTitle,
      seoDesc: data.seoDesc,
      createdBy: userId,
      updatedBy: userId,
    },
  });

  revalidatePath("/admin/hizmetler");
  revalidatePath("/hizmetler");
  return { success: true, id: service.id };
}

export async function updateService(id: string, formData: FormData) {
  const session = await requireAuth();

  const raw = {
    categoryId: formData.get("categoryId"),
    title: formData.get("title"),
    slug: formData.get("slug") || undefined,
    shortDescription: formData.get("shortDescription") || undefined,
    content: formData.get("content") || undefined,
    isFeatured: formData.get("isFeatured") === "true",
    sortOrder: formData.get("sortOrder") || 0,
    seoTitle: formData.get("seoTitle") || undefined,
    seoDesc: formData.get("seoDesc") || undefined,
  };

  const parsed = ServiceSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;
  const existing = await prisma.service.findUnique({ where: { id } });
  if (!existing) return { success: false, errors: { title: ["Hizmet bulunamadı"] } };

  let slug = existing.slug;
  if (data.slug && data.slug !== existing.slug) {
    slug = await generateUniqueSlug(data.slug, "service", id);
  }

  const userId = session.user!.id;

  // Status değişikliği varsa (formdan geliyorsa ayrıca işle)
  const rawStatus = formData.get("status") as ContentStatus | null;
  let publishedAt = existing.publishedAt;
  if (rawStatus && rawStatus !== existing.status) {
    if (!canTransition(existing.status, rawStatus)) {
      return { success: false, errors: { title: ["Geçersiz durum geçişi"] } };
    }
    if (rawStatus === "PUBLISHED" && !publishedAt) {
      publishedAt = new Date();
    }
  }

  const updateData: Prisma.ServiceUncheckedUpdateInput = {
    categoryId: data.categoryId,
    title: data.title,
    slug,
    shortDescription: data.shortDescription ?? null,
    content: data.content ?? null,
    isFeatured: data.isFeatured,
    sortOrder: data.sortOrder,
    seoTitle: data.seoTitle ?? null,
    seoDesc: data.seoDesc ?? null,
    updatedBy: userId,
  };

  if (rawStatus) {
    updateData.status = rawStatus;
    updateData.publishedAt = publishedAt;
  }

  await prisma.service.update({ where: { id }, data: updateData });

  revalidatePath("/admin/hizmetler");
  revalidatePath(`/admin/hizmetler/${id}`);
  revalidatePath(`/hizmetler/${slug}`);
  revalidatePath("/hizmetler");
  return { success: true };
}

export async function deleteService(id: string) {
  await requireAuth();

  const leadCount = await prisma.lead.count({ where: { serviceId: id } });
  if (leadCount > 0) {
    // Soft delete: archive instead
    const existing = await prisma.service.findUnique({ where: { id } });
    if (existing) {
      await prisma.service.update({
        where: { id },
        data: { status: "ARCHIVED" },
      });
      revalidatePath("/admin/hizmetler");
      return { success: true, archived: true };
    }
  }

  await prisma.service.delete({ where: { id } });
  revalidatePath("/admin/hizmetler");
  revalidatePath("/hizmetler");
  return { success: true, archived: false };
}

export async function toggleServiceFeatured(id: string) {
  await requireAuth();

  const existing = await prisma.service.findUnique({ where: { id } });
  if (!existing) return { success: false };

  await prisma.service.update({
    where: { id },
    data: { isFeatured: !existing.isFeatured },
  });

  revalidatePath("/admin/hizmetler");
  revalidatePath("/hizmetler");
  return { success: true };
}

export async function updateServiceStatus(id: string, status: ContentStatus) {
  const session = await requireAuth();

  const existing = await prisma.service.findUnique({ where: { id } });
  if (!existing) return { success: false };

  if (!canTransition(existing.status, status)) {
    return { success: false, error: "Geçersiz durum geçişi" };
  }

  const publishedAt =
    status === "PUBLISHED" && !existing.publishedAt ? new Date() : existing.publishedAt;

  const updateData: Prisma.ServiceUncheckedUpdateInput = {
    status,
    publishedAt,
    updatedBy: session.user!.id,
  };

  await prisma.service.update({ where: { id }, data: updateData });

  revalidatePath("/admin/hizmetler");
  revalidatePath(`/admin/hizmetler/${id}`);
  revalidatePath("/hizmetler");
  return { success: true };
}
