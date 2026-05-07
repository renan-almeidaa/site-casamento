"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  ChevronLeft,
  Gift,
  LayoutDashboard,
  LogOut,
  Menu,
  Users,
  ClipboardCheck,
  X,
} from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { WEDDING } from "@/lib/wedding-data";

const NAV = [
  { href: "/admin/dashboard", label: "Visão Geral", icon: LayoutDashboard },
  { href: "/admin/dashboard/familias", label: "Famílias", icon: Users },
  { href: "/admin/dashboard/rsvp", label: "Respostas RSVP", icon: ClipboardCheck },
  { href: "/admin/dashboard/presentes", label: "Presentes", icon: Gift },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const logout = async () => {
    const supa = createSupabaseBrowserClient();
    if (supa) await supa.auth.signOut();
    router.replace("/admin");
  };

  const isActive = (href: string) =>
    href === "/admin/dashboard"
      ? pathname === href
      : pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-[var(--color-cream)] flex">
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-[var(--color-cream-soft)] border-r border-[var(--color-border-soft)] transform transition-transform lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-[var(--color-border-soft)] flex items-center justify-between">
          <div>
            <p className="font-[var(--font-display)] italic text-xl text-[var(--color-ink)]">
              {WEDDING.coupleName}
            </p>
            <p className="label-uppercase mt-0.5">Admin</p>
          </div>
          <button
            type="button"
            className="lg:hidden p-1 text-[var(--color-champagne-deep)]"
            onClick={() => setMobileOpen(false)}
          >
            <X size={18} />
          </button>
        </div>
        <nav className="p-4 flex flex-col gap-1">
          {NAV.map((it) => {
            const Icon = it.icon;
            const active = isActive(it.href);
            return (
              <Link
                key={it.href}
                href={it.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-[var(--color-champagne-darker)] text-[var(--color-cream)]"
                    : "text-[var(--color-text)] hover:bg-[var(--color-cream)]"
                }`}
              >
                <Icon size={16} />
                {it.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[var(--color-border-soft)]">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-[var(--color-text-soft)] hover:text-[var(--color-champagne-deep)] mb-2"
          >
            <ChevronLeft size={13} /> Ir para o site
          </Link>
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-2 text-xs text-[var(--color-text-soft)] hover:text-red-700"
          >
            <LogOut size={13} /> Sair
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-[rgba(46,34,24,0.4)] lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden p-4 border-b border-[var(--color-border-soft)] flex items-center gap-3 bg-[var(--color-cream)]">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="p-2 text-[var(--color-champagne-deep)]"
          >
            <Menu size={20} />
          </button>
          <p className="font-[var(--font-display)] italic text-lg text-[var(--color-ink)]">
            Admin
          </p>
        </header>
        <main className="flex-1 p-5 md:p-8 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
