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
  assert.match(header, /\["Inicio", "\/"\], \["Catálogo", "\/inmuebles"\], \["Vender", "\/vender"\]/);
  assert.doesNotMatch(header, /Alquilar|Servicios|Nosotros/);
  assert.match(content, /Inmobiliaria en Cubelles/);
  assert.doesNotMatch(explorer, /feature-choice|CARACTERÍSTICAS/);
  assert.match(sitemap, /"\/contacto"/);
  assert.doesNotMatch(sitemap, /servicios|nosotros/);
  assert.match(detail, /getPropertyBySlug/);
  assert.match(logo, /SORIANO_Grupo_Inmobiliario_logo_transparente\.png/);
});

test("offers data-driven locations, a budget slider and the requested valuation fields", async () => {
  const [home, search, contact, explorer, admin, propertyConfig] = await Promise.all([read("app/page.tsx"), read("components/SearchBar.tsx"), read("components/ContactForm.tsx"), read("components/PropertyExplorer.tsx"), read("app/admin/AdminDashboard.tsx"), read("config/property.ts")]);
  assert.match(home, /getPublishedProperties/);
  assert.match(home, /property\.location/);
  assert.match(search, /type="range"/);
  assert.match(search, /new URLSearchParams\(\{ operation \}\)/);
  assert.match(search, /Compra/);
  assert.match(search, /Alquiler/);
  assert.match(search, /Todas las poblaciones/);
  assert.match(propertyConfig, /\["Casa", "Piso", "Local", "Terreno", "Otros"\]/);
  assert.match(propertyConfig, /alquiler: \{ min: 500, max: 3_100, step: 100 \}/);
  assert.match(search, /propertyTypes\.map/);
  assert.match(await read("app/overrides.css"), /Phone search: one predictable column/);
  assert.match(await read("app/overrides.css"), /\.search-bar\{grid-template-columns:minmax\(0,1fr\);width:100%/);
  assert.match(contact, /propertyTypes\.map/);
  assert.match(explorer, /propertyTypes\.map/);
  assert.match(explorer, /property\.operation === operation/);
  assert.match(explorer, /COMPRA O ALQUILER/);
  assert.match(admin, /propertyTypes\.map/);
  assert.match(contact, /Municipio o zona de Catalunya/);
  assert.match(contact, /Explícanos tu situación/);
});

test("integrates the home navigation into the cover", async () => {
  const [home, header, footer, layout] = await Promise.all([read("app/page.tsx"), read("components/Header.tsx"), read("components/Footer.tsx"), read("app/layout.tsx")]);
  assert.match(home, /className="visually-hidden"/);
  assert.doesNotMatch(home, /buy-home-side|CUÉNTANOS QUÉ BUSCAS|La búsqueda está preparada/);
  assert.match(header, /pathname === "\/"/);
  assert.match(header, /home-site-header/);
  assert.match(header, /inner-site-header/);
  assert.match(header, /aria-current=/);
  assert.match(header, /\["Contactar", "\/contacto"\]/);
  assert.match(header, /<span \/><span \/><span \/>/);
  assert.match(header, /menu-button is-open/);
  assert.match(header, /<svg aria-hidden="true"/);
  assert.doesNotMatch(footer, /siteConfig\.schedule/);
  assert.match(layout, /SORIANO_Grupo_Inmobiliario_logo_transparente\.png/);
  assert.doesNotMatch(layout, /Inmobiliaria en Cubelles para propietarios y compradores/);
  assert.match(await read("app/overrides.css"), /\.inner-site-header\{background:var\(--cream\);border-bottom:1px solid var\(--black\)\}/);
  assert.match(await read("app/overrides.css"), /\.inner-site-header \.menu-button\{display:none\}/);
  assert.match(await read("app/overrides.css"), /\.inner-site-header \.primary-nav \.nav-contact-link\{[^}]*background:var\(--black\)/);
  assert.match(layout, /Montserrat/);
  assert.match(layout, /montserrat\.variable/);
  assert.match(await read("app/overrides.css"), /font-family:var\(--font-montserrat\)/);
});

test("publishes privacy and cookie information", async () => {
  const [layout, notice, privacy, cookies] = await Promise.all([read("app/layout.tsx"), read("components/CookieNotice.tsx"), read("app/privacidad/page.tsx"), read("app/cookies/page.tsx")]);
  assert.match(layout, /CookieNotice/);
  assert.match(notice, /No usamos cookies publicitarias ni de analítica/);
  assert.match(privacy, /Supabase/);
  assert.match(cookies, /cookies de publicidad, seguimiento ni analítica/);
});

test("publishes consistent contact and social details", async () => {
  const [site, footer, contactPage, styles] = await Promise.all([read("config/site.ts"), read("components/Footer.tsx"), read("app/contacto/page.tsx"), read("app/overrides.css")]);
  assert.match(site, /\+34 605 153 518/);
  assert.match(site, /instagram\.com\/sorianogrupoi\//);
  assert.match(footer, /Síguenos/);
  assert.match(footer, /aria-label="Instagram de Soriano Grupo Inmobiliario"/);
  assert.match(contactPage, /siteConfig\.phone/);
  assert.match(styles, /@media\(max-width:1024px\)/);
  assert.match(styles, /@media\(max-width:420px\)/);
});

test("provides protected property management", async () => {
  const [dashboard, adminPage, migration] = await Promise.all([read("app/admin/AdminDashboard.tsx"), read("app/admin/page.tsx"), read("supabase/migrations/202609050001_initial_schema.sql")]);
  assert.match(dashboard, /Guardar vivienda/);
  assert.match(dashboard, /property-images/);
  assert.match(dashboard, /\.delete\(\)\.eq\("id"/);
  assert.match(adminPage, /auth\.getClaims/);
  assert.match(migration, /jonathan@sorianogrupo\.com/);
});
