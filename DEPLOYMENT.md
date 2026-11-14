# Yapı Platform — Deployment Rehberi

> **Versiyon:** 0.1.0 — Faz 14  
> **Stack:** Next.js 16.4.6 (App Router) + TypeScript + PostgreSQL 17 + Prisma 5.22

---

## 1. Sistem Gereksinimleri

| Bileşen | Minimum | Önerilen |
|---------|---------|----------|
| Node.js | v20 LTS | v22+ LTS |
| RAM | 512 MB | 2 GB |
| Disk | 10 GB | 50 GB |
| CPU | 1 vCPU | 2 vCPU |
| OS | Ubuntu 22.04 | Ubuntu 24.04 |
| PostgreSQL | 15 | 17 |

---

## 2. Sunucu Hazırlığı

```bash
# Node.js kurulumu (nvm ile)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.bashrc
nvm install 22
nvm use 22

# pnpm kurulumu
npm install -g pnpm@12

# PostgreSQL 17 kurulumu (Ubuntu)
sudo apt install -y postgresql-17
sudo systemctl enable --now postgresql

# Uygulama dizini
sudo mkdir -p /var/www/yapi-platform
sudo chown $USER:$USER /var/www/yapi-platform
```

---

## 3. Veritabanı Kurulumu

```bash
# PostgreSQL kullanıcı ve DB oluştur
sudo -u postgres psql <<EOF
CREATE USER yapi_user WITH PASSWORD 'GUCLU_PAROLA_GIRINIZ';
CREATE DATABASE yapi_platform OWNER yapi_user;
GRANT ALL PRIVILEGES ON DATABASE yapi_platform TO yapi_user;
\q
EOF

# Bağlantıyı test et
psql postgresql://yapi_user:PAROLA@localhost:5432/yapi_platform -c "SELECT version();"
```

---

## 4. Uygulama Kurulumu

```bash
# Repo kopyalama
git clone https://github.com/kullanici/yapi-platform.git /var/www/yapi-platform
cd /var/www/yapi-platform

# Bağımlılıklar
pnpm install --frozen-lockfile

# Ortam değişkenleri
cp .env.example .env.local
nano .env.local   # Değerleri doldurun

# DB migration
pnpm db:migrate:deploy

# DB seed (ilk kurulumda)
pnpm db:seed

# Admin kullanıcısı oluştur
pnpm create-admin

# Production build
pnpm build
```

---

## 5. Ortam Değişkenleri (Zorunlu)

| Değişken | Açıklama | Örnek |
|----------|----------|-------|
| `DATABASE_URL` | PostgreSQL bağlantı URL'i | `postgresql://user:pass@host:5432/db` |
| `AUTH_SECRET` | NextAuth şifreleme anahtarı (min 32 karakter) | `openssl rand -base64 32` |
| `NEXT_PUBLIC_APP_URL` | Uygulamanın tam URL'i | `https://yapi.example.com` |

**AUTH_SECRET üretimi:**
```bash
openssl rand -base64 32
```

---

## 6. Process Yönetimi (PM2)

```bash
# PM2 kurulumu
npm install -g pm2

# Uygulamayı başlat
pm2 start pnpm --name yapi-platform -- start -- -p 3000

# Sistem yeniden başlatmada otomatik başlat
pm2 save
pm2 startup

# Durum kontrolü
pm2 status
pm2 logs yapi-platform

# Yeniden başlat
pm2 restart yapi-platform

# Güncelleme sonrası sıfırlama
pm2 reload yapi-platform --update-env
```

---

## 7. Nginx Reverse Proxy

```nginx
# /etc/nginx/sites-available/yapi-platform
server {
    listen 80;
    server_name yapi.example.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yapi.example.com;

    ssl_certificate     /etc/letsencrypt/live/yapi.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yapi.example.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:...;

    # Upload boyutu (medya upload için)
    client_max_body_size 15M;

    # Statik dosyalar (Next.js .next/static)
    location /_next/static/ {
        alias /var/www/yapi-platform/.next/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Upload dosyaları
    location /uploads/ {
        alias /var/www/yapi-platform/public/uploads/;
        expires 7d;
        add_header Cache-Control "public";
    }

    # Next.js uygulaması
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# SSL sertifikası (Certbot)
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yapi.example.com

# Nginx aktif et
sudo ln -s /etc/nginx/sites-available/yapi-platform /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 8. Medya Dosyaları

Yerel depolamada upload'lar `public/uploads/` dizininde saklanır.

```bash
# Dizin izinleri
chmod 755 /var/www/yapi-platform/public/uploads

