
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/admin/breadcrumb";
import { PageMetaForm } from "./meta-form";
import { BlockList } from "./block-list";
import { ArrowLeft } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const page = await prisma.page.findUnique({ where: { id }, select: { title: true } });
  return { title: page ? `Düzenle: ${page.title}` : "Sayfa Bulunamadı" };
}

export default async function EditPagePage({ params }: Props) {
  const { id } = await params;
  const page = await prisma.page.findUnique({
    where: { id },
    include: {
      sections: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!page) notFound();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <Breadcrumb
          items={[
            { label: "Sayfalar", href: "/admin/sayfalar" },
            { label: page.title },
          ]}
        />
        <div className="mt-2 flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/sayfalar">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">{page.title}</h1>
        </div>
      </div>

      {/* Sayfa meta bilgileri */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Sayfa Bilgileri</CardTitle>
        </CardHeader>
        <CardContent>
          <PageMetaForm page={page} />
        </CardContent>
      </Card>

      {/* Blok editörü */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Sayfa Blokları</CardTitle>
          <p className="text-sm text-[var(--text-muted)]">
            Blokları sürükleyerek sıralayın, aktif/pasif yapın veya içeriklerini düzenleyin.
          </p>
        </CardHeader>
        <CardContent>
          <BlockList pageId={page.id} sections={page.sections} />
        </CardContent>
      </Card>
    </div>
  );
}
