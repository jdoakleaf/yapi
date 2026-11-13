# PROJECT_PROGRESS.md

## Genel durum

- **Proje:** Kurumsal Yapı, İnşaat ve Uygulama Web Platformu
- **Son güncelleme:** 2026-11-13T20:14:00+03:00
- **Aktif faz:** Faz 3 — Kimlik doğrulama ve yetkilendirme
- **Son tamamlanan görev:** Faz 2 kabul kriterleri geçildi — migration + seed doğrulandı
- **Devam eden görev:** Faz 3 başlayacak (kullanıcı onayı bekleniyor)
- **Sıradaki tek adım:** Auth.js (NextAuth v5) + PrismaAdapter kurulumu

## Tamamlanan fazlar

- **Faz 0** — Başlangıç ve keşif ✅ (2026-11-13)
- **Faz 1** — Proje iskeleti ve geliştirme altyapısı ✅ (2026-11-13)
- **Faz 2** — Veritabanı ve veri katmanı ✅ (2026-11-13)

## Faz 2 özeti

| Görev | Durum |
|-------|-------|
| Prisma 5.22.0 kurulumu | ✅ |
| Zod 4.6.7 kurulumu | ✅ |
| tsx (seed runner) kurulumu | ✅ |
| Prisma schema (24 model) | ✅ Validate edildi |
| Enum tasarımları (7 enum) | ✅ |
| İlişkiler + FK + indeksler | ✅ |
| src/lib/db.ts (singleton) | ✅ |
| prisma/seed.ts (idempotent) | ✅ |
| embedded-postgres kurulumu | ✅ 17.11.0-beta.19 |
| PostgreSQL başlatma | ✅ Port 5433, locale C |
| İlk migration (initial_schema) | ✅ 2026-11-13T17:07 |
| Seed çalıştırma | ✅ 4 rol, 15 izin, 12 kategori, 2 menü, tema, 11 ayar |
| Seed idempotency testi | ✅ Çoğalma yok |

## Test sonuçları (Faz 2 sonrası)

| Test | Sonuç | Tarih |
|------|-------|-------|
| Prisma schema validate | ✅ Geçerli | 2026-11-13 |
| ESLint | ✅ 0 hata, 0 uyarı | 2026-11-13 |
| TypeScript (tsc --noEmit) | ✅ Temiz | 2026-11-13 |
| Production Build | ✅ 3 static route | 2026-11-13 |
| Migration (prisma migrate dev) | ✅ Başarılı | 2026-11-13 |
| Seed testi | ✅ İdempotent doğrulandı | 2026-11-13 |

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
| tsx | 4.23.15 | ✅ |
| embedded-postgres | 17.11.0-beta.19 | ✅ Dev DB |
| PostgreSQL (sistem) | — | ⚠️ Faz 14'te kurulacak |

## Proje dosya yapısı (Faz 2 sonu)

```
c:\PROJELER\YAPI2\
├── prisma/
│   ├── schema.prisma          # 24 model, 7 enum, tam ilişkiler
│   ├── seed.ts                # İdempotent seed — 12 kategori, roller, tema, site
│   └── migrations/
│       └── 20261113170743_initial_schema/
│           └── migration.sql  # Tüm tablolar
├── src/
│   ├── app/ ...               # Route iskeleti (Faz 1)
│   ├── components/shared/
│   │   └── current-year.tsx
│   └── lib/
│       ├── config.ts          # Env doğrulama
│       └── db.ts              # Prisma singleton client
├── scripts/
│   ├── setup-db.mjs           # DB başlat + migrate + seed
│   └── start-db.mjs           # Dev için DB başlat
├── docs/
│   └── DECISIONS.md           # D-001..D-010
├── .env.example
├── .env.local                 # DATABASE_URL (gitignore'da)
├── .pg-data/                  # Embedded PG veri dizini (gitignore'da)
├── package.json               # db:* scriptleri
└── pnpm-workspace.yaml        # Build script onayları
```

## Açık riskler / kararlar

### 🟡 Orta — Faz 3'te
- **Auth çözümü:** Auth.js (NextAuth v5) + PrismaAdapter (D-010 kararı)
- **Admin şifre oluşturma CLI komutu:** Faz 3'te yazılacak

### 🟢 Düşük — İleride
- **Sistem PostgreSQL kurulumu:** Faz 14 (yayına hazırlık) — üretimde embedded-postgres kullanılmaz
- KVKK metinleri, gerçek içerik, domain/marka, hosting

## Git geçmişi

| Commit | Açıklama | Tarih |
|--------|----------|-------|
| ee9e527 | feat: Faz 2 complete - migration and seed verified | 2026-11-13 |
| 73a413e | feat: Faz 2 - Prisma 5.22.0 schema ve seed | 2026-11-13 |
| 8b5d699 | feat: Faz 0+1 iskelet kurulumu | 2026-11-13 |

## Faz 3 planı (Auth/RBAC)

### Görevler (sırayla)
1. `pnpm add next-auth@beta @auth/prisma-adapter`
2. `src/lib/auth/config.ts` — Auth.js yapılandırması
3. `src/lib/auth/index.ts` — helper export'ları
4. `src/app/admin/login/page.tsx` — login sayfası
5. `src/app/admin/login/actions.ts` — server action
6. `src/middleware.ts` — admin route koruması
7. `src/lib/auth/rbac.ts` — server-side RBAC helper
8. `src/lib/auth/session.ts` — session utilities
9. `src/app/api/auth/[...nextauth]/route.ts` — Auth.js handler
10. Rate limiting (login endpoint)
11. `scripts/create-admin.mjs` — güvenli admin oluşturma CLI
12. Yetkisiz erişim testleri
13. Audit log altyapısı (Faz 2 modelini kullan)
14. lint + typecheck + build
15. commit

### Faz 3 kabul kriteri
Yetkisiz kullanıcı admin verisine ve mutation işlemlerine erişemiyor.

## Sonraki oturum kuralı

Önce bu dosyayı, `PROJECT_CHECKLIST.md`, `PROJECT_SPECIFICATION.md` ve `docs/DECISIONS.md` dosyalarını oku. Checklist'te tamamlandı görünmeyen hiçbir işi yapılmış varsayma.

Faz 3 başlamadan önce `node scripts/start-db.mjs` ile embedded PostgreSQL başlatılmalı (`.env.local` DATABASE_URL'i port 5433 üzerinden).
