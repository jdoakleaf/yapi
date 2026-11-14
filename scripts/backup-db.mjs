#!/usr/bin/env node
/**
 * scripts/backup-db.mjs
 * PostgreSQL veritabanını yedekler (pg_dump).
 *
 * Kullanım:
 *   node scripts/backup-db.mjs
 *
 * Çıktı: backups/yapi_platform_YYYY-MM-DD_HH-MM-SS.sql
 *
 * Ortam değişkenleri: DATABASE_URL (veya ayrı ayrı PG* değişkenleri)
 * Gereksinim: pg_dump PATH'te olmalı (PostgreSQL client tools)
 */

import { execSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

// Ortam değişkenlerini yükle
const { config } = await import("dotenv");
config({ path: join(ROOT, ".env.local") });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL tanımlı değil. .env.local dosyasını kontrol edin.");
  process.exit(1);
}

// URL'den bağlantı bilgilerini çözümle
let pgUrl;
try {
  pgUrl = new URL(DATABASE_URL);
} catch {
  console.error("❌ DATABASE_URL geçerli bir URL değil:", DATABASE_URL);
  process.exit(1);
}

const host = pgUrl.hostname;
const port = pgUrl.port || "5432";
const user = pgUrl.username;
const password = pgUrl.password;
const dbName = pgUrl.pathname.replace(/^\//, "").split("?")[0];

// Yedek dizini oluştur
const backupDir = join(ROOT, "backups");
mkdirSync(backupDir, { recursive: true });

// Zaman damgası
const now = new Date();
const ts = now.toISOString()
  .replace(/T/, "_")
  .replace(/:/g, "-")
  .replace(/\..+/, "");
const filename = `yapi_platform_${ts}.sql`;
const outputPath = join(backupDir, filename);

console.log(`📦 Yedekleniyor: ${dbName}@${host}:${port}`);
console.log(`📁 Hedef: ${outputPath}`);

// pg_dump ile yedek al
const pgDumpCmd = `pg_dump -h ${host} -p ${port} -U ${user} -d ${dbName} -f "${outputPath}" --no-password --verbose`;

const env = { ...process.env, PGPASSWORD: password };

try {
  execSync(pgDumpCmd, { env, stdio: "inherit" });
  console.log(`\n✅ Yedek başarıyla oluşturuldu: ${filename}`);
  console.log(`\nGeri yüklemek için:`);
  console.log(`  psql -h ${host} -p ${port} -U ${user} -d ${dbName} < "${outputPath}"`);
} catch (err) {
  console.error("\n❌ pg_dump başarısız oldu:", err.message);
  console.error("pg_dump PATH'te olduğundan emin olun: PostgreSQL client tools kurulu olmalı.");
  process.exit(1);
}
