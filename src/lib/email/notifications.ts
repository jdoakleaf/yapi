/**
 * src/lib/email/notifications.ts
 * Bildirim gönderme yardımcıları.
 * Server Actions veya API route'larından çağrılır.
 */

import { sendMail } from "./mailer";
import { leadNotificationTemplate } from "./templates";

export interface LeadNotificationParams {
  fullName: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  serviceCategory?: string;
  leadId: string;
}

/**
 * Yeni teklif talebi geldiğinde admin'e bildirim e-postası gönderir.
 * ADMIN_EMAIL env değişkeni tanımlı değilse sessizce geçer.
 */
export async function notifyNewLead(params: LeadNotificationParams): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) return;

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const { subject, html, text } = leadNotificationTemplate({
    fullName: params.fullName,
    email: params.email,
    phone: params.phone,
    subject: params.subject,
    message: params.message,
    serviceCategory: params.serviceCategory,
    createdAt: new Date(),
    adminUrl: `${appUrl}/admin/talepler/${params.leadId}`,
  });

  await sendMail({ to: adminEmail, subject, html, text });
}
