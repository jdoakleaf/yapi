/**
 * src/app/admin/login/layout.tsx
 * Login sayfası kendi layout'unu kullanır — üst admin layout'unu override eder.
 * Session kontrolü ve sidebar burada YOKTUR; sadece temiz bir full-screen layout.
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giriş | Yönetim Paneli",
  robots: { index: false, follow: false },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
