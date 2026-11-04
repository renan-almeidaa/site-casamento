import { NextResponse } from "next/server";
import { listUsedQuotas } from "@/lib/gift-quotas";
import { rateLimit, getClientIp, tooManyRequests } from "@/lib/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Devolve só quantas cotas de cada presente já foram escolhidas — nunca quem.
export async function GET(request: Request) {
  const ip = getClientIp(request);
  if (!rateLimit(`presente-cotas:${ip}`, 120, 60_000)) return tooManyRequests();
  try {
    const used = await listUsedQuotas();
    return NextResponse.json(
      { used },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (err) {
    console.error("[Presente] Erro ao listar cotas", err);
    return NextResponse.json({ error: "Erro ao carregar as cotas" }, { status: 500 });
  }
}
