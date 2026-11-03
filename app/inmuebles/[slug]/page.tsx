import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContactForm } from "../../../components/ContactForm";
import { PropertyGallery } from "../../../components/PropertyGallery";
import { siteConfig } from "../../../config/site";
import { getPropertyBySlug } from "../../../services/propertyService";
import { formatPrice, propertyFacts } from "../../../types/property";

interface PropertyPageProps { params: Promise<{ slug: string }>; }

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) return { title: "Vivienda no encontrada", robots: { index: false } };
  const description = (property.description || `${property.propertyType} en ${property.location}. ${formatPrice(property)}.`).slice(0, 160);
  return {
    title: `${property.title} en ${property.location}`,
    description,
    alternates: { canonical: `/inmuebles/${property.slug}` },
    openGraph: { title: property.title, description, url: `/inmuebles/${property.slug}`, images: property.images[0] ? [property.images[0]] : undefined },
  };
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();
  const facts = propertyFacts(property);
  const phoneHref = siteConfig.phone ? `tel:${siteConfig.phone.replaceAll(" ", "")}` : "";

  return <main>
    <section className="detail-header site-shell">
      <p className="eyebrow">{property.operation === "venta" ? "EN VENTA" : "EN ALQUILER"} · {property.location.toUpperCase()}{property.status === "reserved" ? " · RESERVADA" : ""}</p>
      <div className="detail-title-row"><h1>{property.title}</h1><strong>{formatPrice(property)}</strong></div>
    </section>
    <PropertyGallery images={property.images} title={property.title} />
    <section className="detail-content site-shell">
      <article>
        <p className="detail-location">{property.propertyType} · {property.location}, {property.province}{property.reference && <> · Ref. {property.reference}</>}</p>
        {facts.length > 0 && <div className="detail-facts">{facts.map((fact) => <span key={fact.label}><strong>{fact.value}</strong> {fact.label}</span>)}</div>}
        {property.description && <><h2>Sobre esta vivienda</h2><p className="detail-description">{property.description}</p></>}
        {property.features.length > 0 && <><h2>Características</h2><ul className="detail-features">{property.features.map((feature) => <li key={feature}>{feature}</li>)}</ul></>}
        {property.energyRating && <><h2>Certificado energético</h2><p className="detail-energy">Calificación energética: <strong>{property.energyRating}</strong></p></>}
        <p className="detail-disclaimer">La información de este anuncio es orientativa y no tiene valor contractual. Confirma precio, superficies y características con nosotros antes de formalizar cualquier operación.</p>
      </article>
      <aside>
        <ContactForm type="property_info" propertyId={property.id} propertyTitle={property.title} title="Solicita información" />
        {phoneHref && <p className="detail-call">¿Prefieres llamar? <a href={phoneHref}>{siteConfig.phone}</a>{property.reference && <> e indica la referencia {property.reference}</>}.</p>}
      </aside>
    </section>
  </main>;
}
