export type IconType =
  | "heart"
  | "home"
  | "knife"
  | "pot"
  | "cup"
  | "plate"
  | "spoon"
  | "tray"
  | "towel"
  | "bed"
  | "blanket"
  | "drainer"
  | "filter"
  | "blender"
  | "coffee"
  | "fryer"
  | "sandwich"
  | "dinner"
  | "honeymoon";

export type CategoriaId =
  | "contribuicao"
  | "cozinha"
  | "quarto"
  | "sala"
  | "banheiro"
  | "lavanderia"
  | "casa"
  | "experiencias"
  | "divertidos"
  | "lua-de-mel"
  | "primeiros-dias";

export type PastelTone =
  | "rose"
  | "salmon"
  | "lavender"
  | "mint"
  | "sky"
  | "yellow";

export type Presente = {
  id: string;
  nome: string;
  valor: number; // 0 = valor livre
  imagem?: string;
  icon: IconType;
  pastel: PastelTone;
  descricao?: string;
  categoria: CategoriaId;
  destaque?: boolean;
};

export const PRESENTES: Presente[] = [
  // Contribuição (valor livre — sempre no topo)
  {
    id: "ajuda-mobiliar",
    nome: "Ajuda para Mobiliar",
    valor: 0,
    imagem: "/fotos-dos-presentes/Ajuda para Mobiliar.png",
    icon: "home",
    pastel: "rose",
    descricao: "Contribua com qualquer valor para mobiliarmos o nosso lar.",
    categoria: "contribuicao",
    destaque: true,
  },
  {
    id: "primeiros-meses",
    nome: "Primeiros Meses Juntos",
    valor: 0,
    imagem: "/fotos-dos-presentes/Primeiros Meses Juntos.png",
    icon: "heart",
    pastel: "salmon",
    descricao: "Ajude com os primeiros meses da nossa nova vida juntos.",
    categoria: "contribuicao",
    destaque: true,
  },

  // Coisas de casa (do mais caro pro mais barato)
  {
    id: "cama-colchao",
    nome: "Cama Box + Colchão",
    valor: 4500,
    imagem: "/fotos-dos-presentes/Cama box.png",
    icon: "bed",
    pastel: "rose",
    categoria: "quarto",
  },
  {
    id: "geladeira",
    nome: "Geladeira",
    valor: 3500,
    imagem: "/fotos-dos-presentes/geladeira.png",
    icon: "home",
    pastel: "mint",
    categoria: "cozinha",
  },
  {
    id: "lava-seca",
    nome: "Lava e Seca",
    valor: 3453,
    imagem: "/fotos-dos-presentes/lava e seca.png",
    icon: "home",
    pastel: "lavender",
    categoria: "lavanderia",
  },
  {
    id: "sofa",
    nome: "Sofá",
    valor: 2500,
    imagem: "/fotos-dos-presentes/sofá.png",
    icon: "home",
    pastel: "salmon",
    categoria: "sala",
  },
  {
    id: "smart-tv",
    nome: "Televisão",
    valor: 2000,
    imagem: "/fotos-dos-presentes/smart tv.png",
    icon: "home",
    pastel: "sky",
    categoria: "sala",
  },
  {
    id: "mesa-cadeiras",
    nome: "Mesa e Cadeiras",
    valor: 1972,
    imagem: "/fotos-dos-presentes/mesas e cadeiras.png",
    icon: "dinner",
    pastel: "yellow",
    categoria: "sala",
  },
  {
    id: "guarda-roupa",
    nome: "Guarda-Roupa",
    valor: 1500,
    imagem: "/fotos-dos-presentes/guarda roupas.jpg",
    icon: "home",
    pastel: "lavender",
    categoria: "quarto",
  },
  {
    id: "comoda",
    nome: "Cômoda",
    valor: 600,
    icon: "home",
    pastel: "mint",
    categoria: "quarto",
  },
  {
    id: "rack-tv",
    nome: "Rack para TV",
    valor: 500,
    icon: "home",
    pastel: "salmon",
    categoria: "sala",
  },
  {
    id: "forno-eletrico",
    nome: "Forno Elétrico",
    valor: 500,
    icon: "fryer",
    pastel: "yellow",
    categoria: "cozinha",
  },
  {
    id: "filtro-agua",
    nome: "Filtro de Água",
    valor: 387,
    imagem: "/fotos-dos-presentes/filtro de água.png",
    icon: "filter",
    pastel: "sky",
    categoria: "cozinha",
  },
  {
    id: "aspirador-po",
    nome: "Aspirador de Pó",
    valor: 350,
    icon: "home",
    pastel: "mint",
    categoria: "casa",
  },
  {
    id: "espelho-corpo",
    nome: "Espelho de Corpo Inteiro",
    valor: 300,
    icon: "home",
    pastel: "lavender",
    categoria: "quarto",
  },
  {
    id: "chuveiro-eletrico",
    nome: "Chuveiro Elétrico",
    valor: 285,
    imagem: "/fotos-dos-presentes/chuveiro elétrico.png",
    icon: "filter",
    pastel: "sky",
    categoria: "banheiro",
  },
  {
    id: "mesa-cabeceira",
    nome: "Mesa de Cabeceira",
    valor: 250,
    icon: "home",
    pastel: "yellow",
    categoria: "quarto",
  },
  {
    id: "furadeira",
    nome: "Furadeira",
    valor: 250,
    icon: "tray",
    pastel: "rose",
    categoria: "casa",
  },
  {
    id: "ventilador",
    nome: "Ventilador",
    valor: 220,
    icon: "home",
    pastel: "sky",
    categoria: "casa",
  },
  {
    id: "seguranca-lar",
    nome: "Segurança do Nosso Lar",
    valor: 170,
    imagem: "/fotos-dos-presentes/seguranca-do-nosso-lar.jpg",
    icon: "home",
    pastel: "sky",
    categoria: "casa",
  },
  {
    id: "escada-domestica",
    nome: "Escada Doméstica",
    valor: 150,
    icon: "home",
    pastel: "lavender",
    categoria: "casa",
  },
  {
    id: "kit-ferramentas",
    nome: "Kit de Ferramentas",
    valor: 120,
    icon: "tray",
    pastel: "sky",
    categoria: "casa",
  },
  {
    id: "prateleiras",
    nome: "Prateleiras",
    valor: 120,
    icon: "tray",
    pastel: "mint",
    categoria: "sala",
  },
  {
    id: "instalacao-cortinas",
    nome: "Instalação das Cortinas",
    valor: 120,
    imagem: "/fotos-dos-presentes/instalacao-das-cortinas.jpg",
    icon: "home",
    pastel: "lavender",
    categoria: "casa",
  },
  {
    id: "iluminacao",
    nome: "Iluminação da Casa",
    valor: 100,
    imagem: "/fotos-dos-presentes/iluminacao-da-casa.jpg",
    icon: "home",
    pastel: "yellow",
    categoria: "casa",
  },
  {
    id: "cantinho-verde",
    nome: "Cantinho Verde da Casa",
    valor: 60,
    imagem: "/fotos-dos-presentes/cantinho-verde-da-casa.jpg",
    icon: "home",
    pastel: "mint",
    categoria: "casa",
  },

  // Experiências e demais presentes (do mais barato pro mais caro)
  {
    id: "estoque-guloseimas",
    nome: "Nosso Primeiro Estoque de Guloseimas",
    valor: 50,
    imagem: "/fotos-dos-presentes/primeiro-estoque-de-guloseimas.jpg",
    icon: "heart",
    pastel: "rose",
    categoria: "divertidos",
  },
  {
    id: "estoque-cafe",
    nome: "Reposição do Estoque de Café",
    valor: 50,
    imagem: "/fotos-dos-presentes/reposicao-estoque-cafe.jpg",
    icon: "coffee",
    pastel: "mint",
    categoria: "divertidos",
  },
  {
    id: "cafe-domingo",
    nome: "Primeiro Café da Manhã de Domingo",
    valor: 60,
    imagem: "/fotos-dos-presentes/primeiro-cafe-domingo.jpg",
    icon: "coffee",
    pastel: "sky",
    categoria: "divertidos",
  },
  {
    id: "cinema-casa",
    nome: "Noite de Cinema em Casa",
    valor: 70,
    imagem: "/fotos-dos-presentes/noite-de-cinema-em-casa.jpg",
    icon: "heart",
    pastel: "sky",
    categoria: "experiencias",
  },
  {
    id: "cafe-cama",
    nome: "Café da Manhã na Cama",
    valor: 80,
    imagem: "/fotos-dos-presentes/cafe-da-manha-na-cama.jpg",
    icon: "coffee",
    pastel: "salmon",
    categoria: "experiencias",
  },
  {
    id: "por-do-sol",
    nome: "Pôr do Sol Especial",
    valor: 80,
    imagem: "/fotos-dos-presentes/por-do-sol-especial.jpg",
    icon: "honeymoon",
    pastel: "salmon",
    categoria: "lua-de-mel",
  },
  {
    id: "fundo-pizza",
    nome: "Fundo para Pedir Pizza sem Culpa",
    valor: 80,
    imagem: "/fotos-dos-presentes/fundo-pedir-pizza.jpg",
    icon: "plate",
    pastel: "yellow",
    categoria: "divertidos",
  },
  {
    id: "piquenique",
    nome: "Piquenique a Dois",
    valor: 100,
    imagem: "/fotos-dos-presentes/piquenique-a-dois.jpg",
    icon: "heart",
    pastel: "mint",
    categoria: "experiencias",
  },
  {
    id: "vale-folga",
    nome: "Vale uma Folga das Tarefas Domésticas",
    valor: 100,
    imagem: "/fotos-dos-presentes/vale-folga-tarefas-domesticas.jpg",
    icon: "heart",
    pastel: "lavender",
    categoria: "divertidos",
  },
  {
    id: "jantar-comemoracao",
    nome: "Nosso Primeiro Jantar de Comemoração",
    valor: 100,
    imagem: "/fotos-dos-presentes/primeiro-jantar-comemoracao.jpg",
    icon: "dinner",
    pastel: "rose",
    categoria: "divertidos",
  },
  {
    id: "cafe-hotel",
    nome: "Café da Manhã no Hotel",
    valor: 120,
    imagem: "/fotos-dos-presentes/cafe-da-manha-no-hotel.jpg",
    icon: "coffee",
    pastel: "yellow",
    categoria: "lua-de-mel",
  },
  {
    id: "fundo-churrasco",
    nome: "Fundo do Churrasco dos Recém-Casados",
    valor: 120,
    imagem: "/fotos-dos-presentes/fundo-do-churrasco.jpg",
    icon: "dinner",
    pastel: "salmon",
    categoria: "divertidos",
  },
  {
    id: "compra-mercado",
    nome: "Primeira Compra de Mercado",
    valor: 150,
    imagem: "/fotos-dos-presentes/primeira-compra-de-mercado.jpg",
    icon: "tray",
    pastel: "mint",
    categoria: "primeiros-dias",
  },
  {
    id: "jantar-especial",
    nome: "Noite de Jantar Especial",
    valor: 150,
    imagem: "/fotos-dos-presentes/noite-de-jantar-especial.jpg",
    icon: "dinner",
    pastel: "rose",
    categoria: "experiencias",
  },
  {
    id: "ajuda-mudanca",
    nome: "Ajuda na Mudança",
    valor: 150,
    imagem: "/fotos-dos-presentes/ajuda-na-mudanca.jpg",
    icon: "home",
    pastel: "salmon",
    categoria: "primeiros-dias",
  },
  {
    id: "encontro-surpresa",
    nome: "Fundo para um Encontro Surpresa",
    valor: 150,
    imagem: "/fotos-dos-presentes/fundo-encontro-surpresa.jpg",
    icon: "heart",
    pastel: "rose",
    categoria: "divertidos",
  },
  {
    id: "jantar-viagem",
    nome: "Jantar Durante a Viagem",
    valor: 180,
    imagem: "/fotos-dos-presentes/jantar-durante-a-viagem.jpg",
    icon: "dinner",
    pastel: "rose",
    categoria: "lua-de-mel",
  },
  {
    id: "dia-descanso",
    nome: "Dia de Descanso do Casal",
    valor: 200,
    imagem: "/fotos-dos-presentes/dia-de-descanso-do-casal.jpg",
    icon: "heart",
    pastel: "lavender",
    categoria: "experiencias",
  },
  {
    id: "montagem-moveis",
    nome: "Montagem dos Móveis",
    valor: 200,
    imagem: "/fotos-dos-presentes/montagem-dos-moveis.jpg",
    icon: "home",
    pastel: "yellow",
    categoria: "primeiros-dias",
  },
  {
    id: "ajuda-passagem",
    nome: "Ajuda com a Passagem",
    valor: 200,
    imagem: "/fotos-dos-presentes/ajuda-com-a-passagem.jpg",
    icon: "honeymoon",
    pastel: "sky",
    categoria: "lua-de-mel",
  },
  {
    id: "passeio-surpresa",
    nome: "Passeio Surpresa",
    valor: 250,
    imagem: "/fotos-dos-presentes/passeio-surpresa.jpg",
    icon: "honeymoon",
    pastel: "sky",
    categoria: "experiencias",
  },
  {
    id: "diaria-hotel",
    nome: "Diária de Hotel",
    valor: 400,
    icon: "bed",
    pastel: "rose",
    categoria: "lua-de-mel",
  },
];

