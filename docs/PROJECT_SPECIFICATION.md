# PROJECT_SPECIFICATION.md

# Kurumsal Yapı, İnşaat ve Uygulama Web Platformu

**Belge türü:** Ana ürün ve teknik gereksinim dokümanı\
**Proje durumu:** Başlangıç / keşif ve planlama\
**Dil:** Türkçe (ilk sürüm)\
**Marka adı:** Geçici --- marka adı daha sonra admin panelinden
değiştirilebilir\
**Tasarım referansı:** Kullanıcının sağladığı SummitRoof web sitesi
ekran görüntüsü\
**Temel yaklaşım:** Referans tasarımın sayfa akışı ve görsel dili
korunacak; turuncu vurgular yerine yönetilebilir mavi renk sistemi
kullanılacak. Tasarım birebir kopyalanmayacak, firmanın 12 hizmet
kategorisine uyarlanacak.

------------------------------------------------------------------------

## 1. Projenin amacı

İzmir merkezli başlayıp Ege Bölgesi ve gerektiğinde Türkiye genelinde
hizmet verebilecek yapı, inşaat ve uygulama firması için hızlı, güvenli,
SEO uyumlu, mobil öncelikli ve tamamen yönetilebilir bir kurumsal web
platformu geliştirilecektir.

Bu proje yalnızca statik tanıtım sitesi değildir. İçerik, hizmet, proje,
medya, teklif talepleri, navigasyon, SEO, kullanıcılar, roller ve görsel
tema ayarlarının kod değişikliği gerektirmeden yönetilebildiği özel bir
CMS/admin paneli içerecektir.

### Başarı ölçütleri

-   Ziyaretçi tarafındaki tüm temel içerikler admin panelinden
    yönetilebilmeli.
-   12 hizmet kategorisi ve her kategoriye ait detay sayfaları
    desteklenmeli.
-   Ana sayfa bölümleri etkinleştirilebilir, devre dışı bırakılabilir,
    sıralanabilir ve içerikleri düzenlenebilir olmalı.
-   Marka adı, logo, favicon, renk paleti ve temel tema ayarları
    panelden değiştirilebilmeli.
-   Projeler ve görseller kolayca eklenip düzenlenebilmeli.
-   Teklif/iletişim talepleri kaybolmadan veritabanında tutulmalı ve
    yönetilebilmeli.
-   Güvenli kimlik doğrulama, rol bazlı yetki, denetim kaydı, yedekleme
    ve hata yönetimi bulunmalı.
-   Sayfalar mobil, tablet ve masaüstünde tutarlı çalışmalı.
-   SEO için her içerikte düzenlenebilir metadata, temiz URL, sitemap ve
    robots yönetimi bulunmalı.
-   Geliştirme süreci kalıcı checklist ve ilerleme günlüğüyle izlenmeli.

## 2. İş modeli ve kurumsal konumlandırma

Firma müşteriye tek marka, tek iletişim noktası ve tek proje
koordinasyonu sunar. Bazı uzmanlık alanları firma bünyesinde, bazıları
çözüm ortaklarıyla yürütülebilir. Bu operasyonel ayrım müşteri
tarafındaki hizmet kataloğunda gereksiz yere vurgulanmayacaktır.

### Sunulacak iş modelleri

1.  **İşçilik hizmeti:** Malzeme müşteri tarafından sağlanır, firma
    uygulama/işçilik hizmeti verir.
2.  **Malzeme + işçilik:** Malzeme tedariki ve uygulama birlikte
    sunulur.
3.  **Anahtar teslim uygulama:** Proje kapsamına göre keşif, planlama,
    malzeme tedariki, uygulama, kontrol ve teslim süreçleri koordine
    edilir.

### Müşteri grupları

-   Bireysel müşteriler: ev, arsa, villa, yazlık ve mülk sahipleri.
-   Kurumsal müşteriler: müteahhitler, inşaat firmaları, işletmeler,
    proje sahipleri ve ticari/endüstriyel tesisler.

### Önerilen müşteri yolculuğu

**Keşif → Teklif → Planlama → Uygulama → Kontrol → Teslim**

## 3. Tasarım ve kullanıcı deneyimi

### 3.1 Tasarım referansı

Kullanıcının yüklediği SummitRoof web sitesi ekran görüntüsü ana tasarım
referansıdır. Aşağıdaki özellikler referans alınacaktır:

-   En üstte ince duyuru/teklif bandı.
-   Sade, yatay navigasyon; logo, menü, telefon ve belirgin teklif
    CTA'sı.
-   Büyük fotoğraflı hero alanı; güçlü başlık, kısa açıklama ve iki CTA.
-   Hero altında güven/uzmanlık göstergeleri.
-   Görsel kartlardan oluşan hizmetler alanı.
-   Koyu zeminli kurumsal değer önerisi bölümü.
-   Proje kartları ve proje portföyü.
-   Müşteri yorumları alanı.
-   Geniş CTA bandı.
-   Çok kolonlu, düzenli footer.

Referansın sektör içeriği çatı hizmetlerine odaklıdır. Yeni sitede bu
içeriklerin yerine firmanın gerçek hizmetleri kullanılacaktır. Görseller
telif açısından uygun, lisanslı veya firmaya ait olmalıdır. Referans
görseli yalnızca tasarım yönü için kullanılmalı; logo, metin, fotoğraf
veya özgün tasarım varlıkları kopyalanmamalıdır.

