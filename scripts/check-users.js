"use strict";

const { PrismaClient } = require("./.next/standalone/node_modules/@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    include: {
      userRoles: {
        include: { role: true }
      }
    }
  });

  console.log("=== KAYITLI KULLANICILAR ===");
  console.log("Toplam kullanıcı:", users.length);
  for (const u of users) {
    console.log({
      id: u.id,
      name: u.name,
      email: u.email,
      isActive: u.isActive,
      hasPasswordHash: !!u.passwordHash,
      roles: u.userRoles.map(r => r.role.key)
    });
  }
}

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
