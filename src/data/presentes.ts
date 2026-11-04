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

  // Itens com preço (do mais barato pro mais caro)
  {
    id: "cafe-manha",
    nome: "Café da Manhã Especial",
    valor: 80,
    icon: "coffee",
    pastel: "salmon",
    categoria: "lua-de-mel",
  },
  {
    id: "noite-pizza",
    nome: "Noite de Pizza na Casa Nova",
    valor: 80,
    icon: "plate",
    pastel: "yellow",
    categoria: "primeiros-dias",
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
    id: "jantar-romantico",
    nome: "Jantar Romântico",
    valor: 150,
    icon: "dinner",
    pastel: "rose",
    categoria: "lua-de-mel",
  },
  {
    id: "compra-mercado",
    nome: "Primeira Compra de Mercado",
    valor: 150,
    icon: "tray",
    pastel: "mint",
    categoria: "primeiros-dias",
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
    id: "ventilador",
    nome: "Ventilador",
    valor: 220,
    icon: "home",
    pastel: "sky",
    categoria: "casa",
  },
  {
    id: "passeio-dois",
    nome: "Passeio a Dois",
    valor: 250,
    icon: "honeymoon",
    pastel: "lavender",
    categoria: "lua-de-mel",
  },
  {
    id: "montagem-moveis",
    nome: "Montagem dos Móveis",
    valor: 250,
    icon: "home",
    pastel: "salmon",
    categoria: "primeiros-dias",
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
    id: "chuveiro-eletrico",
    nome: "Chuveiro Elétrico",
    valor: 285,
    imagem: "/fotos-dos-presentes/chuveiro elétrico.png",
    icon: "filter",
    pastel: "sky",
    categoria: "banheiro",
  },
  {
    id: "primeiras-contas",
    nome: "Ajuda com as Primeiras Contas da Casa",
    valor: 300,
    icon: "home",
    pastel: "sky",
    categoria: "primeiros-dias",
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
    id: "aspirador-po",
    nome: "Aspirador de Pó",
    valor: 350,
    icon: "home",
    pastel: "mint",
    categoria: "casa",
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
    id: "diaria-hotel",
    nome: "Diária de Hotel",
    valor: 400,
    icon: "bed",
    pastel: "rose",
    categoria: "lua-de-mel",
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
    id: "ajuda-passagem",
    nome: "Ajuda na Passagem",
    valor: 600,
    icon: "honeymoon",
    pastel: "sky",
    categoria: "lua-de-mel",
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
  { id: "casa", label: "Casa" },
  { id: "lua-de-mel", label: "Lua de Mel" },
  { id: "primeiros-dias", label: "Primeiros Dias" },
  { id: "contribuicao", label: "Contribuição" },
] as const;
