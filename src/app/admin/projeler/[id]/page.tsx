import { getProject } from "@/lib/cms/project-actions";
import { getServices } from "@/lib/cms/service-actions";
import { notFound } from "next/navigation";
import { ProjectForm } from "../project-form";
import { GalleryManager } from "./gallery-manager";
import { ServiceLinker } from "./service-linker";


interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProjeEditPage({ params }: Props) {
  const { id } = await params;

  const [project, servicesResult] = await Promise.all([
    getProject(id),
    getServices({ pageSize: 200, status: "PUBLISHED" }),
  ]);

  if (!project) notFound();

  const linkedServiceIds = project.projectServices.map((ps) => ps.serviceId);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Proje Düzenle</h1>
        <p className="mt-1 text-sm text-gray-500">{project.title}</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Sol: Form */}
        <div className="lg:col-span-2">
          <ProjectForm
            project={{
              id: project.id,
              title: project.title,
              slug: project.slug,
              summary: project.summary,
              description: project.description,
              locationLabel: project.locationLabel,
              projectType: project.projectType,
              completionDate: project.completionDate,
              isFeatured: project.isFeatured,
              status: project.status,
              seoTitle: project.seoTitle,
              seoDesc: project.seoDesc,
            }}
          />
        </div>

        {/* Sağ: Galeri + Hizmet ilişkisi */}
        <aside className="space-y-6">
          {/* Galeri */}
          <GalleryManager
            projectId={project.id}
            items={project.projectMedia.map((pm) => ({
              id: pm.id,
              caption: pm.caption,
              sortOrder: pm.sortOrder,
              media: pm.media,
            }))}
          />

          {/* Hizmet ilişkisi */}
          <ServiceLinker
            projectId={project.id}
            allServices={servicesResult.items.map((s) => ({
              id: s.id,
              title: s.title,
              categoryName: s.category.name,
            }))}
            linkedIds={linkedServiceIds}
          />
        </aside>
      </div>
    </div>
  );
}