### 3.2 Görsel dil

-   Modern, güven veren, profesyonel ve premium.
-   Güçlü tipografi; kısa, net başlıklar.
-   Geniş ve kaliteli gerçek uygulama fotoğrafları.
-   Beyaz/açık zeminler ile koyu lacivert kurumsal bölümlerin dengesi.
-   Hizmet ve proje kartlarında tutarlı oranlar, net başlıklar ve sade
    etkileşimler.
-   Aşırı animasyon, gereksiz parallax, ağır video arka planı ve dikkat
    dağıtan efektlerden kaçınılmalı.
-   Mobilde okunabilirlik ve CTA erişilebilirliği öncelikli olmalı.
-   Tasarım yalnızca masaüstü ekran görüntüsüne göre yapılmamalı; mobil
    ve tablet ayrıca tasarlanmalı.

### 3.3 Yönetilebilir renk sistemi

Turuncu kullanılmayacaktır. İlk kurulumda aşağıdaki mavi tabanlı palet
varsayılan olabilir; ancak renkler kod içine sabitlenmeyecek, admin
panelindeki **Görünüm / Tema Ayarları** bölümünden düzenlenebilir
olacaktır.

  Token             Varsayılan   Kullanım
  ----------------- ------------ -------------------------------------
  `brand_navy`      `#101F33`    Koyu alanlar, başlıklar, footer
  `brand_primary`   `#1769AA`    Ana marka mavisi, birincil butonlar
  `brand_accent`    `#2589D8`    Hover, bağlantı ve vurgu
  `brand_soft`      `#DCEEFF`    Açık mavi yüzeyler
  `surface`         `#FFFFFF`    Kartlar ve ana yüzey
  `surface_muted`   `#F4F8FC`    Açık bölüm arka planları
  `text_primary`    `#182433`    Ana metin
  `text_muted`      `#657386`    İkincil metin
  `border`          `#E2E8F0`    Kenarlıklar

Gereksinimler: - Panelde renk seçici ve HEX girişi bulunmalı. - Önizleme
ve kaydetmeden önce değişiklikleri görme imkânı olmalı. - Varsayılan
palete dön butonu bulunmalı. - Renk token'ları CSS variables olarak
sunulmalı. - Kontrast/erişilebilirlik uyarısı verilmeli; okunaksız
kombinasyonlar sessizce yayınlanmamalı. - İleride açık/koyu tema veya
alternatif tema preset'leri eklenebilecek şekilde tasarlanmalı. - Logo,
favicon, tipografi seçimi ve temel tasarım ayarları da panelden
yönetilebilmeli.

### 3.4 Tipografi ve bileşen kuralları

-   Türkçe karakterleri destekleyen modern sans-serif yazı tipi
    kullanılmalı.
-   Başlıklar güçlü, gövde metni rahat okunur olmalı.
-   Buton, form, kart, etiket ve boşluk ölçüleri ortak tasarım
    token'larıyla yönetilmeli.
-   Tüm etkileşimli öğelerde hover, focus, disabled, loading ve error
    durumları tasarlanmalı.
-   WCAG 2.2 AA hedeflenmeli; klavye ile kullanım ve görünür focus
    durumları sağlanmalı.

## 4. Site haritası

### Ziyaretçi tarafı

1.  Ana Sayfa `/`
2.  Kurumsal `/kurumsal`
    -   Hakkımızda
    -   Çalışma yaklaşımımız
    -   İş modellerimiz
3.  Hizmetler `/hizmetler`
    -   12 ana kategori
    -   Her kategori için ayrı detay sayfası
4.  Projeler `/projeler`
    -   Proje listeleme
    -   Proje detay sayfası
5.  Çalışma Sürecimiz `/surecimiz`
6.  Blog / Bilgi Merkezi `/blog`
    -   Blog listeleme
    -   Blog detay
7.  Sık Sorulan Sorular `/sss`
8.  Teklif Al `/teklif-al`
9.  İletişim `/iletisim`
10. Gizlilik, KVKK aydınlatma, çerez politikası ve kullanım koşulları
    sayfaları

Sayfa slug'ları, menü adları ve içerikleri panelden düzenlenebilir
olmalı. Sistem URL değişiminde eski URL için 301 yönlendirme oluşturmayı
desteklemeli.

## 5. Hizmet kataloğu --- başlangıç verisi

Aşağıdaki 12 kategori ilk kurulumda seed verisi olarak eklenmelidir.
Bunlar veritabanında normal içerik kayıtları olmalı; kod içine
değiştirilemez sabit metin olarak gömülmemelidir. Admin kategori
ekleyebilir, düzenleyebilir, sıralayabilir, yayından kaldırabilir.

### 5.1 Yapı ve İnşaat Uygulamaları

-   Kaba ve ince inşaat uygulamaları
-   Temel, betonarme, kalıp ve duvar işleri
-   Anahtar teslim yapı uygulamaları
-   Konut, villa, ticari ve endüstriyel yapılar
-   Tadilat ve yenileme

### 5.2 Demir ve Betonarme Donatı İşleri

