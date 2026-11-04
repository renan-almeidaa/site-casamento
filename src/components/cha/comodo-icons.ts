import {
  Bath,
  BedDouble,
  CookingPot,
  Flame,
  Sofa,
  WashingMachine,
  type LucideIcon,
} from "lucide-react";

// Ícone de cada cômodo (id em src/data/cha-itens.ts).
export const COMODO_ICONS: Record<string, LucideIcon> = {
  cozinha: CookingPot,
  quarto: BedDouble,
  banheiro: Bath,
  sala: Sofa,
  servico: WashingMachine,
  lazer: Flame,
};
