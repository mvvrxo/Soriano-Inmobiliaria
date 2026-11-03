export type PropertyStatus = "draft" | "published" | "reserved" | "sold";
export type PropertyOperation = "venta" | "alquiler";

export interface Property {
  id: string;
  slug: string;
  /** Internal agency reference shown on the listing, e.g. "SOR-001". */
  reference: string;
  title: string;
  description: string;
  propertyType: string;
  operation: PropertyOperation;
  location: string;
  province: string;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  features: string[];
  images: string[];
  /** Energy rating letter (A–G), "En trámite" or "Exento". Required in Spanish property adverts. */
  energyRating: string;
  status: PropertyStatus;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export type PropertyInput = Omit<Property, "id" | "createdAt" | "updatedAt">;

export function propertyFromRow(row: Record<string, unknown>): Property {
  return {
    id: String(row.id),
    slug: String(row.slug),
    reference: String(row.reference || ""),
    title: String(row.title),
    description: String(row.description || ""),
    propertyType: String(row.property_type || "Vivienda"),
    operation: row.operation as PropertyOperation,
    location: String(row.location),
    province: String(row.province || "Barcelona"),
    price: Number(row.price || 0),
    area: Number(row.area || 0),
    bedrooms: Number(row.bedrooms || 0),
    bathrooms: Number(row.bathrooms || 0),
    features: Array.isArray(row.features) ? row.features.map(String) : [],
    images: Array.isArray(row.images) ? row.images.map(String) : [],
    energyRating: String(row.energy_rating || ""),
    status: row.status as PropertyStatus,
    featured: Boolean(row.featured),
    createdAt: String(row.created_at || ""),
    updatedAt: String(row.updated_at || ""),
  };
}

export function propertyToRow(property: PropertyInput) {
  return {
    slug: property.slug,
    reference: property.reference,
    title: property.title,
    description: property.description,
    property_type: property.propertyType,
    operation: property.operation,
    location: property.location,
    province: property.province,
    price: property.price,
    area: property.area,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    features: property.features,
    images: property.images,
    energy_rating: property.energyRating,
    status: property.status,
    featured: property.featured,
  };
}

export function formatPrice(property: Pick<Property, "price" | "operation">) {
  const formatted = new Intl.NumberFormat("es-ES").format(property.price);
  return property.operation === "alquiler" ? `${formatted} €/mes` : `${formatted} €`;
}

export function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
}

/** Facts worth showing for a listing. Zero values are hidden (e.g. a plot of land has no bedrooms). */
export function propertyFacts(property: Pick<Property, "bedrooms" | "bathrooms" | "area">, short = false) {
  const facts: { value: number; label: string }[] = [];
  if (property.bedrooms > 0) facts.push({ value: property.bedrooms, label: short ? "hab." : property.bedrooms === 1 ? "habitación" : "habitaciones" });
  if (property.bathrooms > 0) facts.push({ value: property.bathrooms, label: property.bathrooms === 1 ? "baño" : "baños" });
  if (property.area > 0) facts.push({ value: property.area, label: "m²" });
  return facts;
}
