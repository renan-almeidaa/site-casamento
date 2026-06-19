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
  | "lavanderia";

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

  // Itens com preço (do mais barato pro mais caro)
  {
    id: "jogo-facas",
    nome: "Jogo de Facas",
    valor: 73,
    imagem: "/fotos-dos-presentes/jogo de facas.png",
    icon: "knife",
    pastel: "lavender",
    categoria: "cozinha",
  },
  {
    id: "jogo-banho",
    nome: "Jogo de Banho",
    valor: 95,
    imagem: "/fotos-dos-presentes/jogo-de-banho.png",
    icon: "towel",
    pastel: "sky",
    categoria: "banheiro",
  },
  {
    id: "cestos-lixeiras",
    nome: "Cestos e Lixeiras",
    valor: 103,
    icon: "tray",
    pastel: "mint",
    categoria: "lavanderia",
  },
  {
    id: "assadeiras",
    nome: "Assadeiras",
    valor: 115,
    icon: "tray",
    pastel: "salmon",
    categoria: "cozinha",
  },
  {
    id: "frigideira",
    nome: "Frigideira",
    valor: 133,
    imagem: "/fotos-dos-presentes/frigideira.png",
    icon: "fryer",
    pastel: "yellow",
    categoria: "cozinha",
  },
  {
    id: "ferro-passar",
    nome: "Ferro de Passar",
    valor: 135,
    icon: "tray",
    pastel: "sky",
    categoria: "lavanderia",
  },
  {
    id: "utensilios-cozinha",
    nome: "Utensílios de Cozinha",
    valor: 144,
    icon: "spoon",
    pastel: "rose",
    categoria: "cozinha",
  },
  {
    id: "chaleira-eletrica",
    nome: "Chaleira Elétrica",
    valor: 147,
    icon: "coffee",
    pastel: "salmon",
    categoria: "cozinha",
  },
  {
    id: "colcha-casal",
    nome: "Colcha Casal",
    valor: 160,
    icon: "blanket",
    pastel: "lavender",
    categoria: "quarto",
  },
  {
    id: "liquidificador",
    nome: "Liquidificador",
    valor: 179,
    icon: "blender",
    pastel: "yellow",
    categoria: "cozinha",
  },
  {
    id: "panela-arroz",
    nome: "Panela de Arroz",
    valor: 189,
    icon: "pot",
    pastel: "mint",
    categoria: "cozinha",
  },
  {
    id: "jogo-talheres",
    nome: "Jogo de Talheres",
    valor: 189,
    icon: "spoon",
    pastel: "yellow",
    categoria: "cozinha",
  },
  {
    id: "pratos-copos",
    nome: "Pratos e Copos",
    valor: 199,
    icon: "plate",
    pastel: "rose",
    categoria: "cozinha",
  },
  {
    id: "panela-pressao",
    nome: "Panela de Pressão",
    valor: 209,
    icon: "pot",
    pastel: "salmon",
    categoria: "cozinha",
  },
  {
    id: "chuveiro-eletrico",
    nome: "Chuveiro Elétrico",
    valor: 285,
    icon: "filter",
    pastel: "sky",
    categoria: "banheiro",
  },
  {
    id: "panelas-tramontina",
    nome: "Panelas Tramontina",
    valor: 314,
    imagem: "/fotos-dos-presentes/jogo de panelas.png",
    icon: "pot",
    pastel: "mint",
    categoria: "cozinha",
  },
  {
    id: "escorredor-louca",
    nome: "Escorredor de Louça",
    valor: 371,
    icon: "drainer",
    pastel: "lavender",
    categoria: "cozinha",
  },
  {
    id: "filtro-agua",
    nome: "Filtro de Água",
    valor: 387,
    icon: "filter",
    pastel: "sky",
    categoria: "cozinha",
  },
  {
    id: "micro-ondas",
    nome: "Micro-ondas",
    valor: 734,
    icon: "sandwich",
    pastel: "yellow",
    categoria: "cozinha",
  },
  {
    id: "fogao",
    nome: "Fogão",
    valor: 899,
    icon: "pot",
    pastel: "rose",
    categoria: "cozinha",
  },
  {
    id: "guarda-roupa",
    nome: "Guarda-Roupa",
    valor: 1098,
    icon: "home",
    pastel: "lavender",
    categoria: "quarto",
  },
  {
    id: "smart-tv",
    nome: 'Smart TV 32"',
    valor: 1852,
    icon: "home",
    pastel: "sky",
    categoria: "sala",
  },
  {
    id: "mesa-cadeiras",
    nome: "Mesa e Cadeiras",
    valor: 1972,
    icon: "dinner",
    pastel: "yellow",
    categoria: "sala",
  },
  {
    id: "geladeira",
    nome: "Geladeira",
    valor: 2416,
    icon: "home",
    pastel: "mint",
    categoria: "cozinha",
  },
  {
    id: "sofa",
    nome: "Sofá",
    valor: 2500,
    icon: "home",
    pastel: "salmon",
    categoria: "sala",
  },
  {
    id: "cama-colchao",
    nome: "Cama Box + Colchão",
    valor: 2541,
    icon: "bed",
    pastel: "rose",
    categoria: "quarto",
  },
  {
    id: "lava-seca",
    nome: "Lava e Seca",
    valor: 3453,
    icon: "home",
    pastel: "lavender",
    categoria: "lavanderia",
  },
];

export const CATEGORIAS = [
  { id: "todos", label: "Todos" },
  { id: "cozinha", label: "Cozinha" },
  { id: "quarto", label: "Quarto" },
  { id: "sala", label: "Sala" },
  { id: "banheiro", label: "Banheiro" },
  { id: "lavanderia", label: "Lavanderia" },
  { id: "contribuicao", label: "Contribuição" },
] as const;
