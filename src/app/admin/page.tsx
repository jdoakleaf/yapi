// DB erişimi nedeniyle prerender engellenir; dinamik olarak render et
export const instant = false;

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench, FolderOpen, BookOpen, Mail, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";

async function getDashboardStats() {
  const [serviceCount, projectCount, blogCount, leadCount, recentLeads] =
    await Promise.all([
      prisma.service.count({ where: { status: "PUBLISHED" } }),
      prisma.project.count({ where: { status: "PUBLISHED" } }),
      prisma.blogPost.count({ where: { status: "PUBLISHED" } }),
      prisma.lead.count({ where: { status: { notIn: ["ARCHIVED"] } } }),
      prisma.lead.findMany({
        where: { status: { notIn: ["ARCHIVED"] } },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          fullName: true,
          status: true,
          createdAt: true,
          service: { select: { title: true } },
        },
      }),
    ]);

  return { serviceCount, projectCount, blogCount, leadCount, recentLeads };
}

const LEAD_STATUS_LABELS: Record<string, string> = {
  NEW: "Yeni",
  IN_PROGRESS: "İnceleniyor",
  QUOTED: "Teklif Hazırlandı",
  QUOTE_SENT: "Teklif Gönderildi",
  WON: "Kazanıldı",
  LOST: "Kaybedildi",
  ARCHIVED: "Arşivlendi",
};

const LEAD_STATUS_COLORS: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-700",
  IN_PROGRESS: "bg-yellow-100 text-yellow-700",
  QUOTED: "bg-purple-100 text-purple-700",
  QUOTE_SENT: "bg-indigo-100 text-indigo-700",
  WON: "bg-green-100 text-green-700",
  LOST: "bg-red-100 text-red-700",
  ARCHIVED: "bg-gray-100 text-gray-600",
};

export default async function AdminDashboardPage() {
  const session = await auth();
  const stats = await getDashboardStats();

  const statCards = [
    {
      label: "Yayınlanan Hizmetler",
      value: stats.serviceCount,
      icon: Wrench,
      href: "/admin/hizmetler",
      color: "text-[var(--brand-primary)]",
      bg: "bg-blue-50",
    },
    {
      label: "Yayınlanan Projeler",
      value: stats.projectCount,
      icon: FolderOpen,
      href: "/admin/projeler",
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Blog Yazıları",
      value: stats.blogCount,
      icon: BookOpen,
      href: "/admin/blog",
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Aktif Talepler",
      value: stats.leadCount,
      icon: Mail,
      href: "/admin/talepler",
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Dashboard</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Hoş geldiniz{session?.user?.name ? `, ${session.user.name}` : ""}.
          Platformun genel durumu aşağıda özetlenmiştir.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Link key={card.label} href={card.href} className="block group">
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-[var(--text-muted)]">
                      {card.label}
                    </p>
                    <p className={`mt-2 text-3xl font-bold ${card.color}`}>
                      {card.value}
                    </p>
                  </div>
                  <div className={`rounded-lg p-2 ${card.bg}`}>
                    <card.icon className={`h-5 w-5 ${card.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent leads */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Mail className="h-4 w-4 text-[var(--brand-primary)]" />
              Son Teklif Talepleri
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentLeads.length === 0 ? (
              <p className="text-sm text-[var(--text-muted)] py-4 text-center">
                Henüz teklif talebi yok.
              </p>
            ) : (
              <ul className="divide-y divide-[var(--border)]">
                {stats.recentLeads.map((lead) => (
                  <li key={lead.id} className="flex items-center justify-between py-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                        {lead.fullName}
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">
                        {lead.service?.title ?? "—"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-3 shrink-0">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          LEAD_STATUS_COLORS[lead.status] ?? "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {LEAD_STATUS_LABELS[lead.status] ?? lead.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-3">
              <Link
                href="/admin/talepler"
                className="text-xs text-[var(--brand-primary)] hover:underline font-medium"
              >
                Tüm talepleri görüntüle →
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Quick actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-[var(--brand-primary)]" />
              Hızlı İşlemler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {[
                { label: "Yeni hizmet ekle", href: "/admin/hizmetler/yeni" },
                { label: "Yeni proje ekle", href: "/admin/projeler/yeni" },
                { label: "Yeni blog yazısı", href: "/admin/blog/yeni" },
                { label: "Medya yükle", href: "/admin/medya" },
                { label: "Site ayarları", href: "/admin/ayarlar/genel" },
                { label: "Tema ve renkler", href: "/admin/ayarlar/tema" },
              ].map((action) => (
                <li key={action.href}>
                  <Link
                    href={action.href}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--surface-muted)] transition-colors"
                  >
                    <span className="text-[var(--brand-primary)]">→</span>
                    {action.label}
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* System notice */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800">
                Geliştirme Modu
              </p>
              <p className="mt-1 text-sm text-amber-700">
                Platform geliştirme aşamasındadır. Hizmet ve proje içerikleri
                admin panelinden eklenebilir. Üretim öncesi test ve güvenlik
                denetimi yapılmalıdır.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
