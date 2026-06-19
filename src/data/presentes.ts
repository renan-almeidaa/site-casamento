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
    imagem: "/fotos-dos-presentes/Cestos e lixeiras.jpeg",
    icon: "tray",
    pastel: "mint",
    categoria: "lavanderia",
  },
  {
    id: "assadeiras",
    nome: "Assadeiras",
    valor: 115,
    imagem: "/fotos-dos-presentes/assadeiras.png",
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
    imagem: "/fotos-dos-presentes/Ferro de passar.png",
    icon: "tray",
    pastel: "sky",
    categoria: "lavanderia",
  },
  {
    id: "utensilios-cozinha",
    nome: "Utensílios de Cozinha",
    valor: 144,
    imagem: "/fotos-dos-presentes/utensilios de cozinha.png",
    icon: "spoon",
    pastel: "rose",
    categoria: "cozinha",
  },
  {
    id: "chaleira-eletrica",
    nome: "Chaleira Elétrica",
    valor: 147,
    imagem: "/fotos-dos-presentes/chaleira elétrica.png",
    icon: "coffee",
    pastel: "salmon",
    categoria: "cozinha",
  },
  {
    id: "colcha-casal",
    nome: "Colcha Casal",
    valor: 160,
    imagem: "/fotos-dos-presentes/colcha casal.png",
    icon: "blanket",
    pastel: "lavender",
    categoria: "quarto",
  },
  {
    id: "liquidificador",
    nome: "Liquidificador",
    valor: 179,
    imagem: "/fotos-dos-presentes/liquidificador.png",
    icon: "blender",
    pastel: "yellow",
    categoria: "cozinha",
  },
  {
    id: "panela-arroz",
    nome: "Panela de Arroz",
    valor: 189,
    imagem: "/fotos-dos-presentes/Panela de arroz.png",
    icon: "pot",
    pastel: "mint",
    categoria: "cozinha",
  },
  {
    id: "jogo-talheres",
    nome: "Jogo de Talheres",
    valor: 189,
    imagem: "/fotos-dos-presentes/jogo de talheres.png",
    icon: "spoon",
    pastel: "yellow",
    categoria: "cozinha",
  },
  {
    id: "pratos-copos",
    nome: "Pratos e Copos",
    valor: 199,
    imagem: "/fotos-dos-presentes/pratos e copos.jpg",
    icon: "plate",
    pastel: "rose",
    categoria: "cozinha",
  },
  {
    id: "panela-pressao",
    nome: "Panela de Pressão",
    valor: 209,
    imagem: "/fotos-dos-presentes/panela de pressão.png",
    icon: "pot",
    pastel: "salmon",
    categoria: "cozinha",
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
    imagem: "/fotos-dos-presentes/escorredor de louças.png",
    icon: "drainer",
    pastel: "lavender",
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
    id: "micro-ondas",
    nome: "Micro-ondas",
    valor: 734,
    imagem: "/fotos-dos-presentes/microondas.png",
    icon: "sandwich",
    pastel: "yellow",
    categoria: "cozinha",
  },
  {
    id: "fogao",
    nome: "Fogão",
    valor: 899,
    imagem: "/fotos-dos-presentes/fogão.png",
    icon: "pot",
    pastel: "rose",
    categoria: "cozinha",
  },
  {
    id: "guarda-roupa",
    nome: "Guarda-Roupa",
    valor: 1098,
    imagem: "/fotos-dos-presentes/guarda roupas.jpg",
    icon: "home",
    pastel: "lavender",
    categoria: "quarto",
  },
  {
    id: "smart-tv",
    nome: "Smart TV",
    valor: 1852,
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
    id: "geladeira",
    nome: "Geladeira",
    valor: 2416,
    imagem: "/fotos-dos-presentes/geladeira.png",
    icon: "home",
    pastel: "mint",
    categoria: "cozinha",
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
    id: "cama-colchao",
    nome: "Cama Box + Colchão",
    valor: 2541,
    imagem: "/fotos-dos-presentes/Cama box.png",
    icon: "bed",
    pastel: "rose",
    categoria: "quarto",
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
