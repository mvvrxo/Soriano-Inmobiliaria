import type { MetadataRoute } from "next";
import { getPublishedProperties } from "../services/propertyService";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://www.sorianogrupo.com";
  const properties = await getPublishedProperties();
  return [
    ...["", "/inmuebles", "/vender", "/contacto"].map((path) => ({ url: `${base}${path}`, lastModified: new Date() })),
    ...properties.map((property) => ({ url: `${base}/inmuebles/${property.slug}`, lastModified: new Date(property.updatedAt) })),
  ];
}
