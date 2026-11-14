import { Shield, Wrench, Clock, ThumbsUp, Award, MapPin } from "lucide-react";

const VALUES = [
  {
    icon: <Shield className="h-8 w-8 text-[#2589D8]" />,
    title: "Güvenilirlik",
    description:
      "Her projede sözümüzü tutar, verdiğimiz garantileri yerine getiririz. Şeffaf fiyatlandırma ve yazılı sözleşme ile çalışırız.",
  },
  {
    icon: <Wrench className="h-8 w-8 text-[#2589D8]" />,
    title: "Kaliteli Uygulama",
    description:
      "Sektörün en iyi malzemeleri ve deneyimli ekibimizle kusursuz işçilik sağlarız. Kalite kontrolü her aşamada yapılır.",
  },
  {
    icon: <Clock className="h-8 w-8 text-[#2589D8]" />,
    title: "Zamanında Teslimat",
    description:
      "Proje takvimlerine bağlılığımız önceliğimizdir. Planlama aşamasından teslimata kadar her adımı takip ederiz.",
  },
  {
    icon: <ThumbsUp className="h-8 w-8 text-[#2589D8]" />,
    title: "Müşteri Memnuniyeti",
    description:
      "Projeler tamamlandıktan sonra da yanınızdayız. Satış sonrası destek ve garanti hizmetlerimizle müşterilerimizle uzun vadeli ilişkiler kurarız.",
  },
  {
    icon: <Award className="h-8 w-8 text-[#2589D8]" />,
    title: "Uzman Ekip",
    description:
      "15+ yıllık sektör deneyimi, alanında uzman mühendis ve teknisyenlerden oluşan ekibimizle her ölçekte proje yürütürüz.",
  },
  {
    icon: <MapPin className="h-8 w-8 text-[#2589D8]" />,
    title: "Geniş Hizmet Alanı",
    description:
      "İzmir merkezli, Ege Bölgesi genelinde ve gerektiğinde Türkiye genelinde hizmet verebilecek kapasitedeyiz.",
  },
];

export function ValuePropositionSection() {
  return (
    <section className="bg-[#101F33] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Başlık */}
        <div className="mb-14 text-center">
          <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-widest text-[#2589D8]">
            Neden Biz
          </span>
          <h2 className="mb-4 text-3xl font-extrabold text-white sm:text-4xl">
            Neden Bizi Tercih Etmelisiniz?
          </h2>
          <p className="mx-auto max-w-2xl text-base text-gray-400 sm:text-lg">
            Müşterilerimize verdiğimiz değeri somutlaştıran temel
            özelliklerimiz.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {VALUES.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/10 bg-white/5 p-7 transition hover:border-[#1769AA]/50 hover:bg-white/10"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#1769AA]/20">
                {item.icon}
              </div>
              <h3 className="mb-3 text-lg font-bold text-white">{item.title}</h3>
              <p className="text-sm leading-relaxed text-gray-400">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
