import { Resend } from "resend";

export function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key || key.includes("placeholder")) return null;
  return new Resend(key);
}

export function getNotificationEmail() {
  return process.env.NOTIFICATION_EMAIL ?? "renangada@gmail.com";
}

export function getFromEmail() {
  return (
    process.env.RESEND_FROM_EMAIL ??
    "Site Casamento <onboarding@resend.dev>"
  );
}
