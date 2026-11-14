import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

interface SiteFooterProps {
  siteName: string;
  tagline?: string;
  phone?: string;
  email?: string;
  address?: string;
  workingHours?: string;
  socialFacebook?: string;
  socialInstagram?: string;
  socialLinkedin?: string;
  socialYoutube?: string;
}

const SERVICE_LINKS = [
  { label: "Yapı ve İnşaat", href: "/hizmetler" },
  { label: "Çatı ve Yalıtım", href: "/hizmetler" },
  { label: "Zemin ve Kaplama", href: "/hizmetler" },
  { label: "Alüminyum ve Cam", href: "/hizmetler" },
  { label: "Boyama ve Kaplama", href: "/hizmetler" },
  { label: "Peyzaj ve Dış Mekan", href: "/hizmetler" },
];

const COMPANY_LINKS = [
  { label: "Ana Sayfa", href: "/" },
  { label: "Hizmetler", href: "/hizmetler" },
  { label: "Projeler", href: "/projeler" },
  { label: "Blog", href: "/blog" },
  { label: "Teklif Al", href: "/teklif-al" },
  { label: "İletişim", href: "/iletisim" },
];

const LEGAL_LINKS = [
  { label: "KVKK Aydınlatma", href: "/kvkk" },
  { label: "Gizlilik Politikası", href: "/gizlilik" },
  { label: "Çerez Politikası", href: "/cerez" },
  { label: "Kullanım Koşulları", href: "/kullanim-kosullari" },
];

export function SiteFooter({
  siteName,
  tagline,
  phone,
  email,
  address,
  workingHours,
  socialFacebook,
  socialInstagram,
  socialLinkedin,
  socialYoutube,
}: SiteFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#101F33] text-gray-300">
      {/* Ana footer içerik */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Firma Bilgisi */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="mb-3 text-lg font-bold text-white">{siteName}</h3>
            {tagline && (
              <p className="mb-5 text-sm leading-relaxed text-gray-400">
                {tagline}
              </p>
            )}
            <div className="space-y-3 text-sm">
              {phone && (
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="flex items-start gap-2.5 hover:text-white"
                >
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#2589D8]" />
                  <span>{phone}</span>
                </a>
              )}
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="flex items-start gap-2.5 hover:text-white"
                >
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#2589D8]" />
                  <span>{email}</span>
                </a>
              )}
              {address && (
                <div className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#2589D8]" />
                  <span className="leading-relaxed">{address}</span>
                </div>
              )}
              {workingHours && (
                <p className="text-xs text-gray-500">{workingHours}</p>
              )}
            </div>

            {/* Sosyal medya */}
            <div className="mt-5 flex gap-3">
              {socialFacebook && (
                <a
                  href={socialFacebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="rounded-md bg-white/10 px-3 py-2 text-xs font-semibold hover:bg-[#1769AA]"
                >
                  FB
                </a>
              )}
              {socialInstagram && (
                <a
                  href={socialInstagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="rounded-md bg-white/10 px-3 py-2 text-xs font-semibold hover:bg-[#1769AA]"
                >
                  IG
                </a>
              )}
              {socialLinkedin && (
                <a
                  href={socialLinkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="rounded-md bg-white/10 px-3 py-2 text-xs font-semibold hover:bg-[#1769AA]"
                >
                  LI
                </a>
              )}
              {socialYoutube && (
                <a
                  href={socialYoutube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="rounded-md bg-white/10 px-3 py-2 text-xs font-semibold hover:bg-[#1769AA]"
                >
                  YT
                </a>
              )}
            </div>
          </div>

          {/* Hizmetler */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-gray-400">
              Hizmetler
            </h4>
            <ul className="space-y-2.5 text-sm">
              {SERVICE_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-white hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Firma */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-gray-400">
              Firma
            </h4>
            <ul className="space-y-2.5 text-sm">
              {COMPANY_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-white hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-gray-400">
              Ücretsiz Teklif
            </h4>
            <p className="mb-5 text-sm leading-relaxed text-gray-400">
              Projeleriniz için profesyonel destek alın. Ücretsiz keşif ve
              fiyat teklifi için hemen başvurun.
            </p>
            <Link
              href="/teklif-al"
              className="inline-block rounded-lg bg-[#1769AA] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2589D8]"
            >
              Teklif İste →
            </Link>
          </div>
        </div>
      </div>

      {/* Alt çizgi */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-gray-500 sm:flex-row sm:px-6 lg:px-8">
          <span>
            © {currentYear} {siteName}. Tüm hakları saklıdır.
          </span>
          <div className="flex flex-wrap justify-center gap-4">
            {LEGAL_LINKS.map((link) => (
              <Link key={link.label} href={link.href} className="hover:text-gray-300">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
