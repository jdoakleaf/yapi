import Link from "next/link";
import { CurrentYear } from "@/components/shared/current-year";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* AnnouncementBar — Faz 5'te dinamik hale gelecek */}
      {/* Header/Navigation — Faz 11'de tasarlanacak */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-xl font-bold text-[#101F33]">
            Yapı Platform
          </Link>
          <nav className="hidden gap-6 md:flex">
            <Link href="/" className="text-sm font-medium text-gray-700 hover:text-[#1769AA]">
              Ana Sayfa
            </Link>
            <Link href="/hizmetler" className="text-sm font-medium text-gray-700 hover:text-[#1769AA]">
              Hizmetler
            </Link>
            <Link href="/projeler" className="text-sm font-medium text-gray-700 hover:text-[#1769AA]">
              Projeler
            </Link>
            <Link href="/iletisim" className="text-sm font-medium text-gray-700 hover:text-[#1769AA]">
              İletişim
            </Link>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Footer — Faz 11'de tasarlanacak */}
      <footer className="border-t border-gray-200 bg-[#101F33] py-8 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-gray-400 sm:px-6 lg:px-8">
          © <CurrentYear /> Yapı Platform. Tüm hakları saklıdır.
        </div>
      </footer>
    </div>
  );
}
