import { NextResponse } from "next/server";
import { adminStats, listGiftPurchases } from "@/lib/admin-data";
import { ensureAdmin } from "@/lib/admin-guard";

export const runtime = "nodejs";

export async function GET() {
  const guard = await ensureAdmin();
  if (!guard.ok) return guard.response;
  const [stats, purchases] = await Promise.all([
    adminStats(),
    listGiftPurchases(),
  ]);
  const totalArrecadado = purchases
    .filter((p) => p.status === "confirmado")
    .reduce((s, p) => s + p.total, 0);
  const totalPendente = purchases
    .filter((p) => p.status === "aguardando")
    .reduce((s, p) => s + p.total, 0);
  return NextResponse.json({ ...stats, totalArrecadado, totalPendente });
}
