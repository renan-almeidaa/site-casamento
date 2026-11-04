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
    id: "chuveiro-eletrico",
    nome: "Chuveiro Elétrico",
    valor: 285,
    imagem: "/fotos-dos-presentes/chuveiro elétrico.png",
    icon: "filter",
    pastel: "sky",
    categoria: "banheiro",
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
