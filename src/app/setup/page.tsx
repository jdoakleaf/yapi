/**
 * src/app/setup/page.tsx
 * İlk kurulum sihirbazı.
 *
 * - Hiç super_admin yoksa → kurulum formunu göster
 * - Zaten admin varsa → /admin/login'e yönlendir
 * - DB erişilemiyorsa → DB hata mesajı göster
 */

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import SetupForm from "./setup-form";


export const metadata = {
  title: "İlk Kurulum",
  robots: { index: false, follow: false },
};

export default async function SetupPage() {
  // Admin varlığı kontrolü
  try {
    const superAdminRole = await prisma.role.findFirst({
      where: { key: "super_admin" },
    });

    if (superAdminRole) {
      const count = await prisma.userRole_.count({
        where: { roleId: superAdminRole.id },
      });

      if (count > 0) {
        // Admin zaten var — kurulum tamamlanmış
        redirect("/admin/login");
      }
    }
  } catch {
    // DB'ye bağlanılamadı — form yine de gösterilir
    // Kullanıcı formu doldurunca action DB hatası döner
  }

  return <SetupForm />;
}