# Nginx (yukarıda tanımlı) uploads'u doğrudan servis eder
```

> **Üretim önerisi:** S3 uyumlu depolama kullanın (MinIO, AWS S3, Cloudflare R2).  
> `STORAGE_PROVIDER=s3` ile S3 adaptörü Faz 15'te etkinleştirilebilir.

---

## 9. Veritabanı Yedekleme

```bash
# Manuel yedek
node scripts/backup-db.mjs

# Cron ile otomatik günlük yedek (her gece 02:00)
crontab -e
# Ekle:
0 2 * * * cd /var/www/yapi-platform && node scripts/backup-db.mjs >> /var/log/yapi-backup.log 2>&1

# Yedek listesi
ls -lh backups/

# Geri yükleme
psql postgresql://yapi_user:PAROLA@localhost:5432/yapi_platform < backups/yapi_platform_2026-11-15_02-00-00.sql
```

---

## 10. Migration Deploy Prosedürü

```bash
# 1. Yeni kodu çek
cd /var/www/yapi-platform
git pull origin main

# 2. Bağımlılıkları güncelle
pnpm install --frozen-lockfile

# 3. DB yedek al (güvenlik)
node scripts/backup-db.mjs

# 4. Migration uygula
pnpm db:migrate:deploy

# 5. Build
pnpm build

# 6. Yeniden başlat
pm2 reload yapi-platform --update-env

# 7. Sağlık kontrolü
curl https://yapi.example.com/api/health
```

---

## 11. Rollback Prosedürü

```bash
# 1. Önceki commit'e dön
git log --oneline -10
git checkout <ONCEKI_COMMIT_HASH>

# 2. Build
pnpm install --frozen-lockfile
pnpm build

# 3. DB rollback (gerekirse — dikkatli: veri kaybı riski)
# psql postgresql://yapi_user:PAROLA@localhost:5432/yapi_platform < backups/ONCEKI_YEDEK.sql

# 4. Yeniden başlat
pm2 reload yapi-platform --update-env
```

---

## 12. Sağlık Kontrolü ve İzleme

```bash
# Anlık sağlık kontrolü
curl https://yapi.example.com/api/health | jq

# PM2 izleme
pm2 monit

# Nginx erişim logu
tail -f /var/log/nginx/access.log

# Uygulama logu
pm2 logs yapi-platform --lines 100
```

**Health endpoint çıktısı:**
```json
{
  "status": "healthy",
  "timestamp": "2026-11-15T02:00:00.000Z",
  "uptime": 3600,
  "checks": {
    "database": { "status": "ok", "latencyMs": 5 },
    "environment": { "status": "ok" }
  },
  "version": "0.1.0"
}
```

---

## 13. Bilinen Sınırlar ve Gelecek İyileştirmeler

| Konu | Durum | Çözüm |
|------|-------|-------|
| Rate limiting | In-memory Map | Redis + Upstash (Faz 15) |
| E-posta bildirimleri | SMTP config var, gönderim yok | Nodemailer entegrasyonu (Faz 15) |
| S3 medya depolama | Adaptör hazır, implemente yok | AWS S3 / MinIO (Faz 15) |
| Playwright E2E | Browser indirilemedi | CI ortamında çalışacak |
| middleware.ts uyarısı | Next.js 16 deprecated | proxy.ts migrasyonu (Next.js 17) |

---

## 14. Güvenlik Kontrol Listesi

- [x] HTTPS zorunlu (Nginx redirect 80→443)
- [x] HSTS başlığı (63072000s, includeSubDomains, preload)
- [x] X-Frame-Options: SAMEORIGIN
- [x] X-Content-Type-Options: nosniff
- [x] Content-Security-Policy
- [x] Admin route auth koruması (NextAuth middleware)
- [x] Parola: scrypt, timing-safe karşılaştırma
- [x] Upload MIME allowlist + boyut limiti
- [x] Prisma parametreli sorgular (SQL injection koruması)
- [x] Zod input doğrulaması (server action'larda)
- [ ] Redis rate limiting (in-memory Map ile başlayın)
- [ ] WAF (Cloudflare veya AWS WAF — opsiyonel)
