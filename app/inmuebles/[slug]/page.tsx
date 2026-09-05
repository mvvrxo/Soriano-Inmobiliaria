import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContactForm } from "../../../components/ContactForm";
import { getPropertyBySlug } from "../../../services/propertyService";
import { formatPrice } from "../../../types/property";

interface PropertyPageProps { params: Promise<{ slug: string }>; }

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) return { title: "Vivienda no encontrada" };
  return { title: property.title, description: property.description, openGraph: property.images[0] ? { images: [property.images[0]] } : undefined };
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();

  return <main>
    <section className="detail-header site-shell">
      <p className="eyebrow">{property.operation === "venta" ? "EN VENTA" : "EN ALQUILER"} · {property.location.toUpperCase()}</p>
      <div className="detail-title-row"><h1>{property.title}</h1><strong>{formatPrice(property)}</strong></div>
    </section>
    <section className="detail-gallery site-shell">
      {property.images.length ? property.images.slice(0, 3).map((image, index) => <img key={image} src={image} alt={`${property.title}${index ? `, imagen ${index + 1}` : ""}`} />) : <div className="detail-fallback">Soriano Grupo Inmobiliario</div>}
    </section>
    <section className="detail-content site-shell">
      <article>
        <p className="detail-location">{property.propertyType} · {property.location}, {property.province}</p>
        <div className="detail-facts"><span><strong>{property.bedrooms}</strong> habitaciones</span><span><strong>{property.bathrooms}</strong> baños</span><span><strong>{property.area}</strong> m²</span></div>
        <h2>Sobre esta vivienda</h2><p className="detail-description">{property.description}</p>
        {property.features.length > 0 && <><h2>Características</h2><ul className="detail-features">{property.features.map((feature) => <li key={feature}>{feature}</li>)}</ul></>}
      </article>
      <aside><ContactForm type="property_info" propertyId={property.id} title="Solicita información" /></aside>
    </section>
  </main>;
}
