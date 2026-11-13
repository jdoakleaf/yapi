/**
 * Yapı Platform — Environment Configuration & Validation
 *
 * Uygulama başlatılırken ortam değişkenlerinin varlığını ve formatını doğrular.
 * Faz 2'de veritabanı, Faz 3'te auth, Faz 10'da e-posta değişkenleri eklenecek.
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Faz 2'de DATABASE_URL doğrulamasında kullanılacak
function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `❌ Ortam değişkeni eksik: ${key}. Lütfen .env.local dosyasını kontrol edin.`
    );
  }
  return value;
}

function getOptionalEnv(key: string, defaultValue: string): string {
  return process.env[key] || defaultValue;
}

/**
 * Sunucu tarafında kullanılacak yapılandırma.
 * Client component'lerde NEXT_PUBLIC_ prefix'li olanlar kullanılabilir.
 */
export const config = {
  app: {
    url: getOptionalEnv("NEXT_PUBLIC_APP_URL", "http://localhost:3000"),
    env: getOptionalEnv("NODE_ENV", "development"),
    isDev: process.env.NODE_ENV === "development",
    isProd: process.env.NODE_ENV === "production",
  },
  // Veritabanı — Faz 2'de aktifleştirilecek
  // db: {
  //   url: getRequiredEnv("DATABASE_URL"),
  // },
} as const;

export type AppConfig = typeof config;
