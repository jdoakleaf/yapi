/**
 * src/lib/auth/types.ts
 * Next-auth tip genişletmeleri — session'a id ve role ekler.
 */

import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: string;
    };
  }

  interface User {
    role?: string;
  }
}
