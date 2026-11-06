import { NextResponse } from "next/server";
import { listItemClaims } from "@/lib/gift-quotas";
import { ensureAdmin } from "@/lib/admin-guard";

export const runtime = "nodejs";

export async function GET() {
  const guard = await ensureAdmin();
  if (!guard.ok) return guard.response;
  try {
    const claims = await listItemClaims();
    return NextResponse.json({ claims });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro" },
      { status: 500 },
    );
  }
}
