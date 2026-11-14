# DEPLOYMENT_PLESK.md
# Plesk Üzerinde Yayınlama Rehberi

Bu rehber, uygulamanın Plesk kontrol paneli üzerinden nasıl yayınlanacağını adım adım anlatır.

---

## Gereksinimler

| Bileşen | Minimum |
|---------|---------|
| Plesk sürümü | 18.0+ |
| Plesk Node.js Extension | Kurulu ve etkin |
| Plesk PostgreSQL Extension | Kurulu ve etkin |
| Node.js | v20 LTS veya v22 LTS |
| RAM | 1 GB+ (512 MB minimum) |
| Disk | 2 GB+ (uploads + build artifacts) |

---

## Bölüm 1 — Plesk Eklentileri

Plesk Panel → **Extensions** → şunları arayın ve kurun:

- **Node.js** (Plesk resmi eklentisi)
- **PostgreSQL** (veritabanı yönetimi için)
- **Let's Encrypt** (SSL — ücretsiz)

---

## Bölüm 2 — Veritabanı Oluşturma

**Plesk Panel → Databases → Add Database**

| Alan | Değer |
|------|-------|
| Database name | `yapi_platform` |
| Database type | **PostgreSQL** |
| Database server | localhost / 127.0.0.1 |
| Username | `yapi_user` |
| Password | Güçlü bir parola (not edin) |

> [!IMPORTANT]
> PostgreSQL portu Plesk'te genellikle **5432**'dir (embedded-postgres gibi 5433 değil).

Bağlantı URL'si şu formatta olacak:
```
postgresql://yapi_user:PAROLA@localhost:5432/yapi_platform
```

---

## Bölüm 3 — Domain ve Node.js Uygulaması

### 3.1 Domain Ekle

