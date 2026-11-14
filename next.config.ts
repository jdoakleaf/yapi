import type { NextConfig } from "next";

/**
 * HTTP Güvenlik başlıkları
 * Üretimde CSP, HSTS, X-Frame-Options vb. zorunludur.
 */
const securityHeaders = [
  // XSS koruması (modern tarayıcılarda CSP'nin yerini tutmaz ama fallback)
  { key: "X-XSS-Protection", value: "1; mode=block" },
  // MIME type sniffing önleme
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Clickjacking önleme
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Referrer bilgisi kısıtlama
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // İzin politikası — kamera/mikrofon/konum kısıtlama
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  // HSTS — üretimde HTTPS zorunlu (dev'de tarayıcı hatası vermez)
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // Content Security Policy
  // 'unsafe-inline' next.js inline script gereksinimleri için gerekli
  // Üretimde nonce tabanlı CSP'ye geçiş Faz 15 (opsiyonel hardening) için planlandı
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Next.js dev/prod inline scripts
      "style-src 'self' 'unsafe-inline'", // Tailwind inline styles
      "img-src 'self' data: blob: https:",
      "font-src 'self'",
      "connect-src 'self'",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // Güvenlik başlıkları — tüm route'lara uygulanır
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      // API route'ları için ek CORS kısıtlaması
      {
        source: "/api/(.*)",
        headers: [
          ...securityHeaders,
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate" },
        ],
      },
    ];
  },
};

export default nextConfig;
