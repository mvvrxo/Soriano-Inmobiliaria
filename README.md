# Soriano Grupo Inmobiliario

Web inmobiliaria construida con Next.js, Supabase y preparada para Vercel. Conserva el diseño, los colores y el logotipo originales del proyecto.

## Funcionalidad

- Web pública responsive con Inicio, Comprar, Vender y Contacto.
- Catálogo con filtros, ordenación y ficha individual de cada vivienda.
- Formularios que envían cada solicitud por correo a info@sorianogrupo.com (Resend) y guardan una copia en la tabla `leads` de Supabase.
- Gestor de cookies con aceptar, rechazar y configurar.
- Panel privado en `/admin` para crear, editar, publicar, reservar y eliminar viviendas.
- Subida de fotografías a Supabase Storage.
- Gestión del estado de las consultas recibidas.
- Seguridad mediante Supabase Auth y políticas RLS.

## Desarrollo local

Requiere Node.js 22.13 o posterior.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abre `http://localhost:3000`. Sin `.env.local`, el catálogo aparece vacío (no hay viviendas de demostración). El panel requiere Supabase y los formularios requieren Resend.

## Variables de entorno

Consulta `.env.example`:

- `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: públicas; el acceso real se protege con RLS. No añadas una `service_role` a este proyecto web.
- `RESEND_API_KEY`, `CONTACT_EMAIL_FROM` y `CONTACT_EMAIL_TO`: solo de servidor, para el envío de los formularios. Nunca les pongas el prefijo `NEXT_PUBLIC_`.

## Preparar la base de datos y publicar

Sigue [GUIA_DESPLIEGUE.md](./GUIA_DESPLIEGUE.md). El esquema está en `supabase/migrations/` (aplica los archivos en orden).

## Comprobaciones

```bash
npm run lint
npx tsc --noEmit
npm run build
npm test
```

## Datos que deben revisarse antes de publicar

- Teléfono, WhatsApp, correo, dirección y redes: `config/site.ts`.
- Datos fiscales del titular (razón social, NIF, domicilio, registro AICAT): `config/legal.ts`. Mientras falten, las páginas legales los muestran marcados como pendientes.
- Dominio canónico usado por sitemap/robots: `www.sorianogrupo.com`.
