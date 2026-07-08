-- Chinesh News Portal - Supabase schema
-- Run this file in Supabase SQL Editor.
-- Then create one Supabase Auth user for admin login:
--   email: value of VITE_ADMIN_EMAIL (default: admin@chinesh.local)
--   password: your chosen password

create extension if not exists pgcrypto;

-- =============== Storage bucket ===============
insert into storage.buckets (id, name, public)
values ('chinesh-media', 'chinesh-media', true)
on conflict (id) do update set public = true;

-- =============== Tables ===============
create table if not exists public.site_settings (
  id int primary key default 1 check (id = 1),
  hero jsonb not null default '{}'::jsonb,
  hero_cards jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.nav_items (
  id text primary key,
  key text not null unique,
  label jsonb not null,
  href text not null,
  position int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.news_items (
  id text primary key,
  section text not null check (section in ('featured', 'latest', 'highlights')),
  title jsonb not null,
  subtitle jsonb,
  excerpt jsonb not null,
  body jsonb,
  image_url text,
  category text not null check (category in ('city', 'culture', 'society', 'economy', 'sport', 'photo')),
  display_date jsonb not null default '{}'::jsonb,
  is_photo boolean not null default false,
  position int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.breaking_news (
  id text primary key,
  text jsonb not null,
  position int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gallery_images (
  id text primary key,
  src text not null,
  label jsonb not null,
  span text not null,
  position int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  path text not null unique,
  public_url text not null,
  file_name text not null,
  mime_type text,
  size bigint,
  created_at timestamptz not null default now()
);

-- =============== Search indexes ===============
create index if not exists idx_news_section on public.news_items(section);
create index if not exists idx_news_category on public.news_items(category);
create index if not exists idx_news_created_at on public.news_items(created_at desc);
create index if not exists idx_gallery_position on public.gallery_images(position);
create index if not exists idx_breaking_position on public.breaking_news(position);

-- Optional FTS index for later advanced search in SQL/RPC
create index if not exists idx_news_fts on public.news_items using gin (
  to_tsvector(
    'simple',
    coalesce(title->>'fa','') || ' ' ||
    coalesce(title->>'en','') || ' ' ||
    coalesce(excerpt->>'fa','') || ' ' ||
    coalesce(excerpt->>'en','') || ' ' ||
    coalesce(body->>'fa','') || ' ' ||
    coalesce(body->>'en','')
  )
);

-- =============== Updated_at trigger ===============
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_site_settings_updated on public.site_settings;
create trigger trg_site_settings_updated before update on public.site_settings
for each row execute function public.set_updated_at();

drop trigger if exists trg_nav_items_updated on public.nav_items;
create trigger trg_nav_items_updated before update on public.nav_items
for each row execute function public.set_updated_at();

drop trigger if exists trg_news_items_updated on public.news_items;
create trigger trg_news_items_updated before update on public.news_items
for each row execute function public.set_updated_at();

drop trigger if exists trg_breaking_news_updated on public.breaking_news;
create trigger trg_breaking_news_updated before update on public.breaking_news
for each row execute function public.set_updated_at();

drop trigger if exists trg_gallery_images_updated on public.gallery_images;
create trigger trg_gallery_images_updated before update on public.gallery_images
for each row execute function public.set_updated_at();

-- =============== Row Level Security ===============
alter table public.site_settings enable row level security;
alter table public.nav_items enable row level security;
alter table public.news_items enable row level security;
alter table public.breaking_news enable row level security;
alter table public.gallery_images enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.media_assets enable row level security;

-- Public read policies
drop policy if exists "public read site_settings" on public.site_settings;
create policy "public read site_settings" on public.site_settings for select using (true);

drop policy if exists "public read nav_items" on public.nav_items;
create policy "public read nav_items" on public.nav_items for select using (true);

drop policy if exists "public read news_items" on public.news_items;
create policy "public read news_items" on public.news_items for select using (true);

drop policy if exists "public read breaking_news" on public.breaking_news;
create policy "public read breaking_news" on public.breaking_news for select using (true);

drop policy if exists "public read gallery_images" on public.gallery_images;
create policy "public read gallery_images" on public.gallery_images for select using (true);

drop policy if exists "public read media_assets" on public.media_assets;
create policy "public read media_assets" on public.media_assets for select using (true);

-- Newsletter: public insert only, authenticated admin read/delete
drop policy if exists "public insert newsletter" on public.newsletter_subscribers;
create policy "public insert newsletter" on public.newsletter_subscribers for insert with check (true);

drop policy if exists "admin read newsletter" on public.newsletter_subscribers;
create policy "admin read newsletter" on public.newsletter_subscribers for select using (auth.role() = 'authenticated');

drop policy if exists "admin delete newsletter" on public.newsletter_subscribers;
create policy "admin delete newsletter" on public.newsletter_subscribers for delete using (auth.role() = 'authenticated');

-- Authenticated admin write policies
drop policy if exists "admin write site_settings" on public.site_settings;
create policy "admin write site_settings" on public.site_settings for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "admin write nav_items" on public.nav_items;
create policy "admin write nav_items" on public.nav_items for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "admin write news_items" on public.news_items;
create policy "admin write news_items" on public.news_items for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "admin write breaking_news" on public.breaking_news;
create policy "admin write breaking_news" on public.breaking_news for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "admin write gallery_images" on public.gallery_images;
create policy "admin write gallery_images" on public.gallery_images for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "admin write media_assets" on public.media_assets;
create policy "admin write media_assets" on public.media_assets for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Storage policies for chinesh-media bucket
drop policy if exists "public read chinesh-media" on storage.objects;
create policy "public read chinesh-media" on storage.objects for select using (bucket_id = 'chinesh-media');

drop policy if exists "admin upload chinesh-media" on storage.objects;
create policy "admin upload chinesh-media" on storage.objects for insert with check (bucket_id = 'chinesh-media' and auth.role() = 'authenticated');

drop policy if exists "admin update chinesh-media" on storage.objects;
create policy "admin update chinesh-media" on storage.objects for update using (bucket_id = 'chinesh-media' and auth.role() = 'authenticated') with check (bucket_id = 'chinesh-media' and auth.role() = 'authenticated');

drop policy if exists "admin delete chinesh-media" on storage.objects;
create policy "admin delete chinesh-media" on storage.objects for delete using (bucket_id = 'chinesh-media' and auth.role() = 'authenticated');

-- =============== Seed default settings only ===============
insert into public.site_settings (id, hero, hero_cards)
values (
  1,
  '{"eyebrow":{"fa":"پایگاه اطلاع رسانی مدیریت شهری","en":"Urban Management News Portal"},"title1":{"fa":"بینشی نو در","en":"A new insight in"},"titleAccent":{"fa":"خبر","en":"News"},"title2":{"fa":"","en":""},"desc":{"fa":"آخرین اخبار، تحلیل ها و گزارش ها را از پایگاه خبری چینش دنبال کنید","en":"Follow the latest news, analyses and reports from Chinesh news portal"}}'::jsonb,
  '{"top":{"fa":"افتتاح پروژه‌های عمرانی شهر","en":"Urban development projects inaugurated"},"bottom":{"fa":"گزارش لحظه‌ای","en":"Live report"},"caption":{"fa":"زیبایی‌های شهر","en":"City Beauty"},"captionSub":{"fa":"البرز، نگین ایران","en":"Alborz, the gem of Iran"}}'::jsonb
)
on conflict (id) do nothing;
