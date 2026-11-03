import type { Metadata } from "next";
import Link from "../../components/Link";
import { LegalValue } from "../../components/LegalValue";
import { legalConfig } from "../../config/legal";
import { siteConfig } from "../../config/site";

export const metadata: Metadata = { title: "Política de privacidad", description: "Cómo trata Soriano Grupo Inmobiliario los datos personales recibidos a través de su web.", alternates: { canonical: "/privacidad" } };

export default function PrivacyPage() {
  const l = legalConfig;
  const privacyMail = <a href={`mailto:${l.privacyEmail}`}>{l.privacyEmail}</a>;
  return <main className="legal-page site-shell">
    <p className="eyebrow">INFORMACIÓN LEGAL</p>
    <h1>Política de privacidad</h1>
    <p className="legal-updated">Última actualización: {l.lastUpdated}</p>
    <p>Esta política explica cómo tratamos los datos personales que nos facilitas a través de este sitio web, conforme al Reglamento (UE) 2016/679 General de Protección de Datos (RGPD) y a la Ley Orgánica 3/2018 de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD).</p>

    <h2>1. Responsable del tratamiento</h2>
    <ul className="legal-list">
      <li><strong>Responsable:</strong> <LegalValue value={l.holderName} label="Razón social o nombre del titular" />, que opera con el nombre comercial {siteConfig.name}.</li>
      <li><strong>NIF/CIF:</strong> <LegalValue value={l.taxId} label="NIF/CIF" /></li>
      <li><strong>Domicilio:</strong> <LegalValue value={l.registeredAddress} label="Domicilio social completo" /></li>
      <li><strong>Correo para cuestiones de privacidad:</strong> {privacyMail}</li>
      {siteConfig.phone && <li><strong>Teléfono:</strong> {siteConfig.phone}</li>}
    </ul>

    <h2>2. Qué datos tratamos</h2>
    <p>Solo tratamos los datos que nos facilitas en los formularios de la web:</p>
    <ul className="legal-list">
      <li><strong>Formulario de contacto:</strong> nombre, apellidos, correo electrónico, teléfono, motivo de la consulta y mensaje.</li>
      <li><strong>Solicitud de información de una propiedad:</strong> los mismos datos y, además, el inmueble por el que preguntas y si quieres más información o concertar una visita.</li>
      <li><strong>Vender tu vivienda (valoración):</strong> nombre, apellidos, correo electrónico, teléfono y los datos de tu inmueble que decidas indicarnos: tipo, población o zona, dirección aproximada, superficie, habitaciones, baños, estado, plazo previsto de venta y mensaje.</li>
    </ul>
    <p>También registramos la fecha del envío y la página desde la que se hace. Por seguridad, nuestros proveedores técnicos procesan la dirección IP para prevenir abusos y envíos automatizados. Te pedimos que no incluyas en los mensajes datos especialmente protegidos (salud, ideología, etc.) ni datos de otras personas sin su permiso.</p>

    <h2>3. Para qué usamos tus datos y con qué base legal</h2>
    <ul className="legal-list">
      <li><strong>Responder a tu consulta</strong> y mantener contigo la comunicación necesaria. Base legal: tu consentimiento, que das al enviar el formulario (art. 6.1.a RGPD).</li>
      <li><strong>Darte información sobre un inmueble y organizar visitas</strong>, y <strong>valorar tu vivienda y proponerte nuestros servicios de venta</strong> cuando nos lo pides. Base legal: la aplicación de medidas precontractuales a petición tuya (art. 6.1.b RGPD).</li>
      <li><strong>Gestionar la relación</strong> si llegas a contratar nuestros servicios de intermediación. Base legal: la ejecución del contrato (art. 6.1.b RGPD).</li>
      <li><strong>Cumplir obligaciones legales</strong> que nos afectan como agencia inmobiliaria, como las de prevención del blanqueo de capitales o las fiscales, cuando se formalice una operación. Base legal: obligación legal (art. 6.1.c RGPD).</li>
      <li><strong>Proteger la web frente a abusos y envíos automatizados.</strong> Base legal: nuestro interés legítimo en mantener la seguridad del servicio (art. 6.1.f RGPD).</li>
    </ul>
    <p>No te enviaremos comunicaciones comerciales que no hayas solicitado ni tomaremos decisiones automatizadas ni elaboraremos perfiles con tus datos.</p>

    <h2>4. Cuánto tiempo conservamos los datos</h2>
    <p>Si tu consulta no da lugar a una relación comercial, conservaremos los datos el tiempo necesario para atenderla y, como máximo, 12 meses desde el último contacto, salvo que nos pidas antes su supresión. Si contratas nuestros servicios, los conservaremos mientras dure la relación y, después, durante los plazos en que puedan exigirse responsabilidades legales; en particular, la normativa de prevención del blanqueo de capitales obliga a conservar determinada documentación durante 10 años.</p>

    <h2>5. A quién comunicamos los datos</h2>
    <p>No vendemos ni cedemos tus datos. Solo los comunicaremos a terceros cuando una ley lo exija o cuando sea necesario para la operación que nos solicites y con tu conocimiento (por ejemplo, al propietario del inmueble para coordinar una visita, o a una notaría).</p>
    <p>Para prestar el servicio utilizamos proveedores que tratan los datos por cuenta nuestra, con contrato de encargo del tratamiento:</p>
    <ul className="legal-list">
      <li><strong>Vercel Inc.</strong> — alojamiento del sitio web.</li>
      <li><strong>Supabase Inc.</strong> — base de datos donde se guardan las solicitudes, con servidores en la Unión Europea (Irlanda).</li>
      <li><strong>Resend</strong> — envío del correo que nos avisa de cada solicitud.</li>
      <li><strong>Microsoft</strong> — correo electrónico corporativo (Microsoft 365), donde recibimos y respondemos las solicitudes.</li>
    </ul>
    <p>Algunos de estos proveedores tienen su sede en Estados Unidos, por lo que puede haber transferencias internacionales de datos. Se realizan con las garantías previstas en el RGPD, como el Marco de Privacidad de Datos UE-EE. UU. o las cláusulas contractuales tipo aprobadas por la Comisión Europea.</p>

    <h2>6. Tus derechos</h2>
    <p>Puedes ejercer en cualquier momento tus derechos de acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad, así como retirar el consentimiento que hayas dado, sin que ello afecte a la licitud del tratamiento anterior.</p>
    <p>Para ejercerlos, escríbenos a {privacyMail} indicando el derecho que quieres ejercer. Si tenemos dudas razonables sobre tu identidad, podremos pedirte que la acredites. Te responderemos en el plazo máximo de un mes.</p>
    <p>Si consideras que no hemos tratado tus datos correctamente, puedes presentar una reclamación ante la <a href="https://www.aepd.es" target="_blank" rel="noreferrer">Agencia Española de Protección de Datos</a> (www.aepd.es).</p>

    <h2>7. Menores de edad</h2>
    <p>Esta web no está dirigida a menores de 14 años. Si eres menor de esa edad, no nos envíes tus datos.</p>

    <h2>8. Seguridad</h2>
    <p>Aplicamos medidas técnicas y organizativas adecuadas para proteger tus datos: conexión cifrada (HTTPS), acceso restringido a las solicitudes solo para el personal autorizado y políticas de seguridad en la base de datos.</p>

    <h2>9. Cookies y cambios en esta política</h2>
    <p>El uso de cookies se explica en la <Link href="/cookies">política de cookies</Link>. Podemos actualizar esta política cuando cambien nuestros servicios, proveedores o la normativa; la fecha de la última actualización aparece al principio de esta página.</p>
  </main>;
}
