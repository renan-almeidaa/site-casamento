import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CHA } from "@/lib/wedding-data";
import { ChaFlow } from "@/components/cha/ChaFlow";

// Página privada: só abre com o slug exato e não tem link em lugar nenhum.
export const metadata: Metadata = {
  title: "Chá de Casa Nova · Samara & Renan",
  robots: { index: false, follow: false, nocache: true },
};

export default async function ChaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (slug !== CHA.slug) notFound();
  return <ChaFlow />;
}
