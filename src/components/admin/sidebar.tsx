"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Wrench,
  FolderOpen,
  Image,
  BookOpen,
  MessageSquare,
  HelpCircle,
  Navigation,
  Mail,
  Palette,
  Search,
  Users,
  Shield,
  ClipboardList,
  Settings,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    group: "Genel",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
      { href: "/admin/sayfalar", label: "Sayfalar", icon: FileText },
      { href: "/admin/anasayfa", label: "Ana Sayfa Editörü", icon: LayoutDashboard },
    ],
  },
  {
    group: "İçerik",
    items: [
      { href: "/admin/hizmetler", label: "Hizmetler", icon: Wrench },
      { href: "/admin/projeler", label: "Projeler", icon: FolderOpen },
      { href: "/admin/medya", label: "Medya Kütüphanesi", icon: Image },
      { href: "/admin/blog", label: "Blog", icon: BookOpen },
      { href: "/admin/yorumlar", label: "Müşteri Yorumları", icon: MessageSquare },
      { href: "/admin/sss", label: "Sık Sorulan Sorular", icon: HelpCircle },
      { href: "/admin/menu", label: "Menü Yönetimi", icon: Navigation },
    ],
  },
  {
    group: "Talepler",
    items: [
      { href: "/admin/talepler", label: "Teklif Talepleri", icon: Mail },
    ],
  },
  {
    group: "Ayarlar",
    items: [
      { href: "/admin/ayarlar/genel", label: "Site Ayarları", icon: Settings },
      { href: "/admin/ayarlar/tema", label: "Tema ve Renkler", icon: Palette },
      { href: "/admin/ayarlar/seo", label: "SEO ve Yönlendirmeler", icon: Search },
      { href: "/admin/kullanicilar", label: "Kullanıcılar", icon: Users },
      { href: "/admin/roller", label: "Roller ve Yetkiler", icon: Shield },
      { href: "/admin/denetim", label: "Denetim Kayıtları", icon: ClipboardList },
    ],
  },
];

interface AdminSidebarProps {
  onClose?: () => void;
  mobile?: boolean;
}

export function AdminSidebar({ onClose, mobile = false }: AdminSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <div className="flex h-full flex-col bg-[var(--brand-navy)]">
      {/* Logo / Header */}
      <div className="flex h-16 items-center justify-between px-4">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="text-lg font-bold text-white">Yönetim Paneli</span>
        </Link>
        {mobile && onClose && (
          <button
            onClick={onClose}
            className="rounded-md p-1 text-gray-400 hover:bg-white/10 hover:text-white"
            aria-label="Menüyü kapat"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navItems.map((group) => (
          <div key={group.group}>
            <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
              {group.group}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href, item.exact);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={mobile ? onClose : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-[var(--brand-primary)] text-white"
                          : "text-gray-300 hover:bg-white/10 hover:text-white"
                      )}
                      aria-current={active ? "page" : undefined}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 px-4 py-3">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs text-gray-400 hover:text-gray-200 transition-colors"
        >
          <span>Siteyi görüntüle ↗</span>
        </Link>
      </div>
    </div>
  );
}
