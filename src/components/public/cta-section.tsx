import Link from "next/link";
import { Phone } from "lucide-react";

interface CTASectionProps {
  phone?: string;
}

export function CTASection({ phone }: CTASectionProps) {
  return (
    <section className="relative overflow-hidden bg-[#1769AA] py-20">
      {/* Dekoratif daireler */}
      <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-white/5" />
      <div className="absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-white/5" />
      <div className="absolute right-32 top-8 h-32 w-32 rounded-full bg-white/10" />

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="mb-4 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
          Projeniz Hakkında Konuşalım
        </h2>
        <p className="mb-10 text-lg text-blue-100 sm:text-xl">
          Küçük tadilattan anahtar teslim yapıya kadar her ölçekte projeniz
          için ücretsiz keşif ve fiyat teklifi alın.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/teklif-al"
            className="rounded-xl bg-white px-8 py-4 text-base font-bold text-[#1769AA] shadow-lg transition hover:bg-[#DCEEFF]"
          >
            Ücretsiz Teklif Al
          </Link>
          {phone && (
            <a
              href={`tel:${phone.replace(/\s/g, "")}`}
              className="flex items-center gap-2 rounded-xl border-2 border-white/40 px-8 py-4 text-base font-bold text-white transition hover:border-white hover:bg-white/10"
            >
              <Phone className="h-5 w-5" />
              {phone}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