-   Demir kesim, büküm ve bağlama
-   Kolon, kiriş ve perde donatıları
-   Temel, döşeme ve radye temel donatıları
-   Betonarme merdiven donatısı
-   Şantiye demir ekip hizmeti

### 5.3 Çelik Konstrüksiyon ve Metal Yapılar

-   Çelik hangar, depo, fabrika ve atölye
-   Sundurma ve otopark sistemleri
-   Çelik çatı, platform ve merdiven
-   Metal doğrama ve kaynak uygulamaları

### 5.4 Çatı Sistemleri

-   Ahşap ve çelik çatı sistemleri
-   Kiremit, sandviç panel, trapez sac ve shingle
-   Çatı iskeleti, yenileme ve teras kapatma
-   Dere ve yağmur suyu tahliye sistemleri
-   Çatı yalıtımı

### 5.5 Tiny House, Prefabrik ve Modüler Yapılar

-   Tekerlekli ve sabit Tiny House
-   Anahtar teslim Tiny House
-   Prefabrik ev ve modüler yapılar
-   Ahşap ev ve bungalov
-   Bağ/hobi evi ve konteyner düzenleme
-   Modüler ofis ve iç mekân uygulamaları

### 5.6 Su, Isı ve Ses Yalıtım Sistemleri

-   Temel ve perde su yalıtımı
-   Teras, balkon, çatı, banyo ve ıslak hacim yalıtımı
-   Bodrum yalıtımı
-   Membran, sürme esaslı ve poliüretan esaslı uygulamalar
-   Isı yalıtımı ve mantolama
-   Ses/akustik yalıtım
-   Nem ve sızıntı onarımı

### 5.7 Havuz Yapımı ve İzolasyonu

-   Betonarme havuz yapımı
-   Havuz kaba inşaatı
-   Havuz su yalıtımı
-   Seramik ve mozaik kaplama
-   Çevre zemin düzenlemesi
-   Havuz yenileme ve sızdırmazlık

### 5.8 İç Mekân Dekorasyon ve Tadilat

-   Ev ve villa yenileme
-   Anahtar teslim tadilat
-   Mutfak ve banyo yenileme
-   Alçı, saten ve alçıpan
-   Asma tavan ve boya
-   Seramik/fayans ve zemin kaplamaları
-   Laminat, epoksi zemin
-   Kapı, panel, ofis ve mağaza uygulamaları

### 5.9 Dış Cephe ve Cephe Kaplama

-   Dış cephe yenileme
-   Mantolama
-   Kompozit ve dekoratif cephe
-   Ahşap görünümlü ve taş kaplama
-   Söve ve dış cephe boya
-   Cephe yalıtımı

### 5.10 Ahşap Yapı ve Dış Mekân

-   Pergola, veranda ve teras
-   Kamelya ve çardak
-   Ahşap bungalov ve ahşap çatı
-   Deck ve bahçe oturma alanı
-   Ahşap dekorasyon

### 5.11 Restorasyon, Güçlendirme ve Yapısal Onarım

-   Restorasyon
-   Beton tamiri ve yüzey hasarı onarımı
-   Betonarme eleman onarımı
-   Yapısal ve çelik güçlendirme
-   Çatı yenileme
-   Su/nem hasarı onarımı
-   Bakım ve yenileme

Not: Mühendislik, statik proje, ruhsat veya yetkili uzman imzası
gerektiren işler yalnızca mevzuata uygun yetkili teknik ekip ve onaylı
projelerle yürütülmelidir. Web içeriği, gerekli izin ve yetkinliklerin
var olduğu izlenimini gerçeğe aykırı biçimde vermemelidir.

### 5.12 Çevre Düzenleme ve Peyzaj

-   Bahçe ve peyzaj düzenlemesi
-   Bahçe ve istinat duvarı
-   Yürüyüş yolu
-   Açık alan zemin uygulamaları
-   Otopark ve araç alanı
-   Sundurma ve gölgelik
-   Teras/veranda
-   Taş ve parke uygulamaları

Her hizmet kaydı şu alanları desteklemeli: - Ad, slug, kısa açıklama,
detay açıklama - Kart görseli, kapak görseli ve galeri - İkon
(opsiyonel) - Sıralama, aktif/pasif, öne çıkarılmış - SEO title, meta
description, canonical (gerektiğinde), OG görseli - İlgili projeler -
İlgili hizmetler - SSS öğeleri - Teklif CTA metni ve hedefi

## 6. Ana sayfa blokları

Ana sayfa, sabit ve değiştirilemez JSX metinlerinden oluşmamalıdır.
Sıralanabilir, etkinleştirilebilir ve içerikleri düzenlenebilir
bloklardan oluşturulmalıdır.

İlk kurulumda önerilen sıra:

1.  Announcement bar
2.  Header / Navigation
3.  Hero
4.  Güven göstergeleri (deneyim, uzmanlık, çalışma yaklaşımı vb.
    yalnızca doğrulanmışsa)
5.  Hizmetler
6.  Kurumsal değer önerisi
7.  Öne çıkan projeler
8.  Çalışma modelleri
9.  Çalışma süreci
10. Müşteri yorumları (gerçek ve izinli içerik varsa)
11. Blog yazıları (opsiyonel)
12. CTA bandı
13. Footer

