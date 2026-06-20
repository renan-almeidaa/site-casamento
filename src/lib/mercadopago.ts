import "server-only";
import { MercadoPagoConfig, Preference } from "mercadopago";

export function getMercadoPagoClient() {
  const token = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  if (!token || token.includes("COLE-AQUI")) return null;
  return new MercadoPagoConfig({ accessToken: token });
}

export type CreatePreferenceInput = {
  buyerName: string;
  items: { id: string; nome: string; valor: number; qtd: number }[];
  total: number;
  purchaseId: string;
  baseUrl: string; // origin para back_urls
};

export async function createCheckoutPreference(input: CreatePreferenceInput) {
  const client = getMercadoPagoClient();
  if (!client) return null;
  const pref = new Preference(client);

  // Mercado Pago aceita até 12 itens em "items"; agregamos como um único
  // item "Presentes — Casamento Samara & Renan" com o total, garantindo
  // que o valor cobrado seja exatamente o do carrinho.
  const description = input.items
    .map((it) => `${it.qtd}× ${it.nome}`)
    .join(", ")
    .substring(0, 250);

  // Mercado Pago exige back_urls públicas (HTTPS) para usar auto_return.
  // Em desenvolvimento (localhost / IP local) omitimos para o preflight não falhar.
  const isPublic = /^https:\/\//.test(input.baseUrl) &&
    !input.baseUrl.includes("localhost") &&
    !/\/\/\d+\.\d+\.\d+\.\d+/.test(input.baseUrl);

  const result = await pref.create({
    body: {
      items: [
        {
          id: input.purchaseId,
          title: `Presente de Casamento · Samara & Renan`,
          description,
          quantity: 1,
          unit_price: Math.round(input.total * 100) / 100,
          currency_id: "BRL",
        },
      ],
      payer: {
        name: input.buyerName,
      },
      external_reference: input.purchaseId,
      statement_descriptor: "CASAMENTO SAMARA RENAN",
      ...(isPublic
        ? {
            back_urls: {
              success: `${input.baseUrl}/presentes/pagar?mp=success`,
              pending: `${input.baseUrl}/presentes/pagar?mp=pending`,
              failure: `${input.baseUrl}/presentes/pagar?mp=failure`,
            },
            auto_return: "approved",
          }
        : {}),
    },
  });

  return {
    id: result.id,
    initPoint: result.init_point,
    sandboxInitPoint: result.sandbox_init_point,
  };
}
