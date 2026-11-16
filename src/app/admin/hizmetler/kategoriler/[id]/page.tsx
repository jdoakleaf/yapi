import { getServiceCategory } from "@/lib/cms/service-actions";
import { CategoryForm } from "../category-form";
import { notFound } from "next/navigation";


interface Props {
  params: Promise<{ id: string }>;
}

export default async function KategoriEditPage({ params }: Props) {
  const { id } = await params;
  const category = await getServiceCategory(id);

  if (!category) notFound();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Kategori Düzenle</h1>
        <p className="mt-1 text-sm text-gray-500">{category.name}</p>
      </div>
      <div className="max-w-2xl">
        <CategoryForm category={category} />
      </div>
    </div>
  );
}