Her blok için: - Aktif/pasif - Sıralama - Başlık, alt başlık, metin -
Görsel/video veya medya referansı - Buton metni ve URL - Bloka özgü
ayarlar - Masaüstü/mobil görsel alanı (gerekiyorsa) - Yayın durumu

Bir blok tipi eklemek için güvenli, şemalı bir blok sistemi
kullanılmalı. Admin'e serbest HTML/JavaScript çalıştırma alanı
verilmemeli.

## 7. İçerik türleri ve CMS

### 7.1 İçerik modelleri

-   Pages
-   PageSections / PageBlocks
-   Services
-   ServiceCategories
-   Projects
-   ProjectImages / Media
-   BlogPosts
-   Testimonials
-   FAQs
-   Menus / MenuItems
-   Redirects
-   Leads / QuoteRequests
-   SiteSettings
-   ThemeSettings
-   Users
-   Roles / Permissions
-   AuditLogs

İçeriklerde taslak, incelemede, yayınlandı ve arşivlendi gibi durumlar
desteklenmeli. İlk sürümde karmaşık onay akışı zorunlu değil; ancak
yayın durumları ve yayın tarihi tutulmalı.

### 7.2 Medya kütüphanesi

-   Görsel yükleme, önizleme, arama, filtreleme ve silme.
-   Alt metin, başlık, açıklama ve dosya bilgisi.
-   Dosya türü ve boyut doğrulaması.
-   Güvenli dosya adı ve MIME kontrolü.
-   Görsel boyutlandırma ve WebP/AVIF türevleri.
-   Büyük görsellerin lazy loading ile yüklenmesi.
-   Kullanılmakta olan medyanın yanlışlıkla silinmesine karşı uyarı.
-   İlk sürümde yerel disk veya S3 uyumlu obje depolama adaptörü; üretim
    ortamı için kalıcı ve yedeklenen depolama zorunlu.
-   Uygulama sunucusunun geçici klasörüne tek kopya bırakılarak üretim
    medyası saklanmamalı.

## 8. Admin paneli gereksinimleri

Admin paneli `/admin` altında veya ayrı güvenli admin route grubunda
bulunmalıdır. Giriş ekranı arama motorlarına kapalı olmalı; robots
ayarları güvenlik önlemi yerine geçmemelidir.

### 8.1 Dashboard

-   Toplam hizmet, proje, blog ve yayınlanan sayfa sayıları.
-   Yeni teklif talepleri ve durumları.
-   Son içerik değişiklikleri.
-   Hızlı işlem bağlantıları.
-   Sistem uyarıları (yedekleme, depolama, hata vb. varsa).

### 8.2 Modüller

1.  Dashboard
2.  Sayfalar
3.  Ana sayfa düzenleyici
4.  Hizmet kategorileri
5.  Hizmetler
6.  Projeler
7.  Medya kütüphanesi
8.  Blog
9.  Müşteri yorumları
10. Sık sorulan sorular
11. Menü yönetimi
12. Teklif talepleri
13. İletişim ve sosyal medya ayarları
14. Tema ve renk ayarları
15. SEO ve yönlendirmeler
16. Kullanıcılar
17. Roller ve yetkiler
18. Denetim kayıtları
19. Sistem ayarları

### 8.3 Form ve editör deneyimi

-   Zorunlu alanlar net belirtilmeli.
-   Kaydet, taslak kaydet, yayınla ve önizle eylemleri ayrılmalı.
-   Kaydedilmemiş değişikliklerde kullanıcı uyarılmalı.
-   Başarılı/başarısız işlemler anlaşılır bildirim göstermeli.
-   Uzun içeriklerde otomatik taslak kaydı veya kontrollü autosave
    değerlendirilmeli.
-   Liste ekranlarında arama, filtre, sıralama, sayfalama ve toplu işlem
    bulunmalı.
-   Silme işlemleri onay istemeli; kritik verilerde soft delete tercih
    edilmeli.
-   Mobil admin kullanımı en azından temel işlemler için desteklenmeli.

## 9. Teklif ve iletişim talepleri

Teklif formu müşterinin hizmet talebini iletmesini sağlar. İlk sürümde
gereksiz uzun form kullanılmamalı.

Önerilen alanlar: - Ad soyad - Telefon - E-posta (opsiyonel veya iş
kuralına göre) - Müşteri tipi (bireysel / kurumsal) - İlgili hizmet - İş
modeli (işçilik / malzeme + işçilik / anahtar teslim / emin değilim) -
İl / ilçe - Proje açıklaması - Fotoğraf veya belge ekleme (opsiyonel) -
KVKK aydınlatma metninin okunduğuna ilişkin uygun onay/işaretleme

Gereksinimler: - Sunucu tarafında doğrulama ve spam koruması. - Form
gönderiminde başarı/hata geri bildirimi. - Talep veritabanına
kaydedilmeli. - Admin panelinde yeni, aranıyor, teklif hazırlanıyor,
teklif gönderildi, kazanıldı, kaybedildi, arşivlendi gibi durumlar
yönetilebilmeli. - İç notlar ve atanan kullanıcı opsiyonel. - E-posta
bildirimi yapılandırılabilir olmalı; e-posta gönderimi başarısız olsa
bile talep kaydı kaybolmamalı. - Kullanıcıya otomatik yanıt
gönderilecekse admin ayarından açılıp kapatılabilmeli. -
Telefon/WhatsApp bağlantıları panelden değiştirilebilmeli. - Kişisel
veriler için saklama ve silme politikası tanımlanmalı.

