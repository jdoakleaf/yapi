/**
 * src/lib/email/mailer.ts
 * Nodemailer tabanlı e-posta gönderici.
 * SMTP yapılandırması .env'den alınır.
 * SMTP yoksa bildirimler sessizce atlanır (geliştirme modunda konsola log).
 */

import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

let _transporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  if (_transporter) return _transporter;

  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT ?? "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    // SMTP yapılandırılmamış — dev modunda silent, üretimde warn
    if (process.env.NODE_ENV === "production") {
      console.warn(
        "[mailer] SMTP yapılandırılmamış. E-posta bildirimleri devre dışı."
      );
    }
    return null;
  }

  _transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    tls: { rejectUnauthorized: process.env.NODE_ENV === "production" },
  });

  return _transporter;
}

export interface MailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * E-posta gönderir. SMTP yapılandırılmamışsa sessizce atlar.
 * Hata durumunda throw etmez — bildirim gönderimi kritik iş akışını bloke etmemeli.
 */
export async function sendMail(options: MailOptions): Promise<boolean> {
  const transporter = getTransporter();
  const from =
    process.env.SMTP_FROM ??
    process.env.SMTP_USER ??
    "no-reply@example.com";

  if (!transporter) {
    if (process.env.NODE_ENV !== "production") {
      console.log("[mailer] DEV — E-posta gönderilmedi (SMTP yok):", {
        to: options.to,
        subject: options.subject,
      });
    }
    return false;
  }

  try {
    await transporter.sendMail({
      from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text ?? options.subject,
    });
    return true;
  } catch (err) {
    console.error("[mailer] E-posta gönderilemedi:", err);
    return false;
  }
}
