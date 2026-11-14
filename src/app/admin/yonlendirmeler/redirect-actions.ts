"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const RedirectSchema = z.object({
  sourcePath: z
    .string()
    .min(1, "Kaynak yol zorunludur")
    .refine((v) => v.startsWith("/"), "Kaynak yol / ile başlamalıdır"),
  destinationPath: z
    .string()
    .min(1, "Hedef yol zorunludur")
    .refine((v) => v.startsWith("/") || v.startsWith("http"), "Hedef yol / veya http ile başlamalıdır"),
  httpStatus: z.enum(["REDIRECT_301", "REDIRECT_302"]),
  isActive: z.boolean().default(true),
});

export type RedirectFormState = {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function getRedirects() {
  return prisma.redirect.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function createRedirect(
  _prev: RedirectFormState,
  formData: FormData,
): Promise<RedirectFormState> {
  const raw = {
    sourcePath: formData.get("sourcePath") as string,
    destinationPath: formData.get("destinationPath") as string,
    httpStatus: formData.get("httpStatus") as string,
    isActive: formData.get("isActive") === "on",
  };

  const result = RedirectSchema.safeParse(raw);
  if (!result.success) {
    return {
      success: false,
      fieldErrors: result.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    await prisma.redirect.create({
      data: {
        sourcePath: result.data.sourcePath,
        destinationPath: result.data.destinationPath,
        httpStatus: result.data.httpStatus,
        isActive: result.data.isActive,
      },
    });
    revalidatePath("/admin/yonlendirmeler");
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("Unique constraint")) {
      return { success: false, error: "Bu kaynak yol zaten tanımlı." };
    }
    return { success: false, error: "Yönlendirme oluşturulamadı." };
  }
}

export async function deleteRedirect(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.redirect.delete({ where: { id } });
    revalidatePath("/admin/yonlendirmeler");
    return { success: true };
  } catch {
    return { success: false, error: "Yönlendirme silinemedi." };
  }
}

export async function toggleRedirect(
  id: string,
  isActive: boolean,
): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.redirect.update({ where: { id }, data: { isActive } });
    revalidatePath("/admin/yonlendirmeler");
    return { success: true };
  } catch {
    return { success: false, error: "Durum güncellenemedi." };
  }
}
