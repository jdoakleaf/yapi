// server.js
// Plesk Node.js Extension baslatma dosyasi.
// Plesk → Node.js panelinde "Application startup file" olarak tanimlanir.
// PORT ortam degiskenini Plesk otomatik atar.
//
// next.config.ts → output: "standalone" ile build edildigi icin
// .next/standalone/server.js kullanilir (custom next() server DEGIL).
//
// Standalone server statik dosyalari kendi dizininde arar:
//   .next/standalone/.next/static/   → CSS/JS bundle'lari
//   .next/standalone/public/         → public/ klasoru
// Bu dosyalar build sirasinda otomatik kopyalanmaz; bu script yapar.

"use strict";

const path = require("path");
const fs = require("fs");
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
// Adim 2: Standalone icin Prisma engine'i ayarla
// Windows'ta build edilen standalone'da Windows Prisma binary var.
// Linux'ta calistirinca dogru binary bulunamaz → DB sessizce bozulur.
// Ana node_modules'daki Linux binary'yi bulup PRISMA_QUERY_ENGINE_LIBRARY
// olarak set ediyoruz — standalone server bunu kullanir.
// ---------------------------------------------------------------------------

function setupPrismaEngine() {
  // Zaten set edilmisse atla
  if (process.env.PRISMA_QUERY_ENGINE_LIBRARY) {
    console.log(
      "> [prisma] Engine already set:",
      process.env.PRISMA_QUERY_ENGINE_LIBRARY
    );
    return;
  }

  function findEngine(dir, depth) {
    if (depth > 5) return null;
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (
          !entry.isDirectory() &&
          entry.name.startsWith("libquery_engine") &&
          entry.name.endsWith(".node")
        ) {
          return fullPath;
        }
        if (entry.isDirectory() && !entry.name.startsWith(".pnpm-store")) {
          const found = findEngine(fullPath, depth + 1);
          if (found) return found;
        }
      }
    } catch {}
    return null;
  }

  const enginePath = findEngine(
    path.join(__dirname, "node_modules"),
    0
  );

  if (enginePath) {
    process.env.PRISMA_QUERY_ENGINE_LIBRARY = enginePath;
    console.log("> [prisma] Linux engine bulundu:", enginePath);
  } else {
    console.warn(
      "> [prisma] Uyari: libquery_engine.node bulunamadi — DB calismayabilir."
    );
  }
}

setupPrismaEngine();

// ---------------------------------------------------------------------------
// Adim 2: Standalone icin statik dosyalari hazirla
// next build standalone modda .next/static ve public/ klasorlerini
// .next/standalone/ icine KOPYALAMAZ — bunu biz yapiyoruz.
// ---------------------------------------------------------------------------

function copyDirIfMissing(src, dst) {
  if (!fs.existsSync(src)) return;
  if (fs.existsSync(dst)) return; // zaten var, atlaniyor
  try {
    fs.cpSync(src, dst, { recursive: true });
    console.log(`> [setup] Kopyalandi: ${path.basename(src)} → standalone/`);
  } catch (err) {
    console.warn(`> [setup] Kopyalama hatasi (${src}):`, err.message);
  }
}

const standaloneDir = path.join(__dirname, ".next", "standalone");
// .next/static → .next/standalone/.next/static
copyDirIfMissing(
  path.join(__dirname, ".next", "static"),
  path.join(standaloneDir, ".next", "static")
);
// public → .next/standalone/public
copyDirIfMissing(
  path.join(__dirname, "public"),
  path.join(standaloneDir, "public")
);

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
