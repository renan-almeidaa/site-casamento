import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { getDemoStore, newId } from "@/lib/demo-store";
import { sendBrevoEmail, getNotificationEmails } from "@/lib/brevo";
import { GiftPurchaseEmail } from "@/emails/GiftPurchaseEmail";
import {
  PRESENTES,
  VALOR_COTA,
  cotaItemId,
  getPresenteDaCota,
  temCotas,
  totalCotas,
} from "@/data/presentes";
import { registerGiftWithQuotas } from "@/lib/gift-quotas";
import {
  rateLimit,
  getClientIp,
  tooManyRequests,
  redact,
} from "@/lib/security";

export const runtime = "nodejs";

const itemSchema = z.object({
  id: z.string().min(1).max(64),
  nome: z.string().min(1).max(120),
  valor: z.number().nonnegative().max(100_000),
  qtd: z.number().int().positive().max(50),
});

// Limite superior generoso mas defensivo: ninguém vai presentear acima
// de R$ 200k em um casamento; cap previne abuso em cálculos do MP.
const schema = z.object({
  buyerName: z.string().min(2).max(120),
  buyerWhatsapp: z.string().min(8).max(30),
  items: z.array(itemSchema).min(1).max(50),
  total: z.number().nonnegative().max(200_000),
  paymentMethod: z.enum(["pix", "cartao"]).optional().default("pix"),
  previousPurchaseId: z.string().uuid().optional().nullable(),
});

async function notify(payload: {
  buyerName: string;
  buyerWhatsapp: string;
  items: { nome: string; valor: number; qtd: number }[];
  total: number;
}) {
  const result = await sendBrevoEmail({
    to: getNotificationEmails(),
    subject: `🎁 ${payload.buyerName} registrou um presente`,
    react: GiftPurchaseEmail(payload),
  });
  if (!result.ok) {
    const logFn = result.reason === "not_configured" ? console.info : console.error;
    logFn(
      `[Presente] Email não enviado (${result.reason}): ${result.error}`,
      redact(payload as unknown as Record<string, unknown>),
    );
  }
}

export async function POST(request: Request) {
  // Rate limit generoso por IP (30/h) para acomodar CGNAT e WiFi compartilhado
  // — não dá pra prever quantos convidados vão presentear na mesma rede.
  const ip = getClientIp(request);
  if (!rateLimit(`presente-ip:${ip}`, 30, 60 * 60_000)) {
    return tooManyRequests();
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const data = parsed.data;

  // Presente grande só entra em cotas. Carrinho antigo (presente inteiro ou
  // lote do formato anterior) cai aqui e o item é retirado pelo cliente.
  const antigos = data.items
    .filter(
      (it) =>
        it.id.includes("--lote-") ||
        PRESENTES.some((p) => p.id === it.id && temCotas(p)),
    )
    .map((it) => it.id);
  if (antigos.length > 0) {
    return NextResponse.json(
      { error: "taken", takenItemIds: antigos },
      { status: 409 },
    );
  }

  const cotaItems = data.items.filter((it) => it.id.endsWith("--cotas"));
  const cotas: { presente_id: string; qtd: number; total: number }[] = [];
  for (const it of cotaItems) {
    const presente = getPresenteDaCota(it.id);
    if (!presente || it.valor !== VALOR_COTA || it.qtd > totalCotas(presente)) {
      return NextResponse.json({ error: "Cota inválida" }, { status: 400 });
    }
    cotas.push({
      presente_id: presente.id,
      qtd: it.qtd,
      total: totalCotas(presente),
    });
  }

  const supa = createSupabaseServiceClient();
  let purchaseId: string;
  if (cotas.length > 0 || data.previousPurchaseId) {
    let result;
    try {
      result = await registerGiftWithQuotas({
        buyerName: data.buyerName,
        buyerWhatsapp: data.buyerWhatsapp,
        items: data.items,
        total: data.total,
        paymentMethod: data.paymentMethod,
        cotas,
        previousId: data.previousPurchaseId ?? null,
      });
    } catch (err) {
      console.error("[Presente] Erro ao gravar com cotas", err);
      return NextResponse.json({ error: "Erro ao gravar" }, { status: 500 });
    }
    if (!result.ok) {
      return NextResponse.json(
        {
          error: "cotas",
          short: result.short.map((s) => ({
            id: cotaItemId(s.presente_id),
            restante: Math.max(0, s.restante),
          })),
        },
        { status: 409 },
      );
    }
    purchaseId = result.id;
  } else if (supa) {
    const { data: insert, error } = await supa
      .from("gift_purchases")
      .insert({
        buyer_name: data.buyerName,
        buyer_whatsapp: data.buyerWhatsapp,
        items: data.items,
        total: data.total,
        payment_method: data.paymentMethod,
        status: "aguardando",
      })
      .select("id")
      .single();
    if (error) {
      console.error("[Presente] Erro ao gravar", error);
      return NextResponse.json({ error: "Erro ao gravar" }, { status: 500 });
    }
    purchaseId = insert.id;
  } else {
    const store = getDemoStore();
    purchaseId = newId();
    store.gift_purchases.push({
      id: purchaseId,
      buyer_name: data.buyerName,
      buyer_whatsapp: data.buyerWhatsapp,
      items: data.items,
      total: data.total,
      payment_method: data.paymentMethod,
      status: "aguardando",
      created_at: new Date().toISOString(),
    });
  }

  // fire-and-forget — não bloqueia a resposta
  void notify({
    buyerName: data.buyerName,
    buyerWhatsapp: data.buyerWhatsapp,
    items: data.items,
    total: data.total,
  });

  return NextResponse.json({ ok: true, id: purchaseId });
}
