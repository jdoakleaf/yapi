import Link from "next/link";

interface HeroSectionProps {
  heading?: string;
  subheading?: string;
  primaryButtonText?: string;
  primaryButtonHref?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
}

export function HeroSection({
  heading = "Yapı ve İnşaat Hizmetlerinde Güvenilir Çözüm Ortağınız",
  subheading = "İzmir merkezli, 12 farklı hizmet kategorisinde profesyonel yapı, inşaat ve uygulama hizmetleri. İşçilikten anahtar teslime tüm çözümler tek çatı altında.",
  primaryButtonText = "Ücretsiz Teklif Al",
  primaryButtonHref = "/teklif-al",
  secondaryButtonText = "Hizmetlerimiz",
  secondaryButtonHref = "/hizmetler",
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-[#101F33]">
      {/* Arka plan desen */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <div className="max-w-3xl">
          {/* Etiket */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#1769AA]/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#2589D8]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2589D8]" />
            Profesyonel Yapı Hizmetleri
          </div>

          {/* Başlık */}
          <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            {heading}
          </h1>

          {/* Alt başlık */}
          <p className="mb-10 max-w-2xl text-lg leading-relaxed text-gray-300 sm:text-xl">
            {subheading}
          </p>

          {/* CTA butonlar */}
          <div className="flex flex-wrap gap-4">
            <Link
              href={primaryButtonHref}
              className="rounded-xl bg-[#1769AA] px-8 py-4 text-base font-bold text-white shadow-lg transition hover:bg-[#2589D8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1769AA]"
            >
              {primaryButtonText}
            </Link>
            <Link
              href={secondaryButtonHref}
              className="rounded-xl border-2 border-white/30 px-8 py-4 text-base font-bold text-white transition hover:border-white hover:bg-white/10"
            >
              {secondaryButtonText}
            </Link>
          </div>
        </div>
      </div>

      {/* Dekoratif köşe */}
      <div className="absolute bottom-0 right-0 h-64 w-64 translate-x-16 translate-y-16 rounded-full bg-[#1769AA]/20" />
      <div className="absolute right-32 top-16 h-32 w-32 rounded-full bg-[#2589D8]/10" />
    </section>
  );
}