## 10. Veritabanı ve veri mimarisi

### 10.1 Veritabanı kararı

**PostgreSQL** kullanılacaktır. Üretimde SQLite kullanılmamalıdır.
Veritabanı ilişkisel, normalize ve migration kontrollü tasarlanmalıdır.

Önerilen teknoloji: - Next.js App Router + TypeScript - PostgreSQL -
Prisma ORM (mevcut sürüm ve Next.js uyumluluğu geliştirme başlangıcında
doğrulanmalı) - Zod veya eşdeğer şema doğrulama - Güvenli session
tabanlı kimlik doğrulama - Dosya depolama adaptörü

Next.js Route Handlers / Server Actions kullanılabilir; ancak yetki
kontrolleri yalnızca arayüzde değil, her sunucu eylemi ve veri erişim
katmanında uygulanmalıdır.

### 10.2 Genel veri kuralları

-   Tüm tablolarda uygun primary key kullanılmalı; tercihen UUID.
-   `created_at`, `updated_at` zaman alanları gerekli tablolarda
    bulunmalı.
-   Kullanıcı tarafından oluşturulan içeriklerde `created_by`,
    `updated_by` alanları tutulmalı.
-   Yayınlanabilir içeriklerde `status`, `published_at` alanları
    bulunmalı.
-   Slug alanları ilgili tablo içinde unique olmalı.
-   İlişkiler foreign key ile korunmalı.
-   Sık sorgulanan alanlara indeks eklenmeli.
-   Para/teklif tutarları ileride eklenecekse floating point yerine
    decimal/numeric kullanılmalı.
-   Tarihler UTC olarak saklanmalı; arayüzde `Europe/Istanbul`
    gösterilmeli.
-   Silme davranışı ilişki türüne göre açıkça tanımlanmalı. İçerik
    ilişkilerinde yanlışlıkla zincirleme silme yapılmamalı.
-   Hassas veriler loglara yazılmamalı.
-   Şema değişiklikleri yalnızca migration ile yapılmalı; canlı
    veritabanına elle ve izsiz müdahale edilmemeli.

### 10.3 Önerilen tablo taslağı

Aşağıdaki model isimleri kavramsal taslaktır. Antigravity gerçek Prisma
şemasını ilişkiler, indeksler, enum'lar ve migration'larla
tamamlamalıdır.

#### `users`

-   id
-   name
-   email (unique)
-   password_hash veya güvenli auth provider ilişkisi
-   is_active
-   last_login_at
-   created_at
-   updated_at

#### `roles`

-   id
-   name
-   key (unique)
-   description

#### `permissions`

-   id
-   key (unique)
-   description

#### `user_roles`

-   user_id
-   role_id

#### `role_permissions`

-   role_id
-   permission_id

Önerilen başlangıç rolleri: - Super Admin - Admin - Editor - Sales /
Teklif Sorumlusu

İzinler modül ve eylem bazında olmalı: `services.read`,
`services.create`, `services.update`, `services.delete`, `leads.read`,
`leads.update`, `settings.manage` vb.

#### `pages`

-   id
-   title
-   slug (unique)
-   excerpt
-   status
-   template_key
-   seo_title
-   seo_description
-   og_media_id
-   canonical_url
-   published_at
-   created_by
-   updated_by
-   created_at
-   updated_at

#### `page_sections`

-   id
-   page_id
-   block_type
-   sort_order
-   is_active
-   content_json (şemalı JSON)
-   created_at
-   updated_at

`content_json` her block type için doğrulanan bir schema ile kontrol
edilmelidir. Serbest ve çalıştırılabilir kod saklanmamalıdır.

#### `service_categories`

-   id
-   name
-   slug (unique)
-   description
-   image_media_id
-   sort_order
-   is_active
-   seo_title
-   seo_description
-   created_at
-   updated_at

#### `services`

-   id
-   category_id
-   title
-   slug (unique)
-   short_description
-   content
-   card_media_id
-   cover_media_id
-   status
-   is_featured
-   sort_order
-   seo_title
-   seo_description
-   published_at
-   created_by
-   updated_by
-   created_at
-   updated_at

#### `projects`

-   id
-   title
-   slug (unique)
-   summary
-   description
-   location_label
-   project_type
-   completion_date (nullable)
-   status
-   is_featured
-   cover_media_id
-   seo_title
-   seo_description
-   published_at
-   created_by
-   updated_by
-   created_at
-   updated_at

#### `project_services`

-   project_id
-   service_id

#### `project_media`

-   id
-   project_id
-   media_id
-   caption
-   alt_text
-   sort_order

#### `media`

-   id
-   storage_provider
-   storage_key
-   original_filename
-   mime_type
-   file_size
-   width
-   height
-   alt_text
-   title
-   caption
-   uploaded_by
-   created_at

#### `blog_posts`

