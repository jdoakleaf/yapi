import { getServiceBySlug, getServices } from "@/lib/cms/service-actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

function mediaUrl(storageKey: string) {
  return `${BASE_URL}/${storageKey}`;
}

export const instant = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service || service.status !== "PUBLISHED") {
    return { title: "Hizmet Bulunamadı" };
  }

  const coverUrl = service.coverMedia ? mediaUrl(service.coverMedia.storageKey) : undefined;

  return {
    title: service.seoTitle ?? service.title,
    description: service.seoDesc ?? service.shortDescription ?? undefined,
    openGraph: {
      title: service.seoTitle ?? service.title,
      description: service.seoDesc ?? service.shortDescription ?? undefined,
      images: coverUrl ? [coverUrl] : [],
    },
  };
}

// Statik parametre olmadan dinamik rendering
// generateStaticParams burada kasıtlı yok: build sırasında DB gerektirir,
// üretimde SSR ile çalışır, ISR Faz 12'de eklenecek.
export default async function HizmetDetayPage({ params }: Props) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service || service.status !== "PUBLISHED") notFound();

  // İlgili hizmetler (aynı kategoriden, bu hizmet hariç)
  const relatedResult = await getServices({
    categoryId: service.categoryId,
    status: "PUBLISHED",
    pageSize: 4,
  });
  const related = relatedResult.items.filter((s) => s.id !== service.id).slice(0, 3);

  const coverUrl = service.coverMedia ? mediaUrl(service.coverMedia.storageKey) : null;

  return (
    <main className="min-h-screen bg-white">
      {/* Kapak */}
      {coverUrl && (
        <div className="relative h-72 overflow-hidden bg-blue-900 md:h-96">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverUrl}
            alt={service.coverMedia?.altText ?? service.title}
            className="h-full w-full object-cover opacity-50"
          />
          <div className="absolute inset-0 flex flex-col justify-end p-8">
            <div className="mx-auto w-full max-w-6xl">
              <div className="mb-2 text-sm text-blue-200">
                <Link href="/" className="hover:text-white">Ana Sayfa</Link>
                {" / "}
                <Link href="/hizmetler" className="hover:text-white">Hizmetler</Link>
                {" / "}
                <span className="text-white">{service.category.name}</span>
              </div>
              <h1 className="text-3xl font-bold text-white md:text-4xl">{service.title}</h1>
            </div>
          </div>
        </div>
      )}

      {/* Kapak yoksa minimal hero */}
      {!coverUrl && (
        <section className="bg-blue-900 py-14 text-white">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mb-2 text-sm text-blue-300">
              <Link href="/" className="hover:text-white">Ana Sayfa</Link>
              {" / "}
              <Link href="/hizmetler" className="hover:text-white">Hizmetler</Link>
              {" / "}
              <span>{service.category.name}</span>
            </div>
            <h1 className="mt-2 text-3xl font-bold md:text-4xl">{service.title}</h1>
            {service.shortDescription && (
              <p className="mt-3 text-lg text-blue-200">{service.shortDescription}</p>
            )}
          </div>
        </section>
      )}

      {/* İçerik */}
      <section className="py-14">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-10 lg:grid-cols-3">
            {/* Ana içerik */}
            <div className="lg:col-span-2">
              {coverUrl && service.shortDescription && (
                <p className="mb-6 text-lg text-gray-600">{service.shortDescription}</p>
              )}

              {service.content ? (
                <div
                  className="prose prose-blue max-w-none"
                  dangerouslySetInnerHTML={{ __html: service.content }}
                />
              ) : (
                <p className="text-gray-500">
                  Bu hizmet hakkında detaylı bilgi yakında eklenecektir.
                </p>
              )}

              {/* SSS */}
              {service.faqs.length > 0 && (
                <div className="mt-12">
                  <h2 className="mb-6 text-2xl font-bold text-gray-900">Sık Sorulan Sorular</h2>
                  <div className="space-y-4">
                    {service.faqs.map((faq) => (
                      <details
                        key={faq.id}
                        className="group rounded-lg border border-gray-200 p-5"
                      >
                        <summary className="cursor-pointer font-semibold text-gray-900 marker:text-blue-600">
                          {faq.question}
                        </summary>
                        <p className="mt-3 text-gray-600">{faq.answer}</p>
                      </details>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* CTA kartı */}
              <div className="rounded-xl bg-blue-700 p-6 text-white shadow-lg">
                <h3 className="text-lg font-bold">Teklif Alın</h3>
                <p className="mt-2 text-sm text-blue-200">
                  Ücretsiz keşif ve fiyat teklifi için formumuzu doldurun.
                </p>
                <Link
                  href="/teklif-al"
                  className="mt-4 block rounded-lg bg-white px-4 py-2.5 text-center text-sm font-semibold text-blue-700 hover:bg-blue-50"
                >
                  Teklif Al
                </Link>
              </div>

              {/* Kategori bilgisi */}
              <div className="rounded-xl border border-gray-200 p-5">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Kategori
                </p>
                <Link
                  href="/hizmetler"
                  className="mt-1 block font-semibold text-blue-700 hover:underline"
                >
                  {service.category.name}
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* İlgili Hizmetler */}
      {related.length > 0 && (
        <section className="border-t border-gray-200 bg-gray-50 py-14">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="mb-8 text-2xl font-bold text-gray-900">İlgili Hizmetler</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((svc) => (
                <Link
                  key={svc.id}
                  href={`/hizmetler/${svc.slug}`}
                  className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-700">
                    {svc.title}
                  </h3>
                  {svc.shortDescription && (
                    <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                      {svc.shortDescription}
                    </p>
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
