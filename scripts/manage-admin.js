"use strict";

/**
 * scripts/manage-admin.js
 * Kullanıcı listeleme, şifre sıfırlama ve audit log görüntüleme aracı.
 * 
 * Kullanım:
 *   node scripts/manage-admin.js list
 *   node scripts/manage-admin.js reset <eposta> <yeni_sifre>
 *   node scripts/manage-admin.js verify <eposta> <sifre>
 */

const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

// 1. .env dosyalarını oku ve tırnakları temizle
const envFiles = [".env", ".env.production", ".env.local"];
for (const file of envFiles) {
  const envPath = path.join(__dirname, "..", file);
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const i = t.indexOf("=");
      if (i !== -1) {
        const key = t.slice(0, i).trim();
        let val = t.slice(i + 1).trim();
        if (
          (val.startsWith('"') && val.endsWith('"')) ||
          (val.startsWith("'") && val.endsWith("'"))
        ) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

if (!process.env.DATABASE_URL) {
  console.error("UYARI: DATABASE_URL ortam değişkeni bulunamadı!");
}

// 2. Linux engine library kontrolü
const linuxEngine = path.join(
  __dirname,
  "..",
  ".next",
  "standalone",
  "node_modules",
  ".prisma",
  "client",
  "libquery_engine-rhel-openssl-1.1.x.so.node"
);
if (fs.existsSync(linuxEngine) && !process.env.PRISMA_QUERY_ENGINE_LIBRARY) {
  process.env.PRISMA_QUERY_ENGINE_LIBRARY = linuxEngine;
}

// 3. PrismaClient yükle
let PrismaClient;
try {
  PrismaClient = require(path.join(__dirname, "..", ".next", "standalone", "node_modules", "@prisma", "client")).PrismaClient;
} catch {
  try {
    PrismaClient = require("@prisma/client").PrismaClient;
  } catch (err) {
    console.error("PrismaClient yuklenemedi:", err.message);
    process.exit(1);
  }
}

const prisma = new PrismaClient();

// Şifre fonksiyonları (Node built-in crypto)
const KEYLEN = 64;
const COST = 16384;

function hashPassword(password) {
  const salt = crypto.randomBytes(32).toString("hex");
  const hash = crypto.scryptSync(password, salt, KEYLEN, { N: COST });
  return `${salt}:${hash.toString("hex")}`;
}

function verifyPassword(password, stored) {
  try {
    const [salt, hashHex] = stored.split(":");
    if (!salt || !hashHex) return false;
    const storedHash = Buffer.from(hashHex, "hex");
    const derivedHash = crypto.scryptSync(password, salt, KEYLEN, { N: COST });
    return crypto.timingSafeEqual(storedHash, derivedHash);
  } catch {
    return false;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const cmd = args[0] || "list";

  if (cmd === "list") {
    console.log("\n================ KULLANICILAR ================");
    const users = await prisma.user.findMany({
      include: {
        userRoles: {
          include: { role: true },
        },
      },
    });

    if (users.length === 0) {
      console.log("Veritabanında kayıtlı kullanıcı bulunamadı!");
    } else {
      for (const u of users) {
        console.log(`- ID: ${u.id}`);
        console.log(`  Ad: ${u.name}`);
        console.log(`  E-posta: [${u.email}]`);
        console.log(`  Aktif mi: ${u.isActive}`);
        console.log(`  Roller: ${u.userRoles.map((r) => r.role.key).join(", ") || "YOK"}`);
        console.log(`  Şifre Hash: ${u.passwordHash ? "Mevcut (" + u.passwordHash.slice(0, 15) + "...)" : "YOK"}`);
        console.log(`  Son Giriş: ${u.lastLoginAt || "Hiç girmedi"}`);
        console.log("----------------------------------------------");
      }
    }

    console.log("\n============ SON GÜVENLİK / AUDIT LOGLARI ============");
    try {
      const logs = await prisma.auditLog.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
      });
      for (const l of logs) {
        console.log(`[${l.createdAt.toISOString()}] ${l.action} | entity: ${l.entityType} | metadata: ${JSON.stringify(l.metadataJson)}`);
      }
    } catch (e) {
      console.log("Audit log okunamadı:", e.message);
    }
    console.log("==============================================\n");
    return;
  }

  if (cmd === "reset") {
    const email = args[1]?.toLowerCase().trim();
    const newPassword = args[2];

    if (!email || !newPassword) {
      console.error("Kullanım: node scripts/manage-admin.js reset <eposta> <yeni_sifre>");
      process.exit(1);
    }

    if (newPassword.length < 8) {
      console.error("HATA: Yeni şifre en az 8 karakter olmalı.");
      process.exit(1);
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.error(`HATA: '${email}' e-postasına sahip kullanıcı bulunamadı!`);
      process.exit(1);
    }

    const newHash = hashPassword(newPassword);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: newHash,
        isActive: true,
      },
    });

    console.log(`BAŞARILI: '${email}' kullanıcısının şifresi güncellendi ve hesap aktif edildi.`);
    return;
  }

  if (cmd === "verify") {
    const email = args[1]?.toLowerCase().trim();
    const password = args[2];

    if (!email || !password) {
      console.error("Kullanım: node scripts/manage-admin.js verify <eposta> <sifre>");
      process.exit(1);
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.error(`HATA: '${email}' kullanıcısı bulunamadı.`);
      process.exit(1);
    }

    const valid = verifyPassword(password, user.passwordHash || "");
    console.log(`Şifre testi sonucu: ${valid ? "GEÇERLİ (ŞİFRE DOĞRU)" : "GEÇERSİZ (ŞİFRE YANLIŞ)"}`);
    return;
  }

  console.log("Bilinmeyen komut:", cmd);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Hata oluştu:", err);
    process.exit(1);
  });
