import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { ToasterProvider } from "@/components/ui/toaster";
import "./globals.css";

// Fontes hospedadas no próprio projeto (subset latin, variáveis) — o build
// não depende de baixar do Google Fonts, o que quebrava o deploy no Netlify.
const fraunces = localFont({
  src: [
    { path: "./fonts/fraunces-latin.woff2", weight: "200 900", style: "normal" },
    { path: "./fonts/fraunces-italic-latin.woff2", weight: "200 900", style: "italic" },
  ],
  variable: "--font-fraunces",
  display: "swap",
});

const bricolage = localFont({
  src: [{ path: "./fonts/bricolage-latin.woff2", weight: "300 700", style: "normal" }],
  variable: "--font-bricolage",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Samara & Renan · 07.02.2027",
  description:
    "Site oficial do casamento de Samara e Renan. Confirme sua presença, veja informações da cerimônia e da recepção, e participe da nossa lista de presentes.",
  openGraph: {
    title: "Samara & Renan · 07.02.2027",
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
    <html lang="pt-BR" className={`${fraunces.variable} ${bricolage.variable}`}>
      <body>
        <ToasterProvider>{children}</ToasterProvider>
      </body>
    </html>
  );
}
