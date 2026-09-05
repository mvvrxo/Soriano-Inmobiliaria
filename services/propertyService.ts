import { createClient } from "../lib/supabase/server";
import { isSupabaseConfigured } from "../lib/supabase/config";
import { propertyFromRow, type Property } from "../types/property";

export const demoProperties: Property[] = [
  { id: "demo-cubelles", slug: "piso-luminoso-cubelles", title: "Piso luminoso cerca del mar", description: "Vivienda exterior con una distribución cómoda, terraza y todos los servicios a pocos minutos. Un hogar pensado para disfrutar de Cubelles durante todo el año.", propertyType: "Piso", operation: "venta", location: "Cubelles", province: "Barcelona", price: 298000, area: 96, bedrooms: 3, bathrooms: 2, features: ["Terraza", "Ascensor", "Calefacción"], images: ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85"], status: "published", featured: true, createdAt: "2026-09-01", updatedAt: "2026-09-01" },
  { id: "demo-vilanova", slug: "casa-con-jardin-vilanova", title: "Casa familiar con jardín", description: "Una casa amplia y serena, con jardín privado, espacios luminosos y una zona de día abierta al exterior.", propertyType: "Casa", operation: "venta", location: "Vilanova i la Geltrú", province: "Barcelona", price: 495000, area: 184, bedrooms: 4, bathrooms: 3, features: ["Jardín", "Parking", "Aire acondicionado"], images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85"], status: "published", featured: true, createdAt: "2026-09-01", updatedAt: "2026-09-01" },
  { id: "demo-sitges", slug: "atico-terraza-sitges", title: "Ático con gran terraza", description: "Luz, amplitud y una terraza para vivir el Mediterráneo. Disponible para alquiler de larga duración.", propertyType: "Piso", operation: "alquiler", location: "Sitges", province: "Barcelona", price: 2100, area: 112, bedrooms: 3, bathrooms: 2, features: ["Terraza", "Ascensor", "Vistas al mar"], images: ["https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1600&q=85"], status: "published", featured: false, createdAt: "2026-09-01", updatedAt: "2026-09-01" },
];

export async function getPublishedProperties(): Promise<Property[]> {
  if (!isSupabaseConfigured()) return demoProperties;
  const supabase = await createClient();
  const { data, error } = await supabase.from("properties").select("*").in("status", ["published", "reserved"]).order("featured", { ascending: false }).order("created_at", { ascending: false });
  if (error) { console.error(error); return []; }
  return (data || []).map((row) => propertyFromRow(row));
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  if (!isSupabaseConfigured()) return demoProperties.find((item) => item.slug === slug) || null;
  const supabase = await createClient();
  const { data, error } = await supabase.from("properties").select("*").eq("slug", slug).in("status", ["published", "reserved"]).maybeSingle();
  if (error) { console.error(error); return null; }
  return data ? propertyFromRow(data) : null;
}
