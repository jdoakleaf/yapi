"use client";

import { useState } from "react";
import { Menu, LogOut, User } from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { AdminSidebar } from "@/components/admin/sidebar";
import { cn } from "@/lib/utils";

interface AdminHeaderProps {
  userEmail?: string | null;
}

export function AdminHeader({ userEmail }: AdminHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 ease-in-out lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <AdminSidebar mobile onClose={() => setMobileOpen(false)} />
      </div>

      {/* Top header bar */}
      <header className="flex h-16 items-center justify-between border-b border-[var(--border)] bg-white px-4 lg:px-6">
        {/* Mobile menu button */}
        <button
          className="rounded-md p-2 text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)] lg:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Menüyü aç"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Spacer (desktop) */}
        <div className="hidden lg:block" />

        {/* Right side: user info + logout */}
        <div className="flex items-center gap-3">
          {userEmail && (
            <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
              <User className="h-4 w-4" />
              <span className="hidden sm:block">{userEmail}</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="gap-2 text-[var(--text-muted)] hover:text-red-600"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:block">Çıkış</span>
          </Button>
        </div>
      </header>
    </>
  );
}
