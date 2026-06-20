import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type Props = {
  buyerName: string;
  buyerWhatsapp: string;
  items: { nome: string; valor: number; qtd: number }[];
  total: number;
};

const fmt = (v: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(v);

export function GiftPurchaseEmail({
  buyerName,
  buyerWhatsapp,
  items,
  total,
}: Props) {
  return (
    <Html lang="pt-BR">
      <Head />
      <Preview>{`Novo presente registrado por ${buyerName}`}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={h1}>🎁 Novo Presente Registrado</Heading>
          <Text style={subtitle}>Casamento Samara &amp; Renan</Text>
          <Hr style={hr} />
          <Section>
            <Text style={label}>Comprador</Text>
            <Text style={value}>{buyerName}</Text>
            <Text style={value}>📱 {buyerWhatsapp}</Text>
          </Section>
          <Hr style={hr} />
          <Section>
            <Text style={label}>Itens</Text>
            {items.map((it, i) => (
              <Text key={i} style={value}>
                • {it.qtd}× {it.nome} · {fmt(it.valor * it.qtd)}
              </Text>
            ))}
          </Section>
          <Hr style={hr} />
          <Section>
            <Text style={label}>Total</Text>
            <Text style={total$}>{fmt(total)}</Text>
          </Section>
          <Hr style={hr} />
          <Text style={footerText}>
            Lembre-se de confirmar o recebimento no painel admin assim que o
            comprovante chegar.
          </Text>
          <Text style={footer}>
            Site dos noivos · Samara &amp; Renan · 11.10.2026
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const body = {
  backgroundColor: "#f7f3ee",
  fontFamily: "sans-serif",
  padding: "40px 16px",
  margin: 0,
};
const container = {
  margin: "0 auto",
  padding: "44px 36px",
  maxWidth: "560px",
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  boxShadow: "0 2px 16px rgba(100,70,30,0.07)",
};
const h1 = {
  fontFamily: "Georgia, serif",
  fontSize: "28px",
  fontWeight: 300,
  color: "#2e2218",
  textAlign: "center" as const,
  margin: "0 0 6px",
};
const subtitle = {
  fontStyle: "italic",
  color: "#a07850",
  textAlign: "center" as const,
  margin: 0,
};
const hr = { borderColor: "#e0d4c4", margin: "20px 0" };
const label = {
  fontSize: "11px",
  letterSpacing: "3px",
  textTransform: "uppercase" as const,
  color: "#b8966e",
  margin: "0 0 4px",
};
const value = { fontSize: "15px", color: "#3a3028", margin: "0 0 4px" };
const total$ = {
  fontFamily: "Georgia, serif",
  fontSize: "32px",
  color: "#a07850",
  margin: "0 0 4px",
};
const footerText = {
  fontSize: "13px",
  color: "#6b5540",
  fontStyle: "italic" as const,
  textAlign: "center" as const,
};
const footer = {
  fontSize: "11px",
  color: "#a09080",
  textAlign: "center" as const,
  letterSpacing: "2px",
  textTransform: "uppercase" as const,
  margin: "20px 0 4px",
};
