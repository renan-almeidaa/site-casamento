import "server-only";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { getDemoStore, newId } from "@/lib/demo-store";
import { getChaItem } from "@/data/cha-itens";

// =====================================================================
// Camada de dados do chá de casa nova. Mesmo padrão de admin-data.ts:
// Supabase (service role) quando configurado, demo store em memória
// quando não.
// =====================================================================

export async function listTakenItemIds(): Promise<string[]> {
  const supa = createSupabaseServiceClient();
  if (supa) {
    const { data, error } = await supa.from("cha_gift_claims").select("item_id");
    if (error) throw new Error(error.message);
    return (data ?? []).map((r) => r.item_id as string);
  }
  return getDemoStore().cha_gift_claims.map((c) => c.item_id);
}

export type ChaSubmitInput = {
  familyId: string;
  attendingGuestIds: string[];
  whatsapp: string;
  givesPix: boolean;
  comment: string | null;
  itemIds: string[];
};

export type ChaSubmitResult =
  | {
      ok: true;
      familyName: string;
      attendingNames: string[];
      notAttendingNames: string[];
    }
  | { ok: false; error: "family_not_found" }
  | { ok: false; error: "family_exists" }
  | { ok: false; error: "taken"; taken: string[] };

type Member = { id: string; name: string };

function splitMembers(members: Member[], attendingIds: string[]) {
  return {
    attendingNames: members
      .filter((m) => attendingIds.includes(m.id))
      .map((m) => m.name),
    notAttendingNames: members
      .filter((m) => !attendingIds.includes(m.id))
      .map((m) => m.name),
  };
}

export async function submitChaRsvp(
  input: ChaSubmitInput,
): Promise<ChaSubmitResult> {
  const supa = createSupabaseServiceClient();
  if (supa) {
    const { data: family } = await supa
      .from("families")
      .select("id, name")
      .eq("id", input.familyId)
      .maybeSingle();
    if (!family) return { ok: false, error: "family_not_found" };

    const { data: members } = await supa
      .from("guests")
      .select("id, name")
      .eq("family_id", input.familyId);
    // Ignora ids que não são da família (cliente adulterado).
    const memberIds = new Set((members ?? []).map((m) => m.id as string));
    const attending = input.attendingGuestIds.filter((id) => memberIds.has(id));

    const { data, error } = await supa.rpc("submit_cha_rsvp", {
      p_family_id: input.familyId,
      p_attending: attending,
      p_whatsapp: input.whatsapp,
      p_gives_pix: input.givesPix,
      p_comment: input.comment,
      p_item_ids: input.itemIds,
    });
    if (error) throw new Error(error.message);

    const res = data as
      | { ok: true; id: string }
      | { ok: false; error: "family_exists" }
      | { ok: false; error: "taken"; taken: string[] };
    if (!res.ok) return res;

    return {
      ok: true,
      familyName: family.name as string,
      ...splitMembers((members ?? []) as Member[], attending),
    };
  }

  // Fallback demo — mesma regra da função SQL.
  const store = getDemoStore();
  const family = store.families.find((f) => f.id === input.familyId);
  if (!family) return { ok: false, error: "family_not_found" };
  if (store.cha_rsvp_responses.some((r) => r.family_id === input.familyId)) {
    return { ok: false, error: "family_exists" };
  }
  const taken = store.cha_gift_claims
    .map((c) => c.item_id)
    .filter((id) => input.itemIds.includes(id));
  if (taken.length > 0) return { ok: false, error: "taken", taken };

  const members = store.guests.filter((g) => g.family_id === input.familyId);
  const memberIds = new Set(members.map((m) => m.id));
  const attending = input.attendingGuestIds.filter((id) => memberIds.has(id));
  const id = newId();
  const now = new Date().toISOString();
  store.cha_rsvp_responses.push({
    id,
    family_id: input.familyId,
    attending_guest_ids: attending,
    whatsapp: input.whatsapp,
    gives_pix: input.givesPix,
    comment: input.comment,
    created_at: now,
  });
  for (const itemId of input.itemIds) {
    store.cha_gift_claims.push({ item_id: itemId, response_id: id, created_at: now });
  }
  return { ok: true, familyName: family.name, ...splitMembers(members, attending) };
}

// =====================================================================
// Admin
// =====================================================================

export type AdminChaResponse = {
  id: string;
  familyName: string;
  attendingNames: string[];
  notAttendingNames: string[];
  whatsapp: string;
  givesPix: boolean;
  comment: string | null;
  items: { id: string; nome: string; comodo: string }[];
  createdAt: string;
};

type RawResponse = {
  id: string;
  family_id: string;
  attending_guest_ids: string[];
  whatsapp: string;
  gives_pix: boolean;
  comment: string | null;
  created_at: string;
};

function buildAdminResponses(
  responses: RawResponse[],
  families: { id: string; name: string }[],
  guests: { id: string; family_id: string; name: string }[],
  claims: { item_id: string; response_id: string }[],
): AdminChaResponse[] {
  return responses.map((r) => {
    const members = guests.filter((g) => g.family_id === r.family_id);
    return {
      id: r.id,
      familyName: families.find((f) => f.id === r.family_id)?.name ?? "—",
      ...splitMembers(members, r.attending_guest_ids ?? []),
      whatsapp: r.whatsapp,
      givesPix: r.gives_pix,
      comment: r.comment,
      items: claims
        .filter((c) => c.response_id === r.id)
        .map((c) => {
          const item = getChaItem(c.item_id);
          return {
            id: c.item_id,
            nome: item?.nome ?? c.item_id,
            comodo: item?.comodoLabel ?? "",
          };
        }),
      createdAt: r.created_at,
    };
  });
}

export async function listChaResponses(): Promise<AdminChaResponse[]> {
  const supa = createSupabaseServiceClient();
  if (supa) {
    const [responses, families, guests, claims] = await Promise.all([
      supa
        .from("cha_rsvp_responses")
        .select("id, family_id, attending_guest_ids, whatsapp, gives_pix, comment, created_at")
        .order("created_at", { ascending: false }),
      supa.from("families").select("id, name"),
      supa.from("guests").select("id, family_id, name"),
      supa.from("cha_gift_claims").select("item_id, response_id"),
    ]);
    const err = responses.error ?? families.error ?? guests.error ?? claims.error;
    if (err) throw new Error(err.message);
    return buildAdminResponses(
      (responses.data ?? []) as RawResponse[],
      families.data ?? [],
      guests.data ?? [],
      claims.data ?? [],
    );
  }
  const store = getDemoStore();
  return buildAdminResponses(
    [...store.cha_rsvp_responses].sort((a, b) =>
      b.created_at.localeCompare(a.created_at),
    ),
    store.families,
    store.guests,
    store.cha_gift_claims,
  );
}

export async function releaseChaItem(itemId: string) {
  const supa = createSupabaseServiceClient();
  if (supa) {
    const { error } = await supa.from("cha_gift_claims").delete().eq("item_id", itemId);
    if (error) throw new Error(error.message);
    return;
  }
  const store = getDemoStore();
  store.cha_gift_claims = store.cha_gift_claims.filter((c) => c.item_id !== itemId);
}

export async function deleteChaResponse(id: string) {
  const supa = createSupabaseServiceClient();
  if (supa) {
    // Claims caem junto (on delete cascade).
    const { error } = await supa.from("cha_rsvp_responses").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return;
  }
  const store = getDemoStore();
  store.cha_rsvp_responses = store.cha_rsvp_responses.filter((r) => r.id !== id);
  store.cha_gift_claims = store.cha_gift_claims.filter((c) => c.response_id !== id);
}
