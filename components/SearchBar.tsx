"use client";
import { useState } from "react";
import { budgetRanges, propertyTypes } from "../config/property";
import type { PropertyOperation } from "../types/property";

const priceFormatter = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

export function SearchBar({ compact = false, locations = [] }: { compact?: boolean; locations?: string[] }) {
  const [operation, setOperation] = useState<PropertyOperation>("venta");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [maxPrice, setMaxPrice] = useState<number>(budgetRanges.venta.max);
  const range = budgetRanges[operation];
  const budgetLabel = maxPrice === range.max ? "Sin límite" : operation === "alquiler" ? `${priceFormatter.format(maxPrice)}/mes` : priceFormatter.format(maxPrice);
  const changeOperation = (nextOperation: PropertyOperation) => { setOperation(nextOperation); setMaxPrice(budgetRanges[nextOperation].max); };
  const search = (event: React.FormEvent) => { event.preventDefault(); const params = new URLSearchParams({ operation }); if (location) params.set("location", location); if (type) params.set("propertyType", type); if (maxPrice < range.max) params.set("maxPrice", String(maxPrice)); window.location.href = `/inmuebles?${params}`; };
  return <form className={compact ? "search-bar compact" : "search-bar"} onSubmit={search}>
    <label><span>Operación</span><select value={operation} onChange={(event) => changeOperation(event.target.value as PropertyOperation)}><option value="venta">Compra</option><option value="alquiler">Alquiler</option></select></label>
    <label><span>Población</span><select value={location} onChange={(event) => setLocation(event.target.value)}><option value="">Todas las poblaciones</option>{locations.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
    <label><span>Tipo de inmueble</span><select value={type} onChange={(event) => setType(event.target.value)}><option value="">Todos los tipos</option>{propertyTypes.map((item) => <option key={item}>{item}</option>)}</select></label>
    <label><span>Presupuesto máximo</span><span className="budget-range-wrap"><output htmlFor="maxPrice" className="budget-value">{budgetLabel}</output><input id="maxPrice" type="range" min={range.min} max={range.max} step={range.step} value={maxPrice} aria-label={`Presupuesto máximo para ${operation === "venta" ? "compra" : "alquiler"}`} onChange={(event) => setMaxPrice(Number(event.target.value))} /></span></label>
    <button className="search-submit" type="submit">Ver resultados <span>→</span></button>
  </form>;
}
