import { Award, Users, Briefcase, Clock } from "lucide-react";

interface StatItem {
  icon: React.ReactNode;
  value: string;
  label: string;
}

const DEFAULT_STATS: StatItem[] = [
  {
    icon: <Award className="h-7 w-7 text-[#1769AA]" />,
    value: "15+",
    label: "Yıllık Deneyim",
  },
  {
    icon: <Briefcase className="h-7 w-7 text-[#1769AA]" />,
    value: "500+",
    label: "Tamamlanan Proje",
  },
  {
    icon: <Users className="h-7 w-7 text-[#1769AA]" />,
    value: "1.000+",
    label: "Memnun Müşteri",
  },
  {
    icon: <Clock className="h-7 w-7 text-[#1769AA]" />,
    value: "12",
    label: "Hizmet Kategorisi",
  },
];

export function TrustIndicators() {
  return (
    <section className="border-b border-gray-200 bg-white py-10 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {DEFAULT_STATS.map((stat, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-2 text-center"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#DCEEFF]">
                {stat.icon}
              </div>
              <span className="text-2xl font-extrabold text-[#101F33] sm:text-3xl">
                {stat.value}
              </span>
              <span className="text-sm font-medium text-gray-500">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
