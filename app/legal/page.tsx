import type { Metadata } from "next";
import Link from "../../components/Link";
import { LegalValue } from "../../components/LegalValue";
import { legalConfig } from "../../config/legal";
import { siteConfig } from "../../config/site";

export const metadata: Metadata = { title: "Aviso legal", description: "Aviso legal y condiciones de uso del sitio web de Soriano Grupo Inmobiliario.", alternates: { canonical: "/legal" } };

export default function LegalPage() {
  const l = legalConfig;
  return <main className="legal-page site-shell">
    <p className="eyebrow">INFORMACIÓN LEGAL</p>
    <h1>Aviso legal</h1>
    <p className="legal-updated">Última actualización: {l.lastUpdated}</p>

    <h2>1. Identificación del titular</h2>
    <p>En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa de los datos del titular de este sitio web:</p>
    <ul className="legal-list">
      <li><strong>Titular:</strong> <LegalValue value={l.holderName} label="Razón social o nombre del titular" /></li>
      <li><strong>Nombre comercial:</strong> {siteConfig.name}</li>
      <li><strong>NIF/CIF:</strong> <LegalValue value={l.taxId} label="NIF/CIF" /></li>
      <li><strong>Domicilio:</strong> <LegalValue value={l.registeredAddress} label="Domicilio social completo" /></li>
      <li><strong>Oficina de atención al público:</strong> {siteConfig.address}</li>
      <li><strong>Correo electrónico:</strong> <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></li>
      {siteConfig.phone && <li><strong>Teléfono:</strong> <a href={`tel:${siteConfig.phone.replaceAll(" ", "")}`}>{siteConfig.phone}</a></li>}
      {l.holderKind !== "autonomo" && <li><strong>Datos registrales:</strong> <LegalValue value={l.mercantileRegistry} label="Datos del Registro Mercantil (si es una sociedad)" /></li>}
      <li><strong>Registro de Agentes Inmobiliarios de Cataluña (AICAT):</strong> <LegalValue value={l.aicatNumber} label="Número de inscripción AICAT" /></li>
    </ul>

    <h2>2. Objeto del sitio web</h2>
    <p>Este sitio web ofrece información sobre los servicios de intermediación inmobiliaria de {siteConfig.name} —compraventa y alquiler de inmuebles y valoración de viviendas— y permite a los usuarios consultar los inmuebles disponibles y contactar con la empresa.</p>

    <h2>3. Condiciones de uso</h2>
    <p>El acceso a este sitio web es gratuito y atribuye la condición de usuario, lo que implica la aceptación de este aviso legal. El usuario se compromete a utilizar el sitio de forma lícita, de buena fe y conforme a estas condiciones, y a no realizar acciones que puedan dañar, inutilizar o sobrecargar el sitio o impedir su uso normal por otros usuarios.</p>
    <p>Los datos que el usuario facilite a través de los formularios deben ser veraces. El usuario es responsable de la información que envíe y no debe introducir datos de terceros sin su consentimiento.</p>

    <h2>4. Información sobre los inmuebles</h2>
    <p>La información de los inmuebles publicados —precio, superficie, distribución, características, certificación energética e imágenes— se ofrece con carácter informativo, puede cambiar sin previo aviso y no constituye una oferta contractual. Las superficies y demás datos deben confirmarse con {siteConfig.name} antes de formalizar cualquier operación. La documentación que la normativa de protección de los consumidores exige en la compraventa y el arrendamiento de viviendas está a disposición de los interesados en nuestra oficina.</p>

    <h2>5. Propiedad intelectual e industrial</h2>
    <p>Los contenidos de este sitio web —textos, fotografías, diseño, logotipos, marcas y código— pertenecen a {siteConfig.name} o a terceros que han autorizado su uso, y están protegidos por la normativa de propiedad intelectual e industrial. Queda prohibida su reproducción, distribución, comunicación pública o transformación, total o parcial, sin autorización expresa del titular, salvo en los casos permitidos por la ley.</p>

    <h2>6. Enlaces a otros sitios</h2>
    <p>Este sitio puede incluir enlaces a sitios de terceros, como nuestras redes sociales. {siteConfig.name} no controla esos sitios y no se responsabiliza de sus contenidos ni de sus políticas de privacidad.</p>

    <h2>7. Responsabilidad</h2>
    <p>{siteConfig.name} trabaja para que la información del sitio sea correcta y esté actualizada, pero no garantiza la ausencia de errores ni la disponibilidad continua del sitio. No se responsabiliza de los daños que pudieran derivarse de interrupciones del servicio, de errores u omisiones en los contenidos o de la presencia de virus u otros elementos dañinos ajenos a su control, ni del uso que los usuarios hagan del sitio contrario a estas condiciones.</p>

    <h2>8. Protección de datos y cookies</h2>
    <p>El tratamiento de los datos personales se explica en la <Link href="/privacidad">política de privacidad</Link>, y el uso de cookies en la <Link href="/cookies">política de cookies</Link>.</p>

    <h2>9. Legislación aplicable y jurisdicción</h2>
    <p>Este aviso legal se rige por la legislación española. Para cualquier controversia relacionada con el sitio web, las partes se someten a los juzgados y tribunales que correspondan conforme a la ley. Cuando el usuario tenga la condición de consumidor, serán competentes los juzgados y tribunales de su domicilio.</p>
  </main>;
}
