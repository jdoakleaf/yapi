/**
 * Yapı Platform — Prisma Seed
 *
 * İDEMPOTENT: Bu dosya birden fazla kez çalıştırılabilir.
 * Mevcut kayıtları silmez, upsert ile çoğalmayı önler.
 *
 * Seed içerikleri:
 *  1. Roller ve temel izinler
 *  2. 12 hizmet kategorisi
 *  3. Varsayılan site ayarları
 *  4. Varsayılan tema token'ları
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seed başlıyor...");

  // -------------------------------------------------------------------------
  // 1. ROLLER
  // -------------------------------------------------------------------------
  const roles = [
    { key: "super_admin", name: "Süper Admin", description: "Tüm sisteme tam erişim" },
    { key: "admin", name: "Admin", description: "Yönetim paneli tam erişimi" },
    { key: "editor", name: "Editör", description: "İçerik yönetimi" },
    { key: "sales", name: "Satış / Teklif Sorumlusu", description: "Teklif talepleri yönetimi" },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { key: role.key },
      update: { name: role.name, description: role.description },
      create: role,
    });
  }
  console.log(`✅ ${roles.length} rol oluşturuldu/güncellendi.`);

  // -------------------------------------------------------------------------
  // 2. İZİNLER
  // -------------------------------------------------------------------------
  const permissions = [
    { key: "services.read", description: "Hizmetleri görüntüleme" },
    { key: "services.create", description: "Hizmet oluşturma" },
    { key: "services.update", description: "Hizmet düzenleme" },
    { key: "services.delete", description: "Hizmet silme" },
    { key: "projects.read", description: "Projeleri görüntüleme" },
    { key: "projects.create", description: "Proje oluşturma" },
    { key: "projects.update", description: "Proje düzenleme" },
    { key: "projects.delete", description: "Proje silme" },
    { key: "leads.read", description: "Teklif taleplerini görüntüleme" },
    { key: "leads.update", description: "Teklif taleplerini güncelleme" },
    { key: "media.manage", description: "Medya yönetimi" },
    { key: "blog.manage", description: "Blog yönetimi" },
    { key: "settings.manage", description: "Site ayarları yönetimi" },
    { key: "users.manage", description: "Kullanıcı yönetimi" },
    { key: "audit.read", description: "Denetim kayıtlarını görüntüleme" },
  ];

  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: { key: perm.key },
      update: { description: perm.description },
      create: perm,
    });
  }
  console.log(`✅ ${permissions.length} izin oluşturuldu/güncellendi.`);

  // -------------------------------------------------------------------------
  // 3. 12 HİZMET KATEGORİSİ
  // -------------------------------------------------------------------------
  const serviceCategories = [
    {
      name: "Yapı ve İnşaat Uygulamaları",
      slug: "yapi-ve-insaat-uygulamalari",
      description:
        "Kaba ve ince inşaat, temel, betonarme, kalıp ve duvar işleri, anahtar teslim yapı uygulamaları, konut, villa, ticari ve endüstriyel yapılar, tadilat ve yenileme.",
      sortOrder: 1,
    },
    {
      name: "Demir ve Betonarme Donatı İşleri",
      slug: "demir-ve-betonarme-donati-isleri",
      description:
        "Demir kesim, büküm ve bağlama, kolon, kiriş ve perde donatıları, temel, döşeme ve radye temel donatıları, betonarme merdiven donatısı, şantiye demir ekip hizmeti.",
      sortOrder: 2,
    },
    {
      name: "Çelik Konstrüksiyon ve Metal Yapılar",
      slug: "celik-konstruksiyon-ve-metal-yapilar",
      description:
        "Çelik hangar, depo, fabrika ve atölye, sundurma ve otopark sistemleri, çelik çatı, platform ve merdiven, metal doğrama ve kaynak uygulamaları.",
      sortOrder: 3,
    },
    {
      name: "Çatı Sistemleri",
      slug: "cati-sistemleri",
      description:
        "Ahşap ve çelik çatı sistemleri, kiremit, sandviç panel, trapez sac ve shingle, çatı iskeleti, yenileme ve teras kapatma, dere ve yağmur suyu tahliye sistemleri, çatı yalıtımı.",
      sortOrder: 4,
    },
    {
      name: "Tiny House, Prefabrik ve Modüler Yapılar",
      slug: "tiny-house-prefabrik-ve-moduler-yapilar",
      description:
        "Tekerlekli ve sabit Tiny House, anahtar teslim Tiny House, prefabrik ev ve modüler yapılar, ahşap ev ve bungalov, bağ/hobi evi ve konteyner düzenleme, modüler ofis ve iç mekân uygulamaları.",
      sortOrder: 5,
    },
    {
      name: "Su, Isı ve Ses Yalıtım Sistemleri",
      slug: "su-isi-ve-ses-yalitim-sistemleri",
      description:
        "Temel ve perde su yalıtımı, teras, balkon, çatı, banyo ve ıslak hacim yalıtımı, bodrum yalıtımı, membran ve sürme esaslı uygulamalar, ısı yalıtımı ve mantolama, ses/akustik yalıtım, nem ve sızıntı onarımı.",
      sortOrder: 6,
    },
    {
      name: "Havuz Yapımı ve İzolasyonu",
      slug: "havuz-yapimi-ve-izolasyonu",
      description:
        "Betonarme havuz yapımı, havuz kaba inşaatı, havuz su yalıtımı, seramik ve mozaik kaplama, çevre zemin düzenlemesi, havuz yenileme ve sızdırmazlık.",
      sortOrder: 7,
    },
    {
      name: "İç Mekân Dekorasyon ve Tadilat",
      slug: "ic-mekan-dekorasyon-ve-tadilat",
      description:
        "Ev ve villa yenileme, anahtar teslim tadilat, mutfak ve banyo yenileme, alçı, saten ve alçıpan, asma tavan ve boya, seramik/fayans ve zemin kaplamaları, laminat, epoksi zemin, kapı, panel, ofis ve mağaza uygulamaları.",
      sortOrder: 8,
    },
    {
      name: "Dış Cephe ve Cephe Kaplama",
      slug: "dis-cephe-ve-cephe-kaplama",
      description:
        "Dış cephe yenileme, mantolama, kompozit ve dekoratif cephe, ahşap görünümlü ve taş kaplama, söve ve dış cephe boya, cephe yalıtımı.",
      sortOrder: 9,
    },
    {
      name: "Ahşap Yapı ve Dış Mekân",
      slug: "ahsap-yapi-ve-dis-mekan",
      description:
        "Pergola, veranda ve teras, kamelya ve çardak, ahşap bungalov ve ahşap çatı, deck ve bahçe oturma alanı, ahşap dekorasyon.",
      sortOrder: 10,
    },
    {
      name: "Restorasyon, Güçlendirme ve Yapısal Onarım",
      slug: "restorasyon-guclendirme-ve-yapisal-onarim",
      description:
        "Restorasyon, beton tamiri ve yüzey hasarı onarımı, betonarme eleman onarımı, yapısal ve çelik güçlendirme, çatı yenileme, su/nem hasarı onarımı, bakım ve yenileme.",
      sortOrder: 11,
    },
    {
      name: "Çevre Düzenleme ve Peyzaj",
      slug: "cevre-duzenleme-ve-peyzaj",
      description:
        "Bahçe ve peyzaj düzenlemesi, bahçe ve istinat duvarı, yürüyüş yolu, açık alan zemin uygulamaları, otopark ve araç alanı, sundurma ve gölgelik, teras/veranda, taş ve parke uygulamaları.",
      sortOrder: 12,
    },
  ];

  for (const cat of serviceCategories) {
    await prisma.serviceCategory.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        sortOrder: cat.sortOrder,
      },
      create: {
        ...cat,
        isActive: true,
      },
    });
  }
  console.log(`✅ ${serviceCategories.length} hizmet kategorisi oluşturuldu/güncellendi.`);

  // -------------------------------------------------------------------------
  // 4. VARSAYILAN MENÜLER
  // -------------------------------------------------------------------------
  const menus = [
    { key: "main_nav", name: "Ana Navigasyon" },
    { key: "footer_nav", name: "Footer Navigasyon" },
  ];

  for (const menu of menus) {
    await prisma.menu.upsert({
      where: { key: menu.key },
      update: { name: menu.name },
      create: { ...menu, isActive: true },
    });
  }
  console.log(`✅ ${menus.length} menü oluşturuldu/güncellendi.`);

  // -------------------------------------------------------------------------
  // 5. VARSAYILAN TEMA AYARLARI
  // -------------------------------------------------------------------------
  await prisma.themeSetting.upsert({
    where: { themeKey: "default" },
    update: {},
    create: {
      themeKey: "default",
      tokensJson: {
        brand_navy: "#101F33",
        brand_primary: "#1769AA",
        brand_accent: "#2589D8",
        brand_soft: "#DCEEFF",
        surface: "#FFFFFF",
        surface_muted: "#F4F8FC",
        text_primary: "#182433",
        text_muted: "#657386",
        border: "#E2E8F0",
      },
      typographyJson: {
        fontFamily: "system-ui, -apple-system, sans-serif",
        headingWeight: "700",
        bodyWeight: "400",
      },
    },
  });
  console.log("✅ Varsayılan tema ayarları oluşturuldu/güncellendi.");

  // -------------------------------------------------------------------------
  // 6. VARSAYILAN SİTE AYARLARI
  // -------------------------------------------------------------------------
  const siteSettings = [
    { key: "site_name", valueJson: "Yapı Platform" },
    { key: "site_tagline", valueJson: "Yapı, İnşaat ve Uygulama Hizmetleri" },
    { key: "contact_phone", valueJson: "" },
    { key: "contact_email", valueJson: "" },
    { key: "contact_address", valueJson: "" },
    { key: "social_instagram", valueJson: "" },
    { key: "social_facebook", valueJson: "" },
    { key: "social_youtube", valueJson: "" },
    { key: "whatsapp_number", valueJson: "" },
    { key: "announcement_bar_enabled", valueJson: false },
    { key: "announcement_bar_text", valueJson: "" },
  ];

  for (const setting of siteSettings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }
  console.log(`✅ ${siteSettings.length} site ayarı oluşturuldu/güncellendi.`);

  console.log("\n🎉 Seed tamamlandı!");
  console.log(
    "\n⚠️  NOT: İlk admin kullanıcısını oluşturmak için güvenli CLI komutu kullanın."
  );
  console.log("   Seed dosyası asla admin parolası içermez.");
}

main()
  .catch((e) => {
    console.error("❌ Seed hatası:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
