/**
 * src/lib/email/templates.ts
 * E-posta şablonları — HTML + text versiyonları.
 */

export interface LeadNotificationData {
  fullName: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  serviceCategory?: string;
  createdAt: Date;
  adminUrl: string;
}

export function leadNotificationTemplate(data: LeadNotificationData): {
  subject: string;
  html: string;
  text: string;
} {
  const dateStr = data.createdAt.toLocaleString("tr-TR", {
    timeZone: "Europe/Istanbul",
    dateStyle: "long",
    timeStyle: "short",
  });

  const subject = `Yeni Teklif Talebi: ${data.fullName}`;

  const html = `
<!DOCTYPE html>
<html lang="tr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <!-- Header -->
        <tr>
          <td style="background:#101F33;padding:24px 32px;">
            <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:600;">Yeni Teklif Talebi</h1>
            <p style="margin:4px 0 0;color:#90aac4;font-size:13px;">${dateStr}</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:0 0 16px;">
                  <p style="margin:0;font-size:13px;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;font-weight:600;">Ad Soyad</p>
                  <p style="margin:4px 0 0;font-size:16px;color:#111827;font-weight:600;">${escapeHtml(data.fullName)}</p>
                </td>
              </tr>
              <tr>
                <td style="padding:0 0 16px;">
                  <p style="margin:0;font-size:13px;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;font-weight:600;">E-posta</p>
                  <p style="margin:4px 0 0;font-size:15px;color:#1769AA;">
                    <a href="mailto:${escapeHtml(data.email)}" style="color:#1769AA;text-decoration:none;">${escapeHtml(data.email)}</a>
                  </p>
                </td>
              </tr>
              ${data.phone ? `
              <tr>
                <td style="padding:0 0 16px;">
                  <p style="margin:0;font-size:13px;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;font-weight:600;">Telefon</p>
                  <p style="margin:4px 0 0;font-size:15px;color:#111827;">${escapeHtml(data.phone)}</p>
                </td>
              </tr>` : ""}
              ${data.serviceCategory ? `
              <tr>
                <td style="padding:0 0 16px;">
                  <p style="margin:0;font-size:13px;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;font-weight:600;">Hizmet Kategorisi</p>
                  <p style="margin:4px 0 0;font-size:15px;color:#111827;">${escapeHtml(data.serviceCategory)}</p>
                </td>
              </tr>` : ""}
              ${data.subject ? `
              <tr>
                <td style="padding:0 0 16px;">
                  <p style="margin:0;font-size:13px;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;font-weight:600;">Konu</p>
                  <p style="margin:4px 0 0;font-size:15px;color:#111827;">${escapeHtml(data.subject)}</p>
                </td>
              </tr>` : ""}
              <tr>
                <td style="padding:0 0 24px;">
                  <p style="margin:0;font-size:13px;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;font-weight:600;">Mesaj</p>
                  <p style="margin:8px 0 0;font-size:15px;color:#111827;line-height:1.6;white-space:pre-wrap;background:#f9fafb;border-left:3px solid #1769AA;padding:12px 16px;border-radius:4px;">${escapeHtml(data.message)}</p>
                </td>
              </tr>
              <tr>
                <td style="text-align:center;padding:8px 0 0;">
                  <a href="${data.adminUrl}" style="display:inline-block;background:#1769AA;color:#ffffff;text-decoration:none;padding:12px 32px;border-radius:6px;font-size:15px;font-weight:600;">
                    Admin Panelinde Görüntüle
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f9fafb;padding:16px 32px;border-top:1px solid #e5e7eb;">
            <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">Bu e-posta otomatik olarak gönderilmiştir. Lütfen yanıtlamayın.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = [
    `YENİ TEKLİF TALEBİ — ${dateStr}`,
    ``,
    `Ad Soyad: ${data.fullName}`,
    `E-posta: ${data.email}`,
    data.phone ? `Telefon: ${data.phone}` : null,
    data.serviceCategory ? `Hizmet: ${data.serviceCategory}` : null,
    data.subject ? `Konu: ${data.subject}` : null,
    ``,
    `Mesaj:`,
    data.message,
    ``,
    `Admin paneli: ${data.adminUrl}`,
  ]
    .filter((line) => line !== null)
    .join("\n");

  return { subject, html, text };
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
