"use client";
import { useState } from "react";
import { propertyTypes } from "../config/property";

const MAX_BUDGET = 2_000_000;
const priceFormatter = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

export function SearchBar({ compact = false, locations = [] }: { compact?: boolean; locations?: string[] }) {
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [maxPrice, setMaxPrice] = useState(MAX_BUDGET);
  const search = (event: React.FormEvent) => { event.preventDefault(); const params = new URLSearchParams(); if (location) params.set("location", location); if (type) params.set("propertyType", type); if (maxPrice < MAX_BUDGET) params.set("maxPrice", String(maxPrice)); window.location.href = `/inmuebles?${params}`; };
  return <form className={compact ? "search-bar compact" : "search-bar"} onSubmit={search}>
    <label><span>Población</span><select value={location} onChange={(event) => setLocation(event.target.value)}><option value="">Todas las poblaciones</option>{locations.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
    <label><span>Tipo de inmueble</span><select value={type} onChange={(event) => setType(event.target.value)}><option value="">Todos los tipos</option>{propertyTypes.map((item) => <option key={item}>{item}</option>)}</select></label>
    <label><span>Presupuesto máximo</span><span className="budget-range-wrap"><output htmlFor="maxPrice" className="budget-value">{maxPrice === MAX_BUDGET ? "Sin límite" : priceFormatter.format(maxPrice)}</output><input id="maxPrice" type="range" min="100000" max={MAX_BUDGET} step="25000" value={maxPrice} aria-label="Presupuesto máximo" onChange={(event) => setMaxPrice(Number(event.target.value))} /></span></label>
    <button className="search-submit" type="submit">Ver resultados <span>→</span></button>
  </form>;
}
