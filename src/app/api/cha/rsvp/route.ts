import { NextResponse } from "next/server";
import { z } from "zod";
import { submitChaRsvp } from "@/lib/cha-data";
import { getChaItem } from "@/data/cha-itens";
import { sendBrevoEmail, getNotificationEmails } from "@/lib/brevo";
import { ChaEmail } from "@/emails/ChaEmail";
import {
  rateLimit,
  getClientIp,
  tooManyRequests,
  isSameOrigin,
  forbiddenOrigin,
  redact,
} from "@/lib/security";

export const runtime = "nodejs";

const idSchema = z.string().min(1).max(64);

const schema = z.object({
  familyId: idSchema,
  attendingGuestIds: z.array(idSchema).max(30),
  whatsapp: z.string().min(8).max(30),
  givesPix: z.boolean(),
  itemIds: z
    .array(idSchema)
    .max(80)
    .refine((ids) => ids.every((id) => getChaItem(id)), "Item inválido")
    .refine((ids) => new Set(ids).size === ids.length, "Item repetido"),
  comment: z.string().max(1000).optional().nullable(),
});

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return forbiddenOrigin();

  const ip = getClientIp(request);
  if (!rateLimit(`cha-rsvp-ip:${ip}`, 30, 60 * 60_000)) {
    return tooManyRequests();
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const data = parsed.data;

  if (!rateLimit(`cha-rsvp-fam:${data.familyId}`, 5, 10 * 60_000)) {
    return tooManyRequests();
  }

  let result;
  try {
    result = await submitChaRsvp({
      familyId: data.familyId,
      attendingGuestIds: data.attendingGuestIds,
      whatsapp: data.whatsapp,
      givesPix: data.givesPix,
      comment: data.comment?.trim() || null,
      itemIds: data.itemIds,
    });
  } catch (err) {
    console.error("[CHA] Erro ao gravar", err);
    return NextResponse.json({ error: "Erro ao gravar resposta" }, { status: 500 });
  }

  if (!result.ok) {
    if (result.error === "family_not_found") {
      return NextResponse.json({ error: "Família não encontrada" }, { status: 404 });
    }
    if (result.error === "family_exists") {
      return NextResponse.json(
        {
          error:
            "Sua família já respondeu 💛 Se precisar mudar algo, fale com Renan ou Samara.",
        },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { error: "taken", takenItemIds: result.taken },
      { status: 409 },
    );
  }

  const items = data.itemIds.map((id) => {
    const it = getChaItem(id)!;
    return { nome: it.nome, comodo: it.comodoLabel };
  });
  const payload = {
    familyName: result.familyName,
    attendingNames: result.attendingNames,
    notAttendingNames: result.notAttendingNames,
    items,
    givesPix: data.givesPix,
    whatsapp: data.whatsapp,
    comment: data.comment,
  };
  const mail = await sendBrevoEmail({
    to: getNotificationEmails(),
    subject:
      result.attendingNames.length > 0
        ? `🏡 ${result.familyName} confirmou no chá`
        : `🙏 ${result.familyName} não poderá ir ao chá`,
    react: ChaEmail(payload),
  });
  if (!mail.ok) {
    const logFn = mail.reason === "not_configured" ? console.info : console.error;
    logFn(
      `[CHA] Email não enviado (${mail.reason}): ${mail.error}`,
      redact(payload as unknown as Record<string, unknown>, ["whatsapp", "comment"]),
    );
  }

  return NextResponse.json({ ok: true });
}
