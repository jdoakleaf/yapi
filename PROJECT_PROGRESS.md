# PROJECT_PROGRESS.md

## Genel durum

- **Proje:** Kurumsal Yapı, İnşaat ve Uygulama Web Platformu
- **Son güncelleme:** 2026-11-13T20:25:00+03:00
- **Aktif faz:** Faz 4 — Medya ve ortak CMS altyapısı
- **Son tamamlanan görev:** Faz 3 — Auth/RBAC tamamlandı ve test edildi
- **Devam eden görev:** Faz 4 başlayacak (kullanıcı onayı bekleniyor)
- **Sıradaki tek adım:** Medya depolama adaptörü + upload altyapısı

## Tamamlanan fazlar

- **Faz 0** — Başlangıç ve keşif ✅ (2026-11-13)
- **Faz 1** — Proje iskeleti ve geliştirme altyapısı ✅ (2026-11-13)
- **Faz 2** — Veritabanı ve veri katmanı ✅ (2026-11-13)
- **Faz 3** — Kimlik doğrulama ve yetkilendirme ✅ (2026-11-13)

## Faz 3 özeti

| Görev | Durum |
|-------|-------|
| next-auth@5.0.0-beta.32 kurulumu | ✅ |
| @auth/prisma-adapter@2.11.3 kurulumu | ✅ |
| src/lib/auth/config.ts (PrismaAdapter + Credentials) | ✅ |
| src/lib/auth/edge-config.ts (Edge Runtime uyumlu) | ✅ |
| src/lib/auth/index.ts (handler export) | ✅ |
| src/lib/auth/password.ts (scrypt hash/verify) | ✅ |
| src/lib/auth/rbac.ts (requireAuth, requireRole, hasRole) | ✅ |
| src/lib/auth/types.ts (session type augmentation) | ✅ |
| src/middleware.ts (Edge route koruma) | ✅ |
| /api/auth/[...nextauth] route | ✅ |
| /admin/login sayfası (useActionState) | ✅ |
| loginAction (rate limiting + audit log) | ✅ |
| scripts/create-admin.mjs (güvenli CLI) | ✅ |
| Yetkisiz erişim testi | ✅ |
| Audit log entegrasyonu | ✅ |

## Test sonuçları (Faz 3)

| Test | Sonuç | Tarih |
|------|-------|-------|
| GET /admin (yetkisiz) | ✅ 307 → /admin/login | 2026-11-13 |
| GET /admin/login | ✅ 200 | 2026-11-13 |
| GET / (public) | ✅ 200 | 2026-11-13 |
| GET /api/auth/session | ✅ 200 | 2026-11-13 |
| ESLint | ✅ 0 hata, 0 uyarı | 2026-11-13 |
| TypeScript | ✅ Temiz | 2026-11-13 |
| Production Build | ✅ 5 route + proxy | 2026-11-13 |

## Ortam bilgileri

| Bileşen | Sürüm | Durum |
|---------|-------|-------|
| Node.js | v24.15.0 | ✅ |
| pnpm | v12.18.0 | ✅ |
| Next.js | 16.4.6 | ✅ |
| React | 19.3.0 | ✅ |
| TypeScript | 5.9.3 | ✅ |
| Tailwind CSS | 4.3.3 | ✅ |
| Prisma | 5.22.0 | ✅ |
| Zod | 4.6.7 | ✅ |
| next-auth | 5.0.0-beta.32 | ✅ |
| @auth/prisma-adapter | 2.11.3 | ✅ |
| embedded-postgres | 17.11.0-beta.19 | ✅ Dev DB |

## Git geçmişi

| Commit | Açıklama | Tarih |
|--------|----------|-------|
| addf7c0 | feat: Faz 3 - Auth.js (NextAuth v5) + RBAC | 2026-11-13 |
| d4523a7 | docs: update checklist and progress - Faz 2 complete | 2026-11-13 |
| ee9e527 | feat: Faz 2 complete - migration and seed verified | 2026-11-13 |
| 73a413e | feat: Faz 2 - Prisma 5.22.0 schema ve seed | 2026-11-13 |
| 8b5d699 | feat: Faz 0+1 iskelet kurulumu | 2026-11-13 |

## Önemli teknik notlar

### middleware.ts → proxy.ts (Next.js 16)
Next.js 16 `middleware.ts`'i deprecated sayıp `proxy.ts` öneriyor ama hâlâ `middleware.ts`'i arıyor. İsim değişikliği yapmak build'i kırıyor. Şimdilik `middleware.ts` olarak bırakıldı.

### Edge Runtime ayrımı
Auth.js config'i iki katmana bölündü:
- `edge-config.ts` → sadece session doğrulama (middleware)
- `config.ts` → tam config (Prisma, scrypt) → sadece Node.js runtime'da kullanılır

### Rate limiting
Şu an in-memory Map kullanıyor. Üretimde Redis tabanlı (Upstash vb.) ile değiştirilmeli.

### create-admin CLI
Admin parolası seed'e gömülmedi. Güvenli oluşturma: `node scripts/start-db.mjs` ardından `pnpm create-admin`.

## Faz 4 planı (Medya ve CMS Altyapısı)

### Görevler
1. Medya depolama adaptörü (LOCAL / S3 soyutlaması)
2. Upload endpoint — MIME allowlist (image/jpeg, image/png, image/webp, image/svg+xml, application/pdf)
3. Boyut limiti (varsayılan 10MB)
4. Görsel metadata ve alt text alanları
5. Medya kütüphanesi CRUD API (server actions)
6. Güvenli medya silme (kullanım kontrolü)
7. İçerik durumları ve yayınlama mantığı (ContentStatus enum)
8. Slug üretimi ve çakışma kontrolü
9. Ortak arama, filtreleme, sıralama, sayfalama helper'ları
10. lint + typecheck + build
11. commit

## Sonraki oturum kuralı

Önce bu dosyayı, `PROJECT_CHECKLIST.md`, `PROJECT_SPECIFICATION.md` ve `docs/DECISIONS.md` dosyalarını oku.

Dev için: `node scripts/start-db.mjs` ile embedded PostgreSQL başlat (port 5433), ardından `pnpm dev`.
