import { siteConfig } from "../config/site";
import Link from "./Link";

export function Footer() {
  return <footer className="site-footer"><div className="site-shell footer-grid">
    <div><Link className="logo" href="/"><img src="/logos/SORIANO_Grupo_Inmobiliario_logo_transparente.png" alt="Soriano Grupo Inmobiliario" /></Link></div>
    <div><p className="footer-title">Navegar</p><Link href="/">Inicio</Link><Link href="/inmuebles">Catálogo</Link><Link href="/vender">Vender</Link><Link href="/contacto">Contactar</Link></div>
    <div><p className="footer-title">Contacto</p>{siteConfig.phone && <a href={`tel:${siteConfig.phone.replaceAll(" ", "")}`}>{siteConfig.phone}</a>}<a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a><p>{siteConfig.address}</p><p>{siteConfig.schedule}</p></div>
    <div><p className="footer-title">Síguenos</p><a className="social-link" href={siteConfig.social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram de Soriano Grupo Inmobiliario"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.7" /><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" /><circle cx="17.4" cy="6.7" r="1" fill="currentColor" /></svg><span>Instagram</span></a></div>
  </div><div className="site-shell footer-bottom"><span>© {new Date().getFullYear()} Soriano Grupo Inmobiliario</span><span><Link href="/legal">Aviso legal</Link><Link href="/privacidad">Privacidad</Link><Link href="/cookies">Cookies</Link></span></div></footer>;
}
