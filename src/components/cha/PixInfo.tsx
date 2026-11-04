"use client";

import { Copy, CreditCard, Mail } from "lucide-react";
import { WEDDING } from "@/lib/wedding-data";
import { useToast } from "@/components/ui/toaster";

// Dados de pagamento do casal. Sem valor e sem comprovante — o convidado
// manda o que quiser, quando quiser.
export function PixInfo() {
  const { toast } = useToast();
  const { payment } = WEDDING;

  const copy = (text: string, msg: string) => {
    navigator.clipboard?.writeText(text);
    toast(msg);
  };

  return (
    <div className="space-y-2.5">
      <button
        type="button"
        onClick={() => copy(payment.pixEmail, "Chave Pix copiada!")}
        className="w-full min-h-[56px] flex items-center gap-3 px-4 py-3 rounded-2xl border border-[var(--color-border-soft)] bg-white text-left hover:border-[var(--color-champagne)]"
      >
        <Mail size={18} className="text-[var(--color-champagne-deep)] shrink-0" />
        <span className="flex-1 min-w-0">
          <span className="block text-[11px] tracking-[0.2em] uppercase text-[var(--color-champagne-light)]">
            Chave Pix (e-mail)
          </span>
          <span className="block text-[15px] text-[var(--color-ink)] truncate">
            {payment.pixEmail}
          </span>
        </span>
        <Copy size={16} className="text-[var(--color-champagne-deep)] shrink-0" />
      </button>

      <button
        type="button"
        onClick={() => copy(payment.pixCopiaCola, "Código Pix copiado!")}
        className="w-full min-h-[56px] flex items-center gap-3 px-4 py-3 rounded-2xl border border-[var(--color-border-soft)] bg-white text-left hover:border-[var(--color-champagne)]"
      >
        <Copy size={18} className="text-[var(--color-champagne-deep)] shrink-0" />
        <span className="text-[15px] text-[var(--color-ink)]">
          Copiar código Pix (copia e cola)
        </span>
      </button>

      <a
        href={payment.mercadoPagoLink}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full min-h-[56px] flex items-center gap-3 px-4 py-3 rounded-2xl border border-[var(--color-border-soft)] bg-white hover:border-[var(--color-champagne)]"
      >
        <CreditCard size={18} className="text-[var(--color-champagne-deep)] shrink-0" />
        <span className="text-[15px] text-[var(--color-ink)]">
          Prefiro pagar no cartão
        </span>
      </a>

      <p className="text-[13px] text-[var(--color-text-soft)] text-center pt-1">
        Em nome de {payment.pixHolder} · sem valor mínimo 💛
      </p>
    </div>
  );
}
