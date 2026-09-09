export const propertyTypes = ["Casa", "Piso", "Local", "Terreno", "Otros"] as const;

export const budgetRanges = {
  venta: { min: 100_000, max: 2_000_000, step: 25_000 },
  alquiler: { min: 500, max: 3_100, step: 100 },
} as const;
