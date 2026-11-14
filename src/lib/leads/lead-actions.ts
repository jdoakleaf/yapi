"use server";

import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth/rbac";
import { CustomerType, LeadStatus, WorkModel } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { headers } from "next/headers";

// ---------------------------------------------------------------------------
// Rate limiting (in-memory, IP bazlı — üretimde Redis önerilir)
// ---------------------------------------------------------------------------

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 saat

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count += 1;
  return true;
}

function getClientIp(headersList: Awaited<ReturnType<typeof headers>>): string {
  return (
    headersList.get("x-forwarded-for")?.split(",")[0].trim() ??
    headersList.get("x-real-ip") ??
    "unknown"
  );
}

// ---------------------------------------------------------------------------
// Referans kodu üretimi
// ---------------------------------------------------------------------------

function generateReferenceCode(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(100000 + Math.random() * 900000); // 6 hane
  return `YP-${year}-${random}`;
}

async function ensureUniqueReferenceCode(): Promise<string> {
  for (let i = 0; i < 10; i++) {
    const code = generateReferenceCode();
    const existing = await prisma.lead.findUnique({
      where: { referenceCode: code },
      select: { id: true },
    });
    if (!existing) return code;
  }
  throw new Error("Referans kodu üretilemedi");
}

// ---------------------------------------------------------------------------
// E-posta bildirimi (adaptör pattern)
// ---------------------------------------------------------------------------

async function sendLeadNotification(lead: {
  referenceCode: string;
  fullName: string;
  phone: string;
  email?: string | null;
}): Promise<void> {
  // SMTP yapılandırması yoksa loglama yeterli
  const smtpHost = process.env.SMTP_HOST;
  if (!smtpHost) {
    console.log(
      `[LEAD] Yeni talep: ${lead.referenceCode} — ${lead.fullName} (${lead.phone})`,
    );
    return;
  }
  // İleride nodemailer ile gerçek e-posta gönderimi buraya eklenecek
  console.log(
    `[LEAD][EMAIL] ${lead.referenceCode} için bildirim gönderildi: ${lead.email ?? "e-posta yok"}`,
  );
}

// ---------------------------------------------------------------------------
// Şemalar
// ---------------------------------------------------------------------------

const CreateLeadSchema = z.object({
  fullName: z.string().min(2, "Ad Soyad en az 2 karakter olmalıdır"),
  phone: z
    .string()
    .min(10, "Geçerli bir telefon numarası giriniz")
    .regex(/^[0-9+\s()-]+$/, "Geçersiz telefon numarası"),
  email: z.string().email("Geçerli bir e-posta giriniz").optional().or(z.literal("")),
  customerType: z.nativeEnum(CustomerType),
  serviceId: z.string().uuid().optional().or(z.literal("")),
  workModel: z.nativeEnum(WorkModel),
  city: z.string().min(2, "İl giriniz"),
  district: z.string().optional(),
  message: z.string().max(2000).optional(),
  kvkkConsent: z.literal("true"),
  sourcePage: z.string().optional(),
});

const UpdateLeadStatusSchema = z.object({
  status: z.nativeEnum(LeadStatus),
});

const AddLeadNoteSchema = z.object({
  note: z.string().min(1, "Not boş olamaz").max(2000),
});

const AssignLeadSchema = z.object({
  userId: z.string().uuid().nullable(),
});

// ---------------------------------------------------------------------------
// Public: Lead oluşturma
// ---------------------------------------------------------------------------

export async function createLead(formData: FormData) {
  const headersList = await headers();
  const ip = getClientIp(headersList);

  if (!checkRateLimit(ip)) {
    return {
      success: false,
      error: "Çok fazla talep gönderdiniz. Lütfen bir saat sonra tekrar deneyin.",
    };
  }

  const raw = {
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
    email: formData.get("email") ?? "",
    customerType: formData.get("customerType"),
    serviceId: formData.get("serviceId") ?? "",
    workModel: formData.get("workModel"),
    city: formData.get("city"),
    district: formData.get("district") ?? "",
    message: formData.get("message") ?? "",
    kvkkConsent: formData.get("kvkkConsent"),
    sourcePage: formData.get("sourcePage") ?? "/teklif-al",
  };

  const result = CreateLeadSchema.safeParse(raw);
  if (!result.success) {
    const firstError = result.error.issues[0];
    return { success: false, error: firstError?.message ?? "Geçersiz form verisi" };
  }

  const data = result.data;

  try {
    const referenceCode = await ensureUniqueReferenceCode();

    const lead = await prisma.lead.create({
      data: {
        referenceCode,
        fullName: data.fullName,
        phone: data.phone,
        email: data.email || null,
        customerType: data.customerType,
        serviceId: data.serviceId || null,
        workModel: data.workModel,
        city: data.city,
        district: data.district || null,
        message: data.message || null,
        status: LeadStatus.NEW,
        privacyNoticeVersion: "1.0",
        consentMetadata: {
          ip,
          userAgent: headersList.get("user-agent") ?? "unknown",
          consentedAt: new Date().toISOString(),
          version: "1.0",
        },
        sourcePage: data.sourcePage || "/teklif-al",
      },
    });

    await sendLeadNotification({
      referenceCode: lead.referenceCode,
      fullName: lead.fullName,
      phone: lead.phone,
      email: lead.email,
    });

    return { success: true, referenceCode: lead.referenceCode };
  } catch (err) {
    console.error("[createLead]", err);
    return { success: false, error: "Talep kaydedilemedi. Lütfen tekrar deneyin." };
  }
}

