"use client";

import { useState, useTransition } from "react";
import {
  saveThemeTokens,
  resetThemeToDefault,
} from "@/lib/settings/theme-actions";
import {
  generateCssVariables,
  DEFAULT_THEME,
  type ThemeTokens,
} from "@/lib/settings/theme-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { Save, RotateCcw, Eye, AlertTriangle, Check } from "lucide-react";

interface ThemeSettingsFormProps {
  initialTokens: ThemeTokens;
}

const TOKEN_META: Record<
  keyof ThemeTokens,
  { label: string; description: string; preview?: boolean }
> = {
  brand_navy: {
    label: "Koyu Lacivert (brand_navy)",
    description: "Koyu alanlar, header, footer, sidebar arka planı",
    preview: true,
  },
  brand_primary: {
    label: "Ana Marka Mavisi (brand_primary)",
    description: "Birincil butonlar, aktif bağlantılar",
    preview: true,
  },
  brand_accent: {
    label: "Vurgu Mavisi (brand_accent)",
    description: "Hover durumları, ikincil vurgular",
    preview: true,
  },
  brand_soft: {
    label: "Açık Mavi Yüzey (brand_soft)",
    description: "Açık mavi arka planlar, etiket yüzeyleri",
    preview: true,
  },
  surface: {
    label: "Yüzey Rengi (surface)",
    description: "Kartlar ve ana içerik alanı arka planı",
    preview: true,
  },
  surface_muted: {
    label: "Hafif Yüzey (surface_muted)",
    description: "Açık bölüm arka planları",
    preview: true,
  },
  text_primary: {
    label: "Ana Metin (text_primary)",
    description: "Başlıklar ve temel metin",
    preview: true,
  },
  text_muted: {
    label: "İkincil Metin (text_muted)",
    description: "Açıklamalar, etiketler, placeholder'lar",
    preview: true,
  },
  border: {
    label: "Kenarlık (border)",
    description: "Kart, input ve bölüm kenarlıkları",
    preview: true,
  },
};

function isValidHex(hex: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(hex);
}

