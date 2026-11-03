-- Property fields needed for real listings and removal of the old demo listings.

alter table public.properties
  add column if not exists reference text not null default '',
  add column if not exists energy_rating text not null default '';

-- The initial migration seeded three demo listings with stock photos.
delete from public.properties
where slug in ('piso-luminoso-cubelles', 'casa-con-jardin-vilanova', 'atico-terraza-sitges');

-- Server-side limits for enquiries sent through the website.
alter table public.leads
  drop constraint if exists leads_type_check,
  add constraint leads_type_check check (type in ('contact', 'property_info', 'valuation')) not valid,
  drop constraint if exists leads_lengths_check,
  add constraint leads_lengths_check check (
    char_length(phone) <= 20 and char_length(message) <= 4000 and char_length(last_name) <= 120
  ) not valid;

drop policy if exists "Visitors can send enquiries" on public.leads;
create policy "Visitors can send enquiries" on public.leads for insert to anon, authenticated with check (
  char_length(name) between 1 and 120
  and char_length(email) between 3 and 254
  and status = 'new'
);
