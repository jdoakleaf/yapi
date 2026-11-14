// Admin sayfaları DB/session erişimi içerir — prerender yapılmaz
export const instant = false;

import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminHeader } from "@/components/admin/header";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: {
    default: "Yönetim Paneli",
    template: "%s | Yönetim Paneli",
  },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  // Session yoksa sadece children döndür — middleware /admin/login'e yönlendirir.
  // Bu sayede login sayfası tam ekran görüntülenir, sidebar/header olmaz.
  if (!session) {
    return (
      <>
        {children}
        <Toaster />
      </>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--surface-muted)]">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 flex-shrink-0 overflow-y-auto lg:block">
        <AdminSidebar />
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader userEmail={session.user?.email} />

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>

      <Toaster />
    </div>
  );
}
