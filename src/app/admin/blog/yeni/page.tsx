import { BlogForm } from "../blog-form";
export default function YeniBlogPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Yeni Blog Yazısı</h1>
      </div>
      <div className="max-w-3xl"><BlogForm /></div>
    </div>
  );
}