-   id
-   title
-   slug (unique)
-   excerpt
-   content
-   cover_media_id
-   author_id
-   status
-   published_at
-   seo_title
-   seo_description
-   created_at
-   updated_at

#### `testimonials`

-   id
-   display_name
-   company_or_location (nullable)
-   quote
-   rating (nullable)
-   media_id (nullable)
-   is_published
-   sort_order
-   created_at
-   updated_at

Yorumlar yalnızca gerçek, kullanım izni bulunan müşteri geri
bildirimlerinden oluşturulmalıdır. Sahte yorum veya sahte puan
üretilmemelidir.

#### `faqs`

-   id
-   question
-   answer
-   service_id (nullable)
-   sort_order
-   is_published
-   created_at
-   updated_at

#### `menus`

-   id
-   name
-   key (unique)
-   is_active

#### `menu_items`

-   id
-   menu_id
-   parent_id (nullable)
-   label
-   url
-   target
-   sort_order
-   is_active

#### `site_settings`

-   id
-   key (unique)
-   value_json
-   updated_by
-   updated_at

Site adı, logo, favicon, telefon, e-posta, adres, sosyal medya, duyuru
bandı ve genel iletişim ayarları gibi yapılandırmalar burada veya tip
güvenli ilişkili ayar tablolarında tutulabilir. Hassas secret değerleri
bu tabloya düz metin olarak yazılmamalıdır.

#### `theme_settings`

-   id
-   theme_key (unique)
-   tokens_json
-   typography_json
-   updated_by
-   updated_at

Renk token'ları ve görsel tema ayarları burada tutulmalıdır. JSON şeması
doğrulanmalı ve yalnızca izin verilen token'lar kabul edilmelidir.

#### `leads`

-   id
-   reference_code (unique)
-   full_name
-   phone
-   email (nullable)
-   customer_type
-   service_id (nullable)
-   work_model
-   city
-   district
-   message
-   status
-   assigned_to (nullable)
-   privacy_notice_version
-   consent_metadata (yalnızca gerekli ve hukuken uygun veriler)
-   source_page
-   created_at
-   updated_at

#### `lead_attachments`

-   id
-   lead_id
-   media_id

#### `lead_notes`

-   id
-   lead_id
-   user_id
-   note
-   created_at

#### `redirects`

-   id
-   source_path (unique)
-   destination_path
-   http_status (301/302)
-   is_active
-   created_at
-   updated_at

#### `audit_logs`

-   id
-   user_id (nullable)
-   action
-   entity_type
-   entity_id
-   summary
-   metadata_json (secret/kişisel veri içermemeli)
-   ip_hash veya güvenli şekilde minimize edilmiş erişim bilgisi
    (gerekiyorsa)
-   created_at

Denetim kayıtları özellikle giriş, başarısız giriş, rol değişikliği,
ayar değişikliği, içerik yayınlama/silme ve teklif durumu değişimlerini
kaydetmelidir.

#### `sessions` / auth tabloları

Seçilen auth çözümünün önerdiği güvenli session tabloları kullanılmalı.
Şifreler asla düz metin tutulmamalı. Kendi auth sistemi yazılacaksa
güvenli parola hash algoritması (Argon2id tercih edilir), session
yenileme, iptal, CSRF ve brute-force önlemleri uygulanmalıdır. Mümkünse
bakımı yapılan, güvenilir bir auth kütüphanesi tercih edilmelidir.

### 10.4 İlişkiler

-   Bir kategori birçok hizmet içerir.
-   Bir hizmet bir kategoriye bağlıdır.
-   Bir proje birden fazla hizmetle ilişkilendirilebilir.
-   Bir proje birden fazla medya dosyası içerebilir.
-   Bir sayfa çok sayıda sıralanabilir blok içerir.
-   Bir menü çok sayıda hiyerarşik menü öğesi içerir.
-   Bir teklif talebi bir hizmete, sorumlu kullanıcıya ve ek dosyalara
    bağlanabilir.
-   Bir kullanıcı birden fazla role sahip olabilir.
-   Roller birden fazla izne sahip olabilir.

### 10.5 Migration ve seed

-   İlk migration veritabanı şemasını oluşturmalı.
-   Seed işlemi 12 hizmet kategorisini, temel site ayarlarını,
    varsayılan tema token'larını ve başlangıç rollerini eklemeli.
-   Varsayılan admin parolası kaynak kodda veya seed dosyasında
    sabitlenmemeli.
-   İlk admin güvenli CLI komutu veya kontrollü kurulum sihirbazı ile
    oluşturulmalı.
-   Seed tekrar çalıştırıldığında içerikleri çoğaltmamalı; idempotent
    olmalı.
-   Migration öncesi üretim yedeği alınmalı; geri dönüş/restore
    prosedürü belgelenmeli.

## 11. Güvenlik

Güvenlik sonradan eklenecek bir modül değildir; ilk günden
uygulanmalıdır.

-   Parola hash; düz metin parola kesinlikle yok.
-   Güvenli, HttpOnly, Secure (HTTPS), SameSite cookie ayarları.
-   Session süreleri, yenileme ve çıkışta iptal.
-   Login rate limiting ve brute-force koruması.
-   MFA desteği mimari olarak değerlendirilmeli; en azından admin
    hesaplarında güçlü parola politikası.
