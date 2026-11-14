# PROJECT_PROGRESS.md

## Genel durum

- **Proje:** Kurumsal Yapı, İnşaat ve Uygulama Web Platformu
- **Son güncelleme:** 2026-11-14T23:15:00+03:00
- **Aktif faz:** Faz 7 — Hizmet yönetimi (kullanıcı onayı bekleniyor)
- **Son tamamlanan görev:** Faz 6 — Sayfa ve blok editörü ✅ (2026-11-14)
- **Devam eden görev:** Faz 7 başlayacak
- **Sıradaki tek adım:** Hizmet kategorisi CRUD + hizmet CRUD + public sayfalar

## Tamamlanan fazlar

- **Faz 0** — Başlangıç ve keşif ✅ (2026-11-13)
- **Faz 1** — Proje iskeleti ve geliştirme altyapısı ✅ (2026-11-13)
- **Faz 2** — Veritabanı ve veri katmanı ✅ (2026-11-13)
- **Faz 3** — Kimlik doğrulama ve yetkilendirme ✅ (2026-11-13)
- **Faz 4** — Medya ve ortak CMS altyapısı ✅ (2026-11-14)
- **Faz 5** — Admin paneli kabuğu ve ayarlar ✅ (2026-11-14)
- **Faz 6** — Sayfa ve blok editörü ✅ (2026-11-14)

## Faz 6 özeti

| Görev | Durum |
|-------|-------|
| src/lib/cms/blocks.ts (12 blok tipi, Zod şemaları) | ✅ |
| src/lib/cms/page-actions.ts (createPage, updatePage, deletePage, addPageSection, updatePageSection, deletePageSection, reorderPageSections, toggleSectionActive) | ✅ |
| src/app/admin/sayfalar/page.tsx (liste) | ✅ |
| src/app/admin/sayfalar/delete-button.tsx | ✅ |
| src/app/admin/sayfalar/yeni/page.tsx | ✅ |
| src/app/admin/sayfalar/[id]/page.tsx (edit) | ✅ |
| src/app/admin/sayfalar/[id]/meta-form.tsx | ✅ |
| src/app/admin/sayfalar/[id]/block-list.tsx | ✅ |

## Test sonuçları (Faz 6)

| Test | Sonuç | Tarih |
|------|-------|-------|
| ESLint | ✅ 0 hata, 0 uyarı | 2026-11-14 |
| TypeScript (tsc --noEmit) | ✅ Temiz | 2026-11-14 |
| Production Build | ✅ 12 route + proxy, 0 hata | 2026-11-14 |

## Faz 5 özeti

| Görev | Durum |
|-------|-------|
| shadcn/ui bağımlılıkları (Radix + CVA + clsx + lucide-react) | ✅ |
| src/lib/utils.ts (cn helper) | ✅ |
| src/components/ui/button.tsx | ✅ |
| src/components/ui/input.tsx | ✅ |
| src/components/ui/label.tsx | ✅ |
| src/components/ui/card.tsx | ✅ |
| src/components/ui/separator.tsx | ✅ |
| src/components/ui/toast.tsx + toaster.tsx | ✅ |
| src/hooks/use-toast.ts | ✅ |
| src/components/admin/sidebar.tsx (19 modül, 4 grup, aktif link) | ✅ |
| src/components/admin/header.tsx (mobil hamburger, logout) | ✅ |
| src/components/admin/breadcrumb.tsx | ✅ |
| src/app/admin/layout.tsx (session kontrolü, responsive) | ✅ |
| src/app/admin/page.tsx (dashboard: sayaçlar, son talepler) | ✅ |
| src/lib/settings/actions.ts (getSiteSettings, updateSiteSettings) | ✅ |
| src/lib/settings/theme-utils.ts (generateCssVariables, checkWcagAA) | ✅ |
| src/lib/settings/theme-actions.ts (getThemeTokens, saveThemeTokens, resetThemeToDefault) | ✅ |
| src/app/admin/ayarlar/genel/page.tsx + form.tsx | ✅ |
| src/app/admin/ayarlar/tema/page.tsx + form.tsx | ✅ |

## Test sonuçları (Faz 5)

| Test | Sonuç | Tarih |
|------|-------|-------|
| ESLint | ✅ 0 hata, 0 uyarı | 2026-11-14 |
| TypeScript (tsc --noEmit) | ✅ Temiz | 2026-11-14 |
| Production Build | ✅ 8 route + proxy, 0 hata | 2026-11-14 |

## Faz 4 özeti

| Görev | Durum |
|-------|-------|
| src/lib/media/storage.ts (LocalStorageAdapter) | ✅ |
| src/lib/media/actions.ts (uploadMedia, listMedia, deleteMedia, updateMediaAltText) | ✅ |
| src/lib/cms/slug.ts (slugify, generateUniqueSlug) | ✅ |
| src/lib/cms/pagination.ts (parsePagination, buildPaginatedResponse, buildOrderBy) | ✅ |
| src/lib/cms/status.ts (ContentStatus, canTransition, STATUS_LABELS) | ✅ |
| src/app/api/media/upload/route.ts (POST upload + GET list) | ✅ |
| public/uploads/ dizini | ✅ |
| turbopackIgnore yorum eklendi (storage.ts path.join) | ✅ |

## Test sonuçları (Faz 4)


| Test | Sonuç | Tarih |
|------|-------|-------|
| GET /admin (yetkisiz) | ✅ 307 → /admin/login | 2026-11-13 |
| GET /admin/login | ✅ 200 | 2026-11-13 |
| GET / (public) | ✅ 200 | 2026-11-13 |
| GET /api/auth/session | ✅ 200 | 2026-11-13 |
| ESLint | ✅ 0 hata, 0 uyarı | 2026-11-13 |
| TypeScript | ✅ Temiz | 2026-11-13 |
| Production Build | ✅ 5 route + proxy | 2026-11-13 |

## Test sonuçları (Faz 4)

| Test | Sonuç | Tarih |
|------|-------|-------|
| ESLint | ✅ 0 hata, 0 uyarı | 2026-11-14 |
| TypeScript (tsc --noEmit) | ✅ Temiz | 2026-11-14 |
| Production Build | ✅ 6 route + proxy, 0 hata | 2026-11-14 |

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
