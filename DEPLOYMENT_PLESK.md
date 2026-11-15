# DEPLOYMENT_PLESK.md — SSH Erişimi Olmadan Plesk'e Deploy

> [!IMPORTANT]
> Bu rehber **SSH erişimi olmayan** Plesk ortamları için hazırlanmıştır.
> Tüm işlemler Plesk Panel arayüzü ve FTP üzerinden yapılır.

---

## Genel Yaklaşım

```
Yerel Makine          Plesk Panel          Domain
─────────────         ───────────          ──────
pnpm build      ──▶  Git Extension  ──▶   node server.js
                      (veya FTP)           ↓
                                     prisma migrate deploy  (otomatik)
                                           ↓
                                     https://domain.com/setup  (ilk açılış)
                                           ↓
                                     Admin hesabı oluştur
```

**`server.js` uygulama her başlarken otomatik olarak:**
1. `prisma migrate deploy` çalıştırır (SSH'sız migration!)
2. Next.js sunucusunu başlatır
3. İlk açılışta `/setup` adresi admin oluşturma sihirbazını gösterir

---

## Bölüm 1 — Plesk Eklentileri

Plesk Panel → **Extensions (Eklentiler)** → şunları arayıp kurun:

- ✅ **Node.js** (Plesk resmi eklentisi — zorunlu)
- ✅ **PostgreSQL** veya **Git** (hangisi yoksa)
- ✅ **Let's Encrypt** (ücretsiz SSL)

---

## Bölüm 2 — Veritabanı Oluşturma (Plesk Panel)

**Plesk Panel → Databases → Add Database**

| Alan | Değer |
|------|-------|
| Database name | `yapi_platform` |
| Database type | **PostgreSQL** |
| Username | `yapi_user` |
| Password | Güçlü bir parola — not edin |

Bağlantı URL'si (kopyalayın, Bölüm 4'te kullanacaksınız):
```
postgresql://yapi_user:PAROLA@localhost:5432/yapi_platform
```

> [!NOTE]
> Plesk PostgreSQL portu genellikle **5432**'dir.

---

## Bölüm 3 — Kodu Sunucuya Yükleme

İki yöntemden birini seçin:

---

### 🅰 Yöntem A: Plesk Git Extension (Önerilen)

**Adım 1 — GitHub'a push edin (yerel makinenizde):**
```bash
# Proje klasöründe:
git remote add origin https://github.com/KULLANICI/yapi-platform.git
git push -u origin main
```

**Adım 2 — Plesk Panel → Domain → Git sekmesi:**

- **Repository URL:** `https://github.com/KULLANICI/yapi-platform.git`
- **Branch:** `main`
- **Target directory:** `/` (domain kök dizini)

**Adım 3 — Deployment Action alanına yazın:**
```
npm install -g pnpm@12 && pnpm install --frozen-lockfile && pnpm build
```

**Adım 4 — "Deploy" butonuna tıklayın.**

Plesk kodu çeker, komutu çalıştırır. Build tamamlanınca Bölüm 4'e geçin.

> [!TIP]
> Özel (private) repo için: Git → Authentication → SSH Key veya Personal Access Token girin.

---

### 🅱 Yöntem B: FTP + Zip Upload

**Adım 1 — Yerel makinenizde build yapın:**
```bash
cd c:\PROJELER\YAPI2
pnpm install
pnpm build
```

**Adım 2 — Deploy paketi hazırlayın (node_modules HARİÇ):**

Şu klasör/dosyaları zip'leyin:
```
✅ .next/
✅ prisma/
✅ public/
✅ scripts/
✅ src/
✅ server.js
✅ package.json
✅ pnpm-lock.yaml
✅ next.config.ts
✅ tsconfig.json
✅ eslint.config.mjs
✅ vitest.config.ts
❌ node_modules/   → EKLEME (çok büyük)
❌ .git/           → EKLEME
❌ .pg-data/       → EKLEME
❌ .env.local      → EKLEME (güvenlik!)
```

**Adım 3 — Plesk File Manager ile upload edin:**

Plesk Panel → **Files** → Domain klasörü → **Upload** → zip dosyasını seçin → **Extract**

**Adım 4 — Plesk Node.js → "NPM Install" butonuna tıklayın.**

Bu buton `npm install` çalıştırır ve bağımlılıkları kurar.

> [!WARNING]
> Plesk'te `npm install` çalışır ama `pnpm` olmayabilir. Bu durumda `package.json`'daki `packageManager` alanına rağmen npm ile kurulum yapılır. Sorun çıkarsa Plesk support'tan `pnpm` kurmasını isteyin.

---

## Bölüm 4 — Ortam Değişkenleri (Plesk Panel)

**Plesk → Domain → Node.js → Environment Variables:**

| Değişken | Değer |
|----------|-------|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | `postgresql://yapi_user:PAROLA@localhost:5432/yapi_platform` |
| `AUTH_SECRET` | Rastgele 32+ karakter (aşağıya bakın) |
| `NEXT_PUBLIC_APP_URL` | `https://your-domain.com` |
| `ADMIN_EMAIL` | `admin@your-domain.com` |
| `SMTP_HOST` | `smtp.provider.com` *(opsiyonel)* |
| `SMTP_PORT` | `587` *(opsiyonel)* |
| `SMTP_USER` | *(opsiyonel)* |
| `SMTP_PASS` | *(opsiyonel)* |
| `SMTP_FROM` | `Firma <noreply@domain.com>` *(opsiyonel)* |

