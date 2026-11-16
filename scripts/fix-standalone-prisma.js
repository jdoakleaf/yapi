"use strict";

const path = require("path");
const fs = require("fs");

const rootDir = path.join(__dirname, "..");
const standaloneDir = path.join(rootDir, ".next", "standalone");
const standaloneNodeModules = path.join(standaloneDir, "node_modules");

console.log("=== LINK / COPY PRISMA MODULES ===");

if (!fs.existsSync(standaloneNodeModules)) {
  fs.mkdirSync(standaloneNodeModules, { recursive: true });
}

// 1. Root'taki @prisma ve .prisma'yı standalone/node_modules içine kopyala / bağla
const modulesToCopy = ["@prisma", ".prisma"];

for (const mod of modulesToCopy) {
  const src = path.join(rootDir, "node_modules", mod);
  const dst = path.join(standaloneNodeModules, mod);

  if (!fs.existsSync(src)) {
    console.warn("Kaynak bulunamadı:", src);
    continue;
  }

  if (fs.existsSync(dst)) {
    console.log("Hedef zaten var, siliniyor:", dst);
    try {
      fs.rmSync(dst, { recursive: true, force: true });
    } catch (e) {
      console.warn("Silme hatası:", e.message);
    }
  }

  try {
    fs.cpSync(src, dst, { recursive: true, dereference: true });
    console.log("Kopyalandı:", mod, "->", dst);
  } catch (err) {
    console.error("Kopyalama hatası:", mod, err.message);
  }
}

// 2. Şimdi test-db'yi çalıştır
console.log("\n=== TEST BAŞLIYOR ===");
const clientPath = path.join(standaloneNodeModules, "@prisma", "client");
console.log("Client yolu:", clientPath);

try {
  const { PrismaClient } = require(clientPath);
  const prisma = new PrismaClient({ log: ["error", "warn"] });

  prisma.$connect()
    .then(async () => {
      console.log("--> CONNECT BASARILI!");
      const count = await prisma.siteSetting.count();
      console.log("--> siteSetting tablosu OK! Kayıt sayısı:", count);
      return prisma.siteSetting.findFirst();
    })
    .then((first) => {
      console.log("--> İlk kayıt:", first ? first.key : "Boş");
      console.log("--> TEST BAŞARIYLA TAMAMLANDI!");
      process.exit(0);
    })
    .catch((err) => {
      console.error("--> PRISMA QUERY HATASI:", err);
      process.exit(1);
    });
} catch (e) {
  console.error("--> REQUIRE HATASI:", e);
  process.exit(1);
}
