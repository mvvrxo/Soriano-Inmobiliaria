# Soriano Grupo Inmobiliario

Web inmobiliaria construida con Next.js, Supabase y preparada para Vercel. Conserva el diseño, los colores y el logotipo originales del proyecto.

## Funcionalidad

- Web pública responsive con Inicio, Comprar, Vender y Contacto.
- Catálogo con filtros, ordenación y ficha individual de cada vivienda.
- Formularios conectados a la tabla `leads` de Supabase.
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

Abre `http://localhost:3000`. Sin `.env.local`, la parte pública muestra tres viviendas de demostración. El panel y los formularios requieren Supabase.

## Variables de entorno

```env
NEXT_PUBLIC_SUPABASE_URL=https://TU-PROYECTO.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=TU_CLAVE_PUBLICABLE
```

La clave publicable es apta para el navegador porque el acceso real se protege en la base de datos con RLS. No añadas una `service_role` a este proyecto web.

## Preparar la base de datos y publicar

Sigue [GUIA_DESPLIEGUE.md](./GUIA_DESPLIEGUE.md). El esquema completo está en `supabase/migrations/202609050001_initial_schema.sql`.

## Comprobaciones

```bash
npm run lint
npx tsc --noEmit
npm run build
npm test
```

## Datos que deben revisarse antes de publicar

- Teléfono, WhatsApp, correo, dirección y redes: `config/site.ts`.
- Identidad fiscal y textos definitivos: `app/legal`, `app/privacidad` y `app/cookies`.
- Dominio canónico usado por sitemap/robots: `www.sorianogrupo.com`.
