"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Check, Minus, Plus } from "lucide-react";
import {
  VALOR_COTA,
  cotaItemId,
  cotaNome,
  totalCotas,
  type Presente,
} from "@/data/presentes";
import { useCartStore } from "@/lib/cart-store";
import { formatBRL } from "@/lib/utils";

// Card dos presentes grandes: a barra mostra quanto já foi escolhido e o
// convidado define quantas cotas quer dar.
export function CotaGiftCard({
  presente,
  used,
}: {
  presente: Presente;
  used: number;
}) {
  const itemId = cotaItemId(presente.id);
  const inCart = useCartStore((s) => s.items.find((i) => i.id === itemId));
  const setItem = useCartStore((s) => s.setItem);

  const total = totalCotas(presente);
  const restante = Math.max(0, total - used);
  const [qtd, setQtd] = useState(1);

  // Mantém o contador igual ao carrinho (ex.: item removido na sacola).
  const inCartQtd = inCart?.qtd ?? 0;
  useEffect(() => {
    setQtd(inCartQtd > 0 ? inCartQtd : 1);
  }, [inCartQtd]);

  const salvo = inCartQtd > 0 && inCartQtd === qtd;
  const percent = total > 0 ? Math.min(100, (used / total) * 100) : 0;

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

        <div className="mt-3">
          <p className="text-[13px] text-[var(--color-text-soft)]">
            <span className="font-medium text-[var(--color-champagne-deep)]">
              {formatBRL(used * VALOR_COTA)}
            </span>{" "}
            de {formatBRL(presente.valor)}
          </p>
          <div
            className="mt-1.5 h-2 rounded-full bg-[var(--color-cream-deep)] overflow-hidden"
            role="progressbar"
            aria-label={`Quanto já foi escolhido de ${presente.nome}`}
            aria-valuenow={Math.round(percent)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-full bg-[var(--color-champagne-deep)] transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        <div className="mt-auto pt-4">
          {restante === 0 ? (
            <p className="text-[15px] text-center text-[var(--color-ink)] py-3">
              Presente completo! Obrigado 💛
            </p>
          ) : (
            <>
              <p className="text-[14px] text-[var(--color-text)] mb-2">
                Quantas cotas de {formatBRL(VALOR_COTA)}?
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQtd((n) => Math.max(1, n - 1))}
                  disabled={qtd <= 1}
                  aria-label={`Menos cotas de ${presente.nome}`}
                  className="w-11 h-11 rounded-full border-[1.5px] border-[var(--color-champagne)] bg-white flex items-center justify-center text-[var(--color-ink)] disabled:opacity-40"
                >
                  <Minus size={16} />
                </button>
                <span
                  className="w-7 text-center text-xl font-medium text-[var(--color-ink)] tabular-nums"
                  aria-live="polite"
                >
                  {qtd}
                </span>
                <button
                  type="button"
                  onClick={() => setQtd((n) => Math.min(restante, n + 1))}
                  disabled={qtd >= restante}
                  aria-label={`Mais cotas de ${presente.nome}`}
                  className="w-11 h-11 rounded-full border-[1.5px] border-[var(--color-champagne)] bg-white flex items-center justify-center text-[var(--color-ink)] disabled:opacity-40"
                >
                  <Plus size={16} />
                </button>
                <span className="ml-auto font-[var(--font-display)] text-xl text-[var(--color-champagne-deep)]">
                  {formatBRL(qtd * VALOR_COTA)}
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  setItem(
                    {
                      id: itemId,
                      nome: cotaNome(presente),
                      valor: VALOR_COTA,
                      isCota: true,
                    },
                    qtd,
                  )
                }
                className={`mt-3 w-full inline-flex items-center justify-center gap-1.5 rounded-full py-2.5 px-4 text-[11px] tracking-[0.25em] uppercase font-medium transition-colors ${
                  salvo
                    ? "bg-[var(--color-pastel-yellow)] text-[var(--color-ink)]"
                    : "bg-[var(--color-champagne-darker)] text-white hover:bg-[var(--color-champagne-deep)]"
                }`}
              >
                {salvo ? (
                  <>
                    <Check size={14} /> Adicionado
                  </>
                ) : inCartQtd > 0 ? (
                  "Atualizar"
                ) : (
                  <>
                    <Plus size={14} /> Adicionar
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
