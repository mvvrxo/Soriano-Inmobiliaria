"use client";

import { useMemo, useState } from "react";
import { PropertyCard } from "./PropertyCard";
import type { Property, PropertyOperation } from "../types/property";
import { budgetRanges, propertyTypes } from "../config/property";

interface PropertyExplorerProps {
  initialProperties: Property[];
  initialLocation?: string;
  initialType?: string;
  initialMaxPrice?: string;
  initialOperation?: string;
}

const priceFormatter = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

export function PropertyExplorer({ initialProperties, initialLocation = "", initialType = "", initialMaxPrice = "", initialOperation = "venta" }: PropertyExplorerProps) {
  const startingOperation: PropertyOperation = initialOperation === "alquiler" ? "alquiler" : "venta";
  const startingRange = budgetRanges[startingOperation];
  const parsedInitialPrice = Number(initialMaxPrice);
  const [operation, setOperation] = useState<PropertyOperation>(startingOperation);
  const [location, setLocation] = useState(initialLocation);
  const [propertyType, setPropertyType] = useState(initialType);
  const [maxPrice, setMaxPrice] = useState(Number.isFinite(parsedInitialPrice) && parsedInitialPrice > 0 ? Math.min(Math.max(parsedInitialPrice, startingRange.min), startingRange.max) : startingRange.max);
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [minArea, setMinArea] = useState("");
  const [sort, setSort] = useState("newest");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const range = budgetRanges[operation];
  const budgetLabel = maxPrice === range.max ? "Sin límite" : operation === "alquiler" ? `${priceFormatter.format(maxPrice)}/mes` : priceFormatter.format(maxPrice);

  const properties = useMemo(() => {
    const result = initialProperties.filter((property) => {
      const normalizedLocation = location.trim().toLocaleLowerCase("es");
      return property.operation === operation
        && (!normalizedLocation || property.location.toLocaleLowerCase("es").includes(normalizedLocation))
        && (!propertyType || property.propertyType.toLocaleLowerCase("es") === propertyType.toLocaleLowerCase("es"))
        && (maxPrice === range.max || property.price <= maxPrice)
        && (!bedrooms || property.bedrooms >= Number(bedrooms))
        && (!bathrooms || property.bathrooms >= Number(bathrooms))
        && (!minArea || property.area >= Number(minArea));
    });

    return [...result].sort((first, second) => {
      if (sort === "price-asc") return first.price - second.price;
      if (sort === "price-desc") return second.price - first.price;
      return new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime();
    });
  }, [initialProperties, operation, location, propertyType, maxPrice, bedrooms, bathrooms, minArea, range.max, sort]);

  const resetFilters = () => {
    setOperation("venta");
    setLocation("");
    setPropertyType("");
    setMaxPrice(budgetRanges.venta.max);
    setBedrooms("");
    setBathrooms("");
    setMinArea("");
  };

  const changeOperation = (nextOperation: PropertyOperation) => { setOperation(nextOperation); setMaxPrice(budgetRanges[nextOperation].max); };

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
        <label>COMPRA O ALQUILER<select value={operation} onChange={(event) => changeOperation(event.target.value as PropertyOperation)}><option value="venta">Compra</option><option value="alquiler">Alquiler</option></select></label>
        <label>POBLACIÓN<input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Cubelles, Sitges…" /></label>
        <label>TIPO DE INMUEBLE<select value={propertyType} onChange={(event) => setPropertyType(event.target.value)}><option value="">Todos</option>{propertyTypes.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label>PRECIO MÁXIMO<span className="filter-budget"><output htmlFor="catalogMaxPrice">{budgetLabel}</output><input id="catalogMaxPrice" value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} type="range" min={range.min} max={range.max} step={range.step} /></span></label>
        <div className="two-fields">
          <label>HABITACIONES<select value={bedrooms} onChange={(event) => setBedrooms(event.target.value)}><option value="">Todas</option><option value="1">1+</option><option value="2">2+</option><option value="3">3+</option><option value="4">4+</option></select></label>
          <label>BAÑOS<select value={bathrooms} onChange={(event) => setBathrooms(event.target.value)}><option value="">Todos</option><option value="1">1+</option><option value="2">2+</option><option value="3">3+</option></select></label>
        </div>
        <label>SUPERFICIE MÍNIMA<input value={minArea} onChange={(event) => setMinArea(event.target.value)} type="number" min="0" placeholder="m²" /></label>
        <button className="filter-close" type="button" onClick={() => setFiltersOpen(false)}>Ver {properties.length} resultados</button>
      </aside>
      <div>
        {properties.length ? <div className="property-grid">{properties.map((property) => <PropertyCard key={property.id} property={property} />)}</div> : <div className="empty-state"><span>⌂</span><h2>No hay coincidencias</h2><p>Prueba a ampliar la zona o a quitar algún filtro. También puedes contarnos qué vivienda buscas y te ayudaremos personalmente.</p><button className="button-black" type="button" onClick={resetFilters}>Limpiar filtros <span>→</span></button></div>}
      </div>
    </div>
  </section>;
}
