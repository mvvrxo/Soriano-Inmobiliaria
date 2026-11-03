-- Security and performance fixes from the Supabase advisors:
-- 1. is_admin() moves to a schema that the REST API does not expose, so nobody
--    can call it through /rest/v1/rpc/is_admin. RLS policies can still use it.
-- 2. Policies wrap auth.jwt() and is_admin() in a subquery so they run once per
--    query instead of once per row.

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to anon, authenticated;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

revoke all on function private.is_admin() from public;
grant execute on function private.is_admin() to anon, authenticated;

-- admin_users
drop policy if exists "Admins can view their access" on public.admin_users;
create policy "Admins can view their access" on public.admin_users for select to authenticated using (lower(email) = lower(coalesce((select auth.jwt()) ->> 'email', '')));

-- properties
drop policy if exists "Public can view available properties" on public.properties;
drop policy if exists "Admins can create properties" on public.properties;
drop policy if exists "Admins can update properties" on public.properties;
drop policy if exists "Admins can delete properties" on public.properties;
create policy "Public can view available properties" on public.properties for select to anon, authenticated using (status in ('published', 'reserved') or (select private.is_admin()));
create policy "Admins can create properties" on public.properties for insert to authenticated with check ((select private.is_admin()));
create policy "Admins can update properties" on public.properties for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "Admins can delete properties" on public.properties for delete to authenticated using ((select private.is_admin()));

-- leads
drop policy if exists "Admins can view enquiries" on public.leads;
drop policy if exists "Admins can update enquiries" on public.leads;
drop policy if exists "Admins can delete enquiries" on public.leads;
create policy "Admins can view enquiries" on public.leads for select to authenticated using ((select private.is_admin()));
create policy "Admins can update enquiries" on public.leads for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "Admins can delete enquiries" on public.leads for delete to authenticated using ((select private.is_admin()));

-- storage
drop policy if exists "Admins can upload property images" on storage.objects;
drop policy if exists "Admins can update property images" on storage.objects;
drop policy if exists "Admins can delete property images" on storage.objects;
create policy "Admins can upload property images" on storage.objects for insert to authenticated with check (bucket_id = 'property-images' and (select private.is_admin()));
create policy "Admins can update property images" on storage.objects for update to authenticated using (bucket_id = 'property-images' and (select private.is_admin())) with check (bucket_id = 'property-images' and (select private.is_admin()));
create policy "Admins can delete property images" on storage.objects for delete to authenticated using (bucket_id = 'property-images' and (select private.is_admin()));

-- Nothing depends on the public version any more.
drop function if exists public.is_admin();
