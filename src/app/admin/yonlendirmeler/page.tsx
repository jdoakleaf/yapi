
import { getRedirects } from "./redirect-actions";
import { RedirectManager } from "./redirect-manager";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yönlendirmeler | Admin",
  description: "URL yönlendirmelerini yönetin (301/302 redirect)",
};

export default async function YonlendirmelerPage() {
  const redirects = await getRedirects();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">URL Yönlendirmeleri</h1>
        <p className="mt-1 text-sm text-gray-500">
          Eski URL&apos;lerden yeni sayfalara otomatik yönlendirme kuralları tanımlayın (301/302).
        </p>
      </div>
      <RedirectManager redirects={redirects} />
    </div>
  );
}
