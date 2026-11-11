import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("sends every form through the server, stores it and emails it", async () => {
  const [leadService, route, email, resend, form, migration] = await Promise.all([read("services/contactService.ts"), read("app/api/contact/route.ts"), read("lib/leads/email.ts"), read("lib/email/resend.ts"), read("components/ContactForm.tsx"), read("supabase/migrations/202609050001_initial_schema.sql")]);
  assert.match(leadService, /fetch\("\/api\/contact"/);
  assert.doesNotMatch(leadService, /createClient/);
  assert.match(route, /from\("leads"\)\.insert/);
  assert.doesNotMatch(route, /\.insert\([\s\S]*?\)\s*\.select/);
  assert.match(route, /sendEmail\(/);
  assert.match(resend, /info@sorianogrupo\.com/);
  assert.match(resend, /process\.env\.RESEND_API_KEY/);
  assert.match(email, /reply_?[tT]o|replyTo/);
  assert.match(email, /escapeHtml/);
  assert.match(form, /name="website"/);
  assert.match(form, /submissionId/);
  assert.match(form, /disabled=\{status === "sending"\}/);
  assert.match(form, /href="\/privacidad"/);
  assert.match(migration, /enable row level security/);
  assert.match(migration, /Visitors can send enquiries/);
});

test("validates forms and rejects bots on the server", async () => {
  const validate = await read("lib/leads/validate.ts");
  assert.match(validate, /EMAIL_PATTERN/);
  assert.match(validate, /MIN_FILL_TIME_MS/);
  assert.match(validate, /body\.privacy !== true/);
  assert.match(validate, /type === "valuation" && !phone/);
});

test("ships no demo listings or stock photos", async () => {
  const [service, styles, cleanup] = await Promise.all([read("services/propertyService.ts"), read("app/overrides.css"), read("supabase/migrations/202611030002_property_details_and_cleanup.sql")]);
  assert.doesNotMatch(service, /demoProperties|unsplash/);
  assert.doesNotMatch(styles, /images\.unsplash\.com/);
  assert.match(cleanup, /delete from public\.properties/);
  assert.match(cleanup, /energy_rating/);
});

test("offers a cookie choice with equal accept and reject options", async () => {
  const [notice, footer, consent] = await Promise.all([read("components/CookieNotice.tsx"), read("components/Footer.tsx"), read("lib/cookieConsent.ts")]);
  assert.match(notice, /Rechazar/);
  assert.match(notice, /Aceptar todas/);
  assert.match(notice, /Configurar/);
  assert.match(footer, /CookieSettingsButton/);
  assert.match(consent, /analytics: boolean/);
});

test("legal pages never invent company data", async () => {
  const [legal, privacy, config] = await Promise.all([read("app/legal/page.tsx"), read("app/privacidad/page.tsx"), read("config/legal.ts")]);
  assert.match(legal, /LSSI-CE/);
  assert.match(legal, /AICAT/);
  assert.match(privacy, /RGPD/);
  assert.match(privacy, /LOPDGDD/);
  assert.match(config, /holderName: ""|holderName: "[^"]+"/);
  assert.match(legal, /LegalValue/);
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
  assert.match(header, /\["Vender", "\/vender"\], \["Quiénes somos", "\/quienes-somos"\], \["Contacto", "\/contacto"\]/);
  assert.doesNotMatch(home, /home-intro|QUÉ HACEMOS/);
  assert.match(header, /<span \/><span \/><span \/>/);
  assert.match(header, /menu-button is-open/);
  assert.match(header, /<svg aria-hidden="true"/);
  assert.doesNotMatch(footer, /siteConfig\.schedule/);
  assert.match(layout, /SORIANO_Grupo_Inmobiliario_logo_transparente\.png/);
  assert.doesNotMatch(layout, /Inmobiliaria en Cubelles para propietarios y compradores/);
  assert.match(await read("app/overrides.css"), /\.inner-site-header\{background:var\(--cream\);border-bottom:1px solid var\(--black\)\}/);
  assert.match(await read("app/overrides.css"), /\.inner-site-header \.menu-button\{display:none\}/);
  assert.match(await read("app/overrides.css"), /Every phone header uses the same hamburger disclosure/);
  assert.match(await read("app/overrides.css"), /\.inner-site-header \.menu-button\{display:block;color:var\(--ink\)/);
  assert.match(await read("app/overrides.css"), /High-contrast phone navigation on every page/);
  assert.match(await read("app/overrides.css"), /\.home-site-header \.primary-nav,.inner-site-header \.primary-nav\{background:var\(--paper\);color:var\(--ink\)/);
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