// Presentes acima deste valor são divididos em lotes: várias pessoas
// participam do mesmo presente, e cada lote tem um dono só.
export const VALOR_MINIMO_LOTES = 1000;
export const LOTES_POR_PRESENTE = 5;

export const temLotes = (p: Presente) => p.valor > VALOR_MINIMO_LOTES;

export const valorDoLote = (p: Presente) =>
  Math.round((p.valor * 100) / LOTES_POR_PRESENTE) / 100;

export const loteId = (presenteId: string, numero: number) =>
  `${presenteId}--lote-${numero}`;

export function getLote(id: string) {
  const m = /^(.+)--lote-(\d+)$/.exec(id);
  if (!m) return undefined;
  const presente = PRESENTES.find((p) => p.id === m[1]);
  const numero = Number(m[2]);
  if (!presente || !temLotes(presente)) return undefined;
  if (numero < 1 || numero > LOTES_POR_PRESENTE) return undefined;
  return {
    id,
    numero,
    nome: `${presente.nome} — Lote ${numero} de ${LOTES_POR_PRESENTE}`,
    valor: valorDoLote(presente),
  };
}

export const CATEGORIAS = [
  { id: "todos", label: "Todos" },
  { id: "cozinha", label: "Cozinha" },
  { id: "quarto", label: "Quarto" },
  { id: "sala", label: "Sala" },
  { id: "banheiro", label: "Banheiro" },
  { id: "lavanderia", label: "Lavanderia" },
  { id: "casa", label: "Casa" },
  { id: "experiencias", label: "Experiências" },
  { id: "divertidos", label: "Divertidos" },
  { id: "lua-de-mel", label: "Lua de Mel" },
  { id: "primeiros-dias", label: "Primeiros Dias" },
  { id: "contribuicao", label: "Contribuição" },
] as const;
