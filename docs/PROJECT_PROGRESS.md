# PROJECT_PROGRESS.md

## Genel durum

- **Proje:** Kurumsal Yapı, İnşaat ve Uygulama Web Platformu
- **Son güncelleme:** 2026-11-13T12:19:00+03:00
- **Aktif faz:** Faz 0 — Başlangıç ve keşif ✅ TAMAMLANDI
- **Son tamamlanan görev:** Faz 0 keşif, ortam incelemesi, karar günlüğü oluşturma, rapor sunumu
- **Devam eden görev:** Kullanıcı onayı bekleniyor (Faz 1'e geçiş için)
- **Sıradaki tek adım:** Kullanıcı onayı sonrası Faz 1 — Proje iskeleti ve geliştirme altyapısı

## Tamamlanan fazlar

- **Faz 0** — Başlangıç ve keşif (2026-11-13)
  - Mevcut çalışma dizini incelendi (temiz, yalnızca 4 doküman dosyası)
  - Node.js v24.15.0, npm v11.12.1, pnpm v12.18.0 tespit edildi
  - PostgreSQL kurulu olmadığı tespit edildi
  - Git reposu yok, package.json yok, node_modules yok
  - docs/ klasörü oluşturuldu, dokümanlar kopyalandı
  - DECISIONS.md oluşturuldu (6 karar kaydedildi)
  - PROJECT_CHECKLIST.md güncellendi
  - Keşif raporu kullanıcıya sunuldu

## Ortam bilgileri

| Bileşen      | Durum                    |
|-------------|--------------------------|
| Node.js     | v24.15.0 ✅              |
| npm         | v11.12.1 ✅              |
| pnpm        | v12.18.0 ✅              |
| npx         | v11.12.1 ✅              |
| yarn        | Kurulu değil ❌          |
| PostgreSQL  | Kurulu değil ⚠️          |
| Git repo    | Yok (Faz 1'de init)     |
| package.json| Yok (Faz 1'de oluşturulacak) |

## Test sonuçları

- Henüz uygulama kurulmadı; test çalıştırılmadı.

## Açık riskler / kararlar

### ⚠️ Kullanıcı kararı gereken konular

1. **PostgreSQL kurulumu:** Bu makinede PostgreSQL kurulu değil. Seçenekler:
   - a) Yerel PostgreSQL kurulumu
   - b) Docker ile PostgreSQL container
   - c) Uzak PostgreSQL sunucusu
   - → Faz 2'den önce çözülmeli.

2. **Doküman konumu:** Dokümanlar hem kök dizinde hem docs/ içinde. Tek konuma mı taşınsın?

3. **Hosting/deploy hedefi:** Specification'da henüz kesinleşmemiş. VPS/Plesk, Vercel, Railway vb. seçenekler var. Faz 14'te gerekli ama erken planlama faydalı.

4. **Domain / marka adı:** Henüz belirlenmedi. Admin panelinden değiştirilebilir olacak.

### ⚠️ Teknik riskler

- **PowerShell Execution Policy:** PowerShell'de script çalıştırma devre dışı. npm/pnpm komutları `cmd /c` ile çalıştırılabiliyor. Geliştirme sırasında bu kısıtlama sorun yaratabilir. `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser` komutu bu sorunu çözer.
- **KVKK metinleri:** Hukuki inceleme gerektirir, yayına çıkmadan önce tamamlanmalı.
- **Gerçek içerik:** Logo, firmaya ait fotoğraflar, müşteri yorumları ve iletişim bilgileri kullanıcıdan gelmelidir.
- **Auth kütüphanesi seçimi:** Faz 3'te değerlendirilecek. next-auth (Auth.js) vs. Lucia vs. özel çözüm kararı verilecek.

## Son değiştirilen önemli dosyalar

| Dosya | İşlem | Tarih |
|-------|-------|-------|
| docs/DECISIONS.md | Oluşturuldu | 2026-11-13 |
| PROJECT_CHECKLIST.md | Faz 0 görevleri güncellendi | 2026-11-13 |
| PROJECT_PROGRESS.md | İlk kapsamlı güncelleme | 2026-11-13 |
| docs/ klasörü | Oluşturuldu, dokümanlar kopyalandı | 2026-11-13 |

## Sonraki oturum kuralı

Önce bu dosyayı, `PROJECT_CHECKLIST.md`, `PROJECT_SPECIFICATION.md` ve `docs/DECISIONS.md` dosyalarını oku. Checklist'te tamamlandı görünmeyen hiçbir işi yapılmış varsayma.
