import type { MetadataRoute } from "next";
import { getPublishedProperties } from "../services/propertyService";
import { editableCopy } from "../config/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://www.sorianogrupo.com";
  const properties = await getPublishedProperties();
  return [
    ...["", "/inmuebles", "/vender", ...(editableCopy.about.description || editableCopy.about.sections.length ? ["/quienes-somos"] : []), "/contacto"].map((path) => ({ url: `${base}${path}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: path ? 0.8 : 1 })),
    ...["/legal", "/privacidad", "/cookies"].map((path) => ({ url: `${base}${path}`, changeFrequency: "yearly" as const, priority: 0.2 })),
    ...properties.map((property) => ({ url: `${base}/inmuebles/${property.slug}`, lastModified: property.updatedAt ? new Date(property.updatedAt) : undefined, changeFrequency: "weekly" as const, priority: 0.7 })),
  ];
}
