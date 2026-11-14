import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Konum"
      className={cn("flex items-center gap-1 text-sm text-[var(--text-muted)]", className)}
    >
      <Link
        href="/admin"
        className="flex items-center hover:text-[var(--text-primary)] transition-colors"
        aria-label="Admin ana sayfa"
      >
        <Home className="h-3.5 w-3.5" />
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          {item.href && i < items.length - 1 ? (
            <Link
              href={item.href}
              className="hover:text-[var(--text-primary)] transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span
              className={cn(i === items.length - 1 && "text-[var(--text-primary)] font-medium")}
              aria-current={i === items.length - 1 ? "page" : undefined}
            >
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
