import { getServiceCategories } from "@/lib/cms/service-actions";
import { ServiceForm } from "../service-form";


export default async function YeniHizmetPage() {
  const categories = await getServiceCategories();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Yeni Hizmet</h1>
        <p className="mt-1 text-sm text-gray-500">Yeni bir hizmet oluşturun.</p>
      </div>
      <div className="max-w-3xl">
        <ServiceForm categories={categories} />
      </div>
    </div>
  );
}
