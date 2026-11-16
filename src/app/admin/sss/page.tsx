import { getFAQs } from "@/lib/cms/content-actions";
import { FAQList } from "./faq-list";


export default async function SSSPage() {
  const { getServices } = await import("@/lib/cms/service-actions");
  const [faqs, servicesResult] = await Promise.all([
    getFAQs(),
    getServices({ pageSize: 200 }),
  ]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Sık Sorulan Sorular</h1>
        <p className="mt-1 text-sm text-gray-500">{faqs.length} soru</p>
      </div>
      <FAQList
        faqs={faqs}
        services={servicesResult.items.map((s) => ({ id: s.id, title: s.title }))}
      />
    </div>
  );
}
