// Lista de itens do chá de casa nova. Cada item tem um dono só — quando
// alguém escolhe, ele aparece riscado para todo mundo.
//
// O `id` é derivado de cômodo + nome. Renomear um item que já foi escolhido
// "solta" o registro antigo, então prefira só adicionar/remover itens.
// Dentro de cada grupo, os itens mais acessíveis vêm primeiro.

export type ChaComodo = {
  id: string;
  label: string;
  /** Nome curto para o botão de atalho */
  short: string;
  grupos: { label: string; itens: string[] }[];
};

export const CHA_COMODOS: ChaComodo[] = [
  {
    id: "cozinha",
    label: "Cozinha",
    short: "Cozinha",
    grupos: [
      {
        label: "Utensílios básicos",
        itens: [
          "Jogo de copos",
          "Jarra de suco",
          "Jogo de talheres",
          "Jogo de pratos",
          "Panelas",
          "Frigideiras",
        ],
      },
      {
        label: "Preparo e apoio",
        itens: [
          "Abridor de latas",
          "Saca-rolhas",
          "Ralador",
          "Tábua de corte",
          "Escorredor de macarrão",
          "Escorredor de louça",
        ],
      },
      {
        label: "Armazenamento",
        itens: ["Potes plásticos", "Potes herméticos"],
      },
      {
        label: "Panos e avental",
        itens: ["Panos de prato", "Avental"],
      },
      {
        label: "Eletroportáteis",
        itens: [
          "Sanduicheira",
          "Liquidificador",
          "Batedeira",
          "Air fryer",
          "Micro-ondas",
        ],
      },
    ],
  },
  {
    id: "quarto",
    label: "Quarto",
    short: "Quarto",
    grupos: [
      {
        label: "Cama",
        itens: [
          "Travesseiros",
          "Jogo de cama (lençol e fronhas)",
          "Colcha",
          "Edredom",
        ],
      },
      {
        label: "Proteção e organização",
        itens: ["Cabides", "Protetor de colchão", "Sapateira"],
      },
      {
        label: "Decoração",
        itens: ["Almofadas decorativas", "Tapete"],
      },
    ],
  },
  {
    id: "banheiro",
    label: "Banheiro",
    short: "Banheiro",
    grupos: [
      {
        label: "Toalhas e tecidos",
        itens: [
          "Toalhas de rosto",
          "Toalhas de banho",
          "Tapete de banheiro",
          "Roupão",
        ],
      },
      {
        label: "Acessórios",
        itens: [
          "Saboneteira ou dispenser",
          "Escova para vaso sanitário",
          "Lixeira",
          "Cesto de roupa suja",
          "Aromatizador (frasco ou difusor)",
        ],
      },
    ],
  },
  {
    id: "sala",
    label: "Sala",
    short: "Sala",
    grupos: [
      {
        label: "Conforto",
        itens: ["Almofadas (com capas avulsas)", "Manta para o sofá"],
      },
      {
        label: "Piso e janelas",
        itens: ["Tapete para a sala", "Cortina"],
      },
      {
        label: "Detalhes",
        itens: [
          "Velas aromáticas",
          "Porta-retratos",
          "Vasos de plantas",
          "Frasco para aromatizador",
          "Bandeja acrílica",
          "Quadros decorativos",
          "Luminária (abajur, piso ou mesa)",
        ],
      },
    ],
  },
  {
    id: "servico",
    label: "Área de Serviço",
    short: "Serviço",
    grupos: [
      {
        label: "Limpeza básica",
        itens: [
          "Panos de chão",
          "Pá de lixo",
          "Balde",
          "Vassoura",
          "Rodo",
          "Escovas de limpeza",
        ],
      },
      {
        label: "Organização",
        itens: [
          "Pregadores",
          "Cesto multiuso",
          "Cestos organizadores",
          "Suporte de parede para vassouras e rodos",
          "Varal de chão",
        ],
      },
    ],
  },
  {
    id: "lazer",
    label: "Área de Lazer",
    short: "Lazer",
    grupos: [
      {
        label: "Para receber",
        itens: [
          "Toalhas de mesa para área externa",
          "Kit de churrasco",
          "Louças e talheres exclusivos",
          "Caixa de som Bluetooth",
          "Bancos e cadeiras extras",
        ],
      },
    ],
  },
];

const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export type ChaItem = {
  id: string;
  nome: string;
  comodoId: string;
  comodoLabel: string;
  grupo: string;
};

export const CHA_ITENS: ChaItem[] = CHA_COMODOS.flatMap((c) =>
  c.grupos.flatMap((g) =>
    g.itens.map((nome) => ({
      id: `${c.id}-${slugify(nome)}`,
      nome,
      comodoId: c.id,
      comodoLabel: c.label,
      grupo: g.label,
    })),
  ),
);

const BY_ID = new Map(CHA_ITENS.map((i) => [i.id, i]));

export function getChaItem(id: string): ChaItem | undefined {
  return BY_ID.get(id);
}
