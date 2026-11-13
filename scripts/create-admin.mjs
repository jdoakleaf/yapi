/**
 * scripts/create-admin.mjs
 * Güvenli admin kullanıcısı oluşturma CLI aracı.
 * Kullanım: node scripts/create-admin.mjs
 *
 * Bu script çalıştırılmadan önce:
 *   1. node scripts/start-db.mjs (başka terminalde)
 *   2. .env.local dosyasında DATABASE_URL ayarlı olmalı
 */

import { createInterface } from "node:readline";
import { config } from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// .env.local yükle
config({ path: path.join(ROOT, ".env.local") });

// Dinamik import — ESM
const { PrismaClient } = await import("@prisma/client");
const { hashPassword } = await import("../src/lib/auth/password.js");

const db = new PrismaClient();

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => rl.question(prompt, resolve));
}

function questionHidden(prompt) {
  return new Promise((resolve) => {
    process.stdout.write(prompt);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    let password = "";
    process.stdin.on("data", function handler(char) {
      char = char.toString();
      if (char === "\r" || char === "\n") {
        process.stdin.setRawMode(false);
        process.stdin.pause();
        process.stdin.removeListener("data", handler);
        process.stdout.write("\n");
        resolve(password);
      } else if (char === "\x7f") {
        if (password.length > 0) {
          password = password.slice(0, -1);
          process.stdout.clearLine(0);
          process.stdout.cursorTo(0);
          process.stdout.write(prompt + "*".repeat(password.length));
        }
      } else if (char === "\x03") {
        process.exit();
      } else {
        password += char;
        process.stdout.write("*");
      }
    });
  });
}

async function main() {
  console.log("\n🔐 Admin Kullanıcı Oluşturma Aracı\n");

  const name = await question("Ad Soyad: ");
  const email = await question("E-posta: ");

  // E-posta zaten var mı?
  const existing = await db.user.findUnique({ where: { email: email.toLowerCase().trim() } });
  if (existing) {
    console.error(`\n❌ Bu e-posta zaten kayıtlı: ${email}`);
    process.exit(1);
  }

  const password = await questionHidden("Parola (en az 12 karakter): ");
  if (password.length < 12) {
    console.error("\n❌ Parola en az 12 karakter olmalıdır.");
    process.exit(1);
  }

  const confirm = await questionHidden("Parola tekrar: ");
  if (password !== confirm) {
    console.error("\n❌ Parolalar eşleşmiyor.");
    process.exit(1);
  }

  rl.close();

  // super_admin rolünü bul
  const role = await db.role.findUnique({ where: { name: "super_admin" } });
  if (!role) {
    console.error("\n❌ 'super_admin' rolü bulunamadı. Önce 'pnpm db:seed' çalıştırın.");
    process.exit(1);
  }

  const passwordHash = await hashPassword(password);

  const user = await db.user.create({
    data: {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      roleId: role.id,
      isActive: true,
      emailVerified: new Date(),
    },
  });

  // Audit log
  await db.auditLog.create({
    data: {
      userId: user.id,
      action: "ADMIN_CREATED",
      entityType: "User",
      entityId: user.id,
      metadata: { email: user.email, createdBy: "cli" },
    },
  });

  console.log(`\n✅ Admin kullanıcısı oluşturuldu!`);
  console.log(`   Ad:     ${user.name}`);
  console.log(`   E-posta: ${user.email}`);
  console.log(`   Rol:    super_admin\n`);

  await db.$disconnect();
}

main().catch(async (e) => {
  console.error("\n❌ Hata:", e.message);
  await db.$disconnect();
  process.exit(1);
});
