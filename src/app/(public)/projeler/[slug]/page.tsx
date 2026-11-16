import { getProjectBySlug, getProjects } from "@/lib/cms/project-actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/components/seo/json-ld";

interface Props {
  params: Promise<{ slug: string }>;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

function mediaUrl(storageKey: string) {
  return `${BASE_URL}/${storageKey}`;
}


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project || project.status !== "PUBLISHED") {
    return { title: "Proje Bulunamadı" };
  }

  const coverUrl = project.coverMedia ? mediaUrl(project.coverMedia.storageKey) : undefined;

  return {
    title: project.seoTitle ?? project.title,
    description: project.seoDesc ?? project.summary ?? undefined,
    openGraph: {
      title: project.seoTitle ?? project.title,
      description: project.seoDesc ?? project.summary ?? undefined,
      images: coverUrl ? [coverUrl] : [],
    },
  };
}

export default async function ProjeDetayPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project || project.status !== "PUBLISHED") notFound();

  // İlgili projeler — aynı proje türünden veya son eklenenler
  const relatedResult = await getProjects({ status: "PUBLISHED", pageSize: 4 });
  const related = relatedResult.items
    .filter((p) => p.id !== project.id)
    .slice(0, 3);

  const coverUrl = project.coverMedia ? mediaUrl(project.coverMedia.storageKey) : null;
  const galleryItems = project.projectMedia;
  const linkedServices = project.projectServices;

  return (
    <main className="min-h-screen bg-white">
      <BreadcrumbSchema
        items={[
          { name: "Ana Sayfa", href: "/" },
          { name: "Projeler", href: "/projeler" },
          { name: project.title, href: `/projeler/${project.slug}` },
        ]}
      />
      {/* Kapak */}
      {coverUrl ? (
        <div className="relative h-72 overflow-hidden bg-blue-900 md:h-[420px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverUrl}
            alt={project.coverMedia?.altText ?? project.title}
            className="h-full w-full object-cover opacity-60"
          />
          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-blue-950/80 to-transparent p-8">
            <div className="mx-auto w-full max-w-6xl">
              <div className="mb-2 text-sm text-blue-200">
                <Link href="/" className="hover:text-white">Ana Sayfa</Link>
                {" / "}
                <Link href="/projeler" className="hover:text-white">Projeler</Link>
              </div>
              <h1 className="text-3xl font-bold text-white md:text-4xl">{project.title}</h1>
              <div className="mt-2 flex flex-wrap gap-4 text-sm text-blue-200">
                {project.locationLabel && <span>📍 {project.locationLabel}</span>}
                {project.projectType && <span>🏷️ {project.projectType}</span>}
                {project.completionDate && (
                  <span>
                    📅{" "}
                    {new Date(project.completionDate).toLocaleDateString("tr-TR", {
                      year: "numeric",
                      month: "long",
                    })}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <section className="bg-blue-900 py-14 text-white">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mb-2 text-sm text-blue-300">
              <Link href="/" className="hover:text-white">Ana Sayfa</Link>
              {" / "}
              <Link href="/projeler" className="hover:text-white">Projeler</Link>
            </div>
            <h1 className="mt-2 text-3xl font-bold md:text-4xl">{project.title}</h1>
            <div className="mt-2 flex flex-wrap gap-4 text-sm text-blue-300">
              {project.locationLabel && <span>📍 {project.locationLabel}</span>}
              {project.projectType && <span>🏷️ {project.projectType}</span>}
              {project.completionDate && (
                <span>
                  📅{" "}
                  {new Date(project.completionDate).toLocaleDateString("tr-TR", {
                    year: "numeric",
                    month: "long",
                  })}
                </span>
              )}
            </div>
          </div>
        </section>
      )}

      {/* İçerik */}
      <section className="py-14">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-10 lg:grid-cols-3">
            {/* Ana içerik */}
            <div className="lg:col-span-2">
              {project.summary && !coverUrl && (
                <p className="mb-6 text-lg text-gray-600">{project.summary}</p>
              )}
              {project.summary && coverUrl && (
                <p className="mb-6 text-lg text-gray-600">{project.summary}</p>
              )}

              {project.description ? (
                <div
                  className="prose prose-blue max-w-none"
                  dangerouslySetInnerHTML={{ __html: project.description }}
                />
              ) : (
                <p className="text-gray-500">
                  Bu proje hakkında detaylı bilgi yakında eklenecektir.
                </p>
              )}

              {/* Galeri */}
              {galleryItems.length > 0 && (
                <div className="mt-12">
                  <h2 className="mb-6 text-2xl font-bold text-gray-900">Proje Görselleri</h2>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {galleryItems.map((item) => (
                      <div key={item.id} className="overflow-hidden rounded-lg aspect-square bg-gray-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={mediaUrl(item.media.storageKey)}
                          alt={item.media.altText ?? item.caption ?? project.title}
                          className="h-full w-full object-cover hover:scale-105 transition"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* CTA */}
              <div className="rounded-xl bg-blue-700 p-6 text-white shadow-lg">
                <h3 className="text-lg font-bold">Benzer Proje İster Misiniz?</h3>
                <p className="mt-2 text-sm text-blue-200">
                  Projeniz için ücretsiz keşif ve fiyat teklifi alın.
                </p>
                <Link
                  href="/teklif-al"
                  className="mt-4 block rounded-lg bg-white px-4 py-2.5 text-center text-sm font-semibold text-blue-700 hover:bg-blue-50"
                >
                  Teklif Al
                </Link>
              </div>

              {/* İlgili hizmetler */}
              {linkedServices.length > 0 && (
                <div className="rounded-xl border border-gray-200 p-5">
                  <p className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-400">
                    Bu Projede Kullandığımız Hizmetler
                  </p>
                  <div className="space-y-2">
                    {linkedServices.map((ps) => (
                      <Link
                        key={ps.serviceId}
                        href={`/hizmetler/${ps.service.slug}`}
                        className="block text-sm font-medium text-blue-700 hover:underline"
                      >
                        {ps.service.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>

      {/* İlgili Projeler */}
      {related.length > 0 && (
        <section className="border-t border-gray-200 bg-gray-50 py-14">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="mb-8 text-2xl font-bold text-gray-900">Diğer Projeler</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/projeler/${p.slug}`}
                  className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-700">
                    {p.title}
                  </h3>
                  {p.summary && (
                    <p className="mt-2 line-clamp-2 text-sm text-gray-500">{p.summary}</p>
                  )}
                  <span className="mt-3 block text-sm font-medium text-blue-600 group-hover:underline">
                    İncele →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
