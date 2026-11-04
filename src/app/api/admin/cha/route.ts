import { NextResponse } from "next/server";
import { listChaResponses } from "@/lib/cha-data";
import { ensureAdmin } from "@/lib/admin-guard";

export const runtime = "nodejs";

export async function GET() {
  const guard = await ensureAdmin();
  if (!guard.ok) return guard.response;
  try {
    const responses = await listChaResponses();
    return NextResponse.json({ responses });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro" },
      { status: 500 },
    );
  }
}
