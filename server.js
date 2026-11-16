// server.js
// Plesk Node.js Extension baslatma dosyasi.
// Plesk → Node.js panelinde "Application startup file" olarak tanimlanir.
// PORT ortam degiskenini Plesk otomatik atar.
//
// next.config.ts → output: "standalone" ile build edildigi icin
// .next/standalone/server.js kullanilir (custom next() server DEGIL).

"use strict";

const path = require("path");
const { execSync } = require("child_process");

// ---------------------------------------------------------------------------
// Adim 1: Veritabani migration (server baslamadan once)
// ---------------------------------------------------------------------------

function runMigrations() {
  if (!process.env.DATABASE_URL) {
    console.warn(
      "> [migration] DATABASE_URL bulunamadi — migration atlandi."
    );
    return;
  }

  const isWin = process.platform === "win32";
  const prismaBin = path.join(
    __dirname,
    "node_modules",
    ".bin",
    isWin ? "prisma.cmd" : "prisma"
  );

  try {
    console.log("> [migration] Veritabani migration basliyor...");
    execSync(`"${prismaBin}" migrate deploy`, {
      stdio: "inherit",
      cwd: __dirname,
      env: process.env,
      timeout: 30000,
    });
    console.log("> [migration] Migration tamamlandi.");
  } catch (err) {
    console.error(
      "> [migration] Uyari: Migration sirasinda hata olustu:",
      err.message
    );
    console.error("> [migration] Uygulama baslatmaya devam ediliyor...");
  }
}

runMigrations();

// ---------------------------------------------------------------------------
// Adim 2: Standalone Next.js server'i baslat
// output: "standalone" ile build yapildiginda .next/standalone/server.js
// tum bagimliliklari icerir ve dogrudan node ile calistirilir.
// ---------------------------------------------------------------------------

// Standalone server HOST/PORT/HOSTNAME env var'larindan okur
// Plesk zaten PORT'u set eder; biz sadece yonlendiriyoruz.
process.env.HOSTNAME = process.env.HOSTNAME || "0.0.0.0";
process.env.PORT = process.env.PORT || "3000";

console.log(
  `> Standalone server baslatiliyor: PORT=${process.env.PORT} ENV=${process.env.NODE_ENV}`
);

require(path.join(__dirname, ".next", "standalone", "server.js"));
