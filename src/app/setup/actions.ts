"use server";

/**
 * src/app/setup/actions.ts
 * İlk kurulum server action — admin kullanıcısı oluşturur.
 * Yalnızca hiç super_admin yokken çalışır.
 */

import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";
import { redirect } from "next/navigation";
import { z } from "zod/v4";

const SetupSchema = z
  .object({
    siteName: z.string().min(2, "Site adı en az 2 karakter olmalı"),
    adminName: z.string().min(2, "Ad soyad en az 2 karakter olmalı"),
    adminEmail: z.string().email("Geçerli bir e-posta giriniz"),
    adminPassword: z
      .string()
      .min(12, "Parola en az 12 karakter olmalı"),
    adminPasswordConfirm: z.string(),
  })
  .refine((d) => d.adminPassword === d.adminPasswordConfirm, {
    message: "Parolalar eşleşmiyor",
    path: ["adminPasswordConfirm"],
  });

export async function setupAction(
  _prev: unknown,
  formData: FormData
): Promise<{ error?: string } | undefined> {
  // -----------------------------------------------------------------------
  // Güvenlik: Zaten bir super_admin varsa kur işlemini reddet
  // -----------------------------------------------------------------------
  try {
    const superAdminRole = await prisma.role.findFirst({
      where: { key: "super_admin" },
    });

    if (superAdminRole) {
      const count = await prisma.userRole_.count({
        where: { roleId: superAdminRole.id },
      });
      if (count > 0) {
        return {
          error:
            "Kurulum zaten tamamlanmış. Yönetici giriş sayfasına yönlendiriliyorsunuz.",
        };
      }
    }
  } catch {
    // DB erişim sorunu
    return {
      error:
        "Veritabanına bağlanılamadı. DATABASE_URL ortam değişkenini ve bağlantıyı kontrol edin.",
    };
  }

  // -----------------------------------------------------------------------
  // Form doğrulama
  // -----------------------------------------------------------------------
  const raw = {
    siteName: formData.get("siteName"),
    adminName: formData.get("adminName"),
    adminEmail: formData.get("adminEmail"),
    adminPassword: formData.get("adminPassword"),
    adminPasswordConfirm: formData.get("adminPasswordConfirm"),
  };

  const result = SetupSchema.safeParse(raw);
  if (!result.success) {
    return { error: result.error.issues[0]?.message ?? "Geçersiz form verisi" };
  }

  const data = result.data;

  // -----------------------------------------------------------------------
  // Kurulum işlemleri
  // -----------------------------------------------------------------------
  try {
    // 1. Site adını kaydet (SiteSetting.valueJson = JSON)
    await prisma.siteSetting.upsert({
      where: { key: "site_name" },
      create: {
        key: "site_name",
        valueJson: data.siteName,
      },
      update: { valueJson: data.siteName },
    });

    // 2. Admin kullanıcısı oluştur
    const passwordHash = hashPassword(data.adminPassword);

    const user = await prisma.user.create({
      data: {
        name: data.adminName.trim(),
        email: data.adminEmail.toLowerCase().trim(),
        passwordHash,
        isActive: true,
      },
    });

    // 3. super_admin rolünü bul ve ata
    const superAdminRole = await prisma.role.findFirst({
      where: { key: "super_admin" },
    });

    if (!superAdminRole) {
      return {
        error:
          "super_admin rolü bulunamadı. Lütfen veritabanı seed işlemini tamamlayın.",
      };
    }

    await prisma.userRole_.create({
      data: { userId: user.id, roleId: superAdminRole.id },
    });

    // 4. Denetim kaydı
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "ADMIN_CREATED",
        entityType: "User",
        entityId: user.id,
        metadataJson: {
          email: user.email,
          createdBy: "setup-wizard",
        },
      },
    });
  } catch (err) {
    console.error("[setup] Hata:", err);
    return {
      error:
        "Kurulum tamamlanamadı. Veritabanı bağlantısını ve log kayıtlarını kontrol edin.",
    };
  }

  redirect("/admin/login");
}
