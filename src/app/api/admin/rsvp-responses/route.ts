import { NextResponse } from "next/server";
import { listRsvps } from "@/lib/admin-data";
import { ensureAdmin } from "@/lib/admin-guard";

export const runtime = "nodejs";

export async function GET() {
  const guard = await ensureAdmin();
  if (!guard.ok) return guard.response;
  const rsvps = await listRsvps();
  return NextResponse.json({ rsvps });
}
