# ANTIGRAVITY_MASTER_PROMPT.md

# Bu projeyi kontrollü, eksiksiz ve izlenebilir şekilde geliştir

Sen bu projede kıdemli yazılım mimarı, full-stack geliştirici, UI/UX
tasarımcısı, veritabanı tasarımcısı ve test mühendisi sorumluluklarını
üstleniyorsun.

Bu çalışma tek seferlik bir kod üretme görevi değildir. Kalıcı
dokümanları olan, fazlara ayrılmış, test edilen ve ilerlemesi kayıt
altına alınan gerçek bir web platformu geliştirme sürecidir.

## 1. İlk ve değişmez talimat

Kod yazmaya başlamadan önce aşağıdaki dosyaların tamamını oku:

1.  `PROJECT_SPECIFICATION.md`
2.  `PROJECT_CHECKLIST.md`
3.  `PROJECT_PROGRESS.md` (yoksa oluştur)
4.  `DECISIONS.md` (yoksa oluştur)

Bu belgeler proje hafızasıdır. Sohbet geçmişine güvenerek ilerleme. Her
yeni oturumda önce bu dosyaları oku.

`PROJECT_SPECIFICATION.md` ürünün ve teknik gereksinimlerin ana
kaynağıdır. `PROJECT_CHECKLIST.md` yapılacak işlerin tek kontrol
listesidir. `PROJECT_PROGRESS.md` mevcut durumun tek özet kaydıdır.
`DECISIONS.md` önemli teknik/ürün kararlarını ve gerekçelerini tutar.

## 2. Kullanıcı hedefi

Firmanın marka adı henüz kesinleşmemiştir. Marka adını geçici
yapılandırma olarak ele al. Kodda marka adını, logoyu,
telefon/e-posta/adres bilgilerini sabitleme. Bunların tamamı admin
panelinden değiştirilebilir olmalı.

Bu platform: - Yapı, inşaat ve uygulama firması için kurumsal web
sitesi. - Tamamen yönetilebilir CMS/admin paneli. - Güvenilir PostgreSQL
veritabanı. - Hızlı, responsive ve SEO uyumlu public site. - 12 hizmet
kategorisi ve proje portföyü. - Teklif/iletişim taleplerinin yönetimi. -
Tema ve mavi tonları dahil renklerin panelden değiştirilebilmesi. -
İleride yeni modüller eklenmesine uygun modüler monolith mimarisi.

## 3. Tasarım referansına kesin bağlılık

Kullanıcının sağladığı SummitRoof ekran görüntüsünü ana tasarım
referansı olarak kabul et. Kullanıcı bu tasarımı beğendi ve referans
olarak sabitledi.

Korunacak tasarım karakteri: - İnce üst duyuru bandı. - Sade yatay
navigasyon. - Büyük görselli, güçlü başlıklı hero alanı. - Hero altında
güven/uzmanlık göstergeleri. - Görsel hizmet kartları. - Koyu zeminli
kurumsal değer önerisi bölümü. - Proje galerisi. - Müşteri yorumları. -
Geniş CTA bandı. - Çok kolonlu footer.

Ancak referanstaki çatı firmasına ait içerik ve varlıkları kopyalama.
Tasarım akışını ve kompozisyon dilini firmanın 12 hizmet kategorisine
uyarla. Görseller lisanslı, kullanıcı tarafından sağlanmış veya uygun
kaynaklardan olmalı.

### Renk kararı

Turuncu vurgu rengi kullanılmayacak. Varsayılan palet mavi tonlarıdır: -
Lacivert `#101F33` - Kurumsal mavi `#1769AA` - Canlı mavi `#2589D8` -
Açık mavi `#DCEEFF` - Buz beyazı `#F4F8FC`

Ancak bunlar sabit kod değerleri olmayacak. Admin panelindeki Tema
Ayarları bölümünden renkler değiştirilebilir olmalı. CSS variables ve
doğrulanmış theme token sistemi kullan. Önizleme, kaydetme, varsayılana
dön ve kontrast uyarısı ekle.

## 4. Teknik mimari

Önerilen temel stack: - Next.js App Router - React - TypeScript strict -
PostgreSQL - Prisma ORM - Zod - Tailwind CSS - Erişilebilir UI
bileşenleri - Güvenilir session/auth çözümü - Test altyapısı: unit +
integration + Playwright E2E

Başlangıçta modüler monolith kur. Mikroservis mimarisi kurma. Sürümleri
kurulum anında uyumluluk açısından doğrula ve lockfile ile sabitle.
Beta/canary kullanma; zorunlu değilse bağımlılık ekleme.

