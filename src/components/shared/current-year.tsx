"use client";

import { useState, useEffect } from "react";

export function CurrentYear() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  // Prerender sırasında statik fallback, hydration sonrası gerçek yıl
  return <>{year ?? 2026}</>;
}
