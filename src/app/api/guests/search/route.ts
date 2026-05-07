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

export async function GET(request: Request) {
  const ip = getClientIp(request);
  if (!rateLimit(`guests-search:${ip}`, SEARCH_LIMIT, SEARCH_WINDOW_MS)) {
    return tooManyRequests();
  }

  const { searchParams } = new URL(request.url);
  // Limita a query a 60 chars — nomes brasileiros raramente passam disso e
  // evita strings absurdamente longas em ilike (custo na DB).
  const rawQ = (searchParams.get("q") ?? "").trim().slice(0, 60);
  // Sanitiza wildcards do Postgres ilike para que o convidado não consiga
  // forçar varreduras esquisitas (% e _) — escapa-os.
  const q = rawQ.replace(/[%_\\]/g, "\\$&").toLowerCase();
  if (q.length < 2) return NextResponse.json({ families: [] });

  const supa = createSupabaseServiceClient();
  if (supa) {
    const { data: matchingGuests } = await supa
      .from("guests")
      .select("family_id")
      .ilike("name", `%${q}%`)
      .limit(20);
    const familyIds = Array.from(
      new Set((matchingGuests ?? []).map((g) => g.family_id)),
    );
    if (familyIds.length === 0) return NextResponse.json({ families: [] });

    const { data: families } = await supa
      .from("families")
      .select("id, name")
      .in("id", familyIds)
      .limit(6);
    const { data: members } = await supa
      .from("guests")
      .select("id, family_id, name, is_child")
      .in("family_id", familyIds);

    const result = (families ?? []).map((f) => ({
      id: f.id,
      name: f.name,
      members: (members ?? [])
        .filter((m) => m.family_id === f.id)
        .map((m) => ({ id: m.id, name: m.name, isChild: m.is_child })),
    }));
    return NextResponse.json({ families: result });
  }

  // Fallback demo
  const store = getDemoStore();
  const matching = store.guests.filter((g) =>
    g.name.toLowerCase().includes(q),
  );
  const familyIds = Array.from(new Set(matching.map((g) => g.family_id)));
  const result = familyIds.slice(0, 6).map((fid) => {
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
