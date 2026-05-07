import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { ToasterProvider } from "@/components/ui/toaster";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Samara & Renan · 11.10.2026",
  description:
    "Site oficial do casamento de Samara e Renan. Confirme sua presença, veja informações da cerimônia e da recepção, e participe da nossa lista de presentes.",
  openGraph: {
    title: "Samara & Renan · 11.10.2026",
    description:
      "Estamos noivos! Confirme sua presença em nosso casamento.",
    locale: "pt_BR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#f7f3ee",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${cormorant.variable} ${jost.variable}`}>
      <body>
        <ToasterProvider>{children}</ToasterProvider>
      </body>
    </html>
  );
}
