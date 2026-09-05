create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  email text primary key,
  created_at timestamptz not null default now()
);

insert into public.admin_users (email)
values ('jonathan@sorianogrupo.com')
on conflict (email) do nothing;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;

create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null default '',
  property_type text not null default 'Vivienda',
  operation text not null default 'venta' check (operation in ('venta', 'alquiler')),
  location text not null,
  province text not null default 'Barcelona',
  price integer not null default 0 check (price >= 0),
  area integer not null default 0 check (area >= 0),
  bedrooms integer not null default 0 check (bedrooms >= 0),
  bathrooms integer not null default 0 check (bathrooms >= 0),
  features text[] not null default '{}',
  images text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'published', 'reserved', 'sold')),
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists properties_public_idx on public.properties (status, featured desc, created_at desc);
create index if not exists properties_search_idx on public.properties (operation, property_type, location, price);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  name text not null,
  last_name text not null default '',
  email text not null,
  phone text not null default '',
  message text not null default '',
  property_id uuid references public.properties(id) on delete set null,
  source text not null default 'website',
  contact_type text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at timestamptz not null default now()
);

create index if not exists leads_status_created_idx on public.leads (status, created_at desc);

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists properties_set_updated_at on public.properties;
create trigger properties_set_updated_at before update on public.properties for each row execute function public.set_updated_at();

alter table public.admin_users enable row level security;
alter table public.properties enable row level security;
alter table public.leads enable row level security;

create policy "Public can view available properties" on public.properties for select to anon, authenticated using (status in ('published', 'reserved') or public.is_admin());
create policy "Admins can create properties" on public.properties for insert to authenticated with check (public.is_admin());
create policy "Admins can update properties" on public.properties for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admins can delete properties" on public.properties for delete to authenticated using (public.is_admin());
create policy "Admins can view their access" on public.admin_users for select to authenticated using (lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));
create policy "Visitors can send enquiries" on public.leads for insert to anon, authenticated with check (char_length(name) between 1 and 120 and char_length(email) between 3 and 254);
create policy "Admins can view enquiries" on public.leads for select to authenticated using (public.is_admin());
create policy "Admins can update enquiries" on public.leads for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admins can delete enquiries" on public.leads for delete to authenticated using (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('property-images', 'property-images', true, 8388608, array['image/jpeg','image/png','image/webp','image/avif'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy "Property images are public" on storage.objects for select to public using (bucket_id = 'property-images');
create policy "Admins can upload property images" on storage.objects for insert to authenticated with check (bucket_id = 'property-images' and public.is_admin());
create policy "Admins can update property images" on storage.objects for update to authenticated using (bucket_id = 'property-images' and public.is_admin()) with check (bucket_id = 'property-images' and public.is_admin());
create policy "Admins can delete property images" on storage.objects for delete to authenticated using (bucket_id = 'property-images' and public.is_admin());

insert into public.properties (slug, title, description, property_type, operation, location, province, price, area, bedrooms, bathrooms, features, images, status, featured)
values
('piso-luminoso-cubelles', 'Piso luminoso cerca del mar', 'Vivienda exterior con una distribución cómoda, terraza y todos los servicios a pocos minutos. Un hogar pensado para disfrutar de Cubelles durante todo el año.', 'Piso', 'venta', 'Cubelles', 'Barcelona', 298000, 96, 3, 2, array['Terraza','Ascensor','Calefacción'], array['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85'], 'published', true),
('casa-con-jardin-vilanova', 'Casa familiar con jardín', 'Una casa amplia y serena, con jardín privado, espacios luminosos y una zona de día abierta al exterior.', 'Casa', 'venta', 'Vilanova i la Geltrú', 'Barcelona', 495000, 184, 4, 3, array['Jardín','Parking','Aire acondicionado'], array['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85'], 'published', true),
('atico-terraza-sitges', 'Ático con gran terraza', 'Luz, amplitud y una terraza para vivir el Mediterráneo. Disponible para alquiler de larga duración.', 'Ático', 'alquiler', 'Sitges', 'Barcelona', 2100, 112, 3, 2, array['Terraza','Ascensor','Vistas al mar'], array['https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1600&q=85'], 'published', false)
on conflict (slug) do nothing;
