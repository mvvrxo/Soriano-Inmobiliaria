import Link from "../components/Link";

export default function NotFound() {
  return <main className="not-found site-shell">
    <p className="eyebrow">ERROR 404</p>
    <h1>Página no encontrada</h1>
    <p>La página que buscas no existe o el inmueble ya no está disponible.</p>
    <p><Link className="button-black" href="/inmuebles">Ver el catálogo <span>→</span></Link></p>
  </main>;
}
