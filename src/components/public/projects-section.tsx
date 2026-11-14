import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ContentStatus } from "@prisma/client";
import { prisma } from "@/lib/db";

async function getFeaturedProjects() {
  return prisma.project.findMany({
    where: {
      status: ContentStatus.PUBLISHED,
      isFeatured: true,
    },
    orderBy: { createdAt: "desc" },
    take: 4,
    include: {
      coverMedia: { select: { storageKey: true, altText: true } },
    },
  });
}

export async function ProjectsSection() {
  const projects = await getFeaturedProjects();

  if (projects.length === 0) return null;

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Başlık */}
        <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-widest text-[#1769AA]">
              Projelerimiz
            </span>
            <h2 className="text-3xl font-extrabold text-[#101F33] sm:text-4xl">
              Öne Çıkan Projeler
            </h2>
          </div>
          <Link
            href="/projeler"
            className="flex items-center gap-1.5 text-sm font-semibold text-[#1769AA] hover:underline"
          >
            Tüm Projeler
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {projects.map((project, i) => {
            const coverUrl = project.coverMedia
              ? `/${project.coverMedia.storageKey}`
              : null;

            return (
              <Link
                key={project.id}
                href={`/projeler/${project.slug}`}
                className={`group relative overflow-hidden rounded-2xl bg-gray-100 ${i === 0 ? "sm:col-span-2 sm:row-span-2" : ""}`}
              >
                <div
                  className={`relative w-full bg-gradient-to-br from-[#101F33] to-[#1769AA] ${i === 0 ? "h-80 sm:h-full sm:min-h-[400px]" : "h-56"}`}
                >
                  {coverUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={coverUrl}
                      alt={project.coverMedia?.altText ?? project.title}
                      className="h-full w-full object-cover opacity-80 transition group-hover:opacity-70 group-hover:scale-105"
                    />
                  )}
                </div>
                {/* Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/20 to-transparent p-5">
                  {project.locationLabel && (
                    <span className="mb-1 text-xs font-medium text-gray-300">
                      {project.locationLabel}
                    </span>
                  )}
                  <h3 className="font-bold text-white line-clamp-2">
                    {project.title}
                  </h3>
                  {project.summary && (
                    <p className="mt-1 text-xs text-gray-300 line-clamp-1">
                      {project.summary}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
