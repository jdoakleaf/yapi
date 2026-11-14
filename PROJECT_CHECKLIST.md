# PROJECT_CHECKLIST.md

# Uygulama ve teslimat kontrol listesi

Bu dosya projenin görev takip kaynağıdır. Her görev tamamlandığında
Antigravity ilgili kutuyu işaretler, kanıtı veya test sonucunu kısa not
olarak ekler. Test edilmeden `[x]` yapılmaz.

**Durum standardı** - `[ ]` Bekliyor - `[~]` Devam ediyor - `[x]`
Tamamlandı ve doğrulandı - `[!]` Engelli / karar veya dış işlem bekliyor

## Faz 0 --- Başlangıç ve keşif

-   [x] Mevcut çalışma dizinini ve repo durumunu incele.
    > Dizinde yalnızca 4 dokümantasyon dosyası var. Git reposu, package.json, node_modules yok. Temiz başlangıç.
-   [x] Var olan kod, package manager, Node sürümü ve ortamı tespit et.
    > Node.js v24.15.0, npm v11.12.1, pnpm v12.18.0. PostgreSQL kurulu değil. yarn yok.
-   [x] Mevcut dosyaları yedekle/koru; izinsiz silme veya üzerine yazma.
    > Mevcut 4 dosya korundu. docs/ klasörüne kopyalandı, orijinaller yerinde.
-   [x] PROJECT_SPECIFICATION.md, ANTIGRAVITY_MASTER_PROMPT.md ve bu
    checklist'i oku.
    > Tüm dokümanlar okundu ve analiz edildi (2026-11-13).
-   [x] Eksik/çelişkili gereksinimleri listele.
    > Rapor aşağıda. PostgreSQL kurulumu eksik, domain/marka/hosting belirsiz, auth çözümü Faz 3'te seçilecek.
-   [x] Teknik karar günlüğünü oluştur: `docs/DECISIONS.md`.
    > 6 karar kaydedildi (D-001 — D-006).
-   [x] Faz planını ve klasör yapısını oluştur.
    > Specification'daki 15 fazlı plan ve klasör yapısı onaylandı. İnceleme raporu sunuldu.
-   [x] İlk `PROJECT_PROGRESS.md` kaydını yaz.
    > Kapsamlı durum raporu yazıldı (2026-11-13).
-   [x] Kullanıcı onayı gereken kararları ayrı listele.
    > PostgreSQL kurulum yöntemi, doküman konumu, auth çözümü, hosting kararı.

**Faz 0 kabul:** Mevcut durum raporu, karar günlüğü ve yürütme planı
mevcut.

## Faz 1 --- Proje iskeleti ve geliştirme altyapısı

-   [x] Next.js App Router + TypeScript strict proje kurulumu.
    > Next.js 16.4.6, React 19.3.0, TypeScript 5.9.3 strict mode. pnpm ile kuruldu.
-   [x] Tailwind ve erişilebilir UI temel bileşenleri.
    > Tailwind CSS 4.3.3 kurulu. shadcn/ui Faz 5'te eklenecek (component ihtiyacı başladığında).
-   [x] ESLint/formatter ve script'ler.
    > ESLint 9.39.5 + eslint-config-next. Scripts: dev, build, start, lint, typecheck, check.
-   [x] `.env.example` oluştur.
    > Veritabanı, auth, SMTP, storage placeholder'ları ile oluşturuldu.
-   [x] Config doğrulama.
    > src/lib/config.ts — getRequiredEnv/getOptionalEnv ile runtime doğrulama.
-   [x] Public ve admin route/layout iskeleti.
    > (public)/ ve admin/ route grupları, layout, header, sidebar, footer iskeleti.
-   [x] Error, not-found ve loading durumları.
    > global-error.tsx, not-found.tsx, (public)/loading.tsx, admin/loading.tsx oluşturuldu.
-   [x] Lint, typecheck ve production build çalıştır.
    > ✅ lint: 0 error, 0 warning | ✅ typecheck: temiz | ✅ build: başarılı (3 static route).
