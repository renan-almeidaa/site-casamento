export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  // Aceita o nome novo (publishable key — sb_publishable_*) e o legado (anon JWT).
  const anon =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    "";
  const service =
    process.env.SUPABASE_SECRET_KEY ??
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    "";
  const configured =
    Boolean(url) &&
    !url.includes("placeholder") &&
    Boolean(anon) &&
    !anon.includes("placeholder");
  return { url, anon, service, configured };
}
