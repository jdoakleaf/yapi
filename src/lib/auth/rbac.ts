/**
 * src/lib/auth/rbac.ts
 * Server-side rol tabanlı erişim kontrolü yardımcıları.
 */

import { redirect } from "next/navigation";
import { auth } from "./index";

export type AdminRole = "super_admin" | "admin" | "editor" | "viewer";

const ROLE_HIERARCHY: Record<AdminRole, number> = {
  super_admin: 4,
  admin: 3,
  editor: 2,
  viewer: 1,
};

/**
 * Oturumun açık olup olmadığını kontrol eder.
 * Oturum yoksa login'e yönlendirir.
 */
export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }
  return session;
}

/**
 * Minimum rol seviyesini kontrol eder.
 * Yetki yoksa 403 atar.
 */
export async function requireRole(minRole: AdminRole) {
  const session = await requireAuth();
  const userRole = (session.user.role as AdminRole) ?? "viewer";
  const userLevel = ROLE_HIERARCHY[userRole] ?? 0;
  const requiredLevel = ROLE_HIERARCHY[minRole] ?? 0;

  if (userLevel < requiredLevel) {
    redirect("/admin?error=forbidden");
  }

  return session;
}

/**
 * Kullanıcının belirtilen role sahip olup olmadığını kontrol eder (yönlendirmesiz).
 */
export async function hasRole(minRole: AdminRole): Promise<boolean> {
  const session = await auth();
  if (!session?.user) return false;
  const userRole = (session.user.role as AdminRole) ?? "viewer";
  return (ROLE_HIERARCHY[userRole] ?? 0) >= (ROLE_HIERARCHY[minRole] ?? 0);
}
