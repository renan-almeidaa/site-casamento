import { NextResponse } from "next/server";
import { releaseItemClaim } from "@/lib/gift-quotas";
import { ensureAdmin } from "@/lib/admin-guard";

export const runtime = "nodejs";

export async function DELETE(
  request: Request,
  ctx: { params: Promise<{ itemId: string }> },
) {
  const guard = await ensureAdmin(request);
  if (!guard.ok) return guard.response;
  const { itemId } = await ctx.params;
  try {
    await releaseItemClaim(itemId);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro" },
      { status: 500 },
    );
  }
}