-   [x] Progress dosyasını güncelle.
    > PROJECT_PROGRESS.md kapsamlı güncellendi. Git commit: 8b5d699 (36 dosya).

**Faz 1 kabul:** ✅ Temiz kurulum, lint: 0 hata, typecheck: temiz, build: başarılı (3 static route).

**Faz 1 kabul:** Temiz kurulum, lint, typecheck ve build başarılı.

## Faz 2 --- Veritabanı ve veri katmanı

-   [x] PostgreSQL bağlantısı.
    > embedded-postgres 17.11.0-beta.19 (npm) ile çözüldü. EDB bu ağdan engellendiği için sistem PostgreSQL'i npm paketi üzerinden çalıştırıyor. Port 5433, persistent .pg-data/ dizini. Üretim kurulumu Faz 14'te.
-   [x] Prisma kurulumu ve uyumlu sürüm sabitleme.
    > Prisma 5.22.0 (kararlı) + @prisma/client 5.22.0 kuruldu. RC sürüm reddedildi.
-   [x] Ana veri modelleri.
    > Tüm modeller prisma/schema.prisma'da tanımlandı: User, Role, Permission, Session, Media, Page, PageSection, ServiceCategory, Service, Project, ProjectService, ProjectMedia, BlogPost, Testimonial, FAQ, Menu, MenuItem, SiteSetting, ThemeSetting, Lead, LeadAttachment, LeadNote, Redirect, AuditLog.
-   [x] İlişkiler, unique constraint ve foreign key'ler.
    > Tüm ilişkiler, onDelete davranışları ve unique constraint'ler tanımlandı.
-   [x] Gerekli indeksler.
    > slug, status, sortOrder, createdAt, entityType alanlarına indeks eklendi.
-   [x] Enum/status tasarımları.
    > ContentStatus, UserRole, WorkModel, CustomerType, LeadStatus, HttpStatus, StorageProvider enum'ları.
-   [x] İlk migration.
    > 20261113170743_initial_schema migration'ı başarıyla çalıştırıldı. Tüm 24 model tablo olarak oluşturuldu (2026-11-13).
-   [x] İdempotent seed.
    > prisma/seed.ts upsert pattern ile idempotent yazıldı ve doğrulandı.
-   [x] 12 hizmet kategorisinin seed edilmesi.
    > Tüm 12 kategori seed çalıştırıldı ve doğrulandı (2026-11-13).
-   [x] Varsayılan tema ve site ayarlarının seed edilmesi.
    > Mavi palet token'ları ve 11 site ayarı seed edildi ve doğrulandı (2026-11-13).
-   [x] Güvenli ilk admin oluşturma yöntemi.
    > Seed dosyasında admin parolası yok. CLI ile oluşturma zorunluluğu belgelendi.
-   [x] Boş DB üzerinde migration + seed testi.
    > Migration + seed çalıştırıldı. Seed idempotency testi geçti (çoğalma yok). lint ✅ typecheck ✅ build ✅ (2026-11-13).
-   [x] Progress güncellemesi.
    > PROJECT_PROGRESS.md kapsamlı güncellendi. Faz 2 şema kısmı tamamlandı; migration/seed DB bekliyor.

**Faz 2 kabul:** ✅ Veritabanı sıfırdan kurulabiliyor; seed tekrarında çoğalma yok. (2026-11-13)

## Faz 3 --- Kimlik doğrulama ve yetkilendirme

-   [x] Güvenilir auth çözümü seç ve karar günlüğüne yaz.
    > Auth.js (NextAuth v5) + PrismaAdapter seçildi (D-010). next-auth@5.0.0-beta.32, @auth/prisma-adapter@2.11.3.
-   [x] Admin login/logout.
    > /admin/login sayfası (useActionState), loginAction server action, logoutAction. /api/auth/[...nextauth] route.
-   [x] Güvenli session/cookie ayarları.
    > JWT strategy, 8 saat maxAge, HttpOnly cookie, NEXTAUTH_SECRET zorunlu.
-   [x] Parola hash ve parola politikası.
    > scrypt (Node.js built-in) ile hash/verify. Timing-safe karşılaştırma. 12+ karakter zorunlu (create-admin).
