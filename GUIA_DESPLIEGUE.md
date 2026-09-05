# Guía de Supabase, Vercel y dominio

Esta guía deja la web, la base de datos, las fotografías y el panel de administración funcionando. No hace falta contratar un hosting tradicional: Vercel aloja Next.js y Supabase proporciona base de datos, usuarios y almacenamiento.

## Coste real

- **Supabase Free** sirve para configurar y probar: actualmente incluye 500 MB de base de datos y 1 GB de archivos, pero los proyectos gratuitos pueden pausarse tras una semana sin actividad. Para una web de negocio que necesite continuidad y copias de seguridad, el plan Pro parte actualmente de 25 USD/mes.
- **Vercel Hobby** cuesta 0 USD, pero sus condiciones lo reservan a uso personal y no comercial. Para publicar esta inmobiliaria como web de empresa corresponde Vercel Pro, actualmente 20 USD/mes más impuestos.
- El dominio y Microsoft 365 se facturan aparte según el contrato que ya tenga la empresa.

Los precios y límites pueden cambiar: compruébalos en las páginas oficiales de [Supabase](https://supabase.com/pricing) y [Vercel](https://vercel.com/pricing) antes de contratar.

## 1. Crear el proyecto en Supabase

1. Entra en [supabase.com/dashboard](https://supabase.com/dashboard) y pulsa **New project**.
2. Elige una organización, escribe un nombre como `soriano-inmobiliaria` y genera una contraseña segura para la base de datos. Guárdala en un gestor de contraseñas.
3. Elige una región europea cercana y crea el proyecto.
4. Cuando esté listo, abre **SQL Editor** y pulsa **New query**.
5. Abre en Visual Studio Code el archivo `supabase/migrations/202609050001_initial_schema.sql`, copia todo su contenido, pégalo en el editor SQL y pulsa **Run** una sola vez.

Ese script crea:

- `properties`: viviendas.
- `leads`: formularios y solicitudes.
- `admin_users`: personas autorizadas.
- El contenedor `property-images` para fotografías.
- Las políticas RLS que permiten ver la oferta pública, enviar formularios y reservan la gestión a los administradores.
- Tres viviendas de ejemplo que después se pueden editar o eliminar.

## 2. Crear el acceso de Jonathan

1. En Supabase abre **Authentication → Users**.
2. Pulsa **Add user → Create new user**.
3. Usa el correo `jonathan@sorianogrupo.com`.
4. Define una contraseña segura y marca el correo como confirmado si la pantalla ofrece esa opción.

El script SQL ya incluye ese correo en `admin_users`. Tener una cuenta en Authentication no basta por sí solo: debe figurar también en esa tabla. Así, cualquier usuario adicional queda sin acceso administrativo hasta autorizarlo expresamente.

Para añadir otro administrador más adelante, primero créalo en Authentication y ejecuta en SQL Editor:

```sql
insert into public.admin_users (email)
values ('nuevo-correo@dominio.com')
on conflict (email) do nothing;
```

## 3. Conectar el proyecto local

1. En Supabase abre **Connect** o **Project Settings → API**.
2. Copia la **Project URL** y la **Publishable key**. Si tu proyecto todavía muestra claves antiguas, usa la clave pública `anon`, nunca `service_role`.
3. En la raíz del repositorio copia `.env.example` como `.env.local` y sustituye los valores:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxxxxx
```

4. Reinicia el servidor local con `npm run dev`.
5. Comprueba el catálogo en `/inmuebles`, los formularios en `/contacto` y el acceso privado en `/admin`.

No compartas la contraseña ni subas `.env.local` a Git. El archivo ya está ignorado.

## 4. Subir el código a GitHub

Si el repositorio aún no está en GitHub:

1. Crea un repositorio privado vacío en GitHub.
2. Desde la terminal abierta en esta carpeta, guarda y sube los cambios:

```bash
git add .
git commit -m "feat: conectar web con Supabase y Vercel"
git remote add origin URL_DEL_REPOSITORIO
git push -u origin main
```

Si ya existe `origin`, no vuelvas a añadirlo; usa únicamente `git push`.

## 5. Publicar en Vercel

1. Entra en [vercel.com/new](https://vercel.com/new) con la cuenta que vaya a administrar la web.
2. Importa el repositorio de GitHub.
3. Vercel detectará **Next.js**. No cambies el directorio raíz ni los comandos de construcción.
4. En **Environment Variables**, añade para Production, Preview y Development:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
5. Pulsa **Deploy**.
6. Abre la URL temporal `*.vercel.app` y comprueba Inicio, Comprar, Vender, Contacto y `/admin`.

Cada `git push` a `main` generará una nueva publicación.

## 6. Conectar el dominio administrado desde Microsoft 365

El dominio definitivo de la web es `sorianogrupo.com`, el mismo dominio que utiliza el correo de Jonathan.

1. En Vercel abre el proyecto y entra en **Settings → Domains**.
2. Añade `sorianogrupo.com` y deja activada la opción para incluir la variante `www`.
3. Configura `www.sorianogrupo.com` como principal y el dominio raíz como redirección permanente.
4. Vercel mostrará los registros DNS exactos que necesita. Déjalos abiertos.
5. En Microsoft 365 entra en **Configuración → Dominios → sorianogrupo.com → Registros de DNS → Agregar registro**.
6. Añade los valores exactos mostrados por Vercel. Habitualmente serán:

| Uso | Tipo | Nombre | Valor mostrado por Vercel |
|---|---|---|---|
| Dominio raíz | A | `@` | La dirección IP asignada al proyecto |
| Versión www | CNAME | `www` | El destino `*.vercel-dns-*.com` asignado al proyecto |

Los valores de la pantalla de Vercel mandan sobre esta tabla, porque Vercel puede asignar una configuración específica al proyecto.

7. Vuelve a Vercel y pulsa **Refresh/Verify**. La propagación puede tardar desde minutos hasta 48 horas. El certificado HTTPS se genera automáticamente tras verificar el dominio.

### Registros que no debes borrar

No modifiques los registros del correo de Microsoft 365:

- `MX` terminado en `mail.protection.outlook.com`.
- `TXT` con `v=spf1 include:spf.protection.outlook.com ...`.
- `CNAME` `autodiscover` hacia Outlook.

Si llegaste a añadir registros de una publicación anterior de OpenAI Sites —por ejemplo direcciones `162.159.143.30`, `172.66.3.26`, verificaciones `_openai-site-verification`/`_cf-custom-hostname` o un CNAME hacia `custom-domains.chatgpt.site`— elimínalos únicamente después de confirmar que pertenecen a esa publicación anterior. No afectan al repositorio local, pero pueden entrar en conflicto con Vercel.

## 7. Checklist final

- El logo original aparece en cabecera y pie.
- Todos los enlaces del menú abren una página real.
- El buscador conduce al catálogo y sus filtros funcionan.
- Una vivienda publicada aparece en el catálogo y tiene ficha propia.
- Una vivienda en borrador o vendida no aparece en la parte pública.
- Las fotografías se suben desde `/admin`.
- Una consulta de Contacto aparece en **Consultas** dentro de `/admin`.
- El correo de Microsoft 365 sigue funcionando.
- El dominio carga con HTTPS y redirige a una única versión canónica.

Documentación oficial: [Supabase con Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs), [seguridad de Storage](https://supabase.com/docs/guides/storage/security/access-control), [variables de entorno de Vercel](https://vercel.com/docs/environment-variables/framework-environment-variables) y [dominios personalizados de Vercel](https://vercel.com/docs/domains/set-up-custom-domain).
