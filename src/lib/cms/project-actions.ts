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

const ProjectSchema = z.object({
  title: z.string().min(1, "Proje başlığı zorunludur").max(200),
  slug: z.string().optional(),
  summary: z.string().optional(),
  description: z.string().optional(),
  locationLabel: z.string().optional(),
  projectType: z.string().optional(),
  completionDate: z.string().optional(), // ISO date string
  isFeatured: z.boolean().default(false),
  seoTitle: z.string().optional(),
  seoDesc: z.string().optional(),
});

// ---------------------------------------------------------------------------
// PROJECT ACTIONS
// ---------------------------------------------------------------------------

interface GetProjectsParams {
  page?: number;
  pageSize?: number;
  status?: ContentStatus;
  isFeatured?: boolean;
  search?: string;
}

export async function getProjects(params: GetProjectsParams = {}) {
  const { page, pageSize } = parsePagination({
    page: params.page,
    pageSize: params.pageSize,
  });

  const where: Prisma.ProjectWhereInput = {};
  if (params.status) where.status = params.status;
  if (typeof params.isFeatured === "boolean") where.isFeatured = params.isFeatured;
  if (params.search) {
    where.OR = [
      { title: { contains: params.search } },
      { summary: { contains: params.search } },
      { locationLabel: { contains: params.search } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.project.findMany({
      where,
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        title: true,
        slug: true,
        summary: true,
        locationLabel: true,
        projectType: true,
        completionDate: true,
        status: true,
        isFeatured: true,
        coverMedia: { select: { storageKey: true, altText: true } },
        _count: { select: { projectMedia: true, projectServices: true } },
      },
    }),
    prisma.project.count({ where }),
  ]);

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getProject(id: string) {
  return prisma.project.findUnique({
    where: { id },
    include: {
      coverMedia: { select: { id: true, storageKey: true, altText: true } },
      projectServices: {
        include: {
          service: { select: { id: true, title: true, category: { select: { name: true } } } },
        },
      },
      projectMedia: {
        orderBy: { sortOrder: "asc" },
        include: {
          media: { select: { id: true, storageKey: true, altText: true, title: true } },
        },
      },
    },
  });
}

export async function getProjectBySlug(slug: string) {
  return prisma.project.findUnique({
    where: { slug },
    include: {
      coverMedia: { select: { storageKey: true, altText: true } },
      projectMedia: {
        orderBy: { sortOrder: "asc" },
        include: {
          media: { select: { storageKey: true, altText: true, title: true } },
        },
      },
      projectServices: {
        include: {
          service: { select: { id: true, title: true, slug: true } },
        },
      },
    },
  });
}

export async function createProject(formData: FormData) {
  const session = await requireAuth();

  const raw = {
    title: formData.get("title"),
    slug: formData.get("slug") || undefined,
    summary: formData.get("summary") || undefined,
    description: formData.get("description") || undefined,
    locationLabel: formData.get("locationLabel") || undefined,
    projectType: formData.get("projectType") || undefined,
    completionDate: formData.get("completionDate") || undefined,
    isFeatured: formData.get("isFeatured") === "true",
    seoTitle: formData.get("seoTitle") || undefined,
    seoDesc: formData.get("seoDesc") || undefined,
  };

  const parsed = ProjectSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;
  const baseText = (data.slug && data.slug.length > 0) ? data.slug : data.title;
  const slug = await generateUniqueSlug(baseText, "project");
  const userId = session.user!.id;

  const project = await prisma.project.create({
    data: {
      title: data.title,
      slug,
      summary: data.summary,
      description: data.description,
      locationLabel: data.locationLabel,
      projectType: data.projectType,
      completionDate: data.completionDate ? new Date(data.completionDate) : null,
      isFeatured: data.isFeatured,
      seoTitle: data.seoTitle,
      seoDesc: data.seoDesc,
      createdBy: userId,
      updatedBy: userId,
    },
  });

  revalidatePath("/admin/projeler");
  revalidatePath("/projeler");
  return { success: true, id: project.id };
}

export async function updateProject(id: string, formData: FormData) {
  const session = await requireAuth();

  const raw = {
    title: formData.get("title"),
    slug: formData.get("slug") || undefined,
    summary: formData.get("summary") || undefined,
    description: formData.get("description") || undefined,
    locationLabel: formData.get("locationLabel") || undefined,
    projectType: formData.get("projectType") || undefined,
    completionDate: formData.get("completionDate") || undefined,
    isFeatured: formData.get("isFeatured") === "true",
    seoTitle: formData.get("seoTitle") || undefined,
    seoDesc: formData.get("seoDesc") || undefined,
  };

  const parsed = ProjectSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;
  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing) return { success: false, errors: { title: ["Proje bulunamadı"] } };

  let slug = existing.slug;
  if (data.slug && data.slug !== existing.slug) {
    slug = await generateUniqueSlug(data.slug, "project", id);
  }

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

  const updateData: Prisma.ProjectUncheckedUpdateInput = {
    title: data.title,
    slug,
    summary: data.summary ?? null,
    description: data.description ?? null,
    locationLabel: data.locationLabel ?? null,
    projectType: data.projectType ?? null,
    completionDate: data.completionDate ? new Date(data.completionDate) : null,
    isFeatured: data.isFeatured,
    seoTitle: data.seoTitle ?? null,
    seoDesc: data.seoDesc ?? null,
    updatedBy: session.user!.id,
  };

  if (rawStatus) {
    updateData.status = rawStatus;
    updateData.publishedAt = publishedAt;
  }

  await prisma.project.update({ where: { id }, data: updateData });

  revalidatePath("/admin/projeler");
  revalidatePath(`/admin/projeler/${id}`);
  revalidatePath(`/projeler/${slug}`);
  revalidatePath("/projeler");
  return { success: true };
}

