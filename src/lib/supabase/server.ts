import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { getSupabaseEnv } from "./config";

type CookieSet = { name: string; value: string; options?: CookieOptions };

/**
 * Client used in Route Handlers / Server Components for end-user requests.
 * Uses cookies for auth session continuity.
 */
export async function createSupabaseServerClient(): Promise<SupabaseClient | null> {
  const env = getSupabaseEnv();
  if (!env.configured) return null;
  const cookieStore = await cookies();
  return createServerClient(env.url, env.anon, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (toSet: CookieSet[]) => {
        try {
          toSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, hardenCookie(options)),
          );
        } catch {
          // setAll may throw in Server Components — ignored
        }
      },
    },
  });
}

/**
 * Reforça as opções do cookie de auth: HttpOnly (já é por padrão), Secure
 * em produção, SameSite=Lax (Strict quebra o fluxo de OAuth). Path raiz.
 */
function hardenCookie(options: CookieOptions = {}): CookieOptions {
  return {
    ...options,
    httpOnly: true,
    sameSite: options.sameSite ?? "lax",
    secure: options.secure ?? process.env.NODE_ENV === "production",
    path: options.path ?? "/",
  };
}

/**
 * Service-role client — full admin powers, bypasses RLS.
 * NEVER expose to the browser. Server-only.
 */
export function createSupabaseServiceClient(): SupabaseClient | null {
  const env = getSupabaseEnv();
  if (!env.configured || !env.service || env.service.includes("placeholder")) {
    return null;
  }
  return createClient(env.url, env.service, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
