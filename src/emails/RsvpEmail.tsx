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
  confirmed: boolean;
  familyName: string;
  attendingNames: string[];
  notAttendingNames: string[];
  totalAdults: number;
  totalChildren: number;
  phone: string;
  email: string;
  comment?: string | null;
};

export function RsvpEmail({
  confirmed,
  familyName,
  attendingNames,
  notAttendingNames,
  totalAdults,
  totalChildren,
  phone,
  email,
  comment,
}: Props) {
  return (
    <Html lang="pt-BR">
      <Head />
      <Preview>
        {confirmed
          ? `Nova confirmação: ${familyName}`
          : `Resposta recebida: ${familyName} não poderá comparecer`}
      </Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={h1}>
            {confirmed ? "✨ Nova Confirmação" : "🙏 Resposta Recebida"}
          </Heading>
          <Text style={subtitle}>Casamento Samara &amp; Renan</Text>
          <Hr style={hr} />
          <Section>
            <Text style={label}>Família</Text>
            <Text style={value}>{familyName}</Text>
          </Section>
          {attendingNames.length > 0 && (
            <Section>
              <Text style={label}>Vão ao casamento</Text>
              <Text style={value}>{attendingNames.join(", ")}</Text>
              <Text style={small}>
                {totalAdults} adulto(s) · {totalChildren} criança(s)
              </Text>
            </Section>
          )}
          {notAttendingNames.length > 0 && (
            <Section>
              <Text style={label}>Não vão</Text>
              <Text style={value}>{notAttendingNames.join(", ")}</Text>
            </Section>
          )}
          {!confirmed && notAttendingNames.length === 0 && (
            <Section>
              <Text style={label}>Resposta</Text>
              <Text style={value}>
                Ninguém da família poderá comparecer.
              </Text>
            </Section>
          )}
          <Hr style={hr} />
          <Section>
            <Text style={label}>Contato</Text>
            <Text style={value}>📞 {phone}</Text>
            <Text style={value}>✉️ {email}</Text>
          </Section>
          {comment && (
            <>
              <Hr style={hr} />
              <Section>
                <Text style={label}>Comentário</Text>
                <Text style={value}>{comment}</Text>
              </Section>
            </>
          )}
          <Hr style={hr} />
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
const small = { fontSize: "13px", color: "#6b5540", margin: "4px 0 0" };
const footer = {
  fontSize: "11px",
  color: "#a09080",
  textAlign: "center" as const,
  letterSpacing: "2px",
  textTransform: "uppercase" as const,
  margin: "20px 0 4px",
};
