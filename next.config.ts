import type { NextConfig } from "next";

// =====================================================================
// Headers de segurança.
//
// CSP cobre:
//   - script: self + unsafe-inline + unsafe-eval (Next.js precisa deles
//     para a hidratação e para o Turbopack em dev). Removido só com nonces.
//   - connect: self + Supabase (REST + WebSocket Realtime) + Mercado Pago.
//   - frame-ancestors none = bloqueia clickjacking.
//   - object-src none = bloqueia <embed>/<object> com plugins legados.
// =====================================================================

const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.mercadopago.com https://api.mercadolibre.com",
  "frame-src 'self' https://*.mercadopago.com https://*.mercadolibre.com",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' https://*.mercadopago.com",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

// Headers extras só para a área admin: bloqueia indexação por buscadores.
const adminHeaders = [
  ...securityHeaders,
  { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Esconde a versão do Next no header `x-powered-by`
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/admin/:path*", headers: adminHeaders },
    ];
  },
};

export default nextConfig;
