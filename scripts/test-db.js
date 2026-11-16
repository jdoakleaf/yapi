"use strict";

const path = require("path");
const fs = require("fs");

// .env dosyasini yukle
const envPath = path.join(__dirname, "..", ".env");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i !== -1 && !process.env[t.slice(0, i).trim()]) {
      process.env[t.slice(0, i).trim()] = t.slice(i + 1).trim();
    }
  }
}

console.log("DATABASE_URL:", process.env.DATABASE_URL ? "TANIMLI" : "YOK");

// Standalone icindeki PrismaClient
const clientPath = path.join(
  __dirname,
  "..",
  ".next",
  "standalone",
  "node_modules",
  "@prisma",
  "client"
);

console.log("Prisma Client yolu:", clientPath);

try {
  const { PrismaClient } = require(clientPath);
  const prisma = new PrismaClient({ log: ["error", "warn"] });

  async function test() {
    console.log("Prisma baglantisi baslatiliyor...");
    await prisma.$connect();
    console.log("--> CONNECT BASARILI!");
    const count = await prisma.siteSetting.count();
    console.log("--> siteSetting tablosundaki kayit sayisi:", count);
    const first = await prisma.siteSetting.findFirst();
    console.log("--> Ilk kayit:", first ? first.key : "Bos");
  }

  test()
    .then(() => {
      console.log("TEST TAMAMLANDI: Standalone Prisma ve DB calisiyor.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("TEST HATASI:", err);
      process.exit(1);
    });
} catch (e) {
  console.error("REQUIRE HATASI:", e);
  process.exit(1);
}
