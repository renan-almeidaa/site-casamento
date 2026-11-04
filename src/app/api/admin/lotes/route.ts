import { NextResponse } from "next/server";
import { listLotClaims } from "@/lib/gift-lots";
import { ensureAdmin } from "@/lib/admin-guard";

export const runtime = "nodejs";

export async function GET() {
  const guard = await ensureAdmin();
  if (!guard.ok) return guard.response;
  try {
    const claims = await listLotClaims();
    return NextResponse.json({ claims });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro" },
      { status: 500 },
    );
  }
}
