import { NextResponse } from "next/server";
import { listGiftPurchases } from "@/lib/admin-data";
import { ensureAdmin } from "@/lib/admin-guard";

export const runtime = "nodejs";

export async function GET() {
  const guard = await ensureAdmin();
  if (!guard.ok) return guard.response;
  const purchases = await listGiftPurchases();
  return NextResponse.json({ purchases });
}
