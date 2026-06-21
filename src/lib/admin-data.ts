import "server-only";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { getDemoStore, newId } from "@/lib/demo-store";

export type AdminFamily = {
  id: string;
  name: string;
  members: {
    id: string;
    name: string;
    isChild: boolean;
    nicknames: string[];
  }[];
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
  notAttendingNames: string[];
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
      .select("id, family_id, name, is_child, nicknames");
    const { data: responses } = await supa
      .from("rsvp_responses")
      .select(
        "family_id, confirmed, attending_guest_ids, created_at",
      )
      .order("created_at", { ascending: false });

    return (families ?? []).map((f) => {
      const ms = (guests ?? [])
        .filter((g) => g.family_id === f.id)
        .map((g) => ({
          id: g.id,
          name: g.name,
          isChild: g.is_child,
          nicknames: (g.nicknames ?? []) as string[],
        }));
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
      .map((g) => ({
        id: g.id,
        name: g.name,
        isChild: g.is_child,
        nicknames: g.nicknames,
      }));
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
    const { data: families } = await supa
      .from("families")
      .select("id, name")
      .in("id", familyIds);
    // Trazemos TODOS os integrantes das famílias envolvidas para conseguir
    // mostrar tanto quem confirmou quanto quem ficou de fora.
    const { data: guests } = await supa
      .from("guests")
      .select("id, family_id, name")
      .in("family_id", familyIds);
    return responses.map((r) => {
      const familyGuests = (guests ?? []).filter(
        (g) => g.family_id === r.family_id,
      );
      const attendingIds = new Set(r.attending_guest_ids as string[]);
      const attendingNames = familyGuests
        .filter((g) => attendingIds.has(g.id))
        .map((g) => g.name);
      const notAttendingNames = familyGuests
        .filter((g) => !attendingIds.has(g.id))
        .map((g) => g.name);
      return {
        id: r.id,
        familyId: r.family_id,
        familyName: families?.find((f) => f.id === r.family_id)?.name ?? "·",
        confirmed: r.confirmed,
        attendingNames,
        notAttendingNames,
        phone: r.phone,
        email: r.email,
        comment: r.comment,
        createdAt: r.created_at,
      };
    });
  }

  const store = getDemoStore();
  return store.rsvp_responses
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .map((r) => {
      const family = store.families.find((f) => f.id === r.family_id);
      const familyGuests = store.guests.filter(
        (g) => g.family_id === r.family_id,
      );
      const attendingIds = new Set(r.attending_guest_ids);
      const attendingNames = familyGuests
        .filter((g) => attendingIds.has(g.id))
        .map((g) => g.name);
      const notAttendingNames = familyGuests
        .filter((g) => !attendingIds.has(g.id))
        .map((g) => g.name);
      return {
        id: r.id,
        familyId: r.family_id,
        familyName: family?.name ?? "·",
        confirmed: r.confirmed,
        attendingNames,
        notAttendingNames,
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
  members: { name: string; isChild: boolean; nicknames?: string[] }[];
};

export async function addFamily(input: AddFamilyInput): Promise<AdminFamily> {
  const supa = createSupabaseServiceClient();
  if (supa) {
    const { data: family, error } = await supa
      .from("families")
      .insert({ name: input.name })
      .select("id, name")
      .single();
    if (error || !family) throw new Error(error?.message ?? "Erro");

    let members: AdminFamily["members"] = [];
    if (input.members.length > 0) {
      const { data: insertedGuests, error: gErr } = await supa
        .from("guests")
        .insert(
          input.members.map((m) => ({
            family_id: family.id,
            name: m.name,
            is_child: m.isChild,
            nicknames: m.nicknames ?? [],
          })),
        )
        .select("id, name, is_child, nicknames");
      if (gErr) throw new Error(gErr.message);
      members = (insertedGuests ?? []).map((g) => ({
        id: g.id,
        name: g.name,
        isChild: g.is_child,
        nicknames: (g.nicknames ?? []) as string[],
      }));
    }
    return {
      id: family.id,
      name: family.name,
      members,
      latestResponse: null,
    };
  }

  const store = getDemoStore();
  const id = newId();
  store.families.push({
    id,
    name: input.name,
    notes: null,
    created_at: new Date().toISOString(),
  });
  const members: AdminFamily["members"] = [];
  for (const m of input.members) {
    const memberId = newId();
    const nicknames = m.nicknames ?? [];
    store.guests.push({
      id: memberId,
      family_id: id,
      name: m.name,
      is_child: m.isChild,
      nicknames,
    });
    members.push({ id: memberId, name: m.name, isChild: m.isChild, nicknames });
  }
  return {
    id,
    name: input.name,
    members,
    latestResponse: null,
  };
}

export type UpdateFamilyMember = {
  id?: string;
  name: string;
  isChild: boolean;
  nicknames?: string[];
};

export type UpdateFamilyInput = {
  name: string;
  members: UpdateFamilyMember[];
};

export async function updateFamily(
  id: string,
  input: UpdateFamilyInput,
): Promise<AdminFamily> {
  const supa = createSupabaseServiceClient();
  if (supa) {
    const { data: family, error: famErr } = await supa
      .from("families")
      .select("id")
      .eq("id", id)
      .single();
    if (famErr || !family) throw new Error("Família não encontrada");

    const { error: updErr } = await supa
      .from("families")
      .update({ name: input.name })
      .eq("id", id);
    if (updErr) throw new Error(updErr.message);

    const { data: existing } = await supa
      .from("guests")
      .select("id")
      .eq("family_id", id);
    const existingIds = new Set((existing ?? []).map((m) => m.id));
    const inputIds = new Set(
      input.members
        .map((m) => m.id)
        .filter((x): x is string => Boolean(x)),
    );
    const toDelete = [...existingIds].filter((eid) => !inputIds.has(eid));
    const toUpdate = input.members.filter(
      (m): m is UpdateFamilyMember & { id: string } => !!m.id,
    );
    const toInsert = input.members.filter((m) => !m.id);

    if (toDelete.length > 0) {
      const { error: delErr } = await supa
        .from("guests")
        .delete()
        .in("id", toDelete);
      if (delErr) throw new Error(delErr.message);
    }
    for (const m of toUpdate) {
      const { error: uErr } = await supa
        .from("guests")
        .update({
          name: m.name,
          is_child: m.isChild,
          nicknames: m.nicknames ?? [],
        })
        .eq("id", m.id);
      if (uErr) throw new Error(uErr.message);
    }
    if (toInsert.length > 0) {
      const { error: insErr } = await supa.from("guests").insert(
        toInsert.map((m) => ({
          family_id: id,
          name: m.name,
          is_child: m.isChild,
          nicknames: m.nicknames ?? [],
        })),
      );
      if (insErr) throw new Error(insErr.message);
    }

    const { data: finalGuests } = await supa
      .from("guests")
      .select("id, name, is_child, nicknames")
      .eq("family_id", id);
    const { data: latest } = await supa
      .from("rsvp_responses")
      .select("confirmed, attending_guest_ids, created_at")
      .eq("family_id", id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    return {
      id,
      name: input.name,
      members: (finalGuests ?? []).map((g) => ({
        id: g.id,
        name: g.name,
        isChild: g.is_child,
        nicknames: (g.nicknames ?? []) as string[],
      })),
      latestResponse: latest
        ? {
            confirmed: latest.confirmed,
            attendingGuestIds: latest.attending_guest_ids,
            createdAt: latest.created_at,
          }
        : null,
    };
  }

  const store = getDemoStore();
  const family = store.families.find((f) => f.id === id);
  if (!family) throw new Error("Família não encontrada");
  family.name = input.name;

  const inputIds = new Set(
    input.members.map((m) => m.id).filter((x): x is string => Boolean(x)),
  );
  store.guests = store.guests.filter(
    (g) => g.family_id !== id || inputIds.has(g.id),
  );
  for (const m of input.members) {
    if (m.id) {
      const g = store.guests.find((x) => x.id === m.id);
      if (g) {
        g.name = m.name;
        g.is_child = m.isChild;
        g.nicknames = m.nicknames ?? [];
      }
    } else {
      store.guests.push({
        id: newId(),
        family_id: id,
        name: m.name,
        is_child: m.isChild,
        nicknames: m.nicknames ?? [],
      });
    }
  }
  const finalMembers = store.guests
    .filter((g) => g.family_id === id)
    .map((g) => ({
      id: g.id,
      name: g.name,
      isChild: g.is_child,
      nicknames: g.nicknames,
    }));
  const latest = store.rsvp_responses
    .filter((r) => r.family_id === id)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))[0];
  return {
    id,
    name: input.name,
    members: finalMembers,
    latestResponse: latest
      ? {
          confirmed: latest.confirmed,
          attendingGuestIds: latest.attending_guest_ids,
          createdAt: latest.created_at,
        }
      : null,
  };
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

export async function deleteRsvpResponse(id: string) {
  const supa = createSupabaseServiceClient();
  if (supa) {
    const { error } = await supa
      .from("rsvp_responses")
      .delete()
      .eq("id", id);
    if (error) throw new Error(error.message);
    return;
  }
  const store = getDemoStore();
  store.rsvp_responses = store.rsvp_responses.filter((r) => r.id !== id);
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
