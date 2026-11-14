import { ProjectForm } from "../project-form";

export default function YeniProjePage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Yeni Proje</h1>
        <p className="mt-1 text-sm text-gray-500">Yeni bir proje oluşturun.</p>
      </div>
      <div className="max-w-3xl">
        <ProjectForm />
      </div>
    </div>
  );
}
