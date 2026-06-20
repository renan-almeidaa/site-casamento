import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { getDemoStore, newId } from "@/lib/demo-store";
import { sendBrevoEmail, getNotificationEmails } from "@/lib/brevo";
import { RsvpEmail } from "@/emails/RsvpEmail";
import {
  rateLimit,
  getClientIp,
  tooManyRequests,
  redact,
} from "@/lib/security";

export const runtime = "nodejs";

// IDs do Supabase são UUIDs; restringimos para evitar abuso (não precisa
// regex de UUID rigorosa mas garantimos limite de tamanho).
const idSchema = z.string().min(1).max(64);

const schema = z.object({
  familyId: idSchema,
  // attendingGuestIds vazio = ninguém da família vai (decline implícito).
  // Frontend já mostra um confirm() antes de submeter caso esteja vazio.
  attendingGuestIds: z.array(idSchema).max(30),
  phone: z.string().min(8).max(30),
  email: z.string().email().max(254),
  comment: z.string().max(1000).optional().nullable(),
});

async function sendNotification(payload: {
  confirmed: boolean;
  familyName: string;
  attendingNames: string[];
  notAttendingNames: string[];
  totalAdults: number;
  totalChildren: number;
  phone: string;
  email: string;
  comment?: string | null;
}) {
  const result = await sendBrevoEmail({
    to: getNotificationEmails(),
    subject: payload.confirmed
      ? `✨ ${payload.familyName} confirmou presença`
      : `🙏 ${payload.familyName} não poderá ir`,
    react: RsvpEmail(payload),
  });
  if (!result.ok) {
    const logFn = result.reason === "not_configured" ? console.info : console.error;
    logFn(
      `[RSVP] Email não enviado (${result.reason}): ${result.error}`,
      redact(payload as unknown as Record<string, unknown>),
    );
  }
}

export async function POST(request: Request) {
  // Rate limit por IP: generoso para acomodar CGNAT (operadoras móveis
  // brasileiras colocam milhares de usuários atrás do mesmo IP) e WiFi
  // compartilhado. 30 confirmações/hora ainda barra bots agressivos.
  const ip = getClientIp(request);
  if (!rateLimit(`rsvp-ip:${ip}`, 30, 60 * 60_000)) {
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

  // Rate limit por família: 3 envios em 10min na mesma família (permite
  // corrigir erro, mas bloqueia bot que spamma uma família específica).
  if (!rateLimit(`rsvp-fam:${data.familyId}`, 3, 10 * 60_000)) {
    return tooManyRequests();
  }

  const supa = createSupabaseServiceClient();
  if (supa) {
    const { data: family } = await supa
      .from("families")
      .select("id, name")
      .eq("id", data.familyId)
      .single();
    if (!family) {
      return NextResponse.json(
        { error: "Família não encontrada" },
        { status: 404 },
      );
    }

    const { data: existing } = await supa
      .from("rsvp_responses")
      .select("id")
      .eq("family_id", data.familyId)
      .limit(1)
      .maybeSingle();
    if (existing) {
      return NextResponse.json(
        {
          error:
            "Esta família já enviou uma resposta. Se precisar alterar, entre em contato com os noivos pelo WhatsApp.",
        },
        { status: 409 },
      );
    }

    const { data: members } = await supa
      .from("guests")
      .select("id, name, is_child")
      .eq("family_id", data.familyId);
    const attending = (members ?? []).filter((m) =>
      data.attendingGuestIds.includes(m.id),
    );
    const notAttending = (members ?? []).filter(
      (m) => !data.attendingGuestIds.includes(m.id),
    );
    const confirmed = attending.length > 0;

    const { error } = await supa.from("rsvp_responses").insert({
      family_id: data.familyId,
      confirmed,
      attending_guest_ids: data.attendingGuestIds,
      phone: data.phone,
      email: data.email,
      comment: data.comment ?? null,
    });
    if (error) {
      console.error("[RSVP] Erro ao gravar", error);
      return NextResponse.json({ error: "Erro ao gravar resposta" }, { status: 500 });
    }

    await sendNotification({
      confirmed,
      familyName: family.name,
      attendingNames: attending.map((m) => m.name),
      notAttendingNames: notAttending.map((m) => m.name),
      totalAdults: attending.filter((m) => !m.is_child).length,
      totalChildren: attending.filter((m) => m.is_child).length,
      phone: data.phone,
      email: data.email,
      comment: data.comment,
    });
    return NextResponse.json({ ok: true });
  }

  // Fallback demo
  const store = getDemoStore();
  const family = store.families.find((f) => f.id === data.familyId);
  if (!family) {
    return NextResponse.json({ error: "Família não encontrada" }, { status: 404 });
  }
  if (store.rsvp_responses.some((r) => r.family_id === data.familyId)) {
    return NextResponse.json(
      {
        error:
          "Esta família já enviou uma resposta. Se precisar alterar, entre em contato com os noivos pelo WhatsApp.",
      },
      { status: 409 },
    );
  }
  const members = store.guests.filter((g) => g.family_id === data.familyId);
  const attending = members.filter((m) =>
    data.attendingGuestIds.includes(m.id),
  );
  const notAttending = members.filter(
    (m) => !data.attendingGuestIds.includes(m.id),
  );
  const confirmed = attending.length > 0;

  store.rsvp_responses.push({
    id: newId(),
    family_id: data.familyId,
    confirmed,
    attending_guest_ids: data.attendingGuestIds,
    phone: data.phone,
    email: data.email,
    comment: data.comment ?? null,
    created_at: new Date().toISOString(),
  });

  await sendNotification({
    confirmed,
    familyName: family.name,
    attendingNames: attending.map((m) => m.name),
    notAttendingNames: notAttending.map((m) => m.name),
    totalAdults: attending.filter((m) => !m.is_child).length,
    totalChildren: attending.filter((m) => m.is_child).length,
    phone: data.phone,
    email: data.email,
    comment: data.comment,
  });

  return NextResponse.json({ ok: true });
}
