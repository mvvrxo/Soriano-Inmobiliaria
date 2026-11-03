import type { Metadata } from "next";
import { PropertyExplorer } from "../../components/PropertyExplorer";
import { editableCopy } from "../../config/content";
import { getPublishedProperties } from "../../services/propertyService";

export const metadata: Metadata = { title: "Catálogo", description: "Viviendas en venta y alquiler en Cubelles y la Costa del Garraf. Consulta el catálogo de Soriano Grupo Inmobiliario.", alternates: { canonical: "/inmuebles" } };
export default async function PropertiesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const [query, properties] = await Promise.all([searchParams, getPublishedProperties()]);
  const get = (key: string) => typeof query[key] === "string" ? query[key] : "";
  return <main><section className="page-hero site-shell page-hero-buy"><p className="eyebrow">{editableCopy.buy.label}</p><h1>{editableCopy.buy.title}</h1><p>{editableCopy.buy.description}</p></section><PropertyExplorer initialProperties={properties} initialLocation={get("location")} initialType={get("propertyType")} initialMaxPrice={get("maxPrice")} initialOperation={get("operation")} /></main>;
}
