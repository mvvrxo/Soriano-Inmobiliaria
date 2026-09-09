"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "./Link";

const links = [
  ["Inicio", "/"], ["Catálogo", "/inmuebles"], ["Vender", "/vender"], ["Contactar", "/contacto"],
];

export function Header() {
  const [open, setOpen] = useState(false);
  const isHome = usePathname() === "/";
  return <header className={isHome ? "site-header home-site-header" : "site-header"}><div className="site-shell header-inner">
    <Link className="logo" href="/" aria-label="Soriano Grupo Inmobiliario, inicio"><img src="/logos/SORIANO_Grupo_Inmobiliario_logo_transparente.png" alt="Soriano Grupo Inmobiliario" /></Link>
    <nav id="primary-navigation" className={open ? "primary-nav is-open" : "primary-nav"} aria-label="Navegación principal">{links.map(([label, href]) => <Link className={href === "/contacto" ? "nav-contact-link" : undefined} key={label} href={href} onClick={() => setOpen(false)}>{label}</Link>)}</nav>
    <Link className="header-cta" href="/contacto">Contactar <svg aria-hidden="true" viewBox="0 0 16 16" fill="none"><path d="M3 13 13 3M6 3h7v7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" /></svg></Link>
    <button className="menu-button" aria-label={open ? "Cerrar menú" : "Abrir menú"} aria-controls="primary-navigation" aria-expanded={open} onClick={() => setOpen(!open)}><span /><span /><span /></button>
  </div></header>;
}
