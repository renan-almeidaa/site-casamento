import "server-only";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { getDemoStore, newId } from "@/lib/demo-store";

// =====================================================================
// Cotas dos presentes grandes: a soma das cotas reservadas nunca passa do
// total do presente. A reserva acontece quando o convidado registra o
// presente (/presentes/resumo). Apagar o registro no admin libera as cotas.
// =====================================================================

export async function listUsedQuotas(): Promise<Record<string, number>> {
  const supa = createSupabaseServiceClient();
  const rows: { presente_id: string; qtd: number }[] = supa
    ? await (async () => {
        const { data, error } = await supa
          .from("gift_quota_claims")
          .select("presente_id, qtd");
        if (error) throw new Error(error.message);
        return data ?? [];
      })()
    : getDemoStore().gift_quota_claims;
  const used: Record<string, number> = {};
  for (const r of rows) used[r.presente_id] = (used[r.presente_id] ?? 0) + r.qtd;
  return used;
}

type PurchaseItem = { id: string; nome: string; valor: number; qtd: number };

export type RegisterInput = {
  buyerName: string;
  buyerWhatsapp: string;
  items: PurchaseItem[];
  total: number;
  paymentMethod: string;
  cotas: { presente_id: string; qtd: number; total: number }[];
  // Registro anterior desta mesma sessão (convidado voltou e reenviou).
  previousId: string | null;
};

export type RegisterResult =
  | { ok: true; id: string }
  | { ok: false; short: { presente_id: string; restante: number }[] };

export async function registerGiftWithQuotas(
  input: RegisterInput,
): Promise<RegisterResult> {
  const supa = createSupabaseServiceClient();
  if (supa) {
    const { data, error } = await supa.rpc("register_gift_with_quotas", {
      p_buyer_name: input.buyerName,
      p_buyer_whatsapp: input.buyerWhatsapp,
      p_items: input.items,
      p_total: input.total,
      p_payment_method: input.paymentMethod,
      p_cotas: input.cotas,
      p_previous_id: input.previousId,
    });
    if (error) throw new Error(error.message);
    return data as RegisterResult;
  }

  // Fallback demo — mesma regra da função SQL.
  const store = getDemoStore();
  const previous = store.gift_purchases.find(
    (p) => p.id === input.previousId && p.status === "aguardando",
  );
  const usedBy = (presenteId: string) =>
    store.gift_quota_claims
      .filter((c) => c.presente_id === presenteId && c.purchase_id !== previous?.id)
      .reduce((sum, c) => sum + c.qtd, 0);
  const short = input.cotas
    .filter((c) => usedBy(c.presente_id) + c.qtd > c.total)
    .map((c) => ({
      presente_id: c.presente_id,
      restante: c.total - usedBy(c.presente_id),
    }));
  if (short.length > 0) return { ok: false, short };

  if (previous) {
    store.gift_purchases = store.gift_purchases.filter((p) => p !== previous);
    store.gift_quota_claims = store.gift_quota_claims.filter(
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
  for (const c of input.cotas) {
    store.gift_quota_claims.push({
      id: newId(),
      presente_id: c.presente_id,
      purchase_id: id,
      qtd: c.qtd,
      created_at: now,
    });
  }
  return { ok: true, id };
}

// =====================================================================
// Admin
// =====================================================================

export type AdminQuotaClaim = {
  id: string;
  presenteId: string;
  qtd: number;
  buyerName: string;
  buyerWhatsapp: string;
  status: string;
};

export async function listQuotaClaims(): Promise<AdminQuotaClaim[]> {
  const supa = createSupabaseServiceClient();
  if (supa) {
    const [claims, purchases] = await Promise.all([
      supa
        .from("gift_quota_claims")
        .select("id, presente_id, purchase_id, qtd")
        .order("created_at"),
      supa.from("gift_purchases").select("id, buyer_name, buyer_whatsapp, status"),
    ]);
    const err = claims.error ?? purchases.error;
    if (err) throw new Error(err.message);
    return (claims.data ?? []).map((c) => {
      const p = (purchases.data ?? []).find((x) => x.id === c.purchase_id);
      return {
        id: c.id as string,
        presenteId: c.presente_id as string,
        qtd: c.qtd as number,
        buyerName: (p?.buyer_name as string) ?? "—",
        buyerWhatsapp: (p?.buyer_whatsapp as string) ?? "",
        status: (p?.status as string) ?? "aguardando",
      };
    });
  }
  const store = getDemoStore();
  return store.gift_quota_claims.map((c) => {
    const p = store.gift_purchases.find((x) => x.id === c.purchase_id);
    return {
      id: c.id,
      presenteId: c.presente_id,
      qtd: c.qtd,
      buyerName: p?.buyer_name ?? "—",
      buyerWhatsapp: p?.buyer_whatsapp ?? "",
      status: p?.status ?? "aguardando",
    };
  });
}

// Tira as cotas da compra, para o valor não contar duas vezes quando outra
// pessoa escolher as mesmas cotas. Compra sem nenhum item é apagada.
function withoutItem(items: PurchaseItem[], total: number, itemId: string) {
  const rest = items.filter((it) => it.id !== itemId);
  const removed = items
    .filter((it) => it.id === itemId)
    .reduce((sum, it) => sum + it.valor * it.qtd, 0);
  return { rest, total: Math.max(0, Math.round((total - removed) * 100) / 100) };
}

export async function releaseQuotaClaim(claimId: string, itemId: (presenteId: string) => string) {
  const supa = createSupabaseServiceClient();
  if (supa) {
    const { data: claim, error } = await supa
      .from("gift_quota_claims")
      .select("presente_id, purchase_id")
      .eq("id", claimId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!claim) return;

    const { data: purchase, error: readErr } = await supa
      .from("gift_purchases")
      .select("items, total")
      .eq("id", claim.purchase_id)
      .single();
    if (readErr) throw new Error(readErr.message);

    const { rest, total } = withoutItem(
      purchase.items as PurchaseItem[],
      Number(purchase.total),
      itemId(claim.presente_id as string),
    );
    if (rest.length === 0) {
      // As cotas caem junto (on delete cascade).
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
      .from("gift_quota_claims")
      .delete()
      .eq("id", claimId);
    if (delErr) throw new Error(delErr.message);
    return;
  }

  const store = getDemoStore();
  const claim = store.gift_quota_claims.find((c) => c.id === claimId);
  if (!claim) return;
  store.gift_quota_claims = store.gift_quota_claims.filter((c) => c.id !== claimId);
  const purchase = store.gift_purchases.find((p) => p.id === claim.purchase_id);
  if (!purchase) return;
  const { rest, total } = withoutItem(
    purchase.items,
    purchase.total,
    itemId(claim.presente_id),
  );
  if (rest.length === 0) {
    store.gift_purchases = store.gift_purchases.filter((p) => p !== purchase);
    return;
  }
  purchase.items = rest;
  purchase.total = total;
}
