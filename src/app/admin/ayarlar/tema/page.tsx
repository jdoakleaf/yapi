
import { getThemeTokens } from "@/lib/settings/theme-actions";
import { ThemeSettingsForm } from "./form";
import { Breadcrumb } from "@/components/admin/breadcrumb";

export const metadata = {
  title: "Tema ve Renkler",
};

export default async function ThemeSettingsPage() {
  const tokens = await getThemeTokens();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <Breadcrumb items={[{ label: "Ayarlar" }, { label: "Tema ve Renkler" }]} />
        <h1 className="mt-3 text-2xl font-bold text-[var(--text-primary)]">
          Tema ve Renkler
        </h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Renk token&apos;larını düzenleyin. Değişiklikler tüm siteye yansır.
          WCAG AA kontrast uyarıları size bildirilir.
        </p>
      </div>

      <ThemeSettingsForm initialTokens={tokens} />
    </div>
  );
}
