"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod/v4";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth/rbac";
import { generateUniqueSlug } from "@/lib/cms/slug";
import { validateBlockContent } from "@/lib/cms/blocks";
import { Prisma } from "@prisma/client";

// ---------------------------------------------------------------------------
// Sayfa CRUD
// ---------------------------------------------------------------------------

const PageCreateSchema = z.object({
  title: z.string().min(1, "Başlık zorunludur").max(200),
  slug: z.string().max(200).optional(),
  excerpt: z.string().max(500).optional(),
  templateKey: z.string().max(50).optional(),
  seoTitle: z.string().max(200).optional(),
  seoDesc: z.string().max(400).optional(),
});

const PageUpdateSchema = PageCreateSchema.partial().extend({
  status: z.enum(["DRAFT", "REVIEW", "PUBLISHED", "ARCHIVED"]).optional(),
  publishedAt: z.string().datetime().optional(),
});

export type PageFormResult = {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
  pageId?: string;
  slug?: string;
};

export async function createPage(formData: FormData): Promise<PageFormResult> {
  try {
    const session = await requireAuth();

    const raw = {
      title: formData.get("title"),
      slug: formData.get("slug") || undefined,
      excerpt: formData.get("excerpt") || undefined,
      templateKey: formData.get("templateKey") || undefined,
      seoTitle: formData.get("seoTitle") || undefined,
      seoDesc: formData.get("seoDesc") || undefined,
    };

    const parsed = PageCreateSchema.safeParse(raw);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[String(issue.path[0])] = issue.message;
      }
      return { success: false, fieldErrors };
    }

    const data = parsed.data;
    // Slug: kullanıcı slug girdiyse onu kullan, yoksa başlıktan üret
    const slugBase = data.slug || data.title;
    const slug = await generateUniqueSlug(slugBase, "page");

    const page = await prisma.page.create({
      data: {
        title: data.title,
        slug,
        excerpt: data.excerpt,
        templateKey: data.templateKey,
        seoTitle: data.seoTitle,
        seoDesc: data.seoDesc,
        createdBy: session.user!.id,
        updatedBy: session.user!.id,
      },
    });

    revalidatePath("/admin/sayfalar");
    return { success: true, pageId: page.id, slug: page.slug };
  } catch (err) {
    console.error("[createPage]", err);
    return { success: false, error: "Sayfa oluşturulamadı." };
  }
}

export async function updatePage(
  pageId: string,
  formData: FormData
): Promise<PageFormResult> {
  try {
    const session = await requireAuth();

    const raw = {
      title: formData.get("title") || undefined,
      slug: formData.get("slug") || undefined,
      excerpt: formData.get("excerpt") || undefined,
      seoTitle: formData.get("seoTitle") || undefined,
      seoDesc: formData.get("seoDesc") || undefined,
      status: formData.get("status") || undefined,
    };

    const parsed = PageUpdateSchema.safeParse(raw);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[String(issue.path[0])] = issue.message;
      }
      return { success: false, fieldErrors };
    }

    const data = parsed.data;

    // Slug değiştiyse çakışma kontrolü
    let slug: string | undefined;
    if (data.slug) {
      slug = await generateUniqueSlug(data.slug, "page", pageId);
    } else if (data.title) {
      const existing = await prisma.page.findUnique({ where: { id: pageId }, select: { slug: true } });
      slug = existing?.slug;
    }

    const updateData: Prisma.PageUncheckedUpdateInput = {
      ...(data.title && { title: data.title }),
      ...(slug && { slug }),
      excerpt: data.excerpt,
      seoTitle: data.seoTitle,
      seoDesc: data.seoDesc,
      updatedBy: session.user!.id,
    };

    if (data.status) {
      updateData.status = data.status;
      if (data.status === "PUBLISHED") {
        updateData.publishedAt = new Date();
      }
    }

    await prisma.page.update({ where: { id: pageId }, data: updateData });

    revalidatePath("/admin/sayfalar");
    revalidatePath(`/admin/sayfalar/${pageId}`);
    return { success: true, pageId, slug };
  } catch (err) {
    console.error("[updatePage]", err);
    return { success: false, error: "Sayfa güncellenemedi." };
  }
}

