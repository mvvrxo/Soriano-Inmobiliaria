import type { Metadata } from "next";
import { siteConfig } from "../../config/site";

export const metadata: Metadata = { title: "Política de privacidad" };

export default function PrivacyPage() { return <main className="legal-page site-shell">
  <p className="eyebrow">INFORMACIÓN LEGAL</p>
  <h1>Política de privacidad</h1>
  <p className="legal-updated">Última actualización: 5 de septiembre de 2026</p>
  <h2>1. Responsable del tratamiento</h2>
  <p>El responsable opera bajo el nombre comercial <strong>{siteConfig.name}</strong>, con domicilio de atención en {siteConfig.address}. Puedes contactar en <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.</p>
  <p className="legal-note"><strong>Dato pendiente:</strong> antes de considerar definitivo este texto deben incorporarse la razón social o nombre completo del titular y su NIF/CIF.</p>
  <h2>2. Datos, finalidad y base jurídica</h2>
  <p>Tratamos los datos que facilitas en los formularios —identificación, contacto y datos relativos al inmueble o a tu búsqueda— para responder a tu consulta, preparar una valoración y gestionar una posible relación inmobiliaria. La base jurídica es tu consentimiento al enviar el formulario y, cuando proceda, la aplicación de medidas precontractuales solicitadas por ti.</p>
  <h2>3. Conservación y destinatarios</h2>
  <p>Conservaremos los datos durante el tiempo necesario para atender la solicitud y, si nace una relación contractual, durante los plazos legales aplicables. No se venderán datos a terceros. Podrán acceder proveedores necesarios para prestar el servicio, como Supabase —gestión de datos— y Vercel —alojamiento web—, sujetos a sus obligaciones contractuales y de protección de datos.</p>
  <h2>4. Tus derechos</h2>
  <p>Puedes solicitar el acceso, rectificación, supresión, oposición, limitación o portabilidad de tus datos escribiendo a <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> e indicando el derecho que deseas ejercer. También puedes presentar una reclamación ante la <a href="https://www.aepd.es" target="_blank" rel="noreferrer">Agencia Española de Protección de Datos</a>.</p>
  <h2>5. Seguridad y cambios</h2>
  <p>Aplicamos medidas razonables para proteger la información. Esta política podrá actualizarse cuando cambien los servicios, proveedores o requisitos legales.</p>
</main>; }
