"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { createPage } from "@/lib/cms/page-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb } from "@/components/admin/breadcrumb";
import { toast } from "@/hooks/use-toast";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewPagePage() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await createPage(formData);
      if (result.success && result.pageId) {
        toast({ title: "Sayfa oluşturuldu", description: `/${result.slug}` });
        router.push(`/admin/sayfalar/${result.pageId}`);
      } else {
        const errorMsg = result.error ?? JSON.stringify(result.fieldErrors);
        toast({ title: "Hata", description: errorMsg, variant: "destructive" });
      }
    });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <Breadcrumb
          items={[{ label: "Sayfalar", href: "/admin/sayfalar" }, { label: "Yeni Sayfa" }]}
        />
        <div className="mt-2 flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/sayfalar">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Yeni Sayfa</h1>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Sayfa Bilgileri</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="title">Başlık *</Label>
              <Input
                id="title"
                name="title"
                required
                placeholder="Hizmetlerimiz"
                disabled={isPending}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="slug">Slug (opsiyonel — otomatik üretilir)</Label>
              <div className="flex items-center gap-1.5">
                <span className="text-sm text-[var(--text-muted)]">/</span>
                <Input
                  id="slug"
                  name="slug"
                  placeholder="hizmetlerimiz"
                  disabled={isPending}
                  className="font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="excerpt">Özet (opsiyonel)</Label>
              <Input
                id="excerpt"
                name="excerpt"
                placeholder="Kısa açıklama"
                disabled={isPending}
              />
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="submit" disabled={isPending} className="gap-2">
                <Save className="h-4 w-4" />
                {isPending ? "Oluşturuluyor..." : "Sayfa Oluştur"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
