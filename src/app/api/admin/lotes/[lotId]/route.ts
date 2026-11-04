import { NextResponse } from "next/server";
import { releaseLot } from "@/lib/gift-lots";
import { ensureAdmin } from "@/lib/admin-guard";

export const runtime = "nodejs";

export async function DELETE(
  request: Request,
  ctx: { params: Promise<{ lotId: string }> },
) {
  const guard = await ensureAdmin(request);
  if (!guard.ok) return guard.response;
  const { lotId } = await ctx.params;
  try {
    await releaseLot(lotId);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro" },
      { status: 500 },
    );
  }
}
