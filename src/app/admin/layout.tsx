import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: {
    default: "Admin Panel",
    template: "%s | Admin Panel",
  },
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar — Faz 5'te tam tasarlanacak */}
      <aside className="hidden w-64 flex-shrink-0 border-r border-gray-200 bg-[#101F33] lg:block">
        <div className="flex h-16 items-center px-6">
          <span className="text-lg font-bold text-white">Admin Panel</span>
        </div>
        <nav className="mt-4 space-y-1 px-3">
          <Link
            href="/admin"
            className="block rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-[#1a2d47] hover:text-white"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/hizmetler"
            className="block rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-[#1a2d47] hover:text-white"
          >
            Hizmetler
          </Link>
          <Link
            href="/admin/projeler"
            className="block rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-[#1a2d47] hover:text-white"
          >
            Projeler
          </Link>
          <Link
            href="/admin/ayarlar"
            className="block rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-[#1a2d47] hover:text-white"
          >
            Ayarlar
          </Link>
        </nav>
      </aside>

      {/* Main content area */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
          <h2 className="text-lg font-semibold text-gray-800">Yönetim Paneli</h2>
          {/* Auth bilgisi — Faz 3'te eklenecek */}
        </header>
        <main className="flex-1 bg-gray-50 p-6">{children}</main>
      </div>
    </div>
  );
}
