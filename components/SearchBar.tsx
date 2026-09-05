"use client";
import { useState } from "react";

export function SearchBar({ compact = false }: { compact?: boolean }) {
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const search = (event: React.FormEvent) => { event.preventDefault(); const params = new URLSearchParams(); if (location) params.set("location", location); if (type) params.set("propertyType", type); if (maxPrice) params.set("maxPrice", maxPrice); window.location.href = `/inmuebles?${params}`; };
  return <form className={compact ? "search-bar compact" : "search-bar"} onSubmit={search}>
    <label><span>Zona</span><input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Cubelles, Vilanova..." /></label>
    <label><span>Tipo de inmueble</span><select value={type} onChange={(event) => setType(event.target.value)}><option value="">Todos los tipos</option><option>Piso</option><option>Casa</option><option>Chalet</option><option>Ático</option><option>Apartamento</option></select></label>
    <label><span>Presupuesto máximo</span><select value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)}><option value="">Sin límite</option><option value="250000">250.000 €</option><option value="400000">400.000 €</option><option value="700000">700.000 €</option></select></label>
    <button className="search-submit" type="submit">Ver resultados <span>→</span></button>
  </form>;
}
