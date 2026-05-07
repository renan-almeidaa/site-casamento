import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { getDemoStore } from "@/lib/demo-store";
import { rateLimit, getClientIp, tooManyRequests } from "@/lib/security";

export const runtime = "nodejs";

const idSchema = z.string().min(1).max(64);
const schema = z.object({
  paymentMethod: z.enum(["pix", "cartao"]),
});

// Endpoint público para o convidado atualizar o método de pagamento depois
// que já registrou o presente no /resumo. Sem auth: o ID é tratado como
// um identificador opaco e o impacto de uma escrita maliciosa é apenas
// trocar a label "pix"/"cartão" no admin.
export async function PATCH(
  request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const ip = getClientIp(request);
  // Não bloqueia toggle entre PIX/Cartão (operação leve), mas previne loop.
  if (!rateLimit(`presente-patch:${ip}`, 100, 60 * 60_000)) {
    return tooManyRequests();
  }
  const { id } = await ctx.params;
  if (!idSchema.safeParse(id).success) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  const supa = createSupabaseServiceClient();
  if (supa) {
    const { error } = await supa
      .from("gift_purchases")
      .update({ payment_method: parsed.data.paymentMethod })
      .eq("id", id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } else {
    const store = getDemoStore();
    const p = store.gift_purchases.find((x) => x.id === id);
    if (p) p.payment_method = parsed.data.paymentMethod;
  }

  return NextResponse.json({ ok: true });
}
