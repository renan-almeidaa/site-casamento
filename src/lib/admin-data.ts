import "server-only";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { getDemoStore, newId } from "@/lib/demo-store";

export type AdminFamily = {
  id: string;
  name: string;
  members: { id: string; name: string; isChild: boolean }[];
  latestResponse: {
    confirmed: boolean;
    attendingGuestIds: string[];
    createdAt: string;
  } | null;
};

export type AdminRsvp = {
  id: string;
  familyId: string;
  familyName: string;
  confirmed: boolean;
  attendingNames: string[];
  phone: string;
  email: string;
  comment: string | null;
  createdAt: string;
};

export type AdminGiftPurchase = {
  id: string;
  buyerName: string;
  buyerWhatsapp: string;
  items: { id: string; nome: string; valor: number; qtd: number }[];
  total: number;
  paymentMethod: string | null;
  status: "aguardando" | "confirmado";
  createdAt: string;
};

export async function listFamilies(): Promise<AdminFamily[]> {
  const supa = createSupabaseServiceClient();
  if (supa) {
    const { data: families } = await supa
      .from("families")
      .select("id, name")
      .order("name");
    const { data: guests } = await supa
      .from("guests")
      .select("id, family_id, name, is_child");
    const { data: responses } = await supa
      .from("rsvp_responses")
      .select(
        "family_id, confirmed, attending_guest_ids, created_at",
      )
      .order("created_at", { ascending: false });

    return (families ?? []).map((f) => {
      const ms = (guests ?? [])
        .filter((g) => g.family_id === f.id)
        .map((g) => ({ id: g.id, name: g.name, isChild: g.is_child }));
      const latest = (responses ?? []).find((r) => r.family_id === f.id);
      return {
        id: f.id,
        name: f.name,
        members: ms,
        latestResponse: latest
          ? {
              confirmed: latest.confirmed,
              attendingGuestIds: latest.attending_guest_ids,
              createdAt: latest.created_at,
            }
          : null,
      };
    });
  }

  const store = getDemoStore();
  return store.families.map((f) => {
    const members = store.guests
      .filter((g) => g.family_id === f.id)
      .map((g) => ({ id: g.id, name: g.name, isChild: g.is_child }));
    const latest = store.rsvp_responses
      .filter((r) => r.family_id === f.id)
      .sort((a, b) => b.created_at.localeCompare(a.created_at))[0];
    return {
      id: f.id,
      name: f.name,
      members,
      latestResponse: latest
        ? {
            confirmed: latest.confirmed,
            attendingGuestIds: latest.attending_guest_ids,
            createdAt: latest.created_at,
          }
        : null,
    };
  });
}

export async function listRsvps(): Promise<AdminRsvp[]> {
  const supa = createSupabaseServiceClient();
  if (supa) {
    const { data: responses } = await supa
      .from("rsvp_responses")
      .select(
        "id, family_id, confirmed, attending_guest_ids, phone, email, comment, created_at",
      )
      .order("created_at", { ascending: false });
    if (!responses?.length) return [];
    const familyIds = Array.from(new Set(responses.map((r) => r.family_id)));
    const guestIds = responses.flatMap((r) => r.attending_guest_ids);
    const { data: families } = await supa
      .from("families")
      .select("id, name")
      .in("id", familyIds);
    const { data: guests } = await supa
      .from("guests")
      .select("id, name")
      .in("id", guestIds);
    return responses.map((r) => ({
      id: r.id,
      familyId: r.family_id,
      familyName: families?.find((f) => f.id === r.family_id)?.name ?? "—",
      confirmed: r.confirmed,
      attendingNames: r.attending_guest_ids
        .map(
          (gid: string) => guests?.find((g) => g.id === gid)?.name ?? "—",
        )
        .filter(Boolean),
      phone: r.phone,
      email: r.email,
      comment: r.comment,
      createdAt: r.created_at,
    }));
  }

  const store = getDemoStore();
  return store.rsvp_responses
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .map((r) => {
      const family = store.families.find((f) => f.id === r.family_id);
      const names = r.attending_guest_ids
        .map((gid) => store.guests.find((g) => g.id === gid)?.name ?? "—")
        .filter(Boolean);
      return {
        id: r.id,
        familyId: r.family_id,
        familyName: family?.name ?? "—",
        confirmed: r.confirmed,
        attendingNames: names,
        phone: r.phone,
        email: r.email,
        comment: r.comment,
        createdAt: r.created_at,
      };
    });
}

