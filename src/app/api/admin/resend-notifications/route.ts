import { NextResponse } from "next/server";
import { z } from "zod";
import { buildNotifications } from "@/lib/resend-notifications";
import { sendEmail, getNotificationEmails } from "@/lib/email";
import { ensureAdmin } from "@/lib/admin-guard";

export const runtime = "nodejs";

export async function GET() {
  const guard = await ensureAdmin();
  if (!guard.ok) return guard.response;
  const list = await buildNotifications();
  return NextResponse.json({
    to: getNotificationEmails(),
    items: list.map(({ key, label }) => ({ key, label })),
  });
}

// Envia um aviso por chamada: o admin percorre a lista, sem risco de a função
// serverless estourar o tempo tentando mandar todos de uma vez.
export async function POST(request: Request) {
  const guard = await ensureAdmin(request);
  if (!guard.ok) return guard.response;
  const parsed = z
    .object({ key: z.string().min(1).max(100) })
    .safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Dados inválidos" }, { status: 400 });
  }
  const item = (await buildNotifications()).find((n) => n.key === parsed.data.key);
  if (!item) {
    return NextResponse.json({ ok: false, error: "Registro não encontrado" }, { status: 404 });
  }
  const result = await sendEmail({
    to: getNotificationEmails(),
    subject: item.subject,
    react: item.react,
  });
  if (!result.ok) {
    console.error(`[Email] Reenvio falhou (${result.reason}): ${result.error}`);
    return NextResponse.json({ ok: false, error: result.error }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
