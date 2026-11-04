import { NextResponse } from "next/server";
import { releaseQuotaClaim } from "@/lib/gift-quotas";
import { cotaItemId } from "@/data/presentes";
import { ensureAdmin } from "@/lib/admin-guard";

export const runtime = "nodejs";

export async function DELETE(
  request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const guard = await ensureAdmin(request);
  if (!guard.ok) return guard.response;
  const { id } = await ctx.params;
  try {
    await releaseQuotaClaim(id, cotaItemId);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro" },
      { status: 500 },
    );
  }
}
