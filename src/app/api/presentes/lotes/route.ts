import { NextResponse } from "next/server";
import { listTakenLotIds } from "@/lib/gift-lots";
import { rateLimit, getClientIp, tooManyRequests } from "@/lib/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Devolve só os ids dos lotes já escolhidos — nunca quem escolheu.
export async function GET(request: Request) {
  const ip = getClientIp(request);
  if (!rateLimit(`presente-lotes:${ip}`, 120, 60_000)) return tooManyRequests();
  try {
    const taken = await listTakenLotIds();
    return NextResponse.json(
      { taken },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (err) {
    console.error("[Presente] Erro ao listar lotes", err);
    return NextResponse.json({ error: "Erro ao carregar os lotes" }, { status: 500 });
  }
}
