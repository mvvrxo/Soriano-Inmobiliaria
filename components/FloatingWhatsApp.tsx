import { siteConfig } from "../config/site";
export function FloatingWhatsApp() { if (!siteConfig.whatsappPhone) return null; return <a className="whatsapp" href={`https://wa.me/${siteConfig.whatsappPhone}?text=Hola%20Soriano%2C%20me%20gustar%C3%ADa%20recibir%20informaci%C3%B3n.`} target="_blank" rel="noreferrer" aria-label="Contactar por WhatsApp">◔<span>WhatsApp</span></a>; }
