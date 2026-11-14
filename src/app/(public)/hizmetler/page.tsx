import { prisma } from "@/lib/db";
import Link from "next/link";
import type { Metadata } from "next";

export const instant = false;

export const metadata: Metadata = {
  title: "Hizmetlerimiz",
  description: "Sunduğumuz profesyonel yapı ve inşaat hizmetleri",
};

interface ServiceWithMedia {
  id: string;
  title: string;
  slug: string;
  shortDescription: string | null;
  cardMedia: { storageKey: string; altText: string | null } | null;
}

interface CategoryWithServices {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  services: ServiceWithMedia[];
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

function mediaUrl(storageKey: string) {
  return `${BASE_URL}/${storageKey}`;
}

async function getPublishedServices(): Promise<CategoryWithServices[]> {
  const categories = await prisma.serviceCategory.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  const result: CategoryWithServices[] = [];

  for (const cat of categories) {
    const services = await prisma.service.findMany({
      where: { categoryId: cat.id, status: "PUBLISHED" },
      orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
      select: {
        id: true,
        title: true,
        slug: true,
        shortDescription: true,
        cardMedia: { select: { storageKey: true, altText: true } },
      },
    });

    result.push({ ...cat, services });
  }

  return result;
}

export default async function HizmetlerPage() {
  const categories = await getPublishedServices();
  const totalServices = categories.reduce((sum, c) => sum + c.services.length, 0);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-blue-900 py-16 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-sm text-blue-300">
            <Link href="/" className="hover:text-white">Ana Sayfa</Link>
            {" / "}
            <span>Hizmetler</span>
          </div>
          <h1 className="mt-3 text-4xl font-bold">Hizmetlerimiz</h1>
          <p className="mt-3 text-lg text-blue-200">
            Profesyonel ekibimizle {totalServices}+ farklı hizmet sunuyoruz.
          </p>
        </div>
      </section>

      {/* İçerik */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          {categories.length === 0 && (
            <p className="py-20 text-center text-gray-400">Yakında hizmetlerimiz yayınlanacak.</p>
          )}

          {categories.map((cat) =>
            cat.services.length > 0 ? (
              <div key={cat.id} className="mb-14">
                <div className="mb-6 border-b border-gray-200 pb-3">
                  <h2 className="text-2xl font-bold text-gray-900">{cat.name}</h2>
                  {cat.description && (
                    <p className="mt-1 text-gray-500">{cat.description}</p>
                  )}
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {cat.services.map((svc) => (
                    <Link
                      key={svc.id}
                      href={`/hizmetler/${svc.slug}`}
                      className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
                    >
                      {svc.cardMedia ? (
                        <div className="aspect-video overflow-hidden bg-gray-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={mediaUrl(svc.cardMedia.storageKey)}
                            alt={svc.cardMedia.altText ?? svc.title}
                            className="h-full w-full object-cover transition group-hover:scale-105"
                          />
                        </div>
                      ) : (
                        <div className="flex aspect-video items-center justify-center bg-blue-50">
                          <span className="text-4xl text-blue-200">🏗️</span>
                        </div>
                      )}
                      <div className="flex flex-1 flex-col p-5">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-700">
                          {svc.title}
                        </h3>
                        {svc.shortDescription && (
                          <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                            {svc.shortDescription}
                          </p>
                        )}
                        <div className="mt-auto pt-4">
                          <span className="text-sm font-medium text-blue-600 group-hover:underline">
                            Detayları İncele →
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-50 py-14">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Teklif Almak İster Misiniz?</h2>
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
