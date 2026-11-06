import "server-only";
import nodemailer from "nodemailer";
import { render } from "@react-email/components";
import type { ReactElement } from "react";

// Avisos para os noivos, enviados pela conta Gmail com senha de app.

export type SendEmailInput = {
  to: string | string[];
  subject: string;
  react: ReactElement;
};

export type SendEmailResult =
  | { ok: true; messageId?: string }
  | { ok: false; reason: "not_configured" | "render_failed" | "send_failed"; error: string };

export function getNotificationEmails(): string[] {
  const raw = process.env.NOTIFICATION_EMAIL ?? "renangada@gmail.com";
  return raw
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
}

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const user = process.env.GMAIL_USER?.trim();
  // O Google mostra a senha de app com espaços; ela funciona sem eles.
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, "");
  if (!user || !pass) {
    return {
      ok: false,
      reason: "not_configured",
      error: "GMAIL_USER ou GMAIL_APP_PASSWORD ausente",
    };
  }

  let html: string;
  try {
    html = await render(input.react);
  } catch (err) {
    return {
      ok: false,
      reason: "render_failed",
      error: err instanceof Error ? err.message : String(err),
    };
  }

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
    // Limites curtos: a resposta do convidado não pode ficar presa no envio.
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 10000,
  });

  try {
    const info = await transport.sendMail({
      from: { name: "Casamento Samara & Renan", address: user },
      to: input.to,
      subject: input.subject,
      html,
    });
    return { ok: true, messageId: info.messageId };
  } catch (err) {
    return {
      ok: false,
      reason: "send_failed",
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
