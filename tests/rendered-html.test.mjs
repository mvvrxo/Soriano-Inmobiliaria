import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("persists contact intake in Supabase", async () => {
  const [leadService, migration] = await Promise.all([read("services/contactService.ts"), read("supabase/migrations/202609050001_initial_schema.sql")]);
  assert.match(leadService, /from\("leads"\)\.insert/);
  assert.match(migration, /enable row level security/);
  assert.match(migration, /Visitors can send enquiries/);
});

test("keeps the public IA focused on home, buying, selling and contact", async () => {
  const [header, content, explorer, sitemap, detail, logo] = await Promise.all([read("components/Header.tsx"), read("config/content.ts"), read("components/PropertyExplorer.tsx"), read("app/sitemap.ts"), read("app/inmuebles/[slug]/page.tsx"), read("components/Footer.tsx")]);
  assert.match(header, /\["Inicio", "\/"\], \["Comprar", "\/inmuebles"\], \["Vender", "\/vender"\]/);
  assert.doesNotMatch(header, /Alquilar|Servicios|Nosotros/);
  assert.match(content, /Inmobiliaria en Cubelles/);
  assert.match(explorer, /feature-choice/);
  assert.match(sitemap, /"\/contacto"/);
  assert.doesNotMatch(sitemap, /servicios|nosotros/);
  assert.match(detail, /getPropertyBySlug/);
  assert.match(logo, /SORIANO_Grupo_Inmobiliario_logo_transparente\.png/);
});

test("provides protected property management", async () => {
  const [dashboard, adminPage, migration] = await Promise.all([read("app/admin/AdminDashboard.tsx"), read("app/admin/page.tsx"), read("supabase/migrations/202609050001_initial_schema.sql")]);
  assert.match(dashboard, /Guardar vivienda/);
  assert.match(dashboard, /property-images/);
  assert.match(dashboard, /\.delete\(\)\.eq\("id"/);
  assert.match(adminPage, /auth\.getClaims/);
  assert.match(migration, /jonathan@sorianogrupo\.com/);
});
