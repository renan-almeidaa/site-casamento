import { NextResponse } from "next/server";
import { releaseChaItem } from "@/lib/cha-data";
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
    await releaseChaItem(itemId);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro" },
      { status: 500 },
    );
  }
}
