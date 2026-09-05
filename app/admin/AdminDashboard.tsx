"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";
import { formatPrice, propertyFromRow, propertyToRow, slugify, type Property, type PropertyInput, type PropertyStatus } from "../../types/property";

export interface AdminLead { id: string; name: string; lastName: string; email: string; phone: string; message: string; type: string; status: "new" | "contacted" | "closed"; createdAt: string; }

const blankProperty: PropertyInput = { slug: "", title: "", description: "", propertyType: "Piso", operation: "venta", location: "Cubelles", province: "Barcelona", price: 0, area: 0, bedrooms: 0, bathrooms: 0, features: [], images: [], status: "draft", featured: false };
const inputFromProperty = (property: Property): PropertyInput => ({ slug: property.slug, title: property.title, description: property.description, propertyType: property.propertyType, operation: property.operation, location: property.location, province: property.province, price: property.price, area: property.area, bedrooms: property.bedrooms, bathrooms: property.bathrooms, features: property.features, images: property.images, status: property.status, featured: property.featured });

export function AdminDashboard({ email, initialProperties, initialLeads }: { email: string; initialProperties: Property[]; initialLeads: AdminLead[] }) {
  const router = useRouter();
  const [properties, setProperties] = useState(initialProperties);
  const [leads, setLeads] = useState(initialLeads);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<PropertyInput>(blankProperty);
  const [featuresText, setFeaturesText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [tab, setTab] = useState<"properties" | "leads">("properties");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const newLeads = useMemo(() => leads.filter((lead) => lead.status === "new").length, [leads]);

  const update = <K extends keyof PropertyInput>(key: K, value: PropertyInput[K]) => setForm((current) => ({ ...current, [key]: value }));
  const startNew = () => { setEditingId(null); setForm(blankProperty); setFeaturesText(""); setImageUrl(""); setError(""); setNotice(""); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const startEdit = (property: Property) => { setEditingId(property.id); setForm(inputFromProperty(property)); setFeaturesText(property.features.join(", ")); setImageUrl(""); setError(""); setNotice(""); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const addImageUrl = () => { const value = imageUrl.trim(); if (value && !form.images.includes(value)) update("images", [...form.images, value]); setImageUrl(""); };

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setBusy(true); setError("");
    try {
      const supabase = createClient();
      const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${crypto.randomUUID()}.${extension}`;
      const { error: uploadError } = await supabase.storage.from("property-images").upload(path, file, { cacheControl: "3600", upsert: false });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from("property-images").getPublicUrl(path);
      update("images", [...form.images, data.publicUrl]);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "No se ha podido subir la imagen."); }
    finally { setBusy(false); event.target.value = ""; }
  };

  const saveProperty = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setBusy(true); setError(""); setNotice("");
    try {
      const supabase = createClient();
      const cleanForm: PropertyInput = { ...form, slug: slugify(form.slug || form.title), features: featuresText.split(",").map((item) => item.trim()).filter(Boolean) };
      if (!cleanForm.slug) throw new Error("Escribe un título para generar la dirección de la ficha.");
      const query = editingId ? supabase.from("properties").update(propertyToRow(cleanForm)).eq("id", editingId) : supabase.from("properties").insert(propertyToRow(cleanForm));
      const { data, error: saveError } = await query.select("*").single();
      if (saveError) throw saveError;
      const saved = propertyFromRow(data);
      setProperties((current) => editingId ? current.map((item) => item.id === editingId ? saved : item) : [saved, ...current]);
      setEditingId(saved.id); setForm(inputFromProperty(saved)); setFeaturesText(saved.features.join(", ")); setNotice("Vivienda guardada correctamente."); router.refresh();
    } catch (caught) { setError(caught instanceof Error ? caught.message : "No se ha podido guardar la vivienda."); }
    finally { setBusy(false); }
  };

  const deleteProperty = async (property: Property) => {
    if (!window.confirm(`¿Eliminar definitivamente “${property.title}”?`)) return;
    setBusy(true); setError("");
    try {
      const supabase = createClient();
      const { error: deleteError } = await supabase.from("properties").delete().eq("id", property.id);
      if (deleteError) throw deleteError;
      const storagePrefix = "/storage/v1/object/public/property-images/";
      const paths = property.images.map((url) => url.includes(storagePrefix) ? url.split(storagePrefix)[1] : "").filter(Boolean);
      if (paths.length) await supabase.storage.from("property-images").remove(paths);
      setProperties((current) => current.filter((item) => item.id !== property.id));
      if (editingId === property.id) startNew();
    } catch (caught) { setError(caught instanceof Error ? caught.message : "No se ha podido eliminar la vivienda."); }
    finally { setBusy(false); }
  };

  const changeLeadStatus = async (id: string, status: AdminLead["status"]) => {
    const supabase = createClient();
    const { error: leadError } = await supabase.from("leads").update({ status }).eq("id", id);
    if (leadError) { setError(leadError.message); return; }
    setLeads((current) => current.map((lead) => lead.id === id ? { ...lead, status } : lead));
  };

  const logout = async () => { await createClient().auth.signOut(); router.replace("/admin/login"); router.refresh(); };

  return <main className="admin-page">
    <header className="admin-top"><div><p className="eyebrow">SORIANO · GESTIÓN</p><h1>Panel inmobiliario</h1><span>{email}</span></div><button type="button" onClick={logout}>Cerrar sesión</button></header>
    <nav className="admin-tabs"><button className={tab === "properties" ? "active" : ""} onClick={() => setTab("properties")}>Viviendas <span>{properties.length}</span></button><button className={tab === "leads" ? "active" : ""} onClick={() => setTab("leads")}>Consultas <span>{newLeads}</span></button></nav>
    {error && <p className="admin-global-error">{error}</p>}
    {tab === "properties" ? <div className="admin-property-layout">
      <section className="admin-editor"><div className="admin-section-title"><div><p className="eyebrow">{editingId ? "EDITAR" : "NUEVA"}</p><h2>{editingId ? "Editar vivienda" : "Añadir vivienda"}</h2></div>{editingId && <button type="button" onClick={startNew}>+ Nueva</button>}</div>
        <form onSubmit={saveProperty} className="admin-form">
          <label className="admin-full">Título*<input value={form.title} onChange={(event) => update("title", event.target.value)} required /></label>
          <label className="admin-full">Dirección web<input value={form.slug} onChange={(event) => update("slug", event.target.value)} placeholder="Se genera desde el título" /></label>
          <label>Operación<select value={form.operation} onChange={(event) => update("operation", event.target.value as PropertyInput["operation"])}><option value="venta">Venta</option><option value="alquiler">Alquiler</option></select></label>
          <label>Tipo<select value={form.propertyType} onChange={(event) => update("propertyType", event.target.value)}><option>Piso</option><option>Casa</option><option>Chalet</option><option>Ático</option><option>Terreno</option><option>Local</option></select></label>
          <label>Población*<input value={form.location} onChange={(event) => update("location", event.target.value)} required /></label><label>Provincia<input value={form.province} onChange={(event) => update("province", event.target.value)} /></label>
          <label>Precio (€)*<input type="number" min="0" value={form.price} onChange={(event) => update("price", Number(event.target.value))} required /></label><label>Superficie (m²)<input type="number" min="0" value={form.area} onChange={(event) => update("area", Number(event.target.value))} /></label>
          <label>Habitaciones<input type="number" min="0" value={form.bedrooms} onChange={(event) => update("bedrooms", Number(event.target.value))} /></label><label>Baños<input type="number" min="0" value={form.bathrooms} onChange={(event) => update("bathrooms", Number(event.target.value))} /></label>
          <label className="admin-full">Descripción<textarea rows={6} value={form.description} onChange={(event) => update("description", event.target.value)} /></label>
          <label className="admin-full">Características separadas por comas<input value={featuresText} onChange={(event) => setFeaturesText(event.target.value)} placeholder="Terraza, Ascensor, Parking" /></label>
          <div className="admin-full admin-images"><span>Fotografías</span><div className="admin-image-add"><input aria-label="URL de fotografía" value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} placeholder="Pegar URL de una imagen" /><button type="button" onClick={addImageUrl}>Añadir URL</button><label className="admin-upload">{busy ? "Subiendo…" : "Subir archivo"}<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={uploadImage} disabled={busy} /></label></div><div className="admin-image-list">{form.images.map((image, index) => <figure key={`${image}-${index}`}><img src={image} alt="" /><button type="button" aria-label="Quitar fotografía" onClick={() => update("images", form.images.filter((_, itemIndex) => itemIndex !== index))}>×</button></figure>)}</div></div>
          <label>Estado<select value={form.status} onChange={(event) => update("status", event.target.value as PropertyStatus)}><option value="draft">Borrador</option><option value="published">Publicada</option><option value="reserved">Reservada</option><option value="sold">Vendida</option></select></label><label className="admin-check"><input type="checkbox" checked={form.featured} onChange={(event) => update("featured", event.target.checked)} /> Vivienda destacada</label>
          {notice && <p className="admin-success admin-full">{notice}</p>}<button className="admin-save admin-full" disabled={busy}>{busy ? "Guardando…" : "Guardar vivienda"}</button>
        </form>
      </section>
      <section className="admin-list"><div className="admin-section-title"><div><p className="eyebrow">CATÁLOGO</p><h2>Viviendas</h2></div><button type="button" onClick={startNew}>+ Nueva</button></div>{properties.length ? properties.map((property) => <article className="admin-property-row" key={property.id}>{property.images[0] ? <img src={property.images[0]} alt="" /> : <div className="admin-thumb-empty">S</div>}<div><span>{property.location} · {property.status}</span><strong>{property.title}</strong><p>{formatPrice(property)}</p></div><div><button type="button" onClick={() => startEdit(property)}>Editar</button><button className="danger" type="button" onClick={() => deleteProperty(property)} disabled={busy}>Eliminar</button></div></article>) : <p>Aún no hay viviendas.</p>}</section>
    </div> : <section className="admin-leads"><div className="admin-section-title"><div><p className="eyebrow">CONTACTOS</p><h2>Consultas recibidas</h2></div></div>{leads.length ? leads.map((lead) => <article key={lead.id}><div><span>{new Date(lead.createdAt).toLocaleDateString("es-ES")} · {lead.type}</span><h3>{lead.name} {lead.lastName}</h3><a href={`mailto:${lead.email}`}>{lead.email}</a>{lead.phone && <a href={`tel:${lead.phone}`}>{lead.phone}</a>}<p>{lead.message || "Sin mensaje"}</p></div><select aria-label={`Estado de la consulta de ${lead.name}`} value={lead.status} onChange={(event) => changeLeadStatus(lead.id, event.target.value as AdminLead["status"])}><option value="new">Nueva</option><option value="contacted">Contactada</option><option value="closed">Cerrada</option></select></article>) : <p>Todavía no se ha recibido ninguna consulta.</p>}</section>}
  </main>;
}
