# Yapı Platform — Son Kabul Kontrol Listesi (Launch Checklist)

> Yayına almadan önce tüm maddeler işaretlenmeli.

---

## 🔧 Teknik Kontroller

### Temel Altyapı
- [ ] `DATABASE_URL` production PostgreSQL'e işaret ediyor
- [ ] `AUTH_SECRET` min 32 karakter, rastgele, güvenli üretildi
- [ ] `NEXT_PUBLIC_APP_URL` doğru domain ile set edildi
- [ ] `NODE_ENV=production` set edildi
- [ ] `pnpm build` hatasız tamamlandı
- [ ] `pnpm db:migrate:deploy` production DB'de çalıştırıldı
- [ ] `pnpm create-admin` ile ilk admin oluşturuldu

### Güvenlik
- [ ] HTTPS sertifikası aktif (Let's Encrypt / ticari)
- [ ] HTTP → HTTPS yönlendirmesi çalışıyor
- [ ] `GET /api/health` → `{"status":"healthy"}` döndürüyor
- [ ] `/admin` yetkisiz erişimde `/admin/login`'e yönlendiriyor
- [ ] Admin parolası güçlü (12+ karakter, özel karakter)
- [ ] `.env.local` Git'e commit edilmedi (`git status` kontrol)
- [ ] Güvenlik başlıkları aktif (`curl -I https://domain.com | grep -i "x-frame"`)

### Performans
- [ ] Production build `.next/` dizini oluştu
- [ ] Statik dosyalar Nginx'ten servis ediliyor
- [ ] `public/uploads/` dizini yazılabilir

---

## 🌐 Public Site Kontrolleri

### Sayfalar
- [ ] Ana sayfa (`/`) yükleniyor
- [ ] Hizmetler listesi (`/hizmetler`) yükleniyor
- [ ] En az 1 hizmet detay sayfası (`/hizmetler/[slug]`) yükleniyor
- [ ] Projeler listesi (`/projeler`) yükleniyor
- [ ] Blog listesi (`/blog`) yükleniyor
- [ ] Teklif al formu (`/teklif-al`) yükleniyor ve çalışıyor
- [ ] 404 sayfası doğru görünüyor

### SEO
- [ ] `GET /sitemap.xml` → XML döndürüyor
- [ ] `GET /robots.txt` → `/admin/` disallow içeriyor
- [ ] Ana sayfa `<title>` doğru site adını içeriyor
- [ ] JSON-LD schema `<script type="application/ld+json">` mevcut (Developer Tools)

### Form
- [ ] Teklif formu gönderimi: lead DB'ye kaydediliyor
- [ ] Zorunlu alan validasyonu çalışıyor (e-posta, telefon)
- [ ] KVKK onayı olmadan form gönderilemediği doğrulandı

---

## 🔐 Admin Panel Kontrolleri

### Auth
- [ ] `/admin/login` ile giriş yapılıyor
- [ ] Yanlış parola reddediliyor
- [ ] Çıkış yapılabiliyor

### CRUD
- [ ] Hizmet oluştur / düzenle / sil çalışıyor
- [ ] Proje oluştur / düzenle / sil çalışıyor
- [ ] Blog yazısı oluştur / düzenle / sil çalışıyor
- [ ] Lead/talep listesi görüntüleniyor
- [ ] Medya upload çalışıyor (JPG/PNG/PDF)

---

## 📋 Operasyonel Kontroller

- [ ] PM2 ile uygulama çalışıyor (`pm2 status`)
- [ ] Sunucu yeniden başlatma sonrası PM2 otomatik başlıyor (`pm2 startup`)
- [ ] Yedek scripti test edildi (`node scripts/backup-db.mjs`)
- [ ] Cron job kuruldu (günlük yedek)
- [ ] Log dizini oluşturuldu ve yazılabilir

---

## 📱 Responsive Kontrol

- [ ] Ana sayfa — mobil (375px) düzgün görünüyor
- [ ] Admin panel — tablet (768px) düzgün görünüyor
- [ ] Hizmet detay — desktop (1280px) düzgün görünüyor

---

## 🚀 Yayın Sonrası

- [ ] Google Search Console'a site eklendi
- [ ] Sitemap Google'a gönderildi
- [ ] Uptime monitörü kuruldu (UptimeRobot, BetterStack vb.)
- [ ] İlk yedek alındı ve test edildi

---

**Son kontrol tarihi:** ___________  
**Kontrol eden:** ___________  
**Yayın tarihi:** ___________
