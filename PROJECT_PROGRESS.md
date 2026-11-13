# PROJECT_PROGRESS.md

## Genel durum

- **Proje:** Kurumsal Yapı, İnşaat ve Uygulama Web Platformu
- **Son güncelleme:** 2026-11-13T12:58:00+03:00
- **Aktif faz:** Faz 2 — Veritabanı ve veri katmanı (kısmen tamamlandı)
- **Son tamamlanan görev:** Prisma schema + seed yazıldı, lint/typecheck/build geçti
- **Devam eden görev:** Migration ve seed testi — PostgreSQL bağlantısı bekleniyor
- **Sıradaki tek adım:** PostgreSQL kurulumu sonrası `pnpm db:migrate` ve `pnpm db:seed` çalıştırılacak

## Tamamlanan fazlar

- **Faz 0** — Başlangıç ve keşif ✅ (2026-11-13)
- **Faz 1** — Proje iskeleti ve geliştirme altyapısı ✅ (2026-11-13)
- **Faz 2** — Veritabanı şema ve seed hazırlandı ⚠️ (migration/test PostgreSQL bekliyor)

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
| 12 kategori seed verisi | ✅ (çalıştırma DB bekliyor) |
| Tema + site ayarları seed | ✅ (çalıştırma DB bekliyor) |
| İlk migration | ⚠️ PostgreSQL gerekli |
| Migration + seed testi | ⚠️ PostgreSQL gerekli |

## Test sonuçları (Faz 2 sonrası)

| Test | Sonuç | Tarih |
|------|-------|-------|
| Prisma schema validate | ✅ Geçerli | 2026-11-13 |
| ESLint | ✅ 0 hata | 2026-11-13 |
| TypeScript (tsc --noEmit) | ✅ Temiz | 2026-11-13 |
| Production Build | ✅ Başarılı | 2026-11-13 |
| Migration (prisma migrate dev) | ⏳ DB bekleniyor | — |
| Seed testi | ⏳ DB bekleniyor | — |

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
| PostgreSQL | — | ⚠️ Kurulumu gerekli |

## Proje dosya yapısı (Faz 2 sonu)

```
c:\PROJELER\YAPI2\
├── prisma/
│   ├── schema.prisma          # 24 model, 7 enum, tam ilişkiler
│   └── seed.ts                # İdempotent seed — 12 kategori, roller, tema, site
├── src/
│   ├── app/ ...               # Route iskeleti (Faz 1)
│   ├── components/shared/
│   │   └── current-year.tsx   # useSyncExternalStore ile prerender güvenli
│   └── lib/
│       ├── config.ts          # Env doğrulama
│       └── db.ts              # Prisma singleton client
├── docs/
│   └── DECISIONS.md           # D-001..D-008
├── .env.example
├── package.json               # db:generate, db:migrate, db:seed scriptleri
└── pnpm-workspace.yaml        # Prisma build script onayları
```

## Açık riskler / kararlar

### 🔴 Kritik — Şu an engel
- **PostgreSQL kurulumu:** Migration ve seed testi yapılamıyor. Seçenekler:
  - a) Yerel Windows kurulumu
  - b) `docker run -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:16`
  - c) Uzak sunucu `.env.local`'e DATABASE_URL eklenerek

### 🟡 Orta — Faz 3'te
- **Auth çözümü seçimi:** next-auth v5 (Auth.js) önerilir — Faz 3'te karar verilecek
- **Admin şifre oluşturma CLI komutu:** Faz 3'te yazılacak

### 🟢 Düşük — İleride
- KVKK metinleri, gerçek içerik, domain/marka, hosting

## Son değiştirilen önemli dosyalar

| Dosya | İşlem | Tarih |
|-------|-------|-------|
| prisma/schema.prisma | Oluşturuldu (24 model) | 2026-11-13 |
| prisma/seed.ts | Oluşturuldu (idempotent) | 2026-11-13 |
| src/lib/db.ts | Oluşturuldu | 2026-11-13 |
| src/components/shared/current-year.tsx | useSyncExternalStore ile düzeltildi | 2026-11-13 |
| package.json | db:* scriptleri eklendi | 2026-11-13 |
| pnpm-workspace.yaml | Prisma build onayları | 2026-11-13 |

## Sonraki oturum kuralı

Önce bu dosyayı, `PROJECT_CHECKLIST.md`, `PROJECT_SPECIFICATION.md` ve `docs/DECISIONS.md` dosyalarını oku. Checklist'te tamamlandı görünmeyen hiçbir işi yapılmış varsayma.
