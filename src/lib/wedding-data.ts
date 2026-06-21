export const WEDDING = {
  brideName: "Samara",
  groomName: "Renan",
  coupleName: "Samara & Renan",
  date: new Date("2026-10-11T10:30:00-03:00"),
  dateLabel: "11 de outubro de 2026",
  dateShort: "11 . 10 . 2026",
  timeLabel: "10h30",
  verse: "Isto é obra do Senhor, e é maravilhosa aos nossos olhos.",
  verseRef: "Salmos 118:23",
  welcome:
    "Sua presença é o maior presente que poderíamos receber! Com alegria no coração, mal podemos esperar para celebrar esse momento tão especial ao lado de cada um de vocês.",
  ceremony: {
    name: "Igreja Assembleia de Deus – Jardim Catuaí",
    address:
      "R. Joaquim Ferreira Sobrinho, 281 – Núcleo Hab. Parigot de Souza, Apucarana-PR, 86802-610",
    mapUrl:
      "https://www.google.com/maps/place/R.+Joaquim+Ferreira+Sobrinho,+281+-+Nucleo+Hab.+Parigot+de+Souza,+Apucarana+-+PR,+86802-610/@-23.5663586,-51.4390709,14z/data=!4m5!3m4!1s0x94ec9bc0d637a1f7:0xe0809663c30c6f4b!8m2!3d-23.5763053!4d-51.4567949",
    timeLabel: "10h30",
  },
  reception: {
    name: "Recanto Vô Coruja",
    address: "Apucarana-PR",
    mapUrl:
      "https://www.google.com/maps/place/Recanto+V%C3%B4+Coruja/@-23.5793603,-51.4745808,17z/data=!4m14!1m7!3m6!1s0x94ec9bf8df08f519:0x55e24e14152c5f94!2sRecanto+V%C3%B4+Coruja!8m2!3d-23.5793652!4d-51.4720059!16s%2Fg%2F11fvvjgzqt!3m5!1s0x94ec9bf8df08f519:0x55e24e14152c5f94!8m2!3d-23.5793652!4d-51.4720059!16s%2Fg%2F11fvvjgzqt",
    timeLabel: "Logo após a cerimônia",
  },
  dressCode: {
    label: "Esporte fino",
    note: "Cores claras são bem-vindas. O branco fica reservado para a noiva.",
  },
  payment: {
    pixQrLink:
      process.env.NEXT_PUBLIC_PIX_QR_LINK ??
      "https://nubank.com.br/cobrar/5sjpz/69fa538e-109a-4606-b408-0fa284a5938d",
    pixCopiaCola:
      process.env.NEXT_PUBLIC_PIX_COPIA_COLA ??
      "00020126580014BR.GOV.BCB.PIX0136d8c6c7af-56da-4630-a769-8bfe6a4b97005204000053039865802BR5925Renan Goncalves de Almeid6009SAO PAULO62140510RCygUpW3rq63047A2B",
    pixEmail: process.env.NEXT_PUBLIC_PIX_EMAIL ?? "renan_gs14@hotmail.com",
    pixHolder: "Renan Gonçalves de Almeida",
    mercadoPagoLink:
      process.env.NEXT_PUBLIC_MERCADO_PAGO_LINK ??
      "https://link.mercadopago.com.br/samaraerenan",
  },
  whatsappNumber:
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5544999999999",
} as const;

export const SECTIONS = [
  { id: "inicio", label: "Início" },
  { id: "nossa-historia", label: "Nossa História" },
  { id: "o-grande-dia", label: "O Grande Dia" },
  { id: "galeria", label: "Galeria" },
  { id: "rsvp", label: "Confirmar Presença" },
  { id: "presentes", label: "Presentes" },
] as const;

// Fotos da galeria — todas dentro de /fotos-do-casal/galeria/.
// A primeira é o destaque (renderizada em 2x2 no grid desktop).
// Pra reordenar, basta trocar a ordem dos números aqui ou renomear
// os arquivos (gal-01.jpg = primeira posição, etc).
export const GALLERY_PHOTOS = Array.from({ length: 22 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return {
    src: `/fotos-do-casal/galeria/gal-${n}.jpg`,
    alt: "Samara e Renan",
  };
});
