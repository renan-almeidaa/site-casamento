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
  familyName: string;
  attendingNames: string[];
  notAttendingNames: string[];
  items: { nome: string; comodo: string }[];
  givesPix: boolean;
  whatsapp: string;
  comment?: string | null;
};

export function ChaEmail({
  familyName,
  attendingNames,
  notAttendingNames,
  items,
  givesPix,
  whatsapp,
  comment,
}: Props) {
  const vai = attendingNames.length > 0;
  return (
    <Html lang="pt-BR">
      <Head />
      <Preview>
        {vai
          ? `Chá de casa nova: ${familyName} confirmou`
          : `Chá de casa nova: ${familyName} não poderá ir`}
      </Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={h1}>
            {vai ? "🏡 Nova Confirmação" : "🙏 Resposta Recebida"}
          </Heading>
          <Text style={subtitle}>Chá de Casa Nova · Samara &amp; Renan</Text>
          <Hr style={hr} />
          <Section>
            <Text style={label}>Família</Text>
            <Text style={value}>{familyName}</Text>
          </Section>
          {vai ? (
            <Section>
              <Text style={label}>Vão ao chá</Text>
              <Text style={value}>{attendingNames.join(", ")}</Text>
            </Section>
          ) : (
            <Section>
              <Text style={label}>Resposta</Text>
              <Text style={value}>Ninguém da família poderá ir.</Text>
            </Section>
          )}
          {vai && notAttendingNames.length > 0 && (
            <Section>
              <Text style={label}>Não vão</Text>
              <Text style={value}>{notAttendingNames.join(", ")}</Text>
            </Section>
          )}
          <Hr style={hr} />
          <Section>
            <Text style={label}>Presentes</Text>
            {items.map((it) => (
              <Text key={it.nome} style={value}>
                🎁 {it.nome}{" "}
                <span style={small}>({it.comodo})</span>
              </Text>
            ))}
            {givesPix && <Text style={value}>💸 Via Pix ou cartão</Text>}
            {items.length === 0 && !givesPix && (
              <Text style={value}>Nenhum presente escolhido.</Text>
            )}
          </Section>
          <Hr style={hr} />
          <Section>
            <Text style={label}>WhatsApp</Text>
            <Text style={value}>📱 {whatsapp}</Text>
          </Section>
          {comment && (
            <>
              <Hr style={hr} />
              <Section>
                <Text style={label}>Recado</Text>
                <Text style={value}>{comment}</Text>
              </Section>
            </>
          )}
          <Hr style={hr} />
          <Text style={footer}>Site dos noivos · Samara &amp; Renan</Text>
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
const small = { fontSize: "13px", color: "#6b5540" };
const footer = {
  fontSize: "11px",
  color: "#a09080",
  textAlign: "center" as const,
  letterSpacing: "2px",
  textTransform: "uppercase" as const,
  margin: "20px 0 4px",
};
