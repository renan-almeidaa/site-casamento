import "server-only";
import { NextResponse } from "next/server";

// =====================================================================
// Rate limiting em memória (por instância). Suficiente para um site de
// casamento hospedado num único nó. Se virar multi-region/Edge, trocar
// por Upstash Redis ou similar.
// =====================================================================

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

const MAX_BUCKETS = 5000; // proteção contra crescimento descontrolado

function cleanup(now: number) {
  if (buckets.size < MAX_BUCKETS) return;
  for (const [k, v] of buckets) {
    if (v.resetAt < now) buckets.delete(k);
  }
}

/**
 * Token-bucket simples. Retorna true se a request foi permitida.
 *
 * @param key   identificador único (ex: `rsvp:${ip}`)
 * @param max   número máximo de requests dentro da janela
 * @param windowMs   tamanho da janela em ms
 */
export function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  cleanup(now);
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (bucket.count >= max) return false;
  bucket.count++;
  return true;
}

// =====================================================================
// Helpers de identificação do cliente.
// =====================================================================

export function getClientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;
  // x-nf-client-connection-ip = Netlify; cf-connecting-ip = Cloudflare
  const netlifyIp = request.headers.get("x-nf-client-connection-ip");
  if (netlifyIp) return netlifyIp;
  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp;
  return "unknown";
}

// =====================================================================
// Origin check — defesa simples contra CSRF.
// Para mutations vindas de outro domínio, o navegador envia Origin
// indicando o site que originou. Comparamos com o Host do nosso server.
// =====================================================================

export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  // GET/HEAD não exigem Origin; outros métodos modernos enviam.
  if (!origin) return true;
  if (!host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

// =====================================================================
// Respostas padronizadas
// =====================================================================

export function tooManyRequests() {
  return NextResponse.json(
    { error: "Muitas tentativas. Tente novamente em alguns minutos." },
    { status: 429 },
  );
}

export function forbiddenOrigin() {
  return NextResponse.json(
    { error: "Origem não permitida" },
    { status: 403 },
  );
}

// =====================================================================
// Sanitização de logs — nunca logar PII completa em produção.
// =====================================================================

export function redact<T extends Record<string, unknown>>(
  obj: T,
  keys: (keyof T)[] = ["phone", "email", "buyerWhatsapp", "comment"] as (keyof T)[],
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const k of Object.keys(obj)) {
    if (keys.includes(k as keyof T)) {
      const v = obj[k];
      if (typeof v === "string" && v.length > 0) {
        out[k] = `***${v.slice(-3)}`;
      } else {
        out[k] = "***";
      }
    } else {
      out[k] = obj[k];
    }
  }
  return out;
}
