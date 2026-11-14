import { CategoryForm } from "../category-form";

export default function YeniKategoriPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Yeni Kategori</h1>
        <p className="mt-1 text-sm text-gray-500">Yeni bir hizmet kategorisi oluşturun.</p>
      </div>
      <div className="max-w-2xl">
        <CategoryForm />
      </div>
    </div>
  );
}
