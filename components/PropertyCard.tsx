import Link from "./Link";
import { formatPrice, type Property } from "../types/property";

export function PropertyCard({ property }: { property: Property }) {
  return <article className="property-card">
    <Link className="property-image" href={`/inmuebles/${property.slug}`}>
      {property.images[0] ? <img src={property.images[0]} alt={property.title} loading="lazy" /> : <div className="property-fallback">Soriano</div>}
      <span className="property-label">{property.operation === "venta" ? "En venta" : "En alquiler"}</span>
      {property.status === "reserved" && <span className="property-reserved">Reservada</span>}
    </Link>
    <div className="property-content">
      <span className="property-place">{property.propertyType} · {property.location}</span>
      <h3><Link href={`/inmuebles/${property.slug}`}>{property.title}</Link></h3>
      <div className="property-facts"><span>{property.bedrooms} hab.</span><span>{property.bathrooms} baños</span><span>{property.area} m²</span></div>
      <div className="property-card-footer"><strong>{formatPrice(property)}</strong><Link href={`/inmuebles/${property.slug}`} aria-label={`Ver ${property.title}`}>→</Link></div>
    </div>
  </article>;
}