-   RBAC kontrolü sunucu tarafında ve her mutation işleminde.
-   CSRF, XSS, SQL injection, SSRF ve IDOR risklerine karşı koruma.
-   ORM kullanımı SQL injection riskini azaltır ancak yetkilendirme
    yerine geçmez.
-   Form doğrulama hem istemci hem sunucuda.
-   Upload allowlist, boyut sınırı, MIME ve dosya imzası kontrolü;
    tehlikeli dosyaların çalıştırılmasını engelleme.
-   Admin route'ları ve API'ler kimlik doğrulama + yetki kontrolü
    yapmalı.
-   Secret'lar `.env` içinde tutulmalı; Git'e gönderilmemeli.
-   Production hata yanıtları stack trace veya secret göstermemeli.
-   Güvenlik başlıkları, CSP ve HTTPS.
-   Bağımlılık ve güvenlik taraması.
-   Audit log.
-   Kişisel veri minimizasyonu, erişim kısıtı ve saklama/silme
    politikası.
-   KVKK metinleri ve veri işleme uygulamaları hukuk danışmanı
    tarafından kontrol edilmelidir.

## 12. Performans ve SEO

### Performans

-   Server Components varsayılan tercih; Client Components yalnızca
    etkileşim gereken yerde.
-   Görseller optimize edilmeli; doğru boyut ve modern format
    kullanılmalı.
-   Lazy loading ve responsive image.
-   Gereksiz büyük JS paketlerinden kaçınma.
-   Sayfalama ve veritabanı sorgu limitleri.
-   Uygun cache/revalidation stratejisi.
-   Fontlar optimize edilmeli.
-   Lighthouse hedefi: erişilebilirlik, SEO ve en iyi uygulamalarda 90+;
    performans mobilde gerçek ölçümle iyileştirilmeli, garanti olarak
    sunulmamalı.
-   Core Web Vitals izlenmeli.

### SEO

-   Her sayfa ve içerikte benzersiz title/description.
-   Canonical.
-   Open Graph ve sosyal paylaşım görselleri.
-   XML sitemap otomatik oluşturulmalı.
-   robots.txt.
-   Breadcrumb.
-   Uygun JSON-LD schema: Organization/LocalBusiness (yalnızca doğru
    bilgilerle), Service, Article, BreadcrumbList.
-   Temiz ve Türkçe karakter sorunları yaratmayan slug üretimi.
-   301 redirect yönetimi.
-   Görsellerde alt text.
-   Yayınlanmamış içerikler indekslenmemeli.
-   Admin sayfaları noindex ve erişim kontrolü ile korunmalı.
-   Yerel SEO için firma adresi ve hizmet bölgeleri yalnızca doğrulanmış
    bilgilerle girilmeli.

## 13. E-posta, bildirim ve entegrasyonlar

-   SMTP veya güvenilir e-posta sağlayıcısı yapılandırılabilir olmalı.
-   Yeni teklif talebinde admin bildirim e-postası.
-   E-posta gönderim hatası lead kaydını etkilememeli.
-   WhatsApp bağlantısı panelden yönetilmeli; ilk sürümde WhatsApp API
    entegrasyonu zorunlu değil.
-   Google Analytics / Tag Manager / Search Console kodları güvenli ayar
    alanından eklenebilir; yalnızca yetkili admin değiştirebilir.
-   Çerez ve analiz izinleri KVKK ve ilgili mevzuata uygun ele alınmalı.

## 14. Teknik mimari ve proje organizasyonu

### Önerilen stack

-   Next.js App Router
-   React
-   TypeScript strict mode
-   PostgreSQL
-   Prisma ORM (uyumlu kararlı sürüm)
-   Zod
-   Tailwind CSS
-   Erişilebilir bileşen kütüphanesi (ör. shadcn/ui veya eşdeğeri)
-   Güvenilir auth çözümü
-   Test: Vitest/Jest + Playwright (uygun kombinasyon)
-   Package manager: pnpm

Sürüm numaraları proje oluşturulurken güncel kararlı ve birbiriyle
uyumlu sürümlerden seçilmeli; beta/canary sürümler gerekmedikçe
kullanılmamalı. Sürümler lockfile ile sabitlenmeli.

### Mimari ilkeler

-   Başlangıçta modüler monolith. Mikroservis yok.
-   UI, application/service layer, data access ve domain kuralları
    ayrılmalı.
-   Prisma sorguları rastgele her bileşene dağıtılmamalı;
    repository/service katmanı kullanılmalı.
-   Admin ve public site aynı kod tabanında ancak ayrı layout ve route
    gruplarında olmalı.
-   İş mantığı server-only modüllerde tutulmalı.
-   Ortak tipler ve validasyon şemaları merkezi olmalı.
-   İçerik modelleri ile görsel blok bileşenleri arasında açık mapping
    olmalı.
-   Gereksiz soyutlama ve aşırı mühendislikten kaçınılmalı.

### Önerilen klasör yapısı

