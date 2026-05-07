"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  Gift,
  LogOut,
  ChevronLeft,
  Menu,
  X,
  Users as UsersIcon,
  Heart,
  XCircle,
  Clock,
  Loader2,
} from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { WEDDING } from "@/lib/wedding-data";
import { FamiliasManager } from "@/components/admin/FamiliasManager";
import { RsvpTable } from "@/components/admin/RsvpTable";
import { GiftPurchasesTable } from "@/components/admin/GiftPurchasesTable";
import { formatBRL } from "@/lib/utils";
import type { AdminFamily, AdminRsvp, AdminGiftPurchase } from "@/lib/admin-data";

type Tab = "overview" | "familias" | "rsvp" | "presentes";

type Stats = {
  totalFamilies: number;
  totalGuests: number;
  confirmedGuests: number;
  confirmedCount: number;
  declinedCount: number;
  pendingCount: number;
  totalArrecadado: number;
  totalPendente: number;
};

function useAdminFetch<T>(url: string, tab: Tab, activeTab: Tab) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json() as T;
        setData(json);
      }
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (activeTab === tab) load();
  }, [activeTab, tab, load]);

  return { data, loading, reload: load };
}

function Spinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <Loader2 size={24} className="animate-spin text-[var(--color-champagne)]" />
    </div>
  );
}

