"use client";

// Next.js 16 prerender kısıtı: new Date() prerender sırasında çalışamaz.
// useSyncExternalStore ile client-only snapshot alıyoruz — ESLint uyumlu.
import { useSyncExternalStore } from "react";

function getYear() {
  return new Date().getFullYear();
}

function subscribe() {
  // Yıl değişmez; boş unsubscribe yeterli
  return () => {};
}

export function CurrentYear() {
  const year = useSyncExternalStore(subscribe, getYear, () => 2026);
  return <>{year}</>;
}
