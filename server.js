// server.js
// Plesk Node.js Extension baslatma dosyasi.
// Plesk → Node.js panelinde "Application startup file" olarak tanimlanir.
// PORT ortam degiskenini Plesk otomatik atar.
//
// next.config.ts → output:"standalone" kullanilir.
// SWC binary gerekmez; pre-compiled standalone server calistirilir.

"use strict";

const path = require("path");
const fs = require("fs");
const { execSync } = require("child_process");

// ---------------------------------------------------------------------------
// Adim 0: .env dosyasini yukle (Plesk env var'lari yoksa fallback)
// ---------------------------------------------------------------------------

function loadEnvFile() {
  const envPath = path.join(__dirname, ".env");
  if (!fs.existsSync(envPath)) {
    console.warn("> [env] .env dosyasi bulunamadi, Plesk env kullanilacak.");
    return;
  }
  try {
    const content = fs.readFileSync(envPath, "utf8");
    let loaded = 0;
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const idx = trimmed.indexOf("=");
      if (idx === -1) continue;
      const key = trimmed.substring(0, idx).trim();
      const value = trimmed.substring(idx + 1).trim();
      if (!process.env[key]) {
        process.env[key] = value;
        loaded++;
      }
    }
    console.log(`> [env] .env yuklendi (${loaded} degisken).`);
  } catch (err) {
    console.warn("> [env] .env okunamadi:", err.message);
  }
}

loadEnvFile();

// ---------------------------------------------------------------------------
// Adim 1: Veritabani migration
// ---------------------------------------------------------------------------

function runMigrations() {
  if (!process.env.DATABASE_URL) {
    console.warn("> [migration] DATABASE_URL bulunamadi — atlandi.");
    return;
  }

  const prismaBin = path.join(__dirname, "node_modules", ".bin", "prisma");

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
    return;
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
// Adim 3: Prisma RHEL binary ayarla
// ---------------------------------------------------------------------------

function setupPrismaEngine() {
  const rhelBinary = "libquery_engine-rhel-openssl-1.1.x.so.node";

  const sourceCandidates = [
    path.join(
      __dirname,
      "node_modules",
      ".pnpm",
      "@prisma+client@5.22.0_prisma@5.22.0",
      "node_modules",
      ".prisma",
      "client",
      rhelBinary
    ),
    path.join(__dirname, "node_modules", ".prisma", "client", rhelBinary),
  ];

  let sourcePath = null;
  for (const candidate of sourceCandidates) {
    if (fs.existsSync(candidate)) {
      sourcePath = candidate;
      break;
    }
  }

  if (!sourcePath) {
    console.warn("> [prisma] RHEL binary bulunamadi — DB calismayabilir.");
    return;
  }

  // PRISMA_QUERY_ENGINE_LIBRARY env'ini set et
  process.env.PRISMA_QUERY_ENGINE_LIBRARY = sourcePath;
  console.log("> [prisma] PRISMA_QUERY_ENGINE_LIBRARY =", sourcePath);

  // Standalone .prisma/client dizinine kopyala (varsa)
  const targetCandidates = [
    path.join(
      standaloneDir,
      "node_modules",
      ".pnpm",
      "@prisma+client@5.22.0_prisma@5.22.0",
      "node_modules",
      ".prisma",
      "client"
    ),
    path.join(standaloneDir, "node_modules", ".prisma", "client"),
  ];

  for (const targetDir of targetCandidates) {
    if (fs.existsSync(targetDir)) {
      const targetPath = path.join(targetDir, rhelBinary);
      if (!fs.existsSync(targetPath)) {
        try {
          fs.copyFileSync(sourcePath, targetPath);
          console.log("> [prisma] RHEL binary kopyalandi:", targetPath);
        } catch (err) {
          console.warn("> [prisma] Binary kopyalama hatasi:", err.message);
        }
      } else {
        console.log("> [prisma] RHEL binary zaten mevcut:", targetPath);
      }
    }
  }
}

setupPrismaEngine();

// ---------------------------------------------------------------------------
// Adim 4: Standalone server.js'i calistir
// ---------------------------------------------------------------------------

process.env.HOSTNAME = process.env.HOSTNAME || "0.0.0.0";
process.env.PORT = process.env.PORT || "3000";

console.log(
  `> Standalone server baslatiliyor: PORT=${process.env.PORT} ENV=${process.env.NODE_ENV}`
);

require(path.join(__dirname, ".next", "standalone", "server.js"));
