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

-   [ ] Next.js App Router + TypeScript strict proje kurulumu.
-   [ ] Tailwind ve erişilebilir UI temel bileşenleri.
-   [ ] ESLint/formatter ve script'ler.
-   [ ] `.env.example` oluştur.
-   [ ] Config doğrulama.
-   [ ] Public ve admin route/layout iskeleti.
-   [ ] Error, not-found ve loading durumları.
-   [ ] Lint, typecheck ve production build çalıştır.
-   [ ] Progress dosyasını güncelle.

**Faz 1 kabul:** Temiz kurulum, lint, typecheck ve build başarılı.

## Faz 2 --- Veritabanı ve veri katmanı

-   [ ] PostgreSQL bağlantısı.
-   [ ] Prisma kurulumu ve uyumlu sürüm sabitleme.
-   [ ] Ana veri modelleri.
-   [ ] İlişkiler, unique constraint ve foreign key'ler.
-   [ ] Gerekli indeksler.
-   [ ] Enum/status tasarımları.
-   [ ] İlk migration.
-   [ ] İdempotent seed.
-   [ ] 12 hizmet kategorisinin seed edilmesi.
-   [ ] Varsayılan tema ve site ayarlarının seed edilmesi.
-   [ ] Güvenli ilk admin oluşturma yöntemi.
-   [ ] Boş DB üzerinde migration + seed testi.
-   [ ] Progress güncellemesi.

**Faz 2 kabul:** Veritabanı sıfırdan kurulabiliyor; seed tekrarında
çoğalma yok.

## Faz 3 --- Kimlik doğrulama ve yetkilendirme

-   [ ] Güvenilir auth çözümü seç ve karar günlüğüne yaz.
-   [ ] Admin login/logout.
-   [ ] Güvenli session/cookie ayarları.
-   [ ] Parola hash ve parola politikası.
-   [ ] Rate limiting / brute-force koruması.
-   [ ] Roller ve izinler.
-   [ ] Server-side RBAC helper/middleware.
-   [ ] Yetkisiz erişim testleri.
-   [ ] Audit log temel altyapısı.
-   [ ] Progress güncellemesi.

**Faz 3 kabul:** Yetkisiz kullanıcı admin verisine ve mutation
işlemlerine erişemiyor.

## Faz 4 --- Medya ve ortak CMS altyapısı

-   [ ] Medya depolama adaptörü.
-   [ ] Upload allowlist, MIME ve boyut kontrolleri.
-   [ ] Görsel metadata ve alt text.
-   [ ] Medya kütüphanesi CRUD.
-   [ ] Güvenli medya silme ve kullanım kontrolü.
-   [ ] İçerik durumları ve yayınlama mantığı.
-   [ ] Slug üretimi ve çakışma kontrolü.
-   [ ] Ortak arama, filtreleme, sıralama ve sayfalama.
-   [ ] Progress güncellemesi.

## Faz 5 --- Admin paneli kabuğu ve ayarlar

-   [ ] Admin dashboard.
-   [ ] Sidebar/navigation ve responsive admin layout.
-   [ ] Site adı, logo, favicon ayarları.
-   [ ] İletişim ve sosyal medya ayarları.
-   [ ] Duyuru bandı ayarları.
-   [ ] Tema token yönetimi.
-   [ ] Renk seçici ve HEX doğrulama.
-   [ ] Tema canlı önizleme.
-   [ ] Varsayılana dön.
-   [ ] CSS variables üretimi.
-   [ ] Kontrast uyarısı.
-   [ ] Progress güncellemesi.

**Faz 5 kabul:** Marka ve renk değişiklikleri kod değiştirmeden public
siteye yansıyor.

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
