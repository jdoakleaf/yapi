"use client";

import { useState, useTransition } from "react";
import { updateSiteSettings } from "@/lib/settings/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

interface SiteSettingsFormProps {
  initialSettings: Record<string, string>;
}

const SETTING_GROUPS = [
  {
    title: "Site Kimliği",
    description: "Sitenin temel bilgileri.",
    fields: [
      { key: "site_name", label: "Site Adı", type: "text", placeholder: "Firma adınız" },
      { key: "site_tagline", label: "Slogan", type: "text", placeholder: "Kısa bir slogan" },
      { key: "site_description", label: "Site Açıklaması", type: "text", placeholder: "SEO açıklaması" },
    ],
  },
  {
    title: "İletişim Bilgileri",
    description: "Footer ve iletişim sayfasında gösterilir.",
    fields: [
      { key: "contact_phone", label: "Telefon", type: "tel", placeholder: "+90 232 000 0000" },
      { key: "contact_phone_2", label: "İkinci Telefon", type: "tel", placeholder: "+90 232 000 0001" },
      { key: "contact_email", label: "E-posta", type: "email", placeholder: "info@firma.com" },
      { key: "contact_address", label: "Adres", type: "text", placeholder: "Mahalle, Cadde, İlçe / İzmir" },
      { key: "contact_city", label: "Şehir", type: "text", placeholder: "İzmir" },
      { key: "working_hours", label: "Çalışma Saatleri", type: "text", placeholder: "Hft-Cmt 08:00-18:00" },
    ],
  },
  {
    title: "Sosyal Medya",
    description: "Boş bırakılanlar gösterilmez.",
    fields: [
      { key: "social_instagram", label: "Instagram URL", type: "url", placeholder: "https://instagram.com/firma" },
      { key: "social_facebook", label: "Facebook URL", type: "url", placeholder: "https://facebook.com/firma" },
      { key: "social_youtube", label: "YouTube URL", type: "url", placeholder: "https://youtube.com/@firma" },
      { key: "social_linkedin", label: "LinkedIn URL", type: "url", placeholder: "https://linkedin.com/company/firma" },
      { key: "social_whatsapp", label: "WhatsApp Numarası", type: "text", placeholder: "905320000000" },
    ],
  },
  {
    title: "Duyuru Bandı",
    description: "Sitenin en üstünde gösterilen ince bant.",
    fields: [
      { key: "announcement_text", label: "Duyuru Metni", type: "text", placeholder: "Ücretsiz keşif için hemen arayın!" },
      { key: "announcement_link", label: "Duyuru Linki (opsiyonel)", type: "url", placeholder: "/teklif-al" },
      { key: "announcement_active", label: "Duyuru Aktif mi? (true/false)", type: "text", placeholder: "true" },
    ],
  },
];

export function SiteSettingsForm({ initialSettings }: SiteSettingsFormProps) {
  const [values, setValues] = useState<Record<string, string>>(initialSettings);
  const [isPending, startTransition] = useTransition();

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const result = await updateSiteSettings(values);
      if (result.success) {
        toast({
          title: "Ayarlar kaydedildi",
          description: "Site ayarları başarıyla güncellendi.",
          variant: "default",
        });
      } else {
        toast({
          title: "Hata",
          description: result.error ?? "Ayarlar kaydedilemedi.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {SETTING_GROUPS.map((group) => (
        <Card key={group.title}>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">{group.title}</CardTitle>
            {group.description && (
              <p className="text-sm text-[var(--text-muted)]">{group.description}</p>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {group.fields.map((field) => (
              <div key={field.key} className="space-y-1.5">
                <Label htmlFor={field.key}>{field.label}</Label>
                <Input
                  id={field.key}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={values[field.key] ?? ""}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  disabled={isPending}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending} className="gap-2">
          <Save className="h-4 w-4" />
          {isPending ? "Kaydediliyor..." : "Kaydet"}
        </Button>
      </div>
    </form>
  );
}