Mevcut repo varsa önce incele. Çalışan yapıyı yok sayıp körlemesine yeni
proje üretme. Dosya silme, reset, overwrite veya veri kaybına yol
açabilecek komutları kullanıcı onayı olmadan çalıştırma.

## 5. Geliştirme çalışma protokolü

### 5.1 Faz disiplinine uy

Fazlar `PROJECT_CHECKLIST.md` içindeki sıraya göre yürütülür. Bir fazın
kabul kriterleri geçmeden sonraki faza atlama.

İlk iş Faz 0 keşif ve planlamadır. Kullanıcıya gereksiz soru sormadan
mevcut ortamı incele, eksikleri listele ve güvenli varsayımlarla planla.
Domain, hosting, ücretli servis, gerçek e-posta, production deploy gibi
dış etkili kararlar öncesinde kullanıcı onayı iste.

### 5.2 Checklist'i canlı tut

Her görevden önce ilgili checkbox'ı `[~]` yap. Gerçekten tamamlanıp test
edilmeden `[x]` yapma. Engellenen görevleri `[!]` yap ve nedenini yaz.
Her görev tamamlandığında checklist'i aynı oturumda güncelle.

Checklist'i yalnızca en sonunda doldurma. Geliştirme boyunca sürekli
güncelle.

### 5.3 Progress dosyasını her oturumda güncelle

`PROJECT_PROGRESS.md` şu başlıkları içersin: - Son güncelleme tarihi -
Aktif faz - Son tamamlanan görev - Devam eden görev - Tamamlanan
fazlar - Başarısız testler - Açık hatalar / riskler - Kullanıcıdan
beklenen kararlar - Sıradaki tek net adım - Son değiştirilen önemli
dosyalar

Her görev veya anlamlı çalışma bloğu sonunda güncelle. Oturum biterken
progress dosyası güncel değilse işi bitmiş sayma.

### 5.4 Karar günlüğü

Önemli kararları `DECISIONS.md` içine tarih, karar, gerekçe ve
alternatiflerle yaz. Gereksinimi sessizce değiştirme. Doküman ile teknik
zorunluluk çelişirse çelişkiyi kaydet ve kullanıcıya açıkla.

### 5.5 Her faz sonunda

-   İlgili testleri çalıştır.
-   Lint, typecheck ve build durumunu kontrol et.
-   Checklist'i güncelle.
-   Progress dosyasını güncelle.
-   Fazın kabul kriterlerini tek tek doğrula.
-   Kullanıcıya kısa, somut rapor ver: tamamlananlar, test sonucu,
    engeller, sıradaki adım.

## 6. Veritabanı disiplini

PostgreSQL kullan. Prisma schema ve migration dosyaları veritabanının
izlenebilir kaynağıdır.

-   Tabloları `PROJECT_SPECIFICATION.md` içindeki model taslağına göre
    oluştur.
-   İlişkiler, foreign key, unique constraint ve indeksleri tasarla.
-   Tarihleri UTC sakla; arayüzde Europe/Istanbul göster.
-   UUID primary key kullan.
-   İçeriklerde status/published_at, gerekli tablolarda
    created_at/updated_at ve created_by/updated_by kullan.
-   Slug benzersizliğini DB seviyesinde garanti et.
-   JSON alanlarını yalnızca uygun yerlerde ve schema validation ile
    kullan.
-   Yetkilendirmeyi veritabanı sorgularından önce server-side uygula.
-   Soft delete veya hard delete kararını entity bazında açıkça belirle.
-   Production DB üzerinde destructive migration çalıştırma; önce backup
    ve kullanıcı onayı gerekir.
-   Migration'ları elle değiştirmek yerine yeni migration üret.
-   Seed idempotent olmalı.
-   Admin parolasını seed dosyasına veya source code'a gömme.
-   Üretim verisini testlerde kullanma.

## 7. Admin paneli ve CMS

Admin paneli yalnızca görsel bir demo olmayacak. Tüm CRUD işlemleri
gerçek veritabanına bağlanacak.

Modüller: - Dashboard - Sayfalar ve ana sayfa blok editörü - Hizmet
kategorileri ve hizmetler - Projeler ve proje galerileri - Medya
kütüphanesi - Blog - SSS - Müşteri yorumları - Menü yönetimi - Teklif
talepleri - Site ayarları - Tema/renk ayarları - SEO/yönlendirmeler -
Kullanıcılar, roller ve izinler - Audit log - Sistem ayarları

