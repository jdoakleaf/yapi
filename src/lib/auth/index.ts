/**
 * src/lib/auth/index.ts
 * Auth.js instance ve helper export'ları.
 */

import NextAuth from "next-auth";
import { authConfig } from "./config";

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

/**
 * Mevcut kullanıcının oturumunu döndürür.
 * Server Component ve Server Action'larda kullanın.
 */
export { auth as getSession };
