"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import {
  LOTES_POR_PRESENTE,
  getLote,
  loteId,
  valorDoLote,
  type Presente,
} from "@/data/presentes";
import { useCartStore } from "@/lib/cart-store";
import { formatBRL } from "@/lib/utils";

// Card dos presentes grandes: em vez de "Adicionar", mostra 5 lotes.
// Tocar num lote coloca/tira do carrinho. Lote de outra pessoa fica riscado.
export function LotGiftCard({
  presente,
  taken,
}: {
  presente: Presente;
  taken: Set<string>;
}) {
  const items = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const remove = useCartStore((s) => s.remove);

  const lotes = Array.from({ length: LOTES_POR_PRESENTE }, (_, i) => {
    const id = loteId(presente.id, i + 1);
    return {
      id,
      numero: i + 1,
      isTaken: taken.has(id),
      inCart: items.some((it) => it.id === id),
    };
  });
  const livres = lotes.filter((l) => !l.isTaken).length;
  const noCarrinho = lotes.filter((l) => l.inCart && !l.isTaken).length;

  const toggle = (id: string, inCart: boolean) => {
    if (inCart) {
      remove(id);
      return;
    }
    const lote = getLote(id);
    if (lote) addItem({ id, nome: lote.nome, valor: lote.valor, isLote: true });
  };

  return (
    <div className="card-soft overflow-hidden flex flex-col h-full relative">
      <div className="relative aspect-[4/3] overflow-hidden">
        {presente.imagem && (
          <Image
            src={presente.imagem}
            alt={presente.nome}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        )}
      </div>

      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        <h3 className="font-[var(--font-display)] font-light text-xl text-[var(--color-ink)] leading-tight">
          {presente.nome}
        </h3>
        <p className="mt-3 font-[var(--font-display)] text-xl text-[var(--color-champagne-deep)]">
          {formatBRL(valorDoLote(presente))}{" "}
          <span className="font-[var(--font-sans)] text-[13px] text-[var(--color-text-soft)]">
            por lote
          </span>
        </p>
        <p className="text-[13px] text-[var(--color-text-soft)] mt-0.5">
          Valor total: {formatBRL(presente.valor)}
        </p>

        <div className="mt-auto pt-4">
          <p className="text-[13px] text-[var(--color-text)] mb-2">
            {livres === 0
              ? "Presente completo! Obrigado 💛"
              : noCarrinho > 0
                ? `${noCarrinho} ${noCarrinho === 1 ? "lote escolhido" : "lotes escolhidos"} por você`
                : `Escolha um lote · ${livres} ${livres === 1 ? "disponível" : "disponíveis"}`}
          </p>
          <div className="grid grid-cols-5 gap-1.5">
            {lotes.map((l) =>
              l.isTaken ? (
                <button
                  key={l.id}
                  type="button"
                  disabled
                  title="Esse lote já tem dono 💛"
                  aria-label={`Lote ${l.numero} de ${presente.nome} já escolhido por outra pessoa`}
                  className="h-11 rounded-xl border border-dashed border-[var(--color-border-soft)] bg-[var(--color-cream-deep)]/50 text-[15px] text-[var(--color-text-soft)]/60 line-through decoration-[var(--color-champagne-deep)] decoration-2 cursor-not-allowed"
                >
                  {l.numero}
                </button>
              ) : (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => toggle(l.id, l.inCart)}
                  aria-pressed={l.inCart}
                  aria-label={`Lote ${l.numero} de ${presente.nome}, ${formatBRL(valorDoLote(presente))}`}
                  className={`h-11 rounded-xl border-[1.5px] text-[15px] font-medium flex items-center justify-center transition-all active:scale-95 ${
                    l.inCart
                      ? "border-[var(--color-champagne-darker)] bg-[var(--color-champagne-darker)] text-[var(--color-cream)]"
                      : "border-[var(--color-champagne)] bg-white text-[var(--color-ink)] hover:border-[var(--color-champagne-deep)]"
                  }`}
                >
                  {l.inCart ? <Check size={16} strokeWidth={2.5} /> : l.numero}
                </button>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
