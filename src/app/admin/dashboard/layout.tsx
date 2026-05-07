import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/supabase/config";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const env = getSupabaseEnv();
  if (env.configured) {
    const supa = await createSupabaseServerClient();
    if (supa) {
      const {
        data: { user },
      } = await supa.auth.getUser();
      if (!user) redirect("/admin");
    }
  }
  return <>{children}</>;
}
