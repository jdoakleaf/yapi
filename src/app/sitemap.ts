import { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { ContentStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Statik sayfalar
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/hizmetler`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/projeler`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/teklif-al`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/iletisim`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/sss`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  try {
    // Hizmet detay sayfaları
    const services = await prisma.service.findMany({
      where: { status: ContentStatus.PUBLISHED },
      select: { slug: true, updatedAt: true },
    });
    const servicePages: MetadataRoute.Sitemap = services.map((s) => ({
      url: `${BASE_URL}/hizmetler/${s.slug}`,
      lastModified: s.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

    // Proje detay sayfaları
    const projects = await prisma.project.findMany({
      where: { status: ContentStatus.PUBLISHED },
      select: { slug: true, updatedAt: true },
    });
    const projectPages: MetadataRoute.Sitemap = projects.map((p) => ({
      url: `${BASE_URL}/projeler/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    // Blog detay sayfaları
    const posts = await prisma.blogPost.findMany({
      where: { status: ContentStatus.PUBLISHED },
      select: { slug: true, updatedAt: true },
    });
    const blogPages: MetadataRoute.Sitemap = posts.map((p) => ({
      url: `${BASE_URL}/blog/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

    // Dinamik sayfalar (CMS Pages)
    const pages = await prisma.page.findMany({
      where: { status: ContentStatus.PUBLISHED },
      select: { slug: true, updatedAt: true },
    });
    const cmsPages: MetadataRoute.Sitemap = pages
      .filter((p) => p.slug !== "home" && p.slug !== "anasayfa")
      .map((p) => ({
        url: `${BASE_URL}/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }));

    return [
      ...staticPages,
      ...servicePages,
      ...projectPages,
      ...blogPages,
      ...cmsPages,
    ];
  } catch {
    return staticPages;
  }
}
