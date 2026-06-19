import { NextResponse } from "next/server";
import { z } from "zod";
import { deleteFamily, updateFamily } from "@/lib/admin-data";
import { ensureAdmin } from "@/lib/admin-guard";

export const runtime = "nodejs";

const updateSchema = z.object({
  name: z.string().min(2).max(120),
  members: z
    .array(
      z.object({
        id: z.string().min(1).max(64).optional(),
        name: z.string().min(1).max(80),
        isChild: z.boolean(),
      }),
    )
    .min(1)
    .max(30),
});

export async function PUT(
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
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }
  try {
    const family = await updateFamily(id, parsed.data);
    return NextResponse.json({ ok: true, family });
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
    await deleteFamily(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro" },
      { status: 500 },
    );
  }
}
