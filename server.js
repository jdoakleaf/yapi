// server.js
// Plesk Node.js Extension baslatma dosyasi.
// Plesk → Node.js panelinde "Application startup file" olarak tanimlanir.
// PORT ortam degiskenini Plesk otomatik atar.
//
// next.config.ts → output:"standalone" kullanilir.
// SWC binary gerekmez; pre-compiled standalone server calistirilir.

"use strict";

const Module = require("module");
const path = require("path");
const fs = require("fs");
const { execSync } = require("child_process");

// ---------------------------------------------------------------------------
// Adim -1: Turbopack hashed external modules fix (@prisma/client-xxxx -> @prisma/client)
// ---------------------------------------------------------------------------

const originalResolveFilename = Module._resolveFilename;
Module._resolveFilename = function (request, parent, isMain, options) {
  if (typeof request === "string" && request.startsWith("@prisma/client-")) {
    request = "@prisma/client";
  }
  return originalResolveFilename.call(this, request, parent, isMain, options);
};

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

// AUTH_SECRET ve NEXTAUTH_SECRET esitleme
if (process.env.AUTH_SECRET && !process.env.NEXTAUTH_SECRET) {
  process.env.NEXTAUTH_SECRET = process.env.AUTH_SECRET;
}
if (process.env.NEXTAUTH_SECRET && !process.env.AUTH_SECRET) {
  process.env.AUTH_SECRET = process.env.NEXTAUTH_SECRET;
}
if (!process.env.AUTH_SECRET && !process.env.NEXTAUTH_SECRET) {
  console.warn("> [auth] UYARI: AUTH_SECRET veya NEXTAUTH_SECRET tanimli degil! Fallback ataniyor.");
  process.env.AUTH_SECRET = "lagan-auth-secret-key-32-chars-minimum-fallback";
  process.env.NEXTAUTH_SECRET = process.env.AUTH_SECRET;
}
if (!process.env.NEXTAUTH_URL && process.env.NEXT_PUBLIC_APP_URL) {
  process.env.NEXTAUTH_URL = process.env.NEXT_PUBLIC_APP_URL;
}

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
// Adim 2: Standalone icin static ve public dosyalari kopyala
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
// Adim 3: Prisma modullerini standalone node_modules'a saglam sekilde aktar
// ---------------------------------------------------------------------------

function setupPrismaModules() {
  const standaloneNodeModules = path.join(standaloneDir, "node_modules");
  if (!fs.existsSync(standaloneNodeModules)) {
    try {
      fs.mkdirSync(standaloneNodeModules, { recursive: true });
    } catch (e) {}
  }

  // 1. @prisma
  const prismaSources = [
    path.join(__dirname, "node_modules", "@prisma"),
    path.join(
      __dirname,
      "node_modules",
      ".pnpm",
      "@prisma+client@5.22.0_prisma@5.22.0",
      "node_modules",
      "@prisma"
    ),
  ];
  for (const src of prismaSources) {
    if (fs.existsSync(src)) {
      const dst = path.join(standaloneNodeModules, "@prisma");
      if (!fs.existsSync(dst)) {
        try {
          fs.cpSync(src, dst, { recursive: true, dereference: true });
          console.log("> [prisma] @prisma kopyalandi.");
        } catch (e) {}
      }
      break;
    }
  }

  // 2. .prisma
  const dotPrismaSources = [
    path.join(
      __dirname,
      "node_modules",
      ".pnpm",
      "@prisma+client@5.22.0_prisma@5.22.0",
      "node_modules",
      ".prisma"
    ),
    path.join(__dirname, "node_modules", ".prisma"),
  ];
  for (const src of dotPrismaSources) {
    if (fs.existsSync(src)) {
      const dst = path.join(standaloneNodeModules, ".prisma");
      if (!fs.existsSync(dst)) {
        try {
          fs.cpSync(src, dst, { recursive: true, dereference: true });
          console.log("> [prisma] .prisma kopyalandi.");
        } catch (e) {}
      }
      break;
    }
  }

  // 3. Turbopack hash alias (@prisma/client-dcc063df019991b5)
  const prismaScope = path.join(standaloneNodeModules, "@prisma");
  const normalClient = path.join(prismaScope, "client");
  const hashedClient = path.join(prismaScope, "client-dcc063df019991b5");
  if (fs.existsSync(normalClient) && !fs.existsSync(hashedClient)) {
    try {
      fs.cpSync(normalClient, hashedClient, { recursive: true, dereference: true });
      console.log("> [prisma] Hashed client alias olusturuldu.");
    } catch (e) {}
  }

  // 4. RHEL binary yolunu PRISMA_QUERY_ENGINE_LIBRARY olarak ayarla
  const rhelBinary = "libquery_engine-rhel-openssl-1.1.x.so.node";
  const binaryCandidates = [
    path.join(standaloneNodeModules, ".prisma", "client", rhelBinary),
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
  ];
  for (const c of binaryCandidates) {
    if (fs.existsSync(c)) {
      process.env.PRISMA_QUERY_ENGINE_LIBRARY = c;
      console.log("> [prisma] PRISMA_QUERY_ENGINE_LIBRARY =", c);
      break;
    }
  }
}

setupPrismaModules();

// ---------------------------------------------------------------------------
// Adim 4: Standalone server.js'i calistir
// ---------------------------------------------------------------------------

// HOSTNAME'i her zaman 0.0.0.0 yap — tum interface'lerde dinle
process.env.HOSTNAME = "0.0.0.0";
process.env.PORT = process.env.PORT || "3000";

console.log(
  `> Standalone server baslatiliyor: PORT=${process.env.PORT} ENV=${process.env.NODE_ENV}`
);

require(path.join(__dirname, ".next", "standalone", "server.js"));
