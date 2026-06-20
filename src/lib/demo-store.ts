// Fallback store em memória para desenvolvimento sem Supabase configurado.
// Em produção (Supabase real), este arquivo nunca é usado.

import { randomUUID } from "node:crypto";

export type DemoGuest = {
  id: string;
  family_id: string;
  name: string;
  is_child: boolean;
  nicknames: string[];
};

export type DemoFamily = {
  id: string;
  name: string;
  notes: string | null;
  created_at: string;
};

export type DemoRsvp = {
  id: string;
  family_id: string;
  confirmed: boolean;
  attending_guest_ids: string[];
  phone: string;
  email: string;
  comment: string | null;
  created_at: string;
};

export type DemoGiftPurchase = {
  id: string;
  buyer_name: string;
  buyer_whatsapp: string;
  items: { id: string; nome: string; valor: number; qtd: number }[];
  total: number;
  payment_method: string | null;
  status: "aguardando" | "confirmado";
  created_at: string;
};

type Store = {
  families: DemoFamily[];
  guests: DemoGuest[];
  rsvp_responses: DemoRsvp[];
  gift_purchases: DemoGiftPurchase[];
};

declare global {
  // eslint-disable-next-line no-var
  var __weddingDemoStore: Store | undefined;
}

function seed(): Store {
  const f1: DemoFamily = {
    id: randomUUID(),
    name: "Família Adalberto",
    notes: null,
    created_at: new Date().toISOString(),
  };
  const f2: DemoFamily = {
    id: randomUUID(),
    name: "Família Maycon",
    notes: null,
    created_at: new Date().toISOString(),
  };
  return {
    families: [f1, f2],
    guests: [
      { id: randomUUID(), family_id: f1.id, name: "Adalberto", is_child: false, nicknames: [] },
      { id: randomUUID(), family_id: f1.id, name: "Creuza", is_child: false, nicknames: [] },
      { id: randomUUID(), family_id: f2.id, name: "Maycon", is_child: false, nicknames: [] },
      { id: randomUUID(), family_id: f2.id, name: "Vanessa", is_child: false, nicknames: [] },
      { id: randomUUID(), family_id: f2.id, name: "Nicolly", is_child: false, nicknames: [] },
      { id: randomUUID(), family_id: f2.id, name: "Pedro", is_child: false, nicknames: [] },
      { id: randomUUID(), family_id: f2.id, name: "Samuel", is_child: true, nicknames: [] },
    ],
    rsvp_responses: [],
    gift_purchases: [],
  };
}

export function getDemoStore(): Store {
  if (!globalThis.__weddingDemoStore) {
    globalThis.__weddingDemoStore = seed();
  }
  return globalThis.__weddingDemoStore;
}

export function newId() {
  return randomUUID();
}
