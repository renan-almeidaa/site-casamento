import { NextResponse } from "next/server";
import { z } from "zod";
import { setGiftStatus, deleteGiftPurchase } from "@/lib/admin-data";
import { ensureAdmin } from "@/lib/admin-guard";

export const runtime = "nodejs";

const schema = z.object({
  status: z.enum(["aguardando", "confirmado"]),
});

export async function PATCH(
  request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const guard = await ensureAdmin(request);
  if (!guard.ok) return guard.response;
  const { id } = await ctx.params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Status inválido" }, { status: 400 });
  }
  try {
    await setGiftStatus(id, parsed.data.status);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const guard = await ensureAdmin(request);
  if (!guard.ok) return guard.response;
  const { id } = await ctx.params;
  try {
    await deleteGiftPurchase(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro" },
      { status: 500 },
    );
  }
}
