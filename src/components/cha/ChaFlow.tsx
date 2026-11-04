"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, CalendarHeart, Loader2, MapPin } from "lucide-react";
import { CHA, WEDDING } from "@/lib/wedding-data";
import { getChaItem } from "@/data/cha-itens";
import { Ornament, HorizontalDivider } from "@/components/ui/ornament";
import { StepQuemVai, type ChaFamily } from "@/components/cha/StepQuemVai";
import { StepPresentes } from "@/components/cha/StepPresentes";
import { PixInfo } from "@/components/cha/PixInfo";

type Step = 1 | 2 | 3 | "done";

const STEP_TITLES: Record<1 | 2 | 3, string> = {
  1: "Quem é você?",
  2: "Escolha o presente 🎁",
  3: "Tudo certo?",
};

export function ChaFlow() {
  const [step, setStep] = useState<Step>(1);
  const [family, setFamily] = useState<ChaFamily | null>(null);
  const [going, setGoing] = useState<boolean | null>(null);
  const [attending, setAttending] = useState<Set<string>>(new Set());
  const [whatsapp, setWhatsapp] = useState("");
  const [chosen, setChosen] = useState<Set<string>>(new Set());
  const [givesPix, setGivesPix] = useState(false);
  const [taken, setTaken] = useState<Set<string>>(new Set());
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const vai = going === true && attending.size > 0;

  const loadTaken = useCallback(async () => {
    try {
      const r = await fetch("/api/cha/itens", { cache: "no-store" });
      if (!r.ok) return;
      const d = (await r.json()) as { taken: string[] };
      const next = new Set(d.taken);
      setTaken(next);
      // Se algo que estava marcado foi pego por outra pessoa, desmarca.
      setChosen((prev) => new Set([...prev].filter((id) => !next.has(id))));
    } catch {
      // silencioso — a checagem final no servidor garante a regra
    }
  }, []);

  useEffect(() => {
    void loadTaken();
  }, [loadTaken]);

  const go = (s: Step) => {
    setError(null);
    setStep(s);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggle = (set: Set<string>, id: string) => {
    const next = new Set(set);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  };

  const nextFromStep1 = () => {
    if (!family) return setError("Digite seu nome e toque nele na lista 😊");
    if (going === null) return setError("Conta pra gente: vocês vão? 😊");
    if (going && attending.size === 0) return setError("Toque no nome de quem vai 😊");
    if (whatsapp.replace(/\D/g, "").length < 10) {
      return setError("Coloque seu WhatsApp com DDD 📱");
    }
    void loadTaken();
    go(2);
  };

  const nextFromStep2 = () => {
    if (vai && chosen.size === 0 && !givesPix) {
      return setError("Escolha pelo menos um presente (ou o Pix) 🎁");
    }
    // Quem não vai e não quer presentear: envia direto, sem revisão.
    if (!vai && chosen.size === 0 && !givesPix) return void submit();
    go(3);
  };

  const submit = async () => {
    if (!family) return;
    setSubmitting(true);
    setError(null);
    try {
      const r = await fetch("/api/cha/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          familyId: family.id,
          attendingGuestIds: going ? [...attending] : [],
          whatsapp,
          givesPix,
          itemIds: [...chosen],
          comment: comment.trim() || null,
        }),
      });
      const d = (await r.json().catch(() => ({}))) as {
        error?: string;
        takenItemIds?: string[];
      };
      if (r.status === 409 && d.takenItemIds) {
        const lost = d.takenItemIds;
        setTaken((prev) => new Set([...prev, ...lost]));
        setChosen((prev) => new Set([...prev].filter((id) => !lost.includes(id))));
        go(2);
        const names = lost.map((id) => getChaItem(id)?.nome ?? id).join(", ");
        setError(`Ops! Alguém escolheu agora há pouco: ${names} 😅 Escolhe outro?`);
        return;
      }
      if (!r.ok) throw new Error(d.error ?? "Não deu certo. Tenta de novo?");
      go("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não deu certo. Tenta de novo?");
    } finally {
      setSubmitting(false);
    }
  };

  const chosenItems = [...chosen].map((id) => getChaItem(id)).filter(Boolean);
  const giftCount = chosen.size + (givesPix ? 1 : 0);

  return (
    <main className="min-h-screen pb-32">
      <Header />

      <div className="max-w-2xl mx-auto px-5">
        {step !== "done" && (
          <div className="text-center mb-6">
            <div className="flex justify-center gap-2 mb-3" aria-hidden>
              {[1, 2, 3].map((n) => (
                <span
                  key={n}
                  className={`h-1.5 rounded-full transition-all ${
                    n === step
                      ? "w-8 bg-[var(--color-champagne-deep)]"
                      : n < (step as number)
                        ? "w-4 bg-[var(--color-champagne)]"
                        : "w-4 bg-[var(--color-border-soft)]"
                  }`}
                />
              ))}
            </div>
            <p className="label-uppercase">Passo {step} de 3</p>
            <h2 className="heading-display text-3xl mt-1">
              {step === 2 && !vai ? "Quer mandar um presentinho? 🎁" : STEP_TITLES[step]}
            </h2>
            {step === 2 && (
              <p className="text-[15px] text-[var(--color-text-soft)] mt-2">
                {vai
                  ? "Toque para escolher. Pode ser mais de um 😉"
                  : "Sem problema se não quiser, é só pular 💛"}
              </p>
            )}
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={String(step)}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {step === 1 && (
              <StepQuemVai
                family={family}
                onPickFamily={(f) => {
                  setFamily(f);
                  setGoing(null);
                  setAttending(new Set());
                  setError(null);
                }}
                going={going}
                onGoing={(v) => {
                  setGoing(v);
                  setError(null);
                  if (!v) setAttending(new Set());
                }}
                selected={attending}
                onToggleMember={(id) => setAttending((s) => toggle(s, id))}
                whatsapp={whatsapp}
                onWhatsapp={setWhatsapp}
              />
            )}

            {step === 2 && (
              <StepPresentes
                chosen={chosen}
                onToggle={(id) => {
                  setError(null);
                  setChosen((s) => toggle(s, id));
                }}
                taken={taken}
                givesPix={givesPix}
                onTogglePix={() => {
                  setError(null);
                  setGivesPix((v) => !v);
                }}
              />
            )}

            {step === 3 && family && (
              <div className="space-y-4">
                <div className="card-soft p-5 sm:p-6 space-y-4">
                  <div>
                    <p className="label-uppercase mb-1">{family.name}</p>
                    <p className="text-[15px] text-[var(--color-ink)]">
                      {vai
                        ? `Vão: ${family.members
                            .filter((m) => attending.has(m.id))
                            .map((m) => m.name)
                            .join(", ")}`
                        : "Não vamos poder ir 😢"}
                    </p>
                  </div>
                  <HorizontalDivider width={40} className="!mx-0" />
                  <div>
                    <p className="label-uppercase mb-2">Presentes</p>
                    {giftCount === 0 ? (
                      <p className="text-[15px] text-[var(--color-text-soft)]">
                        Nenhum presente
                      </p>
                    ) : (
                      <ul className="space-y-1.5">
                        {givesPix && (
                          <li className="text-[15px] text-[var(--color-ink)]">💸 Via Pix ou cartão</li>
                        )}
                        {chosenItems.map((it) => (
                          <li key={it!.id} className="text-[15px] text-[var(--color-ink)]">
                            🎁 {it!.nome}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="card-soft p-5 sm:p-6">
                  <label htmlFor="cha-recado" className="block text-base font-medium text-[var(--color-ink)] mb-2">
                    Quer deixar um recado?{" "}
                    <span className="text-[13px] font-normal text-[var(--color-text-soft)]">(opcional)</span>
                  </label>
                  <textarea
                    id="cha-recado"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    maxLength={1000}
                    placeholder="Escreva aqui..."
                    className="input-soft text-base min-h-[90px] resize-none"
                  />
                </div>
              </div>
            )}

            {step === "done" && (
              <div className="text-center py-6">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 220, damping: 18 }}
                  className="text-6xl mb-4"
                >
                  {vai ? "🏡" : "💛"}
                </motion.div>
                <h2 className="heading-display text-3xl mb-3">
                  {vai ? "Obrigado!" : "Obrigado por avisar!"}
                </h2>
                <p className="text-base text-[var(--color-text-soft)] leading-relaxed">
                  {vai
                    ? `Te esperamos dia ${CHA.dateShort}, às ${CHA.timeLabel}! 🥂`
                    : "Vamos sentir sua falta, mas obrigado pelo carinho."}
                </p>
                {givesPix && (
                  <div className="card-soft p-5 sm:p-6 mt-8 text-left">
                    <p className="text-base font-medium text-[var(--color-ink)] mb-4 text-center">
                      Dados para o Pix 💸
                    </p>
                    <PixInfo />
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {error && (
          <p
            role="alert"
            className="mt-5 text-center text-[15px] text-red-800 bg-red-50 border border-red-200 rounded-2xl py-3 px-4"
          >
            {error}
          </p>
        )}
      </div>

      {/* Barra de ação fixa — botão grande sempre à mão */}
      {step !== "done" && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-[var(--color-cream)]/95 backdrop-blur border-t border-[var(--color-border-soft)] px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="max-w-2xl mx-auto flex items-center gap-3">
            {step !== 1 && (
              <button
                type="button"
                onClick={() => go(((step as number) - 1) as Step)}
                disabled={submitting}
                aria-label="Voltar"
                className="h-[52px] w-[52px] shrink-0 rounded-full border border-[var(--color-border-soft)] flex items-center justify-center text-[var(--color-champagne-deep)] hover:bg-white disabled:opacity-50"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            {step === 1 && (
              <button type="button" onClick={nextFromStep1} className="btn-cta flex-1 !py-4">
                {going === false ? "Confirmar Ausência" : "Continuar"}
              </button>
            )}
            {step === 2 && (
              <button
                type="button"
                onClick={nextFromStep2}
                disabled={submitting}
                className="btn-cta flex-1 !py-4 !px-6"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Enviando...
                  </>
                ) : giftCount > 0 ? (
                  `Continuar (${giftCount})`
                ) : vai ? (
                  "Continuar"
                ) : (
                  "Pular e enviar"
                )}
              </button>
            )}
            {step === 3 && (
              <button
                type="button"
                onClick={submit}
                disabled={submitting}
                className="btn-cta flex-1 !py-4"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Enviando...
                  </>
                ) : (
                  "Confirmar"
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

function Header() {
  return (
    <header className="text-center px-5 pt-14 sm:pt-20 pb-8">
      <Ornament className="mb-4" />
      <p className="label-uppercase">Você é nosso convidado</p>
      <h1 className="heading-display text-4xl sm:text-5xl mt-2">Chá de Casa Nova</h1>
      <p className="italic-romance text-xl text-[var(--color-champagne-deep)] mt-1">
        {WEDDING.coupleName}
      </p>
      <div className="mt-6 inline-flex flex-col items-center gap-2 text-[15px] text-[var(--color-text)]">
        <span className="inline-flex items-center gap-2">
          <CalendarHeart size={17} className="text-[var(--color-champagne-deep)]" />
          {CHA.dateLabel} · {CHA.timeLabel}
        </span>
        <span className="max-w-sm">
          <MapPin
            size={17}
            className="inline align-[-3px] mr-2 text-[var(--color-champagne-deep)]"
          />
          {CHA.address},{" "}
          <span className="whitespace-nowrap">CEP {CHA.cep}</span>
        </span>
      </div>
      <div>
        <a
          href={CHA.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 py-3 px-6 rounded-full border border-[var(--color-champagne-deep)] text-[var(--color-champagne-darker)] hover:bg-[var(--color-champagne-darker)] hover:text-[var(--color-cream)] active:scale-[0.98] text-[11px] tracking-[0.3em] uppercase font-medium transition-all"
        >
          <MapPin size={14} strokeWidth={1.6} />
          Ver no mapa
        </a>
      </div>
    </header>
  );
}
