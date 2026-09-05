import { siteConfig } from "../config/site";
import Link from "./Link";

export function Footer() {
  return <footer className="site-footer"><div className="site-shell footer-grid">
    <div><Link className="logo" href="/"><img src="/logos/SORIANO_Grupo_Inmobiliario_logo_transparente.png" alt="Soriano Grupo Inmobiliario" /></Link></div>
    <div><p className="footer-title">Navegar</p><Link href="/">Inicio</Link><Link href="/inmuebles">Catálogo</Link><Link href="/vender">Vender</Link><Link href="/contacto">Contactar</Link></div>
    <div><p className="footer-title">Contacto</p>{siteConfig.phone && <a href={`tel:${siteConfig.phone.replaceAll(" ", "")}`}>{siteConfig.phone}</a>}<a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a><p>{siteConfig.address}</p><p>{siteConfig.schedule}</p></div>
  </div><div className="site-shell footer-bottom"><span>© {new Date().getFullYear()} Soriano Grupo Inmobiliario</span><span><Link href="/legal">Aviso legal</Link><Link href="/privacidad">Privacidad</Link><Link href="/cookies">Cookies</Link></span></div></footer>;
}
