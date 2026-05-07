"use client";

import { createBrowserClient } from "@supabase/ssr";
import { type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "./config";

let cached: SupabaseClient | null = null;

export function createSupabaseBrowserClient(): SupabaseClient | null {
  if (cached) return cached;
  const env = getSupabaseEnv();
  if (!env.configured) return null;
  cached = createBrowserClient(env.url, env.anon);
  return cached;
}