export function ThemeSettingsForm({ initialTokens }: ThemeSettingsFormProps) {
  const [tokens, setTokens] = useState<ThemeTokens>(initialTokens);
  const [previewMode, setPreviewMode] = useState(false);
  const [contrastWarnings, setContrastWarnings] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  const handleChange = (key: keyof ThemeTokens, value: string) => {
    setTokens((prev) => ({ ...prev, [key]: value }));
  };

  const handleColorPickerChange = (key: keyof ThemeTokens, hexValue: string) => {
    setTokens((prev) => ({ ...prev, [key]: hexValue }));
  };

  const handleSave = () => {
    startTransition(async () => {
      const result = await saveThemeTokens(tokens);
      if (result.success) {
        setContrastWarnings(result.contrastWarnings ?? []);
        if ((result.contrastWarnings?.length ?? 0) > 0) {
          toast({
            title: "Kaydedildi (uyarı ile)",
            description: `${result.contrastWarnings!.length} kontrast uyarısı var. Erişilebilirliği gözden geçirin.`,
            variant: "default",
          });
        } else {
          toast({
            title: "Tema kaydedildi",
            description: "Renk token'ları başarıyla güncellendi.",
          });
        }
      } else if (result.errors) {
        toast({
          title: "Doğrulama hatası",
          description: "Bazı renk değerleri geçersiz. HEX formatı (#RRGGBB) kullanın.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Hata",
          description: result.error ?? "Tema kaydedilemedi.",
          variant: "destructive",
        });
      }
    });
  };

  const handleReset = () => {
    if (!confirm("Tema varsayılan değerlere döndürülecek. Emin misiniz?")) return;
    startTransition(async () => {
      const result = await resetThemeToDefault();
      if (result.success) {
        setTokens(DEFAULT_THEME);
        setContrastWarnings([]);
        toast({ title: "Tema sıfırlandı", description: "Varsayılan mavi palet geri yüklendi." });
      } else {
        toast({ title: "Hata", description: "Tema sıfırlanamadı.", variant: "destructive" });
      }
    });
  };

  const cssVars = generateCssVariables(tokens);

  return (
    <div className="space-y-6">
      {/* Kontrast uyarıları */}
      {contrastWarnings.length > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-800">
                  WCAG AA Kontrast Uyarıları
                </p>
                <ul className="mt-2 space-y-1">
                  {contrastWarnings.map((w, i) => (
                    <li key={i} className="text-sm text-amber-700">
                      • {w}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Renk token'ları */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Renk Token&apos;ları</CardTitle>
          <p className="text-sm text-[var(--text-muted)]">
            Her token için renk seçici veya HEX kodu girebilirsiniz (#RRGGBB formatı).
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {(Object.keys(TOKEN_META) as Array<keyof ThemeTokens>).map((key) => {
              const meta = TOKEN_META[key];
              const value = tokens[key];
              const valid = isValidHex(value);

              return (
                <div key={key} className="space-y-2">
                  <Label htmlFor={key} className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                    {meta.label}
                  </Label>
                  <div className="flex items-center gap-2">
                    {/* Renk seçici */}
                    <div className="relative">
                      <input
                        type="color"
                        value={valid ? value : "#000000"}
                        onChange={(e) => handleColorPickerChange(key, e.target.value.toUpperCase())}
                        className="h-9 w-9 cursor-pointer rounded-md border border-[var(--border)] bg-transparent p-0.5"
                        title={`${meta.label} renk seçici`}
                      />
                    </div>
                    {/* HEX input */}
                    <Input
                      id={key}
                      value={value}
                      onChange={(e) => handleChange(key, e.target.value.toUpperCase())}
                      placeholder="#000000"
                      maxLength={7}
                      className={`font-mono text-sm ${!valid && value !== "" ? "border-red-400 focus-visible:ring-red-400" : ""}`}
                      disabled={isPending}
                    />
                    {valid && (
                      <div
                        className="h-9 w-9 shrink-0 rounded-md border border-[var(--border)]"
                        style={{ backgroundColor: value }}
                        title={`Önizleme: ${value}`}
                      />
                    )}
                  </div>
                  <p className="text-xs text-[var(--text-muted)]">{meta.description}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Canlı önizleme */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Canlı Önizleme</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPreviewMode(!previewMode)}
              className="gap-2"
            >
              <Eye className="h-4 w-4" />
              {previewMode ? "Gizle" : "Göster"}
            </Button>
          </div>
        </CardHeader>
        {previewMode && (
          <CardContent>
            <div
              className="rounded-lg border p-4 space-y-3"
              style={{
                backgroundColor: tokens.surface,
                borderColor: tokens.border,
              }}
            >
              <div
                className="rounded-t-md px-4 py-2 text-sm font-semibold text-white"
                style={{ backgroundColor: tokens.brand_navy }}
              >
                Header Önizleme
              </div>
              <div className="flex gap-2 flex-wrap">
                <button
                  className="rounded-md px-4 py-2 text-sm font-medium text-white"
                  style={{ backgroundColor: tokens.brand_primary }}
                >
                  Birincil Buton
                </button>
                <button
                  className="rounded-md px-4 py-2 text-sm font-medium text-white"
                  style={{ backgroundColor: tokens.brand_accent }}
                >
                  Vurgu Buton
                </button>
                <div
                  className="rounded-md px-4 py-2 text-sm font-medium"
                  style={{ backgroundColor: tokens.brand_soft, color: tokens.brand_primary }}
                >
                  Soft Badge
                </div>
              </div>
              <div
                className="rounded-md p-3"
                style={{ backgroundColor: tokens.surface_muted }}
              >
                <p style={{ color: tokens.text_primary }} className="text-sm font-medium">
                  Ana metin örneği — başlık
                </p>
                <p style={{ color: tokens.text_muted }} className="text-sm mt-1">
                  İkincil metin ve açıklama satırı buraya gelir.
                </p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* CSS Variables çıktısı */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">CSS Variables Çıktısı</CardTitle>
          <p className="text-sm text-[var(--text-muted)]">
            Kaydettiğinizde bu değerler globals.css&apos;e uygulanır.
          </p>
        </CardHeader>
        <CardContent>
          <pre className="rounded-md bg-[var(--surface-muted)] border border-[var(--border)] p-4 text-xs font-mono overflow-x-auto text-[var(--text-primary)]">
            {cssVars}
          </pre>
        </CardContent>
      </Card>

      <Separator />

      {/* Eylemler */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          disabled={isPending}
          className="gap-2 text-[var(--text-muted)]"
        >
          <RotateCcw className="h-4 w-4" />
          Varsayılana Döndür
        </Button>

        <div className="flex items-center gap-3">
          {!isPending && contrastWarnings.length === 0 && (
            <span className="flex items-center gap-1 text-sm text-green-600">
              <Check className="h-4 w-4" />
              Kontrast geçiyor
            </span>
          )}
          <Button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            {isPending ? "Kaydediliyor..." : "Kaydet"}
          </Button>
        </div>
      </div>
    </div>
  );
}
