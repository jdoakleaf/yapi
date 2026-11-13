/**
 * scripts/setup-db.mjs
 * Embedded PostgreSQL başlatır, migration + seed çalıştırır, sonra kapatır.
 * Yalnızca geliştirme/test ortamında kullanılır.
 */

import EmbeddedPostgres from "embedded-postgres";
import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const ENV_LOCAL = path.join(ROOT, ".env.local");

const DB_NAME = "yapi_platform";
const DB_USER = "postgres";
const DB_PASS = "postgres_dev_local";
const DB_PORT = 5433; // 5432'den farklı — çakışma olmasın

async function main() {
  console.log("🐘 Embedded PostgreSQL başlatılıyor...");

  const pg = new EmbeddedPostgres({
    databaseDir: path.join(ROOT, ".pg-data"),
    user: DB_USER,
    password: DB_PASS,
    port: DB_PORT,
    persistent: true,
    initdbFlags: ["--locale=C", "--encoding=UTF8"],
  });

  try {
    await pg.initialise();
    await pg.start();
    console.log(`✅ PostgreSQL ${DB_PORT} portunda başladı.`);

    // Veritabanı oluştur (zaten varsa atla)
    try {
      await pg.createDatabase(DB_NAME);
      console.log(`✅ Veritabanı oluşturuldu: ${DB_NAME}`);
    } catch (e) {
      if (e.message?.includes("already exists")) {
        console.log(`ℹ️  Veritabanı zaten mevcut: ${DB_NAME}`);
      } else {
        throw e;
      }
    }

    const DATABASE_URL = `postgresql://${DB_USER}:${DB_PASS}@localhost:${DB_PORT}/${DB_NAME}`;

    // .env.local oluştur/güncelle
    writeFileSync(
      ENV_LOCAL,
      `# Otomatik oluşturuldu — scripts/setup-db.mjs\n` +
        `DATABASE_URL="${DATABASE_URL}"\n` +
        `NEXTAUTH_SECRET="dev-secret-change-in-production"\n` +
        `NEXTAUTH_URL="http://localhost:3000"\n`
    );
    console.log(`✅ .env.local yazıldı.`);
    console.log(`   DATABASE_URL=${DATABASE_URL}`);

    // Migration çalıştır
    console.log("\n📦 Migration çalıştırılıyor...");
    execSync("pnpm db:migrate", {
      cwd: ROOT,
      env: { ...process.env, DATABASE_URL },
      stdio: "inherit",
      input: "initial_schema\n", // migration adı için stdin
    });

    // Seed çalıştır
    console.log("\n🌱 Seed çalıştırılıyor...");
    execSync("pnpm db:seed", {
      cwd: ROOT,
      env: { ...process.env, DATABASE_URL },
      stdio: "inherit",
    });

    // İdempotency testi — seed tekrar çalıştır
    console.log("\n🔄 Seed idempotency testi (tekrar çalıştır)...");
    execSync("pnpm db:seed", {
      cwd: ROOT,
      env: { ...process.env, DATABASE_URL },
      stdio: "inherit",
    });

    console.log("\n✅ Faz 2 testleri tamamlandı!");
    console.log("ℹ️  PostgreSQL .pg-data/ klasöründe çalışmaya devam ediyor.");
    console.log("ℹ️  Sonraki oturumda: node scripts/start-db.mjs ile başlatın.");
  } catch (err) {
    console.error("❌ Hata:", err.message);
    process.exit(1);
  }
  // Kapatmıyoruz — persistent mod, veri korunuyor
}

main();
