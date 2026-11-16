
import { getSiteSettings } from "@/lib/settings/actions";
import { SiteSettingsForm } from "./form";
import { Breadcrumb } from "@/components/admin/breadcrumb";

export const metadata = {
  title: "Site Ayarları",
};

export default async function SiteSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <Breadcrumb items={[{ label: "Ayarlar" }, { label: "Site Ayarları" }]} />
        <h1 className="mt-3 text-2xl font-bold text-[var(--text-primary)]">
          Site Ayarları
        </h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Site adı, iletişim bilgileri, sosyal medya ve duyuru bandı ayarları.
        </p>
      </div>

      <SiteSettingsForm initialSettings={settings} />
    </div>
  );
}