export async function deletePage(pageId: string): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAuth();
    await prisma.page.delete({ where: { id: pageId } });
    revalidatePath("/admin/sayfalar");
    return { success: true };
  } catch (err) {
    console.error("[deletePage]", err);
    return { success: false, error: "Sayfa silinemedi." };
  }
}

// ---------------------------------------------------------------------------
// PageSection (blok) CRUD
// ---------------------------------------------------------------------------

export type SectionResult = {
  success: boolean;
  error?: string;
  sectionId?: string;
};

export async function addPageSection(
  pageId: string,
  blockType: string,
  contentJson: unknown
): Promise<SectionResult> {
  try {
    await requireAuth();

    const validation = validateBlockContent(blockType, contentJson);
    if (!validation.success) {
      return { success: false, error: validation.error };
    }

    // Son sıra numarasını bul
    const last = await prisma.pageSection.findFirst({
      where: { pageId },
      orderBy: { sortOrder: "desc" },
      select: { sortOrder: true },
    });

    const section = await prisma.pageSection.create({
      data: {
        pageId,
        blockType,
        contentJson: validation.data as Prisma.InputJsonValue,
        sortOrder: (last?.sortOrder ?? -1) + 1,
        isActive: true,
      },
    });

    revalidatePath(`/admin/sayfalar/${pageId}`);
    return { success: true, sectionId: section.id };
  } catch (err) {
    console.error("[addPageSection]", err);
    return { success: false, error: "Blok eklenemedi." };
  }
}

export async function updatePageSection(
  sectionId: string,
  contentJson: unknown,
  isActive?: boolean
): Promise<SectionResult> {
  try {
    await requireAuth();

    const section = await prisma.pageSection.findUnique({
      where: { id: sectionId },
      select: { blockType: true, pageId: true },
    });
    if (!section) return { success: false, error: "Blok bulunamadı." };

    const validation = validateBlockContent(section.blockType, contentJson);
    if (!validation.success) {
      return { success: false, error: validation.error };
    }

    await prisma.pageSection.update({
      where: { id: sectionId },
      data: {
        contentJson: validation.data as Prisma.InputJsonValue,
        ...(isActive !== undefined && { isActive }),
      },
    });

    revalidatePath(`/admin/sayfalar/${section.pageId}`);
    return { success: true, sectionId };
  } catch (err) {
    console.error("[updatePageSection]", err);
    return { success: false, error: "Blok güncellenemedi." };
  }
}

export async function deletePageSection(sectionId: string): Promise<SectionResult> {
  try {
    await requireAuth();
    const section = await prisma.pageSection.findUnique({
      where: { id: sectionId },
      select: { pageId: true },
    });
    await prisma.pageSection.delete({ where: { id: sectionId } });
    if (section) revalidatePath(`/admin/sayfalar/${section.pageId}`);
    return { success: true };
  } catch (err) {
    console.error("[deletePageSection]", err);
    return { success: false, error: "Blok silinemedi." };
  }
}

export async function reorderPageSections(
  pageId: string,
  orderedIds: string[]
): Promise<SectionResult> {
  try {
    await requireAuth();

    await prisma.$transaction(
      orderedIds.map((id, idx) =>
        prisma.pageSection.update({
          where: { id },
          data: { sortOrder: idx },
        })
      )
    );

    revalidatePath(`/admin/sayfalar/${pageId}`);
    return { success: true };
  } catch (err) {
    console.error("[reorderPageSections]", err);
    return { success: false, error: "Sıralama güncellenemedi." };
  }
}

export async function toggleSectionActive(
  sectionId: string,
  isActive: boolean
): Promise<SectionResult> {
  try {
    await requireAuth();
    const section = await prisma.pageSection.findUnique({
      where: { id: sectionId },
      select: { pageId: true, blockType: true, contentJson: true },
    });
    if (!section) return { success: false, error: "Blok bulunamadı." };

    await prisma.pageSection.update({
      where: { id: sectionId },
      data: { isActive },
    });

    revalidatePath(`/admin/sayfalar/${section.pageId}`);
    return { success: true };
  } catch (err) {
    console.error("[toggleSectionActive]", err);
    return { success: false, error: "Blok durumu değiştirilemedi." };
  }
}
