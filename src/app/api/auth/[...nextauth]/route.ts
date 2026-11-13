/**
 * src/app/api/auth/[...nextauth]/route.ts
 * Auth.js HTTP handler — GET ve POST isteklerini işler.
 */

import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;