export async function deleteProject(id: string) {
  await requireAuth();
  // ProjectMedia cascade ile silinir (schema: onDelete: Cascade)
  await prisma.project.delete({ where: { id } });
  revalidatePath("/admin/projeler");
  revalidatePath("/projeler");
  return { success: true };
}

export async function toggleProjectFeatured(id: string) {
  await requireAuth();
  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing) return { success: false };

  await prisma.project.update({
    where: { id },
    data: { isFeatured: !existing.isFeatured },
  });

  revalidatePath("/admin/projeler");
  return { success: true };
}

export async function updateProjectStatus(id: string, status: ContentStatus) {
  const session = await requireAuth();
  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing) return { success: false };

  if (!canTransition(existing.status, status)) {
    return { success: false, error: "Geçersiz durum geçişi" };
  }

  const publishedAt =
    status === "PUBLISHED" && !existing.publishedAt ? new Date() : existing.publishedAt;

  const updateData: Prisma.ProjectUncheckedUpdateInput = {
    status,
    publishedAt,
    updatedBy: session.user!.id,
  };

  await prisma.project.update({ where: { id }, data: updateData });
  revalidatePath("/admin/projeler");
  revalidatePath(`/admin/projeler/${id}`);
  revalidatePath("/projeler");
  return { success: true };
}

// ---------------------------------------------------------------------------
// PROJECT SERVICE (ilişkilendirme)
// ---------------------------------------------------------------------------

export async function setProjectServices(projectId: string, serviceIds: string[]) {
  await requireAuth();

  await prisma.$transaction([
    prisma.projectService.deleteMany({ where: { projectId } }),
    ...(serviceIds.length > 0
      ? [
          prisma.projectService.createMany({
            data: serviceIds.map((serviceId) => ({ projectId, serviceId })),
            skipDuplicates: true,
          }),
        ]
      : []),
  ]);

  revalidatePath(`/admin/projeler/${projectId}`);
  return { success: true };
}

// ---------------------------------------------------------------------------
// PROJECT MEDIA (galeri)
// ---------------------------------------------------------------------------

export async function addProjectMedia(
  projectId: string,
  mediaId: string,
  caption?: string
) {
  await requireAuth();

  const maxOrder = await prisma.projectMedia.aggregate({
    where: { projectId },
    _max: { sortOrder: true },
  });

  await prisma.projectMedia.create({
    data: {
      projectId,
      mediaId,
      caption: caption ?? null,
      sortOrder: (maxOrder._max.sortOrder ?? -1) + 1,
    },
  });

  revalidatePath(`/admin/projeler/${projectId}`);
  return { success: true };
}

export async function removeProjectMedia(id: string, projectId: string) {
  await requireAuth();
  await prisma.projectMedia.delete({ where: { id } });
  revalidatePath(`/admin/projeler/${projectId}`);
  return { success: true };
}

export async function reorderProjectMedia(
  projectId: string,
  orderedIds: string[]
) {
  await requireAuth();

  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.projectMedia.update({
        where: { id },
        data: { sortOrder: index },
      })
    )
  );

  revalidatePath(`/admin/projeler/${projectId}`);
  return { success: true };
}
