import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseEnv } from "./config";

type CookieSet = { name: string; value: string; options?: CookieOptions };

function hardenCookie(options: CookieOptions = {}): CookieOptions {
  return {
    ...options,
    httpOnly: true,
    sameSite: options.sameSite ?? "lax",
    secure: options.secure ?? process.env.NODE_ENV === "production",
    path: options.path ?? "/",
  };
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const env = getSupabaseEnv();
  if (!env.configured) return response;

  const supabase = createServerClient(env.url, env.anon, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (toSet: CookieSet[]) => {
        toSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        toSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, hardenCookie(options)),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin/dashboard");
  if (isAdminRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  return response;
}