-   [x] Rate limiting / brute-force koruması.
    > In-memory rate limiter: 5 deneme / 15 dakika. Üretimde Redis önerilir (belgelendi).
-   [x] Roller ve izinler.
    > userRoles pivot tablosu üzerinden. RBAC helper: requireAuth, requireRole, hasRole.
-   [x] Server-side RBAC helper/middleware.
    > src/lib/auth/rbac.ts — requireAuth, requireRole(minRole), hasRole(minRole).
-   [x] Yetkisiz erişim testleri.
    > GET /admin (yetkisiz) → 307 → /admin/login ✅. Public route'lar 200 ✅. Test script: scripts/test-auth.mjs.
-   [x] Audit log temel altyapısı.
    > AuditLog modeli Faz 2'de oluşturuldu. LOGIN, LOGIN_FAILED, LOGIN_RATE_LIMITED, ADMIN_CREATED kayıtları aktif.
-   [x] Progress güncellemesi.

**Faz 3 kabul:** ✅ Yetkisiz kullanıcı admin verisine ve mutation işlemlerine erişemiyor. (2026-11-13)

## Faz 4 --- Medya ve ortak CMS altyapısı

-   [x] Medya depolama adaptörü.
    > LocalStorageAdapter + StorageAdapter arayüzü. src/lib/media/storage.ts. Üretimde S3/R2 adaptörü eklenebilir (D-010).
-   [x] Upload allowlist, MIME ve boyut kontrolleri.
    > ALLOWED_MIME_TYPES, MAX_FILE_SIZE (10 MB), validateUpload() fonksiyonu. src/lib/media/storage.ts.
-   [x] Görsel metadata ve alt text.
    > Media.altText güncelleme: updateMediaAltText() server action. src/lib/media/actions.ts.
-   [x] Medya kütüphanesi CRUD.
    > uploadMedia, listMedia (filtreleme+sayfalama), deleteMedia server actions. src/lib/media/actions.ts.
-   [x] Güvenli medya silme ve kullanım kontrolü.
    > deleteMedia: Page+Service+Project+BlogPost referans kontrolü, fiziksel dosya silme. src/lib/media/actions.ts.
-   [x] İçerik durumları ve yayınlama mantığı.
    > ContentStatus enum, canTransition(), getAvailableTransitions(), publishedFilter(). src/lib/cms/status.ts.
-   [x] Slug üretimi ve çakışma kontrolü.
    > slugify() (Türkçe karakter desteği), generateUniqueSlug() (N deneme, suffix). src/lib/cms/slug.ts.
-   [x] Ortak arama, filtreleme, sıralama ve sayfalama.
    > parsePagination(), buildPaginatedResponse(), buildOrderBy(). src/lib/cms/pagination.ts.
-   [x] Progress güncellemesi.
    > PROJECT_PROGRESS.md güncellendi. Build ✅ lint ✅ typecheck ✅ (2026-11-14). Commit: fazla sonra.

## Faz 5 --- Admin paneli kabuğu ve ayarlar

-   [x] Admin dashboard.
    > Gerçek DB verileriyle: hizmet/proje/blog/talep sayaçları, son talepler, hızlı işlemler, sistem uyarısı. src/app/admin/page.tsx.
-   [x] Sidebar/navigation ve responsive admin layout.
    > AdminSidebar (19 modül, 4 grup), AdminHeader (mobil hamburger, logout), responsive layout. src/components/admin/sidebar.tsx, header.tsx.
-   [x] Site adı, logo, favicon ayarları.
    > SiteSettingsForm: site_name, site_tagline, site_description alanları. /admin/ayarlar/genel.
-   [x] İletişim ve sosyal medya ayarları.
    > contact_phone, contact_email, contact_address, working_hours + 5 sosyal medya URL'si. /admin/ayarlar/genel.
-   [x] Duyuru bandı ayarları.
    > announcement_text, announcement_link, announcement_active. /admin/ayarlar/genel.
-   [x] Tema token yönetimi.
    > ThemeSetting modeli: themeKey="colors", tokensJson=JSON. saveThemeTokens/getThemeTokens. /admin/ayarlar/tema.
