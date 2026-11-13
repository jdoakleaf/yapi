/**
 * scripts/start-db.mjs
 * Mevcut .pg-data/ dizinini kullanarak embedded PostgreSQL başlatır.
 * .pg-data/ yoksa önce setup-db.mjs çalıştırılmalıdır.
 */

import EmbeddedPostgres from "embedded-postgres";
import path from "node:path";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DATA_DIR = path.join(ROOT, ".pg-data");

if (!existsSync(DATA_DIR)) {
  console.error("❌ .pg-data/ dizini bulunamadı. Önce 'node scripts/setup-db.mjs' çalıştırın.");
  process.exit(1);
}

const pg = new EmbeddedPostgres({
  databaseDir: DATA_DIR,
  user: "postgres",
  password: "postgres_dev_local",
  port: 5433,
  persistent: true,
});

console.log("🐘 PostgreSQL başlatılıyor (port 5433)...");
// Dizin zaten var — initialise() çağırma, sadece start() yap
await pg.start();
console.log("✅ PostgreSQL hazır. Durdurmak için Ctrl+C.");

process.on("SIGINT", async () => {
  console.log("\n🛑 PostgreSQL durduruluyor...");
  await pg.stop();
  process.exit(0);
});
