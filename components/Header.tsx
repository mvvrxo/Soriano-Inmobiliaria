"use client";

import { useState } from "react";
import Link from "./Link";

const links = [
  ["Inicio", "/"], ["Catálogo", "/inmuebles"], ["Vender", "/vender"],
];

export function Header() {
  const [open, setOpen] = useState(false);
  return <header className="site-header"><div className="site-shell header-inner">
    <Link className="logo" href="/" aria-label="Soriano Grupo Inmobiliario, inicio"><img src="/logos/SORIANO_Grupo_Inmobiliario_logo_transparente.png" alt="Soriano Grupo Inmobiliario" /></Link>
    <nav className={open ? "primary-nav is-open" : "primary-nav"} aria-label="Navegación principal">{links.map(([label, href]) => <Link key={label} href={href} onClick={() => setOpen(false)}>{label}</Link>)}</nav>
    <Link className="header-cta" href="/contacto">Contactar <span>↗</span></Link>
    <button className="menu-button" aria-label="Abrir menú" aria-expanded={open} onClick={() => setOpen(!open)}><span /><span /></button>
  </div></header>;
}
