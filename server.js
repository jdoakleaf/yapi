// server.js
// Plesk Node.js Extension baslatma dosyasi.
// Plesk → Node.js panelinde "Application startup file" olarak tanimlanir.
// PORT ortam degiskenini Plesk otomatik atar.
//
// next.config.ts → output:"standalone" KALDIRILDI.
// Ana node_modules kullanilir (sunucuda pnpm install ile Linux binary kuruldu).

"use strict";

const { createServer } = require("http");
const { parse } = require("url");
const path = require("path");
const { execSync } = require("child_process");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "0.0.0.0";
const port = parseInt(process.env.PORT || "3000", 10);

// ---------------------------------------------------------------------------
// Adim 1: Veritabani migration
// ---------------------------------------------------------------------------

function runMigrations() {
  if (!process.env.DATABASE_URL) {
    console.warn("> [migration] DATABASE_URL bulunamadi — atlandi.");
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
    console.error("> [migration] Uyari:", err.message);
    console.error("> [migration] Devam ediliyor...");
  }
}

runMigrations();

// ---------------------------------------------------------------------------
// Adim 2: Next.js custom server (standalone DEGIL)
// Ana node_modules kullanilir → Linux Prisma binary otomatik bulunur.
// ---------------------------------------------------------------------------

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Hata:", req.url, err);
      res.statusCode = 500;
      res.end("Sunucu hatasi");
    }
  })
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(
        `> Yapi Platform hazir: http://${hostname}:${port} [${process.env.NODE_ENV}]`
      );
    });
});
