import { NextResponse } from "next/server";
import { z } from "zod";
import { addFamily, listFamilies } from "@/lib/admin-data";
import { ensureAdmin } from "@/lib/admin-guard";

export async function GET() {
  const guard = await ensureAdmin();
  if (!guard.ok) return guard.response;
  const families = await listFamilies();
  return NextResponse.json({ families });
}

export const runtime = "nodejs";

const schema = z.object({
  name: z.string().min(2).max(120),
  members: z
    .array(
      z.object({
        name: z.string().min(1).max(80),
        isChild: z.boolean(),
      }),
    )
    .min(1)
    .max(30),
});

export async function POST(request: Request) {
  const guard = await ensureAdmin(request);
  if (!guard.ok) return guard.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }
  try {
    const id = await addFamily(parsed.data);
    return NextResponse.json({ ok: true, id });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro" },
      { status: 500 },
    );
  }
}
