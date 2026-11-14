import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ContentStatus } from "@prisma/client";
import { prisma } from "@/lib/db";

async function getFeaturedServices() {
  const categories = await prisma.serviceCategory.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    take: 6,
    include: {
      services: {
        where: { status: ContentStatus.PUBLISHED },
        orderBy: { sortOrder: "asc" },
        take: 1,
        select: { slug: true },
      },
    },
  });
  return categories;
}

const CATEGORY_ICONS: Record<string, string> = {
  "yapı-inşaat": "🏗️",
  "çatı-yalıtım": "🏠",
  "zemin-kaplama": "🪨",
  "alüminyum-cam": "🪟",
  "boyama-kaplama": "🎨",
  "peyzaj-dış": "🌿",
  "elektrik-tesisat": "⚡",
  "sıhhi-tesisat": "🔧",
  "asansör": "🛗",
  "güneş-enerji": "☀️",
  "tadilat-yenileme": "🔨",
  "dekorasyon": "🏛️",
};

function getCategoryIcon(slug: string): string {
  for (const [key, icon] of Object.entries(CATEGORY_ICONS)) {
    if (slug.includes(key)) return icon;
  }
  return "🏗️";
}

export async function ServicesSection() {
  const categories = await getFeaturedServices();

  return (
    <section className="bg-[#F4F8FC] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Başlık */}
        <div className="mb-12 text-center">
          <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-widest text-[#1769AA]">
            Ne Yapıyoruz
          </span>
          <h2 className="mb-4 text-3xl font-extrabold text-[#101F33] sm:text-4xl">
            Hizmet Kategorilerimiz
          </h2>
          <p className="mx-auto max-w-2xl text-base text-gray-600 sm:text-lg">
            Yapıdan peyzaja, çatıdan zemine 12 farklı hizmet kategorisinde
            profesyonel çözümler sunuyoruz.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => {
            const serviceSlug = cat.services[0]?.slug;
            const href = serviceSlug
              ? `/hizmetler/${serviceSlug}`
              : "/hizmetler";

            return (
              <Link
                key={cat.id}
                href={href}
                className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#1769AA]/30 hover:shadow-md"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#DCEEFF] text-2xl transition group-hover:bg-[#1769AA] group-hover:text-white">
                  <span role="img" aria-label={cat.name}>
                    {getCategoryIcon(cat.slug)}
                  </span>
                </div>
                <h3 className="mb-2 font-bold text-[#101F33] transition group-hover:text-[#1769AA]">
                  {cat.name}
                </h3>
                {cat.description && (
                  <p className="mb-4 flex-1 text-sm leading-relaxed text-gray-500 line-clamp-2">
                    {cat.description}
                  </p>
                )}
                <span className="mt-auto flex items-center gap-1 text-sm font-semibold text-[#1769AA]">
                  Detayları İncele
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>

        {/* Tüm hizmetler */}
        <div className="mt-10 text-center">
          <Link
            href="/hizmetler"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-[#1769AA] px-6 py-3 text-sm font-bold text-[#1769AA] transition hover:bg-[#1769AA] hover:text-white"
          >
            Tüm Hizmetleri Görüntüle
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
