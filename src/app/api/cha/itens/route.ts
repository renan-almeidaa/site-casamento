import { NextResponse } from "next/server";
import { listTakenItemIds } from "@/lib/cha-data";
import { rateLimit, getClientIp, tooManyRequests } from "@/lib/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Devolve só os ids dos itens já escolhidos — nunca quem escolheu.
export async function GET(request: Request) {
  const ip = getClientIp(request);
  if (!rateLimit(`cha-itens:${ip}`, 120, 60_000)) return tooManyRequests();
  try {
    const taken = await listTakenItemIds();
    return NextResponse.json(
      { taken },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (err) {
    console.error("[CHA] Erro ao listar itens", err);
    return NextResponse.json({ error: "Erro ao carregar a lista" }, { status: 500 });
  }
}
