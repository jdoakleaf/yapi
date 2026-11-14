export const instant = false;

import Link from "next/link";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/admin/breadcrumb";
import { Plus, FileText, Eye, Pencil } from "lucide-react";
import { DeletePageButton } from "./delete-button";

export const metadata = { title: "Sayfalar" };

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Taslak",
  REVIEW: "İncelemede",
  PUBLISHED: "Yayında",
  ARCHIVED: "Arşivde",
};
const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  REVIEW: "bg-yellow-100 text-yellow-700",
  PUBLISHED: "bg-green-100 text-green-700",
  ARCHIVED: "bg-red-100 text-red-600",
};

export default async function PagesListPage() {
  const pages = await prisma.page.findMany({
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      updatedAt: true,
      _count: { select: { sections: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Breadcrumb items={[{ label: "Sayfalar" }]} />
          <h1 className="mt-2 text-2xl font-bold text-[var(--text-primary)]">Sayfalar</h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            {pages.length} sayfa — oluşturun, düzenleyin veya yayınlayın.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/sayfalar/yeni" className="gap-2">
            <Plus className="h-4 w-4" />
            Yeni Sayfa
          </Link>
        </Button>
      </div>

      {pages.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <FileText className="mx-auto h-10 w-10 text-[var(--text-muted)]" />
            <p className="mt-3 text-sm font-medium text-[var(--text-primary)]">
              Henüz sayfa yok
            </p>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              İlk sayfanızı oluşturun.
            </p>
            <div className="mt-4">
              <Button asChild size="sm">
                <Link href="/admin/sayfalar/yeni">Sayfa Oluştur</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[var(--text-muted)]">
              Tüm Sayfalar
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-[var(--border)]">
              {pages.map((page) => (
                <div
                  key={page.id}
                  className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-[var(--surface-muted)] transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[var(--text-primary)] truncate">
                        {page.title}
                      </span>
                      <span
                        className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          STATUS_COLORS[page.status] ?? "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {STATUS_LABELS[page.status] ?? page.status}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                      /{page.slug} · {page._count.sections} blok ·{" "}
                      {new Date(page.updatedAt).toLocaleDateString("tr-TR")}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {page.status === "PUBLISHED" && (
                      <Button variant="ghost" size="icon" asChild title="Sayfayı görüntüle">
                        <Link href={`/${page.slug}`} target="_blank">
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" asChild title="Düzenle">
                      <Link href={`/admin/sayfalar/${page.id}`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <DeletePageButton pageId={page.id} pageTitle={page.title} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