Plesk Panel → **Websites & Domains → Add Domain** (veya mevcut domain'i kullanın)

### 3.2 Node.js Uygulaması Yapılandır

Domain üzerinde **Node.js** sekmesine tıklayın:

| Alan | Değer |
|------|-------|
| Node.js version | `20.x LTS` |
| Document root | `/httpdocs` |
| Application root | `/httpdocs` (proje dizini) |
| Application startup file | `server.js` |
| Application mode | `production` |
| Application URL | `https://your-domain.com` |

> [!NOTE]
> "Application root" ile "Document root" aynı dizin olabilir. Next.js statik dosyaları `public/` ve `.next/static/` altında tutar; Nginx yönlendirmesi otomatik ayarlanır.

---

## Bölüm 4 — Dosyaları Sunucuya Yükleme

### Yöntem A: Git (Önerilen)

Plesk Terminal (SSH) veya Plesk Git Extension ile:

```bash
# Plesk File Manager yerine SSH terminali açın
cd /var/www/vhosts/your-domain.com/httpdocs

# Git reposunu klonlayın
git clone https://github.com/kullaniciadi/yapi-platform.git .

# Veya mevcut repo ise pull
git pull origin main
```

### Yöntem B: FTP/SFTP

Proje dosyalarını domain'in `httpdocs` klasörüne yükleyin.  
`.next/` ve `node_modules/` gibi ağır dizinleri sunucuda oluşturun (`pnpm install` ve `pnpm build` ile).

---

## Bölüm 5 — Ortam Değişkenleri

### 5.A Plesk Panel'den

**Node.js sekmesi → Environment Variables** bölümüne aşağıdakileri ekleyin:

```
NODE_ENV=production
DATABASE_URL=postgresql://yapi_user:PAROLA@localhost:5432/yapi_platform
AUTH_SECRET=EN_AZ_32_KARAKTER_RASTGELE_STRING
NEXT_PUBLIC_APP_URL=https://your-domain.com
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_USER=noreply@your-domain.com
SMTP_PASS=smtp-parola
SMTP_FROM=Şirket Adı <noreply@your-domain.com>
ADMIN_EMAIL=admin@your-domain.com
STORAGE_PROVIDER=local
```

> [!CAUTION]
> `AUTH_SECRET` üretmek için: `openssl rand -base64 32`  
> Bu değeri asla kaynak koduna veya Git'e eklemeyin.

### 5.B .env.local ile (SSH)

```bash
cd /var/www/vhosts/your-domain.com/httpdocs
cp .env.example .env.local
nano .env.local   # değerleri düzenleyin
```

---

## Bölüm 6 — Bağımlılıkları Kurma ve Build

**Node.js sekmesi → Run script** (veya SSH terminali):

```bash
cd /var/www/vhosts/your-domain.com/httpdocs

# pnpm kurulu değilse:
npm install -g pnpm

# Bağımlılıkları kur
pnpm install --frozen-lockfile

# Prisma client üret
pnpm db:generate

# Veritabanı migration çalıştır
pnpm db:migrate:deploy

# Seed (ilk kurulumda — 12 kategori, varsayılan ayarlar)
pnpm db:seed

# Production build
pnpm build
```

> [!TIP]
> İlk admin kullanıcısı için:
> ```bash
> pnpm create-admin
> ```

---

## Bölüm 7 — Uygulamayı Başlatma

**Plesk Node.js sekmesi → Restart App** butonuna tıklayın.

Plesk, `server.js` dosyasını `node server.js` ile başlatır ve Nginx üzerinden proxyler.

Durum kontrolü:
```
https://your-domain.com/api/health
```
`200 OK` ve `{"status":"ok","db":"ok"}` dönmeli.

---

## Bölüm 8 — SSL (Let's Encrypt)

**Domain → SSL/TLS Certificates → Let's Encrypt**

- Domain ve www subdomain seçin
- **Force HTTPS redirect** etkinleştirin
- Sertifika otomatik yenilenir

> [!NOTE]
> HSTS başlığı zaten `next.config.ts`'de etkin (2 yıl). SSL zorunludur.

---

## Bölüm 9 — Nginx Ek Yapılandırması (Plesk)

**Domain → Apache & Nginx Settings → Additional Nginx directives** alanına:

```nginx
# Next.js statik dosyaları — uzun süreli cache
location /_next/static/ {
    alias /var/www/vhosts/your-domain.com/httpdocs/.next/static/;
    expires 365d;
    add_header Cache-Control "public, immutable";
    access_log off;
}

# Yüklenen medya dosyaları
location /uploads/ {
    alias /var/www/vhosts/your-domain.com/httpdocs/public/uploads/;
    expires 30d;
    add_header Cache-Control "public";
    access_log off;
}

# Favicon ve statik public dosyaları
location = /favicon.ico {
    alias /var/www/vhosts/your-domain.com/httpdocs/public/favicon.ico;
    expires 7d;
    access_log off;
}

# Gzip sıkıştırma
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;
gzip_min_length 1000;
```

> [!IMPORTANT]
> `/var/www/vhosts/your-domain.com/httpdocs` yolunu gerçek domain diziniyle değiştirin.

---

## Bölüm 10 — Medya Depolama

Upload dizini sunucuda kalıcı olmalıdır:

```bash
# Dizini oluştur (yoksa)
mkdir -p /var/www/vhosts/your-domain.com/httpdocs/public/uploads

# Plesk web kullanıcısına yazma izni ver (psacln veya www-data)
chmod 755 /var/www/vhosts/your-domain.com/httpdocs/public/uploads
chown -R psacln:psaserv /var/www/vhosts/your-domain.com/httpdocs/public/uploads
```

> [!WARNING]
> Plesk'te web kullanıcısı genellikle `psacln` kullanıcısı ve `psaserv` grubudur.  
> `ls -la /var/www/vhosts/your-domain.com/httpdocs/` ile doğrulayın.

---

## Bölüm 11 — Veritabanı Yedekleme

### Manuel Yedek

```bash
cd /var/www/vhosts/your-domain.com/httpdocs
pnpm db:backup
# Yedek: backups/backup-YYYY-MM-DDTHH-MM-SS.sql
```

### Otomatik Yedek (Plesk Scheduled Tasks)

**Plesk Panel → Scheduled Tasks (Cron Jobs) → Add Task**

```bash
# Her gün saat 02:00
0 2 * * *   cd /var/www/vhosts/your-domain.com/httpdocs && pnpm db:backup >> /var/log/yapi-backup.log 2>&1
```

> [!TIP]
> Plesk'in kendi veritabanı yedekleme aracı da kullanılabilir:  
> **Databases → Backup Manager**

---

## Bölüm 12 — Güncelleme ve Deploy

```bash
cd /var/www/vhosts/your-domain.com/httpdocs

# 1. Yedek al
pnpm db:backup

# 2. Kodu çek
git pull origin main

# 3. Bağımlılıkları güncelle
pnpm install --frozen-lockfile

# 4. Migration uygula
pnpm db:migrate:deploy

# 5. Yeniden build
pnpm build

# 6. Uygulamayı yeniden başlat (Plesk Panel veya)
# Plesk → Node.js → Restart App
```

---

## Bölüm 13 — Rollback

```bash
cd /var/www/vhosts/your-domain.com/httpdocs

# Önceki commit'e dön
git log --oneline -10
git checkout <ONCEKI_COMMIT_HASH>

# Yeniden build
pnpm build

# Restart
# Plesk → Node.js → Restart App
```

Veritabanı rollback (gerekiyorsa):
```bash
# DB'yi sil ve yedeği geri yükle
dropdb -h localhost -U yapi_user yapi_platform
createdb -h localhost -U yapi_user yapi_platform
psql -h localhost -U yapi_user yapi_platform < backups/backup-TARIH.sql
```

---

## Bölüm 14 — Sorun Giderme

### Uygulama başlamıyor

```bash
# Node.js loglarını kontrol et
# Plesk Panel → Node.js → View Logs

# Veya SSH ile:
tail -f /var/log/plesk/ext-ng.log
```

### Veritabanı bağlantı hatası

```bash
# .env.local DATABASE_URL'yi kontrol et
psql postgresql://yapi_user:PAROLA@localhost:5432/yapi_platform -c "SELECT 1;"
```

### Build hatası

```bash
# Prisma client yenile
pnpm db:generate
pnpm build
```

### 502 Bad Gateway

Uygulama henüz başlamamış olabilir. Plesk → Node.js → **Restart App** deneyin.  
Logları kontrol edin.

### Medya dosyaları görünmüyor

`public/uploads/` dizin izinlerini kontrol edin:
```bash
ls -la public/uploads/
# psacln kullanıcısına ait olmalı
```

---

## Bölüm 15 — Hızlı Başvuru

| Görev | Komut / Yer |
|-------|-------------|
| Uygulamayı başlat/yeniden başlat | Plesk → Node.js → Restart App |
| Health check | `https://domain.com/api/health` |
| Admin paneli | `https://domain.com/admin` |
| Yedek al | `pnpm db:backup` |
| İlk admin oluştur | `pnpm create-admin` |
| Logları izle | Plesk → Node.js → View Logs |
| SSL yenile | Plesk → Let's Encrypt → Renew |
| Env değişkenleri | Plesk → Node.js → Environment Variables |
