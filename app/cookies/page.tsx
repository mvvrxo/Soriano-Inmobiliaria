import type { Metadata } from "next";
import Link from "../../components/Link";
import { CookieSettingsButton } from "../../components/CookieSettingsButton";
import { legalConfig } from "../../config/legal";
import { siteConfig } from "../../config/site";

export const metadata: Metadata = { title: "Política de cookies", description: "Qué cookies y tecnologías de almacenamiento utiliza la web de Soriano Grupo Inmobiliario.", alternates: { canonical: "/cookies" } };

const cookies = [
  { name: "soriano-cookie-consent-v2", provider: "Esta web (almacenamiento local del navegador)", purpose: "Recordar si has aceptado, rechazado o configurado las cookies.", duration: "12 meses", type: "Técnica" },
  { name: "sb-…-auth-token", provider: "Esta web (Supabase)", purpose: "Mantener abierta la sesión del personal autorizado en el área privada /admin. No se instala a los visitantes de la web pública.", duration: "Hasta cerrar sesión (máx. 400 días)", type: "Técnica" },
];

export default function CookiesPage() { return <main className="legal-page site-shell">
  <p className="eyebrow">INFORMACIÓN LEGAL</p>
  <h1>Política de cookies</h1>
  <p className="legal-updated">Última actualización: {legalConfig.lastUpdated}</p>

  <h2>1. Qué son las cookies</h2>
  <p>Las cookies y tecnologías similares (como el almacenamiento local del navegador) son pequeños archivos o datos que un sitio web guarda en tu dispositivo para que funcione o para obtener información sobre su uso.</p>

  <h2>2. Qué utiliza esta web</h2>
  <p>Actualmente esta web <strong>no utiliza cookies de publicidad, seguimiento ni analítica</strong>, ni contenidos de terceros que las instalen (mapas, vídeos o botones de redes sociales integrados). Las tipografías y las imágenes se sirven desde nuestros propios servidores. Solo empleamos las tecnologías técnicas imprescindibles que se indican a continuación, que no necesitan tu consentimiento:</p>
  <div className="legal-table-wrap"><table className="legal-table">
    <thead><tr><th>Nombre</th><th>Titular</th><th>Finalidad</th><th>Duración</th><th>Tipo</th></tr></thead>
    <tbody>{cookies.map((item) => <tr key={item.name}><td><code>{item.name}</code></td><td>{item.provider}</td><td>{item.purpose}</td><td>{item.duration}</td><td>{item.type}</td></tr>)}</tbody>
  </table></div>
  <p>El enlace a nuestro perfil de Instagram es un enlace normal: Instagram solo podrá instalar sus propias cookies si decides visitar su sitio.</p>

  <h2>3. Cookies opcionales</h2>
  <p>Si en el futuro incorporamos herramientas de analítica u otras cookies no necesarias, se lo indicaremos en esta política y <strong>solo se activarán después de que las aceptes</strong>. Si las rechazas, únicamente se usarán las técnicas necesarias.</p>

  <h2>4. Cómo gestionar o cambiar tu elección</h2>
  <p>La primera vez que visitas la web te mostramos un aviso para aceptar, rechazar o configurar las cookies opcionales. Puedes cambiar tu elección en cualquier momento desde el enlace «Configurar cookies» del pie de página o con este botón:</p>
  <p><CookieSettingsButton /></p>
  <p>También puedes borrar o bloquear las cookies desde la configuración de tu navegador: <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noreferrer">Chrome</a>, <a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noreferrer">Safari</a>, <a href="https://support.mozilla.org/es/kb/Borrar%20cookies" target="_blank" rel="noreferrer">Firefox</a> y <a href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noreferrer">Edge</a>. Si bloqueas las cookies técnicas, el área privada no funcionará.</p>

  <h2>5. Más información</h2>
  <p>Para cualquier duda sobre esta política, escríbenos a <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>. El tratamiento de datos personales se explica en la <Link href="/privacidad">política de privacidad</Link>.</p>
</main>; }
