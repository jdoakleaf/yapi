/**
 * src/lib/auth/password.ts
 * scrypt ile parola hash ve doğrulama (Node.js built-in).
 */

import { scryptSync, randomBytes, timingSafeEqual } from "node:crypto";

const KEYLEN = 64;
const COST = 16384;

/**
 * Parolayı scrypt ile hashler.
 * Format: "salt:hash" (hex)
 */
export function hashPassword(password: string): string {
  const salt = randomBytes(32).toString("hex");
  const hash = scryptSync(password, salt, KEYLEN, { N: COST });
  return `${salt}:${hash.toString("hex")}`;
}

/**
 * Parolayı saklanan hash ile doğrular.
 * Timing-safe karşılaştırma kullanır.
 */
export function verifyPassword(password: string, stored: string): boolean {
  try {
    const [salt, hashHex] = stored.split(":");
    if (!salt || !hashHex) return false;
    const storedHash = Buffer.from(hashHex, "hex");
    const derivedHash = scryptSync(password, salt, KEYLEN, { N: COST });
    return timingSafeEqual(storedHash, derivedHash);
  } catch {
    return false;
  }
}
