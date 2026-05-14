export type FilterPreset = {
  id: string;
  label: string;
  /** Applied to video/canvas via CSS filter */
  cssFilter: string;
};

export const FILTER_PRESETS: FilterPreset[] = [
  { id: "kodak-gold-400", label: "Kodak Gold 400", cssFilter: "contrast(1.08) saturate(1.25) sepia(0.12) brightness(1.03)" },
  { id: "fuji-superia", label: "Fuji Superia", cssFilter: "saturate(1.2) hue-rotate(-8deg) contrast(1.05) brightness(1.02)" },
  { id: "lomo-lca", label: "Lomo LC-A", cssFilter: "saturate(1.35) contrast(1.2) hue-rotate(12deg) brightness(0.98)" },
  { id: "ilford-hp5", label: "Ilford HP5", cssFilter: "grayscale(1) contrast(1.15) brightness(0.95)" },
  { id: "portra-400", label: "Portra 400", cssFilter: "saturate(1.1) contrast(1.02) sepia(0.08) brightness(1.04)" },
  { id: "ektachrome", label: "Ektachrome", cssFilter: "saturate(1.3) contrast(1.12) hue-rotate(-4deg)" },
  { id: "cinestill", label: "Cinestill", cssFilter: "saturate(1.15) contrast(1.18) brightness(1.05) hue-rotate(4deg)" },
  { id: "polaroid", label: "Polaroid", cssFilter: "contrast(0.95) saturate(0.9) sepia(0.18) brightness(1.06)" },
];

export function getFilterById(id: string): FilterPreset {
  return FILTER_PRESETS.find((f) => f.id === id) ?? FILTER_PRESETS[0]!;
}
