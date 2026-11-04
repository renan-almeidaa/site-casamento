import "server-only";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { getDemoStore, newId } from "@/lib/demo-store";

// =====================================================================
// Lotes dos presentes grandes: cada lote tem um dono só. O lote fica
// reservado quando o convidado registra o presente (/presentes/resumo).
// Apagar o registro no admin libera os lotes dele.
// =====================================================================

export async function listTakenLotIds(): Promise<string[]> {
  const supa = createSupabaseServiceClient();
  if (supa) {
    const { data, error } = await supa.from("gift_lot_claims").select("lot_id");
    if (error) throw new Error(error.message);
    return (data ?? []).map((r) => r.lot_id as string);
  }
  return getDemoStore().gift_lot_claims.map((c) => c.lot_id);
}

export type RegisterInput = {
  buyerName: string;
  buyerWhatsapp: string;
  items: { id: string; nome: string; valor: number; qtd: number }[];
  total: number;
  paymentMethod: string;
  lotIds: string[];
  // Registro anterior desta mesma sessão (convidado voltou e reenviou).
  previousId: string | null;
};

export type RegisterResult =
  | { ok: true; id: string }
  | { ok: false; taken: string[] };

export async function registerGiftWithLots(
  input: RegisterInput,
): Promise<RegisterResult> {
  const supa = createSupabaseServiceClient();
  if (supa) {
    const { data, error } = await supa.rpc("register_gift_purchase", {
      p_buyer_name: input.buyerName,
      p_buyer_whatsapp: input.buyerWhatsapp,
      p_items: input.items,
      p_total: input.total,
      p_payment_method: input.paymentMethod,
      p_lot_ids: input.lotIds,
      p_previous_id: input.previousId,
    });
    if (error) throw new Error(error.message);
    return data as RegisterResult;
  }

  // Fallback demo — mesma regra da função SQL.
  const store = getDemoStore();
  const taken = store.gift_lot_claims
    .filter(
      (c) => input.lotIds.includes(c.lot_id) && c.purchase_id !== input.previousId,
    )
    .map((c) => c.lot_id);
  if (taken.length > 0) return { ok: false, taken };

  const previous = store.gift_purchases.find(
    (p) => p.id === input.previousId && p.status === "aguardando",
  );
  if (previous) {
    store.gift_purchases = store.gift_purchases.filter((p) => p !== previous);
    store.gift_lot_claims = store.gift_lot_claims.filter(
      (c) => c.purchase_id !== previous.id,
    );
  }

  const id = newId();
  const now = new Date().toISOString();
  store.gift_purchases.push({
    id,
    buyer_name: input.buyerName,
    buyer_whatsapp: input.buyerWhatsapp,
    items: input.items,
    total: input.total,
    payment_method: input.paymentMethod,
    status: "aguardando",
    created_at: now,
  });
  for (const lotId of input.lotIds) {
    store.gift_lot_claims.push({ lot_id: lotId, purchase_id: id, created_at: now });
  }
  return { ok: true, id };
}

// =====================================================================
// Admin
// =====================================================================

export type AdminLotClaim = {
  lotId: string;
  buyerName: string;
  buyerWhatsapp: string;
  status: string;
};

export async function listLotClaims(): Promise<AdminLotClaim[]> {
  const supa = createSupabaseServiceClient();
  if (supa) {
    const [claims, purchases] = await Promise.all([
      supa.from("gift_lot_claims").select("lot_id, purchase_id"),
      supa.from("gift_purchases").select("id, buyer_name, buyer_whatsapp, status"),
    ]);
    const err = claims.error ?? purchases.error;
    if (err) throw new Error(err.message);
    return (claims.data ?? []).map((c) => {
      const p = (purchases.data ?? []).find((x) => x.id === c.purchase_id);
      return {
        lotId: c.lot_id as string,
        buyerName: (p?.buyer_name as string) ?? "—",
        buyerWhatsapp: (p?.buyer_whatsapp as string) ?? "",
        status: (p?.status as string) ?? "aguardando",
      };
    });
  }
  const store = getDemoStore();
  return store.gift_lot_claims.map((c) => {
    const p = store.gift_purchases.find((x) => x.id === c.purchase_id);
    return {
      lotId: c.lot_id,
      buyerName: p?.buyer_name ?? "—",
      buyerWhatsapp: p?.buyer_whatsapp ?? "",
      status: p?.status ?? "aguardando",
    };
  });
}

type PurchaseItem = RegisterInput["items"][number];

// Libera o lote e tira ele da compra, para o valor não contar duas vezes
// quando outra pessoa escolher o mesmo lote. Compra que fica sem nenhum
// item é apagada.
function withoutLot(items: PurchaseItem[], total: number, lotId: string) {
  const rest = items.filter((it) => it.id !== lotId);
  const removed = items
    .filter((it) => it.id === lotId)
    .reduce((sum, it) => sum + it.valor * it.qtd, 0);
  return { rest, total: Math.max(0, Math.round((total - removed) * 100) / 100) };
}

export async function releaseLot(lotId: string) {
  const supa = createSupabaseServiceClient();
  if (supa) {
    const { data: claim, error } = await supa
      .from("gift_lot_claims")
      .select("purchase_id")
      .eq("lot_id", lotId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!claim) return;

    const { data: purchase, error: readErr } = await supa
      .from("gift_purchases")
      .select("items, total")
      .eq("id", claim.purchase_id)
      .single();
    if (readErr) throw new Error(readErr.message);

    const { rest, total } = withoutLot(
      purchase.items as PurchaseItem[],
      Number(purchase.total),
      lotId,
    );
    if (rest.length === 0) {
      // Os lotes caem junto (on delete cascade).
      const { error: delErr } = await supa
        .from("gift_purchases")
        .delete()
        .eq("id", claim.purchase_id);
      if (delErr) throw new Error(delErr.message);
      return;
    }
    const { error: updErr } = await supa
      .from("gift_purchases")
      .update({ items: rest, total })
      .eq("id", claim.purchase_id);
    if (updErr) throw new Error(updErr.message);
    const { error: delErr } = await supa
      .from("gift_lot_claims")
      .delete()
      .eq("lot_id", lotId);
    if (delErr) throw new Error(delErr.message);
    return;
  }

  const store = getDemoStore();
  const claim = store.gift_lot_claims.find((c) => c.lot_id === lotId);
  if (!claim) return;
  store.gift_lot_claims = store.gift_lot_claims.filter((c) => c.lot_id !== lotId);
  const purchase = store.gift_purchases.find((p) => p.id === claim.purchase_id);
  if (!purchase) return;
  const { rest, total } = withoutLot(purchase.items, purchase.total, lotId);
  if (rest.length === 0) {
    store.gift_purchases = store.gift_purchases.filter((p) => p !== purchase);
    return;
  }
  purchase.items = rest;
  purchase.total = total;
}
