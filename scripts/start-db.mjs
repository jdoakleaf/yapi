/**
 * scripts/start-db.mjs
 * Mevcut .pg-data/ dizinini kullanarak embedded PostgreSQL başlatır.
 * Dev sunucusu çalıştırılmadan önce bu script çalıştırılmalıdır.
 */

import EmbeddedPostgres from "embedded-postgres";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const pg = new EmbeddedPostgres({
  databaseDir: path.join(ROOT, ".pg-data"),
  user: "postgres",
  password: "postgres_dev_local",
  port: 5433,
  persistent: true,
});

console.log("🐘 PostgreSQL başlatılıyor (port 5433)...");
await pg.initialise();
await pg.start();
console.log("✅ PostgreSQL hazır. Durdurmak için Ctrl+C.");

process.on("SIGINT", async () => {
  console.log("\n🛑 PostgreSQL durduruluyor...");
  await pg.stop();
  process.exit(0);
});
