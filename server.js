// server.js
// Plesk Node.js Extension baslatma dosyasi.
// Plesk → Node.js panelinde "Application startup file" olarak tanimlanir.
// PORT ortam degiskenini Plesk otomatik atar.
//
// next.config.ts → output:"standalone" kullanilir.
// SWC binary gerekmez; pre-compiled standalone server calistirilir.
// Prisma RHEL binary schema.prisma binaryTargets ile dahil edilmistir.

"use strict";

const path = require("path");
const fs = require("fs");
const { execSync } = require("child_process");

// ---------------------------------------------------------------------------
// Adim 1: Veritabani migration
// ---------------------------------------------------------------------------

function runMigrations() {
  if (!process.env.DATABASE_URL) {
    console.warn("> [migration] DATABASE_URL bulunamadi — atlandi.");
    return;
  }

  const prismaBin = path.join(
    __dirname,
    "node_modules",
    ".bin",
    "prisma"
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
    console.error("> [migration] Uyari:", err.message);
    console.error("> [migration] Devam ediliyor...");
  }
}

runMigrations();

// ---------------------------------------------------------------------------
// Adim 2: Standalone icin static dosyalari kopyala (yoksa)
// ---------------------------------------------------------------------------

function copyDirIfMissing(src, dst) {
  if (!fs.existsSync(src)) {
    console.warn("> [setup] Kaynak dizin bulunamadi:", src);
    return;
  }
  if (fs.existsSync(dst)) {
    return; // Zaten kopyalanmis
  }
  try {
    fs.cpSync(src, dst, { recursive: true });
    console.log("> [setup] Kopyalandi:", src, "->", dst);
  } catch (err) {
    console.warn("> [setup] Kopyalama hatasi:", err.message);
  }
}

const standaloneDir = path.join(__dirname, ".next", "standalone");

copyDirIfMissing(
  path.join(__dirname, ".next", "static"),
  path.join(standaloneDir, ".next", "static")
);
copyDirIfMissing(
  path.join(__dirname, "public"),
  path.join(standaloneDir, "public")
);

// ---------------------------------------------------------------------------
// Adim 3: Standalone server.js'i calistir
// ---------------------------------------------------------------------------

process.env.HOSTNAME = process.env.HOSTNAME || "0.0.0.0";
process.env.PORT = process.env.PORT || "3000";

console.log(
  `> Standalone server baslatiliyor: PORT=${process.env.PORT} ENV=${process.env.NODE_ENV}`
);

require(path.join(__dirname, ".next", "standalone", "server.js"));
