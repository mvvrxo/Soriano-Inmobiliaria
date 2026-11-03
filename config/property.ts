export const propertyTypes = ["Casa", "Piso", "Local", "Terreno", "Otros"] as const;

export const budgetRanges = {
  venta: { min: 100_000, max: 2_000_000, step: 25_000 },
  alquiler: { min: 500, max: 3_100, step: 100 },
} as const;

/** Energy certificate options. Spanish law requires the rating in every sale or rental advert. */
export const energyRatings = ["A", "B", "C", "D", "E", "F", "G", "En trámite", "Exento"] as const;
