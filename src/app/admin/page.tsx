"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Lock } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Ornament, HorizontalDivider } from "@/components/ui/ornament";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [supabaseConfigured, setSupabaseConfigured] = useState(true);

  useEffect(() => {
    const supa = createSupabaseBrowserClient();
    if (!supa) {
      setSupabaseConfigured(false);
      return;
    }
    supa.auth.getUser().then(({ data }) => {
      if (data.user) router.replace("/admin/dashboard");
    });
  }, [router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const supa = createSupabaseBrowserClient();
    if (!supa) {
      setError("Supabase não configurado. Contate o administrador.");
      return;
    }
    setLoading(true);
    const { error } = await supa.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError("Email ou senha inválidos.");
      return;
    }
    router.replace("/admin/dashboard");
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-5 py-10 bg-[var(--color-cream)]">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm card-soft p-8 text-center"
      >
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-cream-soft)] border border-[var(--color-border-soft)] text-[var(--color-champagne-deep)] mb-3">
          <Lock size={18} />
        </div>
        <Ornament className="mb-3" />
        <p className="label-uppercase mb-2">Área do casal</p>
        <h1 className="heading-display text-2xl">Bem-vindos</h1>
        <HorizontalDivider className="my-3" />
        <p className="text-sm text-[var(--color-text-soft)] italic font-[var(--font-display)] mb-6">
          Entre para gerenciar a lista de convidados e os presentes.
        </p>

        {!supabaseConfigured && (
          <p className="text-xs bg-[var(--color-pastel-yellow)] border border-[var(--color-champagne-light)] rounded-lg p-3 mb-4 text-[var(--color-text)]">
            Configure as variáveis de ambiente do Supabase para habilitar o
            login.
          </p>
        )}

        <form onSubmit={submit} className="space-y-3 text-left">
          <div>
            <label className="label-uppercase block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              className="input-soft"
            />
          </div>
          <div>
            <label className="label-uppercase block mb-1">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="input-soft"
            />
          </div>
          {error && (
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg py-2 px-3">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="btn-cta w-full mt-2"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : "Entrar"}
          </button>
        </form>
      </motion.div>
    </main>
  );
}