// ---------------------------------------------------------------------------
// Admin: Lead listeleme
// ---------------------------------------------------------------------------

export async function getLeads(opts?: {
  status?: LeadStatus;
  search?: string;
  page?: number;
  pageSize?: number;
  startDate?: string;
  endDate?: string;
}) {
  await requireAuth();

  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  const skip = (page - 1) * pageSize;

  const where = {
    ...(opts?.status ? { status: opts.status } : {}),
    ...(opts?.search
      ? {
          OR: [
            { referenceCode: { contains: opts.search, mode: "insensitive" as const } },
            { fullName: { contains: opts.search, mode: "insensitive" as const } },
            { phone: { contains: opts.search, mode: "insensitive" as const } },
            { email: { contains: opts.search, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(opts?.startDate ? { createdAt: { gte: new Date(opts.startDate) } } : {}),
    ...(opts?.endDate
      ? { createdAt: { lte: new Date(opts.endDate + "T23:59:59Z") } }
      : {}),
  };

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
      include: {
        service: { select: { title: true } },
      },
    }),
    prisma.lead.count({ where }),
  ]);

  return { leads, total, page, pageSize, pageCount: Math.ceil(total / pageSize) };
}

// ---------------------------------------------------------------------------
// Admin: Tek lead detayı
// ---------------------------------------------------------------------------

export async function getLead(id: string) {
  await requireAuth();

  return prisma.lead.findUnique({
    where: { id },
    include: {
      service: { select: { id: true, title: true } },
      notes: {
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true, email: true } } },
      },
    },
  });
}

// ---------------------------------------------------------------------------
// Admin: Durum güncelleme
// ---------------------------------------------------------------------------

export async function updateLeadStatus(id: string, formData: FormData) {
  await requireAuth();

  const result = UpdateLeadStatusSchema.safeParse({
    status: formData.get("status"),
  });
  if (!result.success) {
    return { success: false, error: "Geçersiz durum" };
  }

  await prisma.lead.update({
    where: { id },
    data: { status: result.data.status },
  });

  revalidatePath(`/admin/talepler/${id}`);
  revalidatePath("/admin/talepler");
  return { success: true };
}

// ---------------------------------------------------------------------------
// Admin: Not ekleme
// ---------------------------------------------------------------------------

export async function addLeadNote(id: string, formData: FormData) {
  const session = await requireAuth();

  const result = AddLeadNoteSchema.safeParse({
    note: formData.get("note"),
  });
  if (!result.success) {
    return { success: false, error: result.error.issues[0]?.message ?? "Geçersiz not" };
  }

  await prisma.leadNote.create({
    data: {
      leadId: id,
      userId: session.user.id,
      note: result.data.note,
    },
  });

  revalidatePath(`/admin/talepler/${id}`);
  return { success: true };
}

// ---------------------------------------------------------------------------
// Admin: Atama
// ---------------------------------------------------------------------------

export async function assignLead(id: string, formData: FormData) {
  await requireAuth();

  const result = AssignLeadSchema.safeParse({
    userId: formData.get("userId") || null,
  });
  if (!result.success) {
    return { success: false, error: "Geçersiz kullanıcı" };
  }

  await prisma.lead.update({
    where: { id },
    data: { assignedTo: result.data.userId },
  });

  revalidatePath(`/admin/talepler/${id}`);
  return { success: true };
}

// ---------------------------------------------------------------------------
// Admin: Dashboard sayaçları
// ---------------------------------------------------------------------------

export async function getLeadCounts() {
  await requireAuth();

  const counts = await prisma.lead.groupBy({
    by: ["status"],
    _count: { status: true },
  });

  const result: Record<string, number> = {};
  for (const row of counts) {
    result[row.status] = row._count.status;
  }
  return result;
}
