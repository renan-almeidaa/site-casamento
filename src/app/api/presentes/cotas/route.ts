import { NextResponse } from "next/server";
import { listTakenItemIds, listUsedQuotas } from "@/lib/gift-quotas";
import { rateLimit, getClientIp, tooManyRequests } from "@/lib/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Devolve só o que já foi escolhido (cotas por presente e itens) — nunca quem.
export async function GET(request: Request) {
  const ip = getClientIp(request);
  if (!rateLimit(`presente-cotas:${ip}`, 120, 60_000)) return tooManyRequests();
  try {
    const [used, takenItems] = await Promise.all([
      listUsedQuotas(),
      listTakenItemIds(),
    ]);
    return NextResponse.json(
      { used, takenItems },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (err) {
    console.error("[Presente] Erro ao listar cotas", err);
    return NextResponse.json({ error: "Erro ao carregar as cotas" }, { status: 500 });
  }
}