function OverviewTab() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => setStats(d as Stats))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (!stats) return null;

  const cards = [
    { label: "Famílias", value: stats.totalFamilies, tone: "var(--color-pastel-lavender)", Icon: UsersIcon },
    { label: "Convidados", value: stats.totalGuests, tone: "var(--color-pastel-sky)", Icon: ClipboardCheck },
    { label: "Confirmados", value: `${stats.confirmedGuests}`, sub: `${stats.confirmedCount} família(s)`, tone: "var(--color-pastel-mint)", Icon: Heart },
    { label: "Não vão", value: stats.declinedCount, tone: "var(--color-pastel-rose)", Icon: XCircle },
    { label: "Pendentes", value: stats.pendingCount, tone: "var(--color-pastel-yellow)", Icon: Clock },
    { label: "Arrecadado", value: formatBRL(stats.totalArrecadado), sub: `Aguardando: ${formatBRL(stats.totalPendente)}`, tone: "var(--color-pastel-salmon)", Icon: Gift },
  ];

  return (
    <div>
      <header className="mb-8">
        <p className="label-uppercase mb-1">Painel</p>
        <h1 className="heading-display text-3xl md:text-4xl">Visão Geral</h1>
        <p className="text-sm text-[var(--color-text-soft)] mt-1">
          Acompanhe em tempo real quem confirmou, quem ainda não respondeu e os presentes recebidos.
        </p>
      </header>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        {cards.map((c) => (
          <div key={c.label} className="card-soft p-5 relative overflow-hidden">
            <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-50 blur-2xl" style={{ background: c.tone }} aria-hidden />
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-[var(--color-cream-soft)] border border-[var(--color-border-soft)] text-[var(--color-champagne-deep)] flex items-center justify-center mb-3">
                <c.Icon size={16} />
              </div>
              <p className="label-uppercase mb-1">{c.label}</p>
              <p className="font-[var(--font-display)] text-2xl" style={{ color: "var(--color-ink)" }}>{c.value}</p>
              {c.sub && <p className="text-[11px] text-[var(--color-text-soft)] mt-1">{c.sub}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FamiliasTab() {
  const [families, setFamilies] = useState<AdminFamily[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/families")
      .then((r) => r.json())
      .then((d: { families: AdminFamily[] }) => setFamilies(d.families))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div>
      <header className="mb-8">
        <p className="label-uppercase mb-1">Convidados</p>
        <h1 className="heading-display text-3xl md:text-4xl">Famílias</h1>
        <p className="text-sm text-[var(--color-text-soft)] mt-1">
          Adicione famílias e seus integrantes. Os nomes aqui aparecem na busca do site.
        </p>
      </header>
      <FamiliasManager initial={families ?? []} />
    </div>
  );
}

function RsvpTab() {
  const [rsvps, setRsvps] = useState<AdminRsvp[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/rsvp-responses")
      .then((r) => r.json())
      .then((d: { rsvps: AdminRsvp[] }) => setRsvps(d.rsvps))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div>
      <header className="mb-8">
        <p className="label-uppercase mb-1">Confirmações</p>
        <h1 className="heading-display text-3xl md:text-4xl">Respostas RSVP</h1>
        <p className="text-sm text-[var(--color-text-soft)] mt-1">
          Lista de quem respondeu, ordenado pelas mais recentes.
        </p>
      </header>
      <RsvpTable rsvps={rsvps ?? []} />
    </div>
  );
}

function PresentesTab() {
  const [purchases, setPurchases] = useState<AdminGiftPurchase[] | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/gift-purchases");
    const d = await res.json() as { purchases: AdminGiftPurchase[] };
    setPurchases(d.purchases);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  if (loading) return <Spinner />;

  return (
    <div>
      <header className="mb-8">
        <p className="label-uppercase mb-1">Carinho recebido</p>
        <h1 className="heading-display text-3xl md:text-4xl">Presentes</h1>
        <p className="text-sm text-[var(--color-text-soft)] mt-1">
          Lista dos presentes registrados pelos convidados. Marque como confirmado quando o comprovante chegar.
        </p>
      </header>
      <GiftPurchasesTable purchases={purchases ?? []} onRefresh={load} />
    </div>
  );
}

const NAV: { id: Tab; label: string; Icon: React.ElementType }[] = [
  { id: "overview", label: "Visão Geral", Icon: LayoutDashboard },
  { id: "familias", label: "Famílias", Icon: Users },
  { id: "rsvp", label: "Respostas RSVP", Icon: ClipboardCheck },
  { id: "presentes", label: "Presentes", Icon: Gift },
];

export function AdminDashboard({ defaultTab = "overview" }: { defaultTab?: Tab }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>(defaultTab);
  const [mobileOpen, setMobileOpen] = useState(false);

  const logout = async () => {
    const supa = createSupabaseBrowserClient();
    if (supa) await supa.auth.signOut();
    router.replace("/admin");
  };

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
          <button type="button" className="lg:hidden p-1 text-[var(--color-champagne-deep)]" onClick={() => setMobileOpen(false)}>
            <X size={18} />
          </button>
        </div>
        <nav className="p-4 flex flex-col gap-1">
          {NAV.map((it) => (
            <button
              key={it.id}
              type="button"
              onClick={() => { setTab(it.id); setMobileOpen(false); }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors w-full text-left ${
                tab === it.id
                  ? "bg-[var(--color-champagne-darker)] text-[var(--color-cream)]"
                  : "text-[var(--color-text)] hover:bg-[var(--color-cream)]"
              }`}
            >
              <it.Icon size={16} />
              {it.label}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[var(--color-border-soft)]">
          <a href="/" className="flex items-center gap-2 text-xs text-[var(--color-text-soft)] hover:text-[var(--color-champagne-deep)] mb-2">
            <ChevronLeft size={13} /> Ir para o site
          </a>
          <button type="button" onClick={logout} className="flex items-center gap-2 text-xs text-[var(--color-text-soft)] hover:text-red-700">
            <LogOut size={13} /> Sair
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-[rgba(46,34,24,0.4)] lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden p-4 border-b border-[var(--color-border-soft)] flex items-center gap-3 bg-[var(--color-cream)]">
          <button type="button" onClick={() => setMobileOpen(true)} className="p-2 text-[var(--color-champagne-deep)]">
            <Menu size={20} />
          </button>
          <p className="font-[var(--font-display)] italic text-lg text-[var(--color-ink)]">Admin</p>
        </header>
        <main className="flex-1 p-5 md:p-8 overflow-x-hidden">
          {tab === "overview" && <OverviewTab />}
          {tab === "familias" && <FamiliasTab />}
          {tab === "rsvp" && <RsvpTab />}
          {tab === "presentes" && <PresentesTab />}
        </main>
      </div>
    </div>
  );
}