export async function listGiftPurchases(): Promise<AdminGiftPurchase[]> {
  const supa = createSupabaseServiceClient();
  if (supa) {
    const { data } = await supa
      .from("gift_purchases")
      .select(
        "id, buyer_name, buyer_whatsapp, items, total, payment_method, status, created_at",
      )
      .order("created_at", { ascending: false });
    return (data ?? []).map((g) => ({
      id: g.id,
      buyerName: g.buyer_name,
      buyerWhatsapp: g.buyer_whatsapp,
      items: g.items,
      total: Number(g.total),
      paymentMethod: g.payment_method,
      status: g.status,
      createdAt: g.created_at,
    }));
  }
  const store = getDemoStore();
  return store.gift_purchases
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .map((g) => ({
      id: g.id,
      buyerName: g.buyer_name,
      buyerWhatsapp: g.buyer_whatsapp,
      items: g.items,
      total: g.total,
      paymentMethod: g.payment_method,
      status: g.status,
      createdAt: g.created_at,
    }));
}

export type AddFamilyInput = {
  name: string;
  members: { name: string; isChild: boolean }[];
};

export async function addFamily(input: AddFamilyInput) {
  const supa = createSupabaseServiceClient();
  if (supa) {
    const { data: family, error } = await supa
      .from("families")
      .insert({ name: input.name })
      .select("id")
      .single();
    if (error || !family) throw new Error(error?.message ?? "Erro");
    if (input.members.length > 0) {
      const { error: gErr } = await supa.from("guests").insert(
        input.members.map((m) => ({
          family_id: family.id,
          name: m.name,
          is_child: m.isChild,
        })),
      );
      if (gErr) throw new Error(gErr.message);
    }
    return family.id as string;
  }
  const store = getDemoStore();
  const id = newId();
  store.families.push({
    id,
    name: input.name,
    notes: null,
    created_at: new Date().toISOString(),
  });
  for (const m of input.members) {
    store.guests.push({
      id: newId(),
      family_id: id,
      name: m.name,
      is_child: m.isChild,
    });
  }
  return id;
}

export async function deleteFamily(id: string) {
  const supa = createSupabaseServiceClient();
  if (supa) {
    const { error } = await supa.from("families").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return;
  }
  const store = getDemoStore();
  store.families = store.families.filter((f) => f.id !== id);
  store.guests = store.guests.filter((g) => g.family_id !== id);
  store.rsvp_responses = store.rsvp_responses.filter(
    (r) => r.family_id !== id,
  );
}

export async function setGiftStatus(
  id: string,
  status: "aguardando" | "confirmado",
) {
  const supa = createSupabaseServiceClient();
  if (supa) {
    const { error } = await supa
      .from("gift_purchases")
      .update({ status })
      .eq("id", id);
    if (error) throw new Error(error.message);
    return;
  }
  const store = getDemoStore();
  const g = store.gift_purchases.find((x) => x.id === id);
  if (g) g.status = status;
}

export async function deleteGiftPurchase(id: string) {
  const supa = createSupabaseServiceClient();
  if (supa) {
    const { error } = await supa
      .from("gift_purchases")
      .delete()
      .eq("id", id);
    if (error) throw new Error(error.message);
    return;
  }
  const store = getDemoStore();
  store.gift_purchases = store.gift_purchases.filter((x) => x.id !== id);
}

export async function adminStats() {
  const families = await listFamilies();
  const totalFamilies = families.length;
  const totalGuests = families.reduce((s, f) => s + f.members.length, 0);
  const confirmedFamilies = families.filter(
    (f) => f.latestResponse?.confirmed,
  );
  const declinedFamilies = families.filter(
    (f) => f.latestResponse && !f.latestResponse.confirmed,
  );
  const pendingFamilies = families.filter((f) => !f.latestResponse);
  const confirmedGuests = confirmedFamilies.reduce(
    (s, f) => s + (f.latestResponse?.attendingGuestIds.length ?? 0),
    0,
  );
  return {
    totalFamilies,
    totalGuests,
    confirmedCount: confirmedFamilies.length,
    declinedCount: declinedFamilies.length,
    pendingCount: pendingFamilies.length,
    confirmedGuests,
  };
}
