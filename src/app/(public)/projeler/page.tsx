import { prisma } from "@/lib/db";
import Link from "next/link";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Projelerimiz",
  description: "Tamamladığımız ve sürdürdüğümüz inşaat projeleri",
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

function mediaUrl(storageKey: string) {
  return `${BASE_URL}/${storageKey}`;
}

async function getPublishedProjects() {
  return prisma.project.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ isFeatured: "desc" }, { completionDate: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      title: true,
      slug: true,
      summary: true,
      locationLabel: true,
      projectType: true,
      completionDate: true,
      isFeatured: true,
      coverMedia: { select: { storageKey: true, altText: true } },
      _count: { select: { projectMedia: true } },
    },
  });
}

export default async function ProjelerPage() {
  const projects = await getPublishedProjects();
  const featured = projects.filter((p) => p.isFeatured);
  const rest = projects.filter((p) => !p.isFeatured);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-blue-900 py-16 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-2 text-sm text-blue-300">
            <Link href="/" className="hover:text-white">Ana Sayfa</Link>
            {" / "}
            <span>Projeler</span>
          </div>
          <h1 className="mt-2 text-4xl font-bold">Projelerimiz</h1>
          <p className="mt-3 text-lg text-blue-200">
            {projects.length} tamamlanmış proje ile kaliteyi kanıtlıyoruz.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-6xl px-4">
          {projects.length === 0 && (
            <p className="py-20 text-center text-gray-400">
              Yakında projelerimiz yayınlanacak.
            </p>
          )}

          {/* Öne Çıkan Projeler */}
          {featured.length > 0 && (
            <div className="mb-14">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">Öne Çıkan Projeler</h2>
              <div className="grid gap-8 md:grid-cols-2">
                {featured.map((project) => (
                  <Link
                    key={project.id}
                    href={`/projeler/${project.slug}`}
                    className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-lg"
                  >
                    <div className="relative aspect-video overflow-hidden bg-blue-50">
                      {project.coverMedia ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={mediaUrl(project.coverMedia.storageKey)}
                          alt={project.coverMedia.altText ?? project.title}
                          className="h-full w-full object-cover transition group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-5xl text-blue-200">
                          🏗️
                        </div>
                      )}
                      <div className="absolute left-3 top-3 rounded-full bg-blue-700 px-3 py-1 text-xs font-semibold text-white">
                        Öne Çıkan
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700">
                        {project.title}
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-500">
                        {project.locationLabel && <span>📍 {project.locationLabel}</span>}
                        {project.projectType && <span>🏷️ {project.projectType}</span>}
                        {project.completionDate && (
                          <span>
                            📅 {new Date(project.completionDate).toLocaleDateString("tr-TR", { year: "numeric", month: "long" })}
                          </span>
                        )}
                      </div>
                      {project.summary && (
                        <p className="mt-3 line-clamp-2 text-gray-600">{project.summary}</p>
                      )}
                      <span className="mt-4 block text-sm font-medium text-blue-600 group-hover:underline">
                        Projeyi İncele →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Diğer Projeler */}
          {rest.length > 0 && (
            <div>
              {featured.length > 0 && (
                <h2 className="mb-6 text-2xl font-bold text-gray-900">Diğer Projeler</h2>
              )}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((project) => (
                  <Link
                    key={project.id}
                    href={`/projeler/${project.slug}`}
                    className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
                  >
                    <div className="aspect-video overflow-hidden bg-blue-50">
                      {project.coverMedia ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={mediaUrl(project.coverMedia.storageKey)}
                          alt={project.coverMedia.altText ?? project.title}
                          className="h-full w-full object-cover transition group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-4xl text-blue-200">
                          🏗️
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-700">
                        {project.title}
                      </h3>
                      <div className="mt-1.5 flex flex-wrap gap-2 text-xs text-gray-400">
                        {project.locationLabel && <span>{project.locationLabel}</span>}
                        {project.projectType && <span>· {project.projectType}</span>}
                      </div>
                      {project.summary && (
                        <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                          {project.summary}
                        </p>
                      )}
                      <span className="mt-3 block text-sm font-medium text-blue-600 group-hover:underline">
                        İncele →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-50 py-14">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Projenizi Hayata Geçirelim</h2>
          <p className="mt-3 text-gray-600">
            Ücretsiz keşif ve fiyat teklifi için formumuzu doldurun.
          </p>
          <Link
            href="/teklif-al"
            className="mt-6 inline-flex items-center rounded-lg bg-blue-700 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-blue-800"
          >
            Teklif Al
          </Link>
        </div>
      </section>
    </main>
  );
}