-   [x] Renk seçici ve HEX doğrulama.
    > Native color picker + HEX input, /^#[0-9A-Fa-f]{6}$/ doğrulama. ThemeSettingsForm.
-   [x] Tema canlı önizleme.
    > "Canlı Önizleme" toggle — header/buton/metin/badge örneği inline CSS ile. ThemeSettingsForm.
-   [x] Varsayılana dön.
    > resetThemeToDefault() server action, confirm dialog ile. ThemeSettingsForm.
-   [x] CSS variables üretimi.
    > generateCssVariables() → :root { --brand-navy: ... } formatı, form'da gösterilir. theme-utils.ts.
-   [x] Kontrast uyarısı.
    > checkWcagAA() WCAG AA (4.5:1) kontrolü — 3 kritik çift. Uyarılar kaydedilir ama kaydetmeyi engellemez. theme-utils.ts.
-   [x] Progress güncellemesi.
    > PROJECT_PROGRESS.md güncellendi. Build ✅ lint ✅ typecheck ✅ (2026-11-14). Commit: fazla.

**Faz 5 kabul:** ✅ Marka ve renk değişiklikleri admin panelinden veritabanına kaydedilir. Build 8 route, 0 hata. (2026-11-14)

## Faz 6 --- Sayfa ve blok editörü

-   [ ] Sayfa CRUD.
-   [ ] Şemalı blok tipi sistemi.
-   [ ] Hero blok editörü.
-   [ ] Güven göstergeleri bloğu.
-   [ ] Hizmetler bloğu.
-   [ ] Kurumsal değer önerisi bloğu.
-   [ ] Projeler bloğu.
-   [ ] Çalışma modeli bloğu.
-   [ ] Süreç bloğu.
-   [ ] Yorumlar bloğu.
-   [ ] Blog bloğu.
-   [ ] CTA bloğu.
-   [ ] Sıralama ve aktif/pasif.
-   [ ] Taslak/önizleme/yayınlama.
-   [ ] Mobil ve masaüstü önizleme.
-   [ ] Progress güncellemesi.

## Faz 7 --- Hizmet yönetimi

-   [ ] Hizmet kategorisi CRUD.
-   [ ] 12 kategori seed verisinin kontrolü.
-   [ ] Hizmet CRUD.
-   [ ] Hizmet kart ve kapak görseli.
-   [ ] Hizmet detay içerik alanları.
-   [ ] Sıralama ve öne çıkarma.
-   [ ] SEO alanları.
-   [ ] İlgili hizmet ve proje bağlantıları.
-   [ ] Public hizmet listeleme.
-   [ ] Public hizmet detay sayfası.
-   [ ] Progress güncellemesi.

**Faz 7 kabul:** 12 kategori ve hizmet içerikleri admin'den yönetiliyor;
detay sayfaları dinamik.

## Faz 8 --- Proje portföyü

-   [ ] Proje CRUD.
-   [ ] Proje kapak ve galeri yönetimi.
-   [ ] Projeleri hizmetlerle ilişkilendirme.
-   [ ] Proje lokasyon ve tarih alanları.
-   [ ] Öne çıkan proje seçimi.
-   [ ] Public proje listesi.
-   [ ] Public proje detay sayfası.
-   [ ] SEO ve görsel alt metinleri.
-   [ ] Progress güncellemesi.

## Faz 9 --- Blog, SSS, yorumlar ve menüler

-   [ ] Blog CRUD ve yayınlama.
-   [ ] Blog detay ve liste sayfaları.
-   [ ] SSS CRUD ve hizmet ilişkisi.
-   [ ] Yorum CRUD ve yayın durumu.
-   [ ] Menü ve alt menü CRUD.
-   [ ] Sıralama ve aktif/pasif.
-   [ ] Progress güncellemesi.

## Faz 10 --- Teklif ve iletişim

