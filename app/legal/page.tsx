import type { Metadata } from "next";
import { siteConfig } from "../../config/site";

export const metadata: Metadata = { title: "Aviso legal" };

export default function LegalPage() { return <main className="legal-page site-shell">
  <p className="eyebrow">INFORMACIÓN LEGAL</p>
  <h1>Aviso legal</h1>
  <h2>Titular del sitio</h2>
  <p>Este sitio web corresponde a {siteConfig.name}. Dirección de atención: {siteConfig.address}. Contacto: <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.</p>
  <p className="legal-note"><strong>Información pendiente:</strong> razón social o nombre completo del titular, NIF/CIF y, si corresponde, datos registrales y número de colegiación profesional.</p>
  <h2>Condiciones de uso</h2>
  <p>La información inmobiliaria se ofrece con carácter informativo y puede cambiar. Las fotografías, superficies, precios y demás datos deberán confirmarse antes de formalizar cualquier operación. El uso del sitio debe realizarse de buena fe y conforme a la legislación aplicable.</p>
  <h2>Propiedad intelectual</h2>
  <p>Los textos, identidad visual, fotografías y demás contenidos pertenecen a sus titulares. No se permite su reproducción o explotación sin autorización, salvo en los casos previstos legalmente.</p>
</main>; }
