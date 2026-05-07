import "server-only";
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/supabase/config";
import { isSameOrigin, forbiddenOrigin } from "@/lib/security";

/**
 * Garante que o request veio de um admin autenticado.
 * Em modo demo (sem Supabase), libera para o dev experimentar.
 *
 * Para chamadas de mutação (POST/PATCH/DELETE), passe o `request` para
 * que façamos validação de Origin (defesa contra CSRF — um site malicioso
 * não consegue forjar o cookie de sessão se o navegador respeitar Origin).
 */
export async function ensureAdmin(
  request?: Request,
): Promise<{ ok: true } | { ok: false; response: NextResponse }> {
  // Defesa CSRF: bloqueia mutations vindas de origens que não a nossa.
  // GET/HEAD passam direto (não mudam estado).
  if (request) {
    const method = request.method.toUpperCase();
    if (method !== "GET" && method !== "HEAD" && !isSameOrigin(request)) {
      return { ok: false, response: forbiddenOrigin() };
    }
  }

  const env = getSupabaseEnv();
  if (!env.configured) return { ok: true };

  const supa = await createSupabaseServerClient();
  if (!supa)
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Supabase indisponível" },
        { status: 500 },
      ),
    };
  const {
    data: { user },
  } = await supa.auth.getUser();
  if (!user) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Não autorizado" }, { status: 401 }),
    };
  }
  return { ok: true };
}
