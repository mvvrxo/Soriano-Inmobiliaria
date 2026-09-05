export type PropertyStatus = "draft" | "published" | "reserved" | "sold";
export type PropertyOperation = "venta" | "alquiler";

export interface Property {
  id: string;
  slug: string;
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
    status: row.status as PropertyStatus,
    featured: Boolean(row.featured),
    createdAt: String(row.created_at || ""),
    updatedAt: String(row.updated_at || ""),
  };
}

export function propertyToRow(property: PropertyInput) {
  return {
    slug: property.slug,
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
