import type { Metadata } from "next";
import { ContactForm } from "../../components/ContactForm";
import { editableCopy } from "../../config/content";
import { siteConfig } from "../../config/site";
export const metadata: Metadata = { title: "Contacto", description: "Contacto de Soriano Grupo Inmobiliario en Cubelles." };
export default function ContactPage() { return <main><section className="contact-page-hero"><div className="site-shell"><p className="eyebrow">{editableCopy.contact.title}</p><h1>{editableCopy.contact.title}</h1><p>{editableCopy.contact.description}</p></div></section><section className="contact-page-grid site-shell"><div className="contact-data"><p className="eyebrow">DATOS DE CONTACTO</p>{siteConfig.phone && <a href={`tel:${siteConfig.phone.replaceAll(" ", "")}`}>{siteConfig.phone}</a>}<a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a><p>{siteConfig.address}</p><p>{siteConfig.schedule}</p></div><ContactForm /></section></main>; }
