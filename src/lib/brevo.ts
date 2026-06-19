import { render } from "@react-email/components";
import type { ReactElement } from "react";

export type BrevoSendInput = {
  to: string | string[];
  subject: string;
  react: ReactElement;
};

export type BrevoSendResult =
  | { ok: true; messageId?: string }
  | { ok: false; reason: "not_configured" | "render_failed" | "api_error"; error: string };

export function getBrevoApiKey() {
  const key = process.env.BREVO_API_KEY;
  if (!key || key.includes("placeholder")) return null;
  return key;
}

export function getNotificationEmails(): string[] {
  const raw = process.env.NOTIFICATION_EMAIL ?? "renangada@gmail.com";
  return raw
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
}

export function getFromEmail() {
  return process.env.BREVO_FROM_EMAIL ?? "";
}

export function getFromName() {
  return process.env.BREVO_FROM_NAME ?? "Casamento Samara & Renan";
}

export async function sendBrevoEmail(
  input: BrevoSendInput,
): Promise<BrevoSendResult> {
  const apiKey = getBrevoApiKey();
  if (!apiKey) {
    return {
      ok: false,
      reason: "not_configured",
      error: "BREVO_API_KEY ausente",
    };
  }
  const from = getFromEmail();
  if (!from) {
    return {
      ok: false,
      reason: "not_configured",
      error: "BREVO_FROM_EMAIL ausente",
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

  let res: Response;
  try {
    res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        sender: { name: getFromName(), email: from },
        to: (Array.isArray(input.to) ? input.to : [input.to]).map((email) => ({
          email,
        })),
        subject: input.subject,
        htmlContent: html,
      }),
    });
  } catch (err) {
    return {
      ok: false,
      reason: "api_error",
      error: err instanceof Error ? err.message : String(err),
    };
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return {
      ok: false,
      reason: "api_error",
      error: `HTTP ${res.status}: ${text.slice(0, 200)}`,
    };
  }

  const data = (await res.json().catch(() => ({}))) as { messageId?: string };
  return { ok: true, messageId: data.messageId };
}
