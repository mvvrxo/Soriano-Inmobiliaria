"use client";

import { useMemo, useState } from "react";
import { PropertyCard } from "./PropertyCard";
import type { Property } from "../types/property";

interface PropertyExplorerProps {
  initialProperties: Property[];
  initialLocation?: string;
  initialType?: string;
  initialMaxPrice?: string;
}

const availableFeatures = ["Terraza", "Ascensor", "Jardín", "Parking", "Vistas al mar", "Aire acondicionado"];

export function PropertyExplorer({ initialProperties, initialLocation = "", initialType = "", initialMaxPrice = "" }: PropertyExplorerProps) {
  const [location, setLocation] = useState(initialLocation);
  const [propertyType, setPropertyType] = useState(initialType);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [minArea, setMinArea] = useState("");
  const [features, setFeatures] = useState<string[]>([]);
  const [sort, setSort] = useState("newest");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const properties = useMemo(() => {
    const result = initialProperties.filter((property) => {
      const normalizedLocation = location.trim().toLocaleLowerCase("es");
      return (!normalizedLocation || property.location.toLocaleLowerCase("es").includes(normalizedLocation))
        && (!propertyType || property.propertyType.toLocaleLowerCase("es") === propertyType.toLocaleLowerCase("es"))
        && (!maxPrice || property.price <= Number(maxPrice))
        && (!bedrooms || property.bedrooms >= Number(bedrooms))
        && (!bathrooms || property.bathrooms >= Number(bathrooms))
        && (!minArea || property.area >= Number(minArea))
        && features.every((feature) => property.features.includes(feature));
    });

    return [...result].sort((first, second) => {
      if (sort === "price-asc") return first.price - second.price;
      if (sort === "price-desc") return second.price - first.price;
      return new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime();
    });
  }, [initialProperties, location, propertyType, maxPrice, bedrooms, bathrooms, minArea, features, sort]);

  const resetFilters = () => {
    setLocation("");
    setPropertyType("");
    setMaxPrice("");
    setBedrooms("");
    setBathrooms("");
    setMinArea("");
    setFeatures([]);
  };

  const toggleFeature = (feature: string) => setFeatures((current) => current.includes(feature) ? current.filter((item) => item !== feature) : [...current, feature]);

  return <section className="explorer site-shell">
    <div className="explorer-toolbar">
      <p><strong>{properties.length}</strong> {properties.length === 1 ? "vivienda encontrada" : "viviendas encontradas"}</p>
      <button className="filter-mobile" type="button" onClick={() => setFiltersOpen(true)}>Filtros</button>
      <label className="sort-select">Ordenar por
        <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Ordenar viviendas">
          <option value="newest">Más recientes</option>
          <option value="price-asc">Precio: menor a mayor</option>
          <option value="price-desc">Precio: mayor a menor</option>
        </select>
      </label>
    </div>
    <div className="explorer-layout">
      <aside className={filtersOpen ? "filters is-open" : "filters"} aria-label="Filtros de búsqueda">
        <div className="filters-heading"><strong>Filtrar</strong><button type="button" onClick={resetFilters}>Limpiar</button></div>
        <label>POBLACIÓN<input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Cubelles, Sitges…" /></label>
        <label>TIPO DE INMUEBLE<select value={propertyType} onChange={(event) => setPropertyType(event.target.value)}><option value="">Todos</option><option>Piso</option><option>Casa</option><option>Chalet</option><option>Ático</option><option>Terreno</option></select></label>
        <label>PRECIO MÁXIMO<input value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} type="number" min="0" placeholder="Sin límite" /></label>
        <div className="two-fields">
          <label>HABITACIONES<select value={bedrooms} onChange={(event) => setBedrooms(event.target.value)}><option value="">Todas</option><option value="1">1+</option><option value="2">2+</option><option value="3">3+</option><option value="4">4+</option></select></label>
          <label>BAÑOS<select value={bathrooms} onChange={(event) => setBathrooms(event.target.value)}><option value="">Todos</option><option value="1">1+</option><option value="2">2+</option><option value="3">3+</option></select></label>
        </div>
        <label>SUPERFICIE MÍNIMA<input value={minArea} onChange={(event) => setMinArea(event.target.value)} type="number" min="0" placeholder="m²" /></label>
        <fieldset><legend>CARACTERÍSTICAS</legend><div className="feature-options">{availableFeatures.map((feature) => <label className="feature-choice" key={feature}><input checked={features.includes(feature)} onChange={() => toggleFeature(feature)} type="checkbox" /><span className="feature-control" />{feature}</label>)}</div></fieldset>
        <button className="filter-close" type="button" onClick={() => setFiltersOpen(false)}>Ver {properties.length} resultados</button>
      </aside>
      <div>
        {properties.length ? <div className="property-grid">{properties.map((property) => <PropertyCard key={property.id} property={property} />)}</div> : <div className="empty-state"><span>⌂</span><h2>No hay coincidencias</h2><p>Prueba a ampliar la zona o a quitar algún filtro. También puedes contarnos qué vivienda buscas y te ayudaremos personalmente.</p><button className="button-black" type="button" onClick={resetFilters}>Limpiar filtros <span>→</span></button></div>}
      </div>
    </div>
  </section>;
}