``` text
src/
  app/
    (public)/
    admin/
    api/
  components/
    public/
    admin/
    shared/
    blocks/
  features/
    auth/
    pages/
    services/
    projects/
    media/
    blog/
    leads/
    settings/
    users/
  lib/
    auth/
    db/
    validation/
    security/
    storage/
    seo/
    email/
  server/
    services/
    repositories/
  styles/
prisma/
  schema.prisma
  migrations/
  seed.ts
public/
docs/
  PROJECT_SPECIFICATION.md
  ANTIGRAVITY_MASTER_PROMPT.md
  PROJECT_CHECKLIST.md
  PROJECT_PROGRESS.md
```

Dosya yapısı uygulama geliştikçe makul biçimde uyarlanabilir; doküman
klasöründeki ilerleme kayıtları korunmalıdır.

## 15. Test ve kalite güvencesi

-   Unit test: validasyon, slug, yetki ve iş kuralları.
-   Integration test: DB repository/service, teklif kaydı, auth ve RBAC.
-   E2E test: ziyaretçi sayfaları, teklif formu, admin giriş, içerik
    CRUD, tema güncelleme.
-   Migration testi: boş veritabanından kurulum ve seed.
-   Responsive test: mobil, tablet, masaüstü.
-   Güvenlik testleri: yetkisiz erişim, rol atlama, upload, rate limit,
    CSRF/XSS senaryoları.
-   Build ve lint hatasız olmalı.
-   Testler geçmeden tamamlandı işaretlenmemeli.
-   Gerçek müşteri verisi kullanılmadan test fixture'ları kullanılmalı.

## 16. Yayınlama ve operasyon

Hosting sağlayıcısı henüz kesinleşmedi. Bu nedenle uygulama Plesk/VPS
veya Node.js destekli başka bir ortama taşınabilir biçimde hazırlanmalı.

-   Production ortamı için Node.js çalıştırma desteği.
-   PostgreSQL erişimi ve güvenli ağ/credential ayarı.
-   Kalıcı medya depolama.
-   HTTPS.
-   Environment variable dokümantasyonu.
-   Build/start/migration/backup/restore komutları.
-   Health check endpoint.
-   Log rotation ve hata izleme.
-   Otomatik günlük DB yedeği ve periyodik geri yükleme testi.
-   Uygulama ve veritabanı ayrı yedekleme planı.
-   Deploy sırasında migration ve rollback prosedürü.
-   `.env.example` hazırlanmalı; gerçek secret içermemeli.

## 17. Kabul kriterleri

Proje ancak aşağıdaki koşullar sağlandığında ilk sürüm için tamamlanmış
sayılır:

1.  Public site referans tasarım yönüne uygun, özgün ve responsive.
2.  12 hizmet kategorisi veritabanında seed edilmiş ve admin'den
    yönetilebilir.
3.  Hizmet detay sayfaları dinamik.
4.  Sayfa ve ana sayfa blokları yönetilebilir.
5.  Logo, site adı, iletişim bilgileri ve renkler admin'den
    değiştirilebilir.
6.  Tema değişikliği public siteye tutarlı yansır.
7.  Proje, blog, medya, menü ve SSS yönetimi çalışır.
8.  Teklif formu kayıt oluşturur; admin listeler ve durum günceller.
9.  RBAC gerçek sunucu tarafında uygulanır.
10. Audit log kritik işlemleri kaydeder.
11. SEO metadata, sitemap, robots, canonical ve redirect altyapısı
    çalışır.
12. Migration, seed, backup ve restore yönergeleri test edilmiştir.
13. Lint, typecheck, test ve production build başarılıdır.
14. E2E kritik akışlar geçer.
15. `PROJECT_CHECKLIST.md` ve `PROJECT_PROGRESS.md` günceldir.

------------------------------------------------------------------------

## 18. Geliştirme yöntemi ve ilerleme yönetimi

Antigravity bu projeyi tek seferde ve kontrolsüz biçimde üretmemelidir.
Fazlara ayrılmış, test edilmiş ve kayıt altına alınmış şekilde
ilerlemelidir.

-   İlk iş mevcut repo ve ortamı incelemek.
-   Kod yazmadan önce uygulama planını ve dosya yapısını doğrulamak.
-   `PROJECT_CHECKLIST.md` dosyasını görevlerin tek doğruluk kaynağı
    yapmak.
-   Her görevden sonra checklist durumunu güncellemek.
-   Her oturum başında `PROJECT_PROGRESS.md` ve checklist'i okumak.
-   Her oturum sonunda yapılanlar, testler, açık sorunlar ve sıradaki
    tek adımı progress dosyasına yazmak.
-   Bir fazın kabul kriterleri geçmeden sonraki faza atlamamak.
-   Hata varsa tamamlandı işaretlememek.
-   Kullanıcı onayı gerektiren dış işlemler (domain, ücretli servis,
    production deploy, gerçek e-posta gönderimi vb.) öncesinde durup
    onay istemek.
-   Her fazda çalışır uygulama bırakmak.
-   Var olan dosyaları incelemeden üzerine yazmamak.
-   Belirsizlikte güvenli ve geri alınabilir seçeneği tercih etmek;
    önemli ürün kararlarını karar günlüğüne yazmak.

**Bu belge ürünün ana gereksinim kaynağıdır.** Kod ve uygulama kararları
bu belgeyle çelişirse Antigravity önce çelişkiyi belirtmeli, sessizce
kapsamı değiştirmemelidir.