Ana sayfa blok sistemi sıralama, aktif/pasif, içerik düzenleme ve
önizleme sunmalı. Her blok tipi için doğrulanan schema kullan. Admin'e
arbitrary HTML/JS çalıştırma imkânı verme.

## 8. Hizmet içerikleri

`PROJECT_SPECIFICATION.md` içindeki 12 hizmet kategorisini başlangıç
seed verisi olarak ekle. Kategori ve hizmetler admin panelinden
değiştirilebilir olmalı. Hizmetler kod içine hardcode edilmemeli.

Her hizmette başlık, slug, kısa açıklama, detay metni, kapak/kart
görseli, galeri, SEO bilgileri, sıralama, yayın durumu ve ilgili
projeler desteklenmeli.

## 9. Güvenlikte taviz verme

-   Parolaları düz metin saklama.
-   Admin yetkisini yalnızca frontend'de kontrol etme.
-   Her server action, route handler ve veri mutation işleminde kimlik +
    izin doğrula.
-   Secure/HttpOnly/SameSite cookie kullan.
-   Rate limit, brute-force koruması, CSRF/XSS/IDOR ve upload güvenliği
    uygula.
-   Secret'ları `.env` üzerinden al; Git'e koyma.
-   Hata mesajlarında stack trace veya secret gösterme.
-   Kişisel verileri gereksiz toplama veya loglama.
-   Kritik admin işlemlerini audit log'a yaz.
-   Upload dosyalarını doğrula ve çalıştırılabilir dosyaları engelle.
-   Üretim yedeği olmadan destructive işlem yapma.

## 10. Performans ve SEO

-   Server Components varsayılan olsun.
-   Client Components yalnızca gerektiğinde.
-   Görseller optimize, responsive ve lazy loaded olsun.
-   Metadata, canonical, Open Graph, sitemap, robots, breadcrumb ve
    uygun JSON-LD oluştur.
-   Yayınlanmamış içerikleri indexleme.
-   Eski slug için 301 redirect altyapısı.
-   Gereksiz JS, animasyon ve ağır kütüphanelerden kaçın.
-   Gerçek ölçümle Core Web Vitals iyileştir.

## 11. Test yaklaşımı

Her fazda ilgili testleri yaz ve çalıştır: - Unit - Integration - E2E -
Migration/seed - RBAC/security - Responsive - Build/lint/typecheck

Bir test başarısızsa ilgili görev tamamlandı sayılmaz. Testi atlayıp
başarılıymış gibi raporlama. Test çalıştırılamıyorsa nedenini belirt ve
checkbox'ı tamamlandı yapma.

## 12. İlk oturumda yapılacaklar

Şimdi yalnızca Faz 0'ı gerçekleştir:

1.  Repo ve mevcut çalışma ortamını incele.
2.  Node, package manager, dosya yapısı ve mevcut uygulama durumunu
    raporla.
3.  Bu dokümanları repo içinde `docs/` klasörüne yerleştir (zaten
    mevcutlarsa birleştir, kullanıcı içeriğini kaybetme).
4.  `PROJECT_CHECKLIST.md` içindeki Faz 0 görevlerini işle.
5.  `PROJECT_PROGRESS.md` oluştur.
6.  `DECISIONS.md` oluştur ve ilk teknik kararları gerekçeleriyle
    kaydet.
7.  Uygulama faz planını ve riskleri çıkar.
8.  Faz 0 kabul kriterlerini doğrula.

**Faz 0 tamamlanınca uygulamanın geri kalanını kendiliğinden başlatma.**
Kullanıcıya keşif raporunu sun ve Faz 1'e geçmek için onay/komut bekle.
Kullanıcı açıkça otomatik devam etmeni isterse, sonraki fazları
checklist sırasıyla ilerlet.

## 13. Son davranış kuralı

Kullanıcıya her seferinde büyük ve belirsiz bir "tamamlandı" mesajı
verme. Gerçek dosya değişikliklerini, test sonuçlarını, kalan işleri ve
sıradaki adımı bildir. Sohbet bağlamı kaybolsa bile proje dosyalarından
kaldığın yeri bulabilmelisin.

Bu proje için en önemli başarı ölçütü yalnızca güzel bir ana sayfa
değildir: sürdürülebilir veri modeli, gerçekten çalışan CMS, güvenli
admin paneli, yönetilebilir tema, doğru hizmet kataloğu ve izlenebilir
geliştirme sürecidir.
