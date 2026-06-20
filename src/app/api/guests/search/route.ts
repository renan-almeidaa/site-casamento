import { NextResponse } from "next/server";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { getDemoStore } from "@/lib/demo-store";
import { rateLimit, getClientIp, tooManyRequests } from "@/lib/security";

export const runtime = "nodejs";

// Rate limit moderado: a busca dispara a cada tecla digitada, então
// permitimos um volume alto, mas barramos enumeração massiva.
// Considera CGNAT: várias pessoas digitando ao mesmo tempo no mesmo IP.
const SEARCH_LIMIT = 200; // por minuto por IP
const SEARCH_WINDOW_MS = 60_000;

// Remove acentos pra busca tolerante: "Cláudio" e "Claudio" matcham,
// "Ângela" e "angela" matcham, "Conceição" e "conceicao" matcham.
const fold = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export async function GET(request: Request) {
  const ip = getClientIp(request);
  if (!rateLimit(`guests-search:${ip}`, SEARCH_LIMIT, SEARCH_WINDOW_MS)) {
    return tooManyRequests();
  }

  const { searchParams } = new URL(request.url);
  // Limita a query a 60 chars — nomes brasileiros raramente passam disso e
  // evita strings absurdamente longas.
  const rawQ = (searchParams.get("q") ?? "").trim().slice(0, 60);
  if (rawQ.length < 2) return NextResponse.json({ families: [] });

  const qNorm = fold(rawQ);

  const supa = createSupabaseServiceClient();
  if (supa) {
    // Busca todos os guests (~50-200 rows num casamento típico, ~5-10 KB)
    // e filtra em JS pra suportar tolerância de acentos. Não dá pra usar
    // ILIKE direto porque Postgres por padrão é accent-sensitive, e ativar
    // o unaccent exigiria migration.
    const { data: allGuests } = await supa
      .from("guests")
      .select("id, family_id, name, is_child, nicknames");

    const matching = (allGuests ?? []).filter((g) => {
      if (fold(g.name).includes(qNorm)) return true;
      const nicks = (g.nicknames ?? []) as string[];
      return nicks.some((n) => fold(n).includes(qNorm));
    });
    if (matching.length === 0) return NextResponse.json({ families: [] });

    const familyIds = Array.from(new Set(matching.map((g) => g.family_id))).slice(
      0,
      6,
    );

    const { data: families } = await supa
      .from("families")
      .select("id, name")
      .in("id", familyIds);

    const result = (families ?? []).map((f) => ({
      id: f.id,
      name: f.name,
      members: (allGuests ?? [])
        .filter((m) => m.family_id === f.id)
        .map((m) => ({ id: m.id, name: m.name, isChild: m.is_child })),
    }));
    return NextResponse.json({ families: result });
  }

  // Fallback demo
  const store = getDemoStore();
  const matching = store.guests.filter(
    (g) =>
      fold(g.name).includes(qNorm) ||
      g.nicknames.some((n) => fold(n).includes(qNorm)),
  );
  const familyIds = Array.from(new Set(matching.map((g) => g.family_id))).slice(
    0,
    6,
  );
  const result = familyIds.map((fid) => {
    const f = store.families.find((x) => x.id === fid)!;
    return {
      id: f.id,
      name: f.name,
      members: store.guests
        .filter((g) => g.family_id === fid)
        .map((g) => ({ id: g.id, name: g.name, isChild: g.is_child })),
    };
  });
  return NextResponse.json({ families: result });
}
