import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { getDemoStore, newId } from "@/lib/demo-store";
import {
  getResend,
  getNotificationEmail,
  getFromEmail,
} from "@/lib/resend";
import { GiftPurchaseEmail } from "@/emails/GiftPurchaseEmail";
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
});

async function notify(payload: {
  buyerName: string;
  buyerWhatsapp: string;
  items: { nome: string; valor: number; qtd: number }[];
  total: number;
  paymentMethod: string;
}) {
  const resend = getResend();
  if (!resend) {
    console.info(
      "[Presente] (sem Resend) Novo presente registrado",
      redact(payload as unknown as Record<string, unknown>),
    );
    return;
  }
  try {
    await resend.emails.send({
      from: getFromEmail(),
      to: getNotificationEmail(),
      subject: `🎁 ${payload.buyerName} registrou um presente`,
      react: GiftPurchaseEmail(payload),
    });
  } catch (err) {
    console.error("[Presente] Erro ao enviar email", err);
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

  const supa = createSupabaseServiceClient();
  let purchaseId: string;
  if (supa) {
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
    paymentMethod: data.paymentMethod === "pix" ? "PIX" : "Cartão",
  });

  return NextResponse.json({ ok: true, id: purchaseId });
}
