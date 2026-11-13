# DECISIONS.md — Teknik Karar Günlüğü

Bu dosya projede alınan önemli teknik ve ürün kararlarını, gerekçelerini ve değerlendirilen alternatifleri kayıt altına alır.

---

## D-001 — Ortam Tespiti ve Temiz Başlangıç

**Tarih:** 2026-11-13
**Karar:** Proje dizini yalnızca 4 adet dokümantasyon dosyası içermektedir. Mevcut bir Next.js projesi, package.json, node_modules veya git reposu bulunmamaktadır. Proje sıfırdan kurulacaktır.
**Gerekçe:** Mevcut hiçbir kod veya yapılandırma bulunmadığı için sıfırdan kurulum yapılması zorunludur. Silinecek veya korunması gereken mevcut kod yoktur.
**Alternatifler:** Yok — mevcut kod tabanı boş.

---

## D-002 — Teknoloji Stack'i

**Tarih:** 2026-11-13
**Karar:** PROJECT_SPECIFICATION.md'deki önerilen stack onaylanmıştır:
- **Runtime:** Node.js v24.15.0 (mevcut kurulum)
- **Framework:** Next.js App Router (en güncel kararlı sürüm)
- **Dil:** TypeScript strict mode
- **Veritabanı:** PostgreSQL
- **ORM:** Prisma ORM (uyumlu kararlı sürüm)
- **Doğrulama:** Zod
- **CSS:** Tailwind CSS
- **UI Bileşenleri:** shadcn/ui (erişilebilir, headless tabanlı)
- **Paket Yöneticisi:** pnpm (v12.18.0 mevcut)
- **Test:** Vitest + Playwright
- **Auth:** Araştırılacak (Faz 3'te karar verilecek)

**Gerekçe:** Specification'da açıkça belirtilmiştir. pnpm tercih edilmiştir (mevcut ve specification'da önerilmiş). Node.js v24.15.0 güncel LTS sürümüdür.
**Alternatifler:** npm (daha yavaş), yarn (ek kurulum gerekir).

---

## D-003 — Mimari Yaklaşım

**Tarih:** 2026-11-13
**Karar:** Modüler monolith mimarisi uygulanacaktır. Admin ve public site aynı kod tabanında ancak ayrı route gruplarında olacaktır.
**Gerekçe:** Specification açıkça mikroservis yerine modüler monolith istemektedir. İlk sürüm için uygun karmaşıklık seviyesi.
**Alternatifler:** Mikroservis (gereksiz karmaşıklık, reddedildi).

---

## D-004 — PostgreSQL Kurulum Durumu

**Tarih:** 2026-11-13
**Karar:** PostgreSQL bu makinede kurulu değildir. Faz 2'ye geçmeden önce PostgreSQL kurulumu veya Docker ile PostgreSQL container çalıştırılması gerekecektir.
**Gerekçe:** `psql` PATH'te bulunamadı, Windows servisleri arasında PostgreSQL yok.
**Durum:** ⚠️ Kullanıcı kararı bekleniyor — yerel kurulum mu, Docker mu, uzak sunucu mu?

---

## D-005 — Doküman Organizasyonu

**Tarih:** 2026-11-13
**Karar:** Proje dokümanları hem kök dizinde hem de `docs/` klasöründe tutulacaktır. Kök dizindeki dosyalar hızlı erişim için korunacak, `docs/` klasöründeki kopyalar specification'ın önerdiği yapıya uygunluk sağlayacaktır.
**Gerekçe:** Kullanıcı dosyaları kök dizinde oluşturmuştur. Specification `docs/` klasörünü önerir. İki yerde de bulunması erişimi kolaylaştırır. Git kurulumu sonrasında sembolik bağlantı veya tek konum kararı verilebilir.
**Alternatifler:** Yalnızca docs/ (kök dizinden kaldırma — kullanıcı onayı gerekir).

---

## D-006 — Git Reposu

**Tarih:** 2026-11-13
**Karar:** Proje dizininde henüz Git reposu yoktur. Faz 1'de proje iskeleti kurulduktan sonra `git init` yapılacak ve `.gitignore` oluşturulacaktır.
**Gerekçe:** Sürüm kontrolü en erken aşamada başlatılmalıdır.
**Alternatifler:** Yok.
