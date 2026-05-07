// Gerador de PIX "copia e cola" (BR Code, padrão EMV).
// Permite incluir um valor dinâmico — quando o convidado escolhe presentes
// com preço, geramos um código PIX já com o valor preenchido.

function tlv(id: string, value: string): string {
  return id + value.length.toString().padStart(2, "0") + value;
}

// CRC16-CCITT-FALSE (poly 0x1021, init 0xFFFF) — exigido pelo padrão BR Code.
function crc16(payload: string): string {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

// Sanitiza textos para o BR Code: remove acentos, caracteres especiais,
// e limita o tamanho. Bancos rejeitam caracteres fora do ASCII básico.
function ascii(text: string, max: number): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^A-Za-z0-9 ]/g, "")
    .substring(0, max)
    .trim();
}

export type PixParams = {
  pixKey: string;
  merchantName: string;
  merchantCity: string;
  amount?: number; // em reais; se ausente ou 0, valor fica em aberto
  txid?: string; // até 25 chars; "***" = sem identificador
};

export function generatePixCode({
  pixKey,
  merchantName,
  merchantCity,
  amount,
  txid = "***",
}: PixParams): string {
  const merchantAccountInfo =
    tlv("00", "BR.GOV.BCB.PIX") + tlv("01", pixKey);

  const cleanedTxid = ascii(txid || "***", 25) || "***";
  const additionalData = tlv("05", cleanedTxid);

  const amountStr =
    amount && amount > 0 ? amount.toFixed(2) : "";

  let payload =
    tlv("00", "01") +
    tlv("26", merchantAccountInfo) +
    tlv("52", "0000") +
    tlv("53", "986") +
    (amountStr ? tlv("54", amountStr) : "") +
    tlv("58", "BR") +
    tlv("59", ascii(merchantName, 25)) +
    tlv("60", ascii(merchantCity, 15)) +
    tlv("62", additionalData);

  payload += "6304" + crc16(payload + "6304");
  return payload;
}

// Dados do casal — extrai o pixKey (chave aleatória UUID) do template estático
// definido no .env, garantindo que o código gerado bata exatamente com o do banco.
const STATIC_TEMPLATE =
  "00020126580014BR.GOV.BCB.PIX0136d8c6c7af-56da-4630-a769-8bfe6a4b97005204000053039865802BR5925Renan Goncalves de Almeid6009SAO PAULO62140510RCygUpW3rq63047A2B";

function extractPixKey(template: string): string {
  const FALLBACK = "d8c6c7af-56da-4630-a769-8bfe6a4b9700";
  // O bloco 26 (Merchant Account Info) sempre vem após o cabeçalho fixo
  // "000201" (Payload Format Indicator). Pulamos esses 6 chars e parseamos
  // o TLV propriamente, sem indexOf (que casa em substrings dentro de outros campos).
  if (template.length < 10 || template.substring(6, 8) !== "26") {
    return FALLBACK;
  }
  const merchantLen = parseInt(template.substring(8, 10), 10);
  const block = template.substring(10, 10 + merchantLen);

  // Caminha campo por campo dentro do bloco
  let pos = 0;
  while (pos + 4 <= block.length) {
    const fieldId = block.substring(pos, pos + 2);
    const fieldLen = parseInt(block.substring(pos + 2, pos + 4), 10);
    const fieldValue = block.substring(pos + 4, pos + 4 + fieldLen);
    if (fieldId === "01") return fieldValue;
    pos += 4 + fieldLen;
  }
  return FALLBACK;
}

export const PIX_CONFIG = {
  pixKey: extractPixKey(
    process.env.NEXT_PUBLIC_PIX_COPIA_COLA ?? STATIC_TEMPLATE,
  ),
  merchantName: "Renan Goncalves de Almeid",
  merchantCity: "SAO PAULO",
};

// Helper que já injeta os dados do casal — só precisa passar o valor.
export function pixForAmount(amount?: number, txid?: string): string {
  return generatePixCode({
    ...PIX_CONFIG,
    amount,
    txid,
  });
}
