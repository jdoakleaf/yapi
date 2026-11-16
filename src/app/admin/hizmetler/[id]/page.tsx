import { getService, getServiceCategories } from "@/lib/cms/service-actions";
import { ServiceForm } from "../service-form";
import { notFound } from "next/navigation";


interface Props {
  params: Promise<{ id: string }>;
}

export default async function HizmetEditPage({ params }: Props) {
  const { id } = await params;
  const [service, categories] = await Promise.all([
    getService(id),
    getServiceCategories(),
  ]);

  if (!service) notFound();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Hizmet Düzenle</h1>
        <p className="mt-1 text-sm text-gray-500">{service.title}</p>
      </div>
      <div className="max-w-3xl">
        <ServiceForm
          service={{
            id: service.id,
            categoryId: service.categoryId,
            title: service.title,
            slug: service.slug,
            shortDescription: service.shortDescription,
            content: service.content,
            isFeatured: service.isFeatured,
            sortOrder: service.sortOrder,
            status: service.status,
            seoTitle: service.seoTitle,
            seoDesc: service.seoDesc,
          }}
          categories={categories}
        />
      </div>
    </div>
  );
}
