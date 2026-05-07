import { NextResponse } from "next/server";
import { z } from "zod";
import { createCheckoutPreference } from "@/lib/mercadopago";
import {
  rateLimit,
  getClientIp,
  tooManyRequests,
  isSameOrigin,
  forbiddenOrigin,
} from "@/lib/security";

export const runtime = "nodejs";

const itemSchema = z.object({
  id: z.string().min(1).max(64),
  nome: z.string().min(1).max(120),
  valor: z.number().nonnegative().max(100_000),
  qtd: z.number().int().positive().max(50),
});

const schema = z.object({
  buyerName: z.string().min(2).max(120),
  purchaseId: z.string().min(1).max(64),
  total: z.number().positive().max(200_000),
  items: z.array(itemSchema).min(1).max(50),
});

export async function POST(request: Request) {
  // Endpoint sensível: cada chamada cria uma preferência via SDK do MP usando
  // o access token. Restringimos a chamadas vindas do nosso próprio domínio
  // (defesa contra outros sites disparando preferências no nosso nome) e
  // aplicamos rate limit agressivo por IP.
  if (!isSameOrigin(request)) return forbiddenOrigin();
  const ip = getClientIp(request);
  // Generoso o bastante para acomodar várias pessoas atrás do mesmo NAT,
  // mas ainda bloqueia abuso da SDK do Mercado Pago.
  if (!rateLimit(`mp:${ip}`, 30, 60 * 60_000)) {
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
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  const origin =
    request.headers.get("origin") ?? new URL(request.url).origin;

  try {
    const pref = await createCheckoutPreference({
      ...parsed.data,
      baseUrl: origin,
    });
    if (!pref) {
      return NextResponse.json(
        { error: "Mercado Pago não configurado" },
        { status: 503 },
      );
    }
    return NextResponse.json({
      ok: true,
      url: pref.initPoint,
      preferenceId: pref.id,
    });
  } catch (err) {
    // Não inclui o erro no response (pode vazar detalhes do SDK do MP).
    console.error(
      "[MP] Erro ao criar preferência",
      err instanceof Error ? err.message : err,
    );
    return NextResponse.json(
      { error: "Erro ao criar pagamento" },
      { status: 500 },
    );
  }
}
