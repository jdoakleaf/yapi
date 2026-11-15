// server.js
// Plesk Node.js Extension baslatma dosyasi.
// Plesk → Node.js panelinde "Application startup file" olarak tanimlanir.
// PORT ortam degiskenini Plesk otomatik atar.
//
// Ozellikler:
//   1. Baslamadan once veritabani migration'larini otomatik calistirir
//   2. Next.js uygulamasini PORT uzerinde baslatir
//   3. SSH erisimine gerek yoktur

"use strict";

const { createServer } = require("http");
const { parse } = require("url");
const path = require("path");
const { execSync } = require("child_process");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

// ---------------------------------------------------------------------------
// Adim 1: Veritabani migration (server baslamadan once)
// ---------------------------------------------------------------------------

function runMigrations() {
  // DATABASE_URL tanimli degilse migration atlaniyor
  if (!process.env.DATABASE_URL) {
    console.warn(
      "> [migration] DATABASE_URL bulunamadi — migration atlandi. Lutfen .env.local veya Plesk env degiskenlerini kontrol edin."
    );
    return;
  }

  // Yerel prisma binary (platform-uyumlu)
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
    });
    console.log("> [migration] Migration tamamlandi.");
  } catch (err) {
    // Migration basarisiz olsa bile uygulamayi durdurmuyoruz.
    // DB zaten guncel olabilir; hata varsa /api/health endpoint'inden gorulur.
    console.error(
      "> [migration] Uyari: Migration sirasinda hata olustu:",
      err.message
    );
    console.error("> [migration] Uygulama baslatmaya devam ediliyor...");
  }
}

runMigrations();

// ---------------------------------------------------------------------------
// Adim 2: Next.js uygulamasini baslat
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
        `> Yapi Platform hazir: http://${hostname}:${port} [${process.env.NODE_ENV || "development"}]`
      );
      console.log(`> Ilk kurulum icin: http://${hostname}:${port}/setup`);
    });
});
