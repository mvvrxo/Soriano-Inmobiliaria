import Link from "../components/Link";
import { SearchBar } from "../components/SearchBar";
import { editableCopy } from "../config/content";
import { getPublishedProperties } from "../services/propertyService";

export const revalidate = 0;

export default async function Home() {
  const properties = await getPublishedProperties();
  const locations = Array.from(new Set(properties.map((property) => property.location.trim()).filter(Boolean)))
    .sort((a, b) => a.localeCompare(b, "es"));
  return <main>
    <section className="home-hero-clean">
      <div className="site-shell hero-clean-grid">
        <h1 className="visually-hidden">{editableCopy.hero.title}</h1>
      </div>
      <div className="site-shell hero-search"><SearchBar locations={locations} /></div>
    </section>
    <section className="home-intro site-shell"><div><p className="eyebrow">QUÉ HACEMOS</p><h2>Compra y venta<br />de viviendas</h2></div><p>Trabajamos con una atención directa y una estrategia adaptada a cada vivienda y a cada búsqueda. Nuestro objetivo es que el proceso sea claro de principio a fin.</p></section>
    <section className="sell-home"><div className="site-shell sell-home-grid"><div><p className="eyebrow light">{editableCopy.sell.label}</p><h2>{editableCopy.sell.title}</h2><p>{editableCopy.sell.description}</p><Link className="button-cream" href="/vender">Información para propietarios <span>→</span></Link></div><div className="sell-home-note"><p>VENTA DE VIVIENDAS</p><span>Te acompañamos desde la valoración hasta la firma.</span></div></div></section>
    <section className="buy-home site-shell"><div><p className="eyebrow">{editableCopy.buy.label}</p><h2>{editableCopy.buy.title}</h2><p>{editableCopy.buy.description}</p><Link className="button-black" href="/inmuebles">Buscar vivienda <span>→</span></Link></div></section>
    <section className="home-contact"><div className="site-shell home-contact-grid"><div><p className="eyebrow">{editableCopy.contact.title}</p><h2>{editableCopy.contact.title}</h2></div><div><p>{editableCopy.contact.description}</p><Link href="/contacto">Contacta con nosotros <span>→</span></Link></div></div></section>
  </main>;
}
