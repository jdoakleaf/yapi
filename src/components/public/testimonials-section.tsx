import { Star } from "lucide-react";
import { prisma } from "@/lib/db";

async function getTestimonials() {
  return prisma.testimonial.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: "asc" },
    take: 6,
  });
}

export async function TestimonialsSection() {
  const testimonials = await getTestimonials();

  if (testimonials.length === 0) return null;

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Başlık */}
        <div className="mb-12 text-center">
          <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-widest text-[#1769AA]">
            Müşterilerimiz
          </span>
          <h2 className="mb-4 text-3xl font-extrabold text-[#101F33] sm:text-4xl">
            Müşteri Yorumları
          </h2>
          <p className="mx-auto max-w-xl text-base text-gray-600">
            Projelerini tamamladığımız müşterilerimizin deneyimleri.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="flex flex-col rounded-2xl border border-gray-200 bg-[#F4F8FC] p-7 shadow-sm"
            >
              {/* Yıldızlar */}
              {t.rating && (
                <div className="mb-4 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < (t.rating ?? 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
              )}

              {/* Yorum */}
              <blockquote className="mb-5 flex-1 text-sm leading-relaxed text-gray-700 italic">
                &quot;{t.quote}&quot;
              </blockquote>

              {/* Kişi */}
              <div className="flex items-center gap-3 border-t border-gray-200 pt-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1769AA] text-sm font-bold text-white">
                  {t.displayName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#101F33]">
                    {t.displayName}
                  </p>
                  {t.companyOrLocation && (
                    <p className="text-xs text-gray-500">
                      {t.companyOrLocation}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
