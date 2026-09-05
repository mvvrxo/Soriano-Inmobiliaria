import type { Metadata } from "next";

export const metadata: Metadata = { title: "Política de cookies" };

export default function CookiesPage() { return <main className="legal-page site-shell">
  <p className="eyebrow">INFORMACIÓN LEGAL</p>
  <h1>Política de cookies</h1>
  <p className="legal-updated">Última actualización: 5 de septiembre de 2026</p>
  <h2>¿Qué utiliza esta web?</h2>
  <p>Actualmente esta web no utiliza cookies de publicidad, seguimiento ni analítica. Solo puede emplear tecnologías estrictamente necesarias para la seguridad, el funcionamiento de los formularios y el acceso al área de administración.</p>
  <h2>Preferencia del aviso</h2>
  <p>Al pulsar “Entendido”, el navegador guarda localmente la clave <code>soriano-cookie-notice-v1</code>. Su única finalidad es recordar que ya has visto el aviso. Permanece hasta que borres los datos del navegador y no se envía a Soriano Grupo Inmobiliario ni a terceros.</p>
  <h2>Servicios técnicos</h2>
  <p>La web está alojada en Vercel y utiliza Supabase para formularios, propiedades y autenticación del área privada. Estos proveedores pueden tratar información técnica necesaria para prestar y proteger sus servicios.</p>
  <h2>Cambios futuros</h2>
  <p>Si en el futuro se incorporan cookies opcionales —por ejemplo, analítica o publicidad—, se solicitará consentimiento antes de activarlas y se ofrecerán opciones equivalentes para aceptarlas o rechazarlas.</p>
</main>; }