**AUTH_SECRET üretmek için** (yerel makinenizde PowerShell):
```powershell
[System.Web.Security.Membership]::GeneratePassword(40, 10)
# veya:
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 40 | % {[char]$_})
```

> [!CAUTION]
> `AUTH_SECRET` değerini asla kaynak koda veya Git'e eklemeyin.

---

## Bölüm 5 — Node.js Uygulaması Yapılandırma

**Plesk → Domain → Node.js:**

| Alan | Değer |
|------|-------|
| Node.js version | `20.x LTS` |
| Document root | `/` |
| Application startup file | `server.js` |
| Application mode | `production` |

**"Enable Node.js"** butonuna tıklayın.

---

## Bölüm 6 — Uygulamayı Başlatma ve İlk Kurulum

**Plesk → Node.js → "Restart App"** butonuna tıklayın.

Uygulama başlarken `server.js` otomatik olarak:
1. `prisma migrate deploy` → veritabanı tabloları oluşturulur
2. Next.js sunucusu başlatılır

**İlk kurulum sihirbazı:**

Tarayıcınızda açın:
```
https://your-domain.com/setup
```

Karşınıza çıkan formda:
- **Firma / Site Adı** → şirket adınız
- **Ad Soyad** → admin kullanıcı adı
- **E-posta** → giriş için kullanılacak
- **Parola** → en az 12 karakter

"Kurulumu Tamamla" → otomatik `/admin/login`'e yönlendirir.

> [!IMPORTANT]
> `/setup` sayfası bir kez admin oluşturulduktan sonra otomatik kapanır. Tekrar açmaya çalışanlar `/admin/login`'e yönlendirilir.

---

## Bölüm 7 — SSL (Let's Encrypt)

**Plesk → Domain → SSL/TLS Certificates → Let's Encrypt**

- Domain ve www subdomain seçin
- **Force HTTPS redirect** ✅ etkinleştirin
- Kaydet → sertifika otomatik kurulur

HSTS başlığı zaten `next.config.ts`'de etkin (2 yıl).

---

## Bölüm 8 — Nginx Statik Dosya Optimizasyonu

**Plesk → Domain → Apache & Nginx Settings → Additional Nginx directives:**

```nginx
# Next.js statik varlıklar — 1 yıl cache
location /_next/static/ {
    expires 365d;
    add_header Cache-Control "public, immutable";
    access_log off;
}

# Yüklenen medya dosyaları
location /uploads/ {
    expires 30d;
    add_header Cache-Control "public";
    access_log off;
}

# Gzip sıkıştırma
gzip on;
gzip_types text/plain text/css application/json application/javascript image/svg+xml;
gzip_min_length 1000;
```

---

## Bölüm 9 — Sonraki Güncelleme Deploy

### Yöntem A ile (Git Extension):

1. Yerel makinede değişiklik yapın
2. `git push origin main`
3. Plesk → Git → **Pull** (veya otomatik webhook ayarlayın)
4. Deployment Action otomatik çalışır
5. Plesk → Node.js → **Restart App**

### Yöntem B ile (FTP):

1. Yerel makinede `pnpm build` yapın
2. Değişen dosyaları zip'leyip Plesk'e yükleyin
3. Plesk → Node.js → **Restart App**

> [!NOTE]
> `server.js` her yeniden başlamada migration kontrol eder. Yeni migration varsa otomatik çalışır — veritabanı yedeksiz güncellemeye gerek yoktur.

---

## Bölüm 10 — Veritabanı Yedekleme

**Plesk → Databases → Backup Manager** (en kolay yol)

Veya **Plesk Scheduled Tasks** (Cron) ekleyin:
```
# Her gün 02:00
0 2 * * *   cd /var/www/vhosts/domain.com/httpdocs && node scripts/backup-db.mjs
```

---

## Bölüm 11 — Sorun Giderme

### "502 Bad Gateway"
Uygulama başlamamış olabilir:
- Plesk → Node.js → **Restart App**
- Plesk → Node.js → **View Logs** ile hata logunu kontrol edin

### "Migration hatası" (ilk başlatmada)
- `DATABASE_URL` ortam değişkeninin doğru olduğunu kontrol edin
- Plesk → Databases → veritabanının oluşturulduğunu doğrulayın
- Plesk → Node.js → Restart App (yeniden denesin)

### "/setup sayfası yönlendiriyor (admin yok ama setup açılmıyor)"
- `DATABASE_URL` yanlış olabilir — seed çalışmamıştır
- Plesk → Databases → phpPgAdmin ile `role` tablosunu kontrol edin
- `super_admin` rolü yoksa: Plesk → Node.js → `pnpm db:seed` çalıştırın

### "pnpm bulunamadı"
Plesk → Node.js → Application startup file alanında:
```
server.js
```
(pnpm'e bağımlılık yok — `server.js` node ile çalışır)

Build için Plesk terminal yoksa Yöntem A (Git Extension) kullanın.

---

## Bölüm 12 — Hızlı Başvuru

| Görev | Yer |
|-------|-----|
| İlk kurulum | `https://domain.com/setup` |
| Yönetici girişi | `https://domain.com/admin` |
| Sağlık kontrolü | `https://domain.com/api/health` |
| Uygulama yeniden başlat | Plesk → Node.js → Restart App |
| Ortam değişkenleri | Plesk → Node.js → Environment Variables |
| Loglar | Plesk → Node.js → View Logs |
| Veritabanı yedek | Plesk → Databases → Backup Manager |
| SSL yenile | Plesk → Let's Encrypt → Renew |
