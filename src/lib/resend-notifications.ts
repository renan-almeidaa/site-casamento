import "server-only";
import type { ReactElement } from "react";
import {
  listFamilies,
  listGiftPurchases,
  listRsvps,
} from "@/lib/admin-data";
import { listChaResponses } from "@/lib/cha-data";
import { RsvpEmail } from "@/emails/RsvpEmail";
import { ChaEmail } from "@/emails/ChaEmail";
import { GiftPurchaseEmail } from "@/emails/GiftPurchaseEmail";

// Monta de novo os avisos das respostas já gravadas, para reenviar os que não
// saíram enquanto o provedor de email bloqueava os envios.

export type PendingNotification = {
  key: string;
  label: string;
  subject: string;
  react: ReactElement;
};

export async function buildNotifications(): Promise<PendingNotification[]> {
  const [rsvps, families, cha, gifts] = await Promise.all([
    listRsvps(),
    listFamilies(),
    listChaResponses(),
    listGiftPurchases(),
  ]);

  const fromRsvps = rsvps.map((r): PendingNotification => {
    const members = families.find((f) => f.id === r.familyId)?.members ?? [];
    const attending = members.filter((m) => r.attendingNames.includes(m.name));
    return {
      key: `rsvp:${r.id}`,
      label: `Casamento · ${r.familyName}`,
      subject: r.confirmed
        ? `Reenvio: ${r.familyName} confirmou presença`
        : `Reenvio: ${r.familyName} não poderá ir`,
      react: RsvpEmail({
        confirmed: r.confirmed,
        familyName: r.familyName,
        attendingNames: r.attendingNames,
        notAttendingNames: r.notAttendingNames,
        totalAdults: attending.filter((m) => !m.isChild).length,
        totalChildren: attending.filter((m) => m.isChild).length,
        phone: r.phone,
        comment: r.comment,
      }),
    };
  });

  const fromCha = cha.map((r): PendingNotification => ({
    key: `cha:${r.id}`,
    label: `Chá · ${r.familyName}`,
    subject:
      r.attendingNames.length > 0
        ? `Reenvio: ${r.familyName} confirmou no chá`
        : `Reenvio: ${r.familyName} não poderá ir ao chá`,
    react: ChaEmail({
      familyName: r.familyName,
      attendingNames: r.attendingNames,
      notAttendingNames: r.notAttendingNames,
      items: r.items.map((it) => ({ nome: it.nome, comodo: it.comodo })),
      givesPix: r.givesPix,
      whatsapp: r.whatsapp,
      comment: r.comment,
    }),
  }));

  const fromGifts = gifts.map((g): PendingNotification => ({
    key: `presente:${g.id}`,
    label: `Presente · ${g.buyerName}`,
    subject: `Reenvio: ${g.buyerName} registrou um presente`,
    react: GiftPurchaseEmail({
      buyerName: g.buyerName,
      buyerWhatsapp: g.buyerWhatsapp,
      items: g.items,
      total: g.total,
    }),
  }));

  return [...fromRsvps, ...fromCha, ...fromGifts];
}
