import { createElement } from "react";
import { NextResponse } from "next/server";
import { sendEmail, getNotificationEmails } from "@/lib/email";
import { ensureAdmin } from "@/lib/admin-guard";

export const runtime = "nodejs";

// Botão "Testar envio de email" do admin: mostra na tela o que aconteceu,
// sem precisar criar uma resposta falsa.
export async function POST(request: Request) {
  const guard = await ensureAdmin(request);
  if (!guard.ok) return guard.response;
  const to = getNotificationEmails();
  const result = await sendEmail({
    to,
    subject: "✅ Teste de email do site do casamento",
    react: createElement(
      "p",
      null,
      "Se você recebeu este email, os avisos do site estão funcionando.",
    ),
  });
  if (!result.ok) {
    console.error(`[Email] Teste falhou (${result.reason}): ${result.error}`);
    return NextResponse.json({ ok: false, to, error: result.error }, { status: 502 });
  }
  return NextResponse.json({ ok: true, to });
}
