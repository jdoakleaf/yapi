import { Search, FileText, Hammer, CheckCircle, Truck } from "lucide-react";

const STEPS = [
  {
    icon: <Phone className="h-6 w-6" />,
    step: "01",
    title: "İletişim ve Talep",
    description:
      "Web sitesi, telefon veya e-posta ile bize ulaşın. İhtiyacınızı kısaca aktarın.",
  },
  {
    icon: <Search className="h-6 w-6" />,
    step: "02",
    title: "Ücretsiz Keşif",
    description:
      "Uzman ekibimiz yerinde keşif yaparak projenizin kapsamını ve gereksinimlerini belirler.",
  },
  {
    icon: <FileText className="h-6 w-6" />,
    step: "03",
    title: "Teklif ve Planlama",
    description:
      "Şeffaf fiyatlandırma ile detaylı teklif sunar, proje takvimini birlikte planlarız.",
  },
  {
    icon: <Hammer className="h-6 w-6" />,
    step: "04",
    title: "Uygulama",
    description:
      "Deneyimli ekibimiz belirlenen takvim ve kalite standartlarında işi tamamlar.",
  },
  {
    icon: <CheckCircle className="h-6 w-6" />,
    step: "05",
    title: "Kontrol ve Teslimat",
    description:
      "Tamamlanan iş titizlikle kontrol edilir. Eksikler giderilip projeniz teslim edilir.",
  },
  {
    icon: <Truck className="h-6 w-6" />,
    step: "06",
    title: "Satış Sonrası Destek",
    description:
      "Teslimat sonrasında da yanınızdayız. Garanti kapsamında sorunlarınızı çözüyoruz.",
  },
];

import { Phone } from "lucide-react";

export function ProcessSection() {
  return (
    <section className="bg-[#F4F8FC] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Başlık */}
        <div className="mb-14 text-center">
          <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-widest text-[#1769AA]">
            Nasıl Çalışıyoruz
          </span>
          <h2 className="mb-4 text-3xl font-extrabold text-[#101F33] sm:text-4xl">
            Çalışma Sürecimiz
          </h2>
          <p className="mx-auto max-w-2xl text-base text-gray-600 sm:text-lg">
            İlk temastan teslimat sonrası desteğe kadar şeffaf ve planlı bir
            iş süreci yürütüyoruz.
          </p>
        </div>

        {/* Adımlar */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((step, i) => (
            <div
              key={i}
              className="relative rounded-2xl border border-gray-200 bg-white p-7 shadow-sm"
            >
              {/* Numara */}
              <span className="absolute right-5 top-5 text-5xl font-black text-[#DCEEFF] select-none">
                {step.step}
              </span>
              {/* İkon */}
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#1769AA] text-white">
                {step.icon}
              </div>
              <h3 className="mb-2 text-lg font-bold text-[#101F33]">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-500">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
