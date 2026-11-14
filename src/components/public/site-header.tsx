"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Phone } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
}

interface SiteHeaderProps {
  siteName: string;
  phone?: string;
  navItems?: NavItem[];
}

const DEFAULT_NAV: NavItem[] = [
  { label: "Ana Sayfa", href: "/" },
  { label: "Hizmetler", href: "/hizmetler" },
  { label: "Projeler", href: "/projeler" },
  { label: "Blog", href: "/blog" },
  { label: "İletişim", href: "/iletisim" },
];

export function SiteHeader({ siteName, phone, navItems }: SiteHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const nav = navItems && navItems.length > 0 ? navItems : DEFAULT_NAV;

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold text-[#101F33] hover:text-[#1769AA]"
          >
            {siteName}
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 lg:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-gray-700 transition hover:text-[#1769AA]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop right */}
          <div className="hidden items-center gap-4 lg:flex">
            {phone && (
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-[#1769AA]"
              >
                <Phone className="h-4 w-4" />
                {phone}
              </a>
            )}
            <Link
              href="/teklif-al"
              className="rounded-lg bg-[#1769AA] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#101F33]"
            >
              Teklif Al
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-md p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
            aria-label="Menüyü aç/kapat"
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-gray-200 bg-white lg:hidden">
          <nav className="flex flex-col px-4 py-3">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="border-b border-gray-100 py-3 text-sm font-medium text-gray-700 hover:text-[#1769AA]"
              >
                {item.label}
              </Link>
            ))}
            {phone && (
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="mt-2 flex items-center gap-2 py-3 text-sm font-medium text-gray-700"
              >
                <Phone className="h-4 w-4" />
                {phone}
              </a>
            )}
            <Link
              href="/teklif-al"
              onClick={() => setMobileOpen(false)}
              className="mt-3 rounded-lg bg-[#1769AA] px-4 py-3 text-center text-sm font-semibold text-white"
            >
              Teklif Al
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