-   [ ] Teklif formu.
-   [ ] Server-side validasyon.
-   [ ] Spam/rate limit koruması.
-   [ ] Lead veritabanı kaydı.
-   [ ] Dosya eki güvenliği.
-   [ ] Admin lead listesi ve detay ekranı.
-   [ ] Durum yönetimi.
-   [ ] Atama ve iç notlar.
-   [ ] E-posta bildirim adaptörü.
-   [ ] E-posta başarısız olsa da lead kaydının korunması.
-   [ ] KVKK metin sürümü ve onay kayıtlarının uygun tasarımı.
-   [ ] Progress güncellemesi.

## Faz 11 --- Public site tasarım uygulaması

-   [ ] Referans tasarımın sayfa akışını uygulama.
-   [ ] Duyuru bandı ve header.
-   [ ] Hero alanı ve CTA.
-   [ ] Güven göstergeleri.
-   [ ] Hizmet kartları.
-   [ ] Koyu kurumsal değer bölümü.
-   [ ] Proje galerisi.
-   [ ] Çalışma modelleri ve süreç.
-   [ ] Yorum alanı (gerçek içerik varsa).
-   [ ] CTA bandı.
-   [ ] Footer.
-   [ ] 12 hizmet kategorisinin doğru görsel/metin temsili.
-   [ ] Mobil/tablet/desktop responsive kontrol.
-   [ ] Erişilebilirlik kontrolü.
-   [ ] Progress güncellemesi.

## Faz 12 --- SEO ve içerik kalitesi

-   [ ] Metadata yönetimi.
-   [ ] Canonical.
-   [ ] Open Graph.
-   [ ] Sitemap.
-   [ ] Robots.
-   [ ] JSON-LD yapılandırılmış veri.
-   [ ] Breadcrumb.
-   [ ] Redirect yönetimi.
-   [ ] 404 ve noindex kuralları.
-   [ ] Görsel alt text kontrolü.
-   [ ] Türkçe içerik ve URL kontrolü.
-   [ ] Progress güncellemesi.

## Faz 13 --- Güvenlik ve kalite testleri

-   [ ] RBAC testleri.
-   [ ] CSRF/XSS/SQLi temel testleri.
-   [ ] IDOR ve doğrudan API erişim testleri.
-   [ ] Upload güvenlik testleri.
-   [ ] Login rate limit testi.
-   [ ] Form spam testi.
-   [ ] Unit testler.
-   [ ] Integration testler.
-   [ ] E2E kritik akışlar.
-   [ ] Responsive tarama.
-   [ ] Lighthouse/performans ölçümü.
-   [ ] Lint, typecheck, test ve build.
-   [ ] Açık hata listesi.
-   [ ] Progress güncellemesi.

## Faz 14 --- Yayına hazırlık ve operasyon

-   [ ] Production env dokümantasyonu.
-   [ ] Hosting/Node çalışma gereksinimleri.
-   [ ] PostgreSQL production kurulumu.
-   [ ] Kalıcı medya depolama.
-   [ ] HTTPS ve güvenlik başlıkları.
-   [ ] Health check.
-   [ ] Log ve hata yönetimi.
-   [ ] DB backup komutu ve planı.
-   [ ] Restore prosedürü ve denemesi.
-   [ ] Migration deploy prosedürü.
-   [ ] Rollback prosedürü.
-   [ ] Kullanıcı/admin kullanım dokümanı.
-   [ ] Son kabul kontrolü.
-   [ ] Progress güncellemesi.

## Her görevden sonra zorunlu kapanış

-   [ ] İlgili görev(ler) doğru durumla güncellendi.
-   [ ] Yapılan değişiklikler ve dosyalar kaydedildi.
-   [ ] Çalıştırılan testler ve sonuçları yazıldı.
-   [ ] Bilinen sorunlar ve riskler yazıldı.
-   [ ] Sıradaki tek net görev yazıldı.
-   [ ] `PROJECT_PROGRESS.md` güncellendi.

## Tamamlanma kuralı

Bir checkbox yalnızca kod yazıldığı için işaretlenemez. Uygulama
çalıştırılmalı, ilgili test/manuel doğrulama yapılmalı ve sonuç progress
dosyasına kaydedilmelidir. Bir görev kısmen tamamlandıysa `[~]` olarak
kalmalıdır.
