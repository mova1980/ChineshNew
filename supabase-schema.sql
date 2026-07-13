-- ═══════════════════════════════════════════════════════════════════
--  پایگاه خبری چینش — اسکریپت کامل دیتابیس Supabase
--  Chinesh News Portal — Complete Supabase Database Script
--
--  نحوه اجرا:
--    1) در Supabase وارد SQL Editor شوید
--    2) کل این فایل را paste کنید و Run بزنید
--    3) در Authentication > Users یک کاربر ادمین بسازید:
--         Email:    مقدار VITE_ADMIN_EMAIL   (پیش‌فرض: admin@chinesh.local)
--         Password: رمز دلخواه شما
--    4) env های Vercel را تنظیم و Redeploy کنید
-- ═══════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────
-- 0) Extensions
-- ─────────────────────────────────────────────
create extension if not exists pgcrypto;   -- gen_random_uuid()
create extension if not exists pg_trgm;    -- fuzzy / trigram search

-- ─────────────────────────────────────────────
-- 1) Storage Bucket (تصاویر و رسانه‌ها)
-- ─────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('chinesh-media', 'chinesh-media', true)
on conflict (id) do update set public = true;

-- ─────────────────────────────────────────────
-- 2) Tables
-- ─────────────────────────────────────────────

-- 2.1 تنظیمات صفحه اول (هیرو + کارت‌های شناور) — تک‌ردیفی
create table if not exists public.site_settings (
  id          int primary key default 1 check (id = 1),
  hero        jsonb not null default '{}'::jsonb,
  hero_cards  jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 2.2 منوهای سایت
create table if not exists public.nav_items (
  id          text primary key,
  key         text not null unique,
  label       jsonb not null,          -- {"fa": "...", "en": "..."}
  href        text not null,
  position    int  not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 2.3 اخبار (هر سه بخش: ویژه / آخرین / آرشیو)
create table if not exists public.news_items (
  id           text primary key,
  section      text not null check (section in ('featured','latest','highlights')),
  title        jsonb not null,         -- {"fa": "...", "en": "..."}
  subtitle     jsonb,
  excerpt      jsonb not null,
  body         jsonb,
  image_url    text,
  category     text not null check (category in ('city','culture','society','economy','sport','photo')),
  display_date jsonb not null default '{}'::jsonb,
  is_photo     boolean not null default false,
  position     int not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- 2.4 اخبار فوری (نوار متحرک)
create table if not exists public.breaking_news (
  id          text primary key,
  text        jsonb not null,          -- {"fa": "...", "en": "..."}
  position    int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 2.5 نگارخانه
create table if not exists public.gallery_images (
  id          text primary key,
  src         text not null,
  label       jsonb not null,          -- {"fa": "...", "en": "..."}
  span        text not null,           -- کلاس‌های Tailwind اندازه
  position    int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 2.6 مشترکین خبرنامه
create table if not exists public.newsletter_subscribers (
  id          uuid primary key default gen_random_uuid(),
  email       text not null unique,
  created_at  timestamptz not null default now()
);

-- 2.7 رسانه‌های آپلودشده (متادیتای فایل‌های Storage)
create table if not exists public.media_assets (
  id          uuid primary key default gen_random_uuid(),
  path        text not null unique,
  public_url  text not null,
  file_name   text not null,
  mime_type   text,
  size        bigint,
  created_at  timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- 3) Indexes (کارایی و جستجو)
-- ─────────────────────────────────────────────
create index if not exists idx_news_section     on public.news_items(section);
create index if not exists idx_news_category    on public.news_items(category);
create index if not exists idx_news_created_at  on public.news_items(created_at desc);
create index if not exists idx_news_position    on public.news_items(section, position);
create index if not exists idx_gallery_position on public.gallery_images(position);
create index if not exists idx_breaking_position on public.breaking_news(position);
create index if not exists idx_nav_position     on public.nav_items(position);
create index if not exists idx_newsletter_email on public.newsletter_subscribers(email);
create index if not exists idx_media_created    on public.media_assets(created_at desc);

-- ایندکس جستجوی تمام‌متن (فارسی + انگلیسی)
create index if not exists idx_news_fts on public.news_items using gin (
  to_tsvector('simple',
    coalesce(title->>'fa','')   || ' ' || coalesce(title->>'en','')   || ' ' ||
    coalesce(excerpt->>'fa','') || ' ' || coalesce(excerpt->>'en','') || ' ' ||
    coalesce(body->>'fa','')    || ' ' || coalesce(body->>'en','')
  )
);

-- ایندکس trigram برای جستجوی fuzzy روی عنوان فارسی
create index if not exists idx_news_title_fa_trgm on public.news_items
  using gin ((title->>'fa') gin_trgm_ops);

-- ─────────────────────────────────────────────
-- 4) Functions & Triggers
-- ─────────────────────────────────────────────

-- 4.1 به‌روزرسانی خودکار updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_site_settings_updated on public.site_settings;
create trigger trg_site_settings_updated
  before update on public.site_settings
  for each row execute function public.set_updated_at();

drop trigger if exists trg_nav_items_updated on public.nav_items;
create trigger trg_nav_items_updated
  before update on public.nav_items
  for each row execute function public.set_updated_at();

drop trigger if exists trg_news_items_updated on public.news_items;
create trigger trg_news_items_updated
  before update on public.news_items
  for each row execute function public.set_updated_at();

drop trigger if exists trg_breaking_news_updated on public.breaking_news;
create trigger trg_breaking_news_updated
  before update on public.breaking_news
  for each row execute function public.set_updated_at();

drop trigger if exists trg_gallery_images_updated on public.gallery_images;
create trigger trg_gallery_images_updated
  before update on public.gallery_images
  for each row execute function public.set_updated_at();

-- 4.2 تابع جستجوی تمام‌متن اخبار (RPC — قابل فراخوانی از کلاینت)
--     مثال فراخوانی از JS:
--       supabase.rpc('search_news', { q: 'شهرداری', lang: 'fa', max_rows: 20 })
create or replace function public.search_news(
  q        text,
  lang     text default 'fa',
  max_rows int  default 20
)
returns setof public.news_items
language sql
stable
as $$
  select *
  from public.news_items n
  where
    (n.title->>lang)   ilike '%' || q || '%'
    or (n.excerpt->>lang) ilike '%' || q || '%'
    or (n.body->>lang)    ilike '%' || q || '%'
    or to_tsvector('simple',
         coalesce(n.title->>'fa','')   || ' ' || coalesce(n.title->>'en','')   || ' ' ||
         coalesce(n.excerpt->>'fa','') || ' ' || coalesce(n.excerpt->>'en','') || ' ' ||
         coalesce(n.body->>'fa','')    || ' ' || coalesce(n.body->>'en','')
       ) @@ plainto_tsquery('simple', q)
  order by n.created_at desc
  limit max_rows;
$$;

-- 4.3 تابع آرشیو صفحه‌بندی‌شده (RPC)
--     مثال: supabase.rpc('get_archive', { cat: 'city', page_num: 1, page_size: 9 })
create or replace function public.get_archive(
  cat       text default null,   -- null یعنی همه دسته‌ها
  page_num  int  default 1,
  page_size int  default 9
)
returns table (
  items      jsonb,
  total_rows bigint
)
language plpgsql
stable
as $$
declare
  off int := greatest(0, (page_num - 1) * page_size);
begin
  return query
  select
    coalesce(jsonb_agg(t.*), '[]'::jsonb) as items,
    (select count(*)
       from public.news_items c
      where cat is null or c.category = cat) as total_rows
  from (
    select *
    from public.news_items n
    where cat is null or n.category = cat
    order by n.created_at desc
    limit page_size offset off
  ) t;
end;
$$;

-- 4.4 تابع آمار داشبورد ادمین (RPC)
create or replace function public.get_dashboard_stats()
returns jsonb
language sql
stable
as $$
  select jsonb_build_object(
    'featured',   (select count(*) from public.news_items where section = 'featured'),
    'latest',     (select count(*) from public.news_items where section = 'latest'),
    'highlights', (select count(*) from public.news_items where section = 'highlights'),
    'breaking',   (select count(*) from public.breaking_news),
    'gallery',    (select count(*) from public.gallery_images),
    'nav',        (select count(*) from public.nav_items),
    'newsletter', (select count(*) from public.newsletter_subscribers),
    'media',      (select count(*) from public.media_assets)
  );
$$;

-- ─────────────────────────────────────────────
-- 5) Views (ویوهای کمکی)
-- ─────────────────────────────────────────────

-- 5.1 همه اخبار مرتب‌شده — مناسب آرشیو
create or replace view public.v_all_news as
select
  n.*,
  (n.title->>'fa')   as title_fa,
  (n.title->>'en')   as title_en,
  (n.excerpt->>'fa') as excerpt_fa,
  (n.excerpt->>'en') as excerpt_en
from public.news_items n
order by n.created_at desc;

-- 5.2 آخرین اخبار هر بخش (برای صفحه اول)
create or replace view public.v_home_news as
select * from (
  select n.*,
         row_number() over (partition by n.section order by n.position asc, n.created_at desc) as rn
  from public.news_items n
) x
where
  (x.section = 'featured'   and x.rn <= 4) or
  (x.section = 'latest'     and x.rn <= 6) or
  (x.section = 'highlights' and x.rn <= 6);

-- 5.3 شمارش اخبار به تفکیک دسته (برای فیلترهای آرشیو)
create or replace view public.v_category_counts as
select category, count(*) as total
from public.news_items
group by category;

-- ─────────────────────────────────────────────
-- 6) Row Level Security (RLS)
-- ─────────────────────────────────────────────
alter table public.site_settings          enable row level security;
alter table public.nav_items              enable row level security;
alter table public.news_items             enable row level security;
alter table public.breaking_news          enable row level security;
alter table public.gallery_images         enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.media_assets           enable row level security;

-- 6.1 خواندن عمومی (بازدیدکنندگان سایت)
drop policy if exists "public read site_settings" on public.site_settings;
create policy "public read site_settings"
  on public.site_settings for select using (true);

drop policy if exists "public read nav_items" on public.nav_items;
create policy "public read nav_items"
  on public.nav_items for select using (true);

drop policy if exists "public read news_items" on public.news_items;
create policy "public read news_items"
  on public.news_items for select using (true);

drop policy if exists "public read breaking_news" on public.breaking_news;
create policy "public read breaking_news"
  on public.breaking_news for select using (true);

drop policy if exists "public read gallery_images" on public.gallery_images;
create policy "public read gallery_images"
  on public.gallery_images for select using (true);

drop policy if exists "public read media_assets" on public.media_assets;
create policy "public read media_assets"
  on public.media_assets for select using (true);

-- 6.2 خبرنامه: ثبت‌نام عمومی، مشاهده/حذف فقط ادمین
drop policy if exists "public insert newsletter" on public.newsletter_subscribers;
create policy "public insert newsletter"
  on public.newsletter_subscribers for insert with check (true);

drop policy if exists "admin read newsletter" on public.newsletter_subscribers;
create policy "admin read newsletter"
  on public.newsletter_subscribers for select using (auth.role() = 'authenticated');

drop policy if exists "admin delete newsletter" on public.newsletter_subscribers;
create policy "admin delete newsletter"
  on public.newsletter_subscribers for delete using (auth.role() = 'authenticated');

-- 6.3 نوشتن فقط برای ادمین لاگین‌شده
drop policy if exists "admin write site_settings" on public.site_settings;
create policy "admin write site_settings"
  on public.site_settings for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "admin write nav_items" on public.nav_items;
create policy "admin write nav_items"
  on public.nav_items for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "admin write news_items" on public.news_items;
create policy "admin write news_items"
  on public.news_items for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "admin write breaking_news" on public.breaking_news;
create policy "admin write breaking_news"
  on public.breaking_news for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "admin write gallery_images" on public.gallery_images;
create policy "admin write gallery_images"
  on public.gallery_images for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "admin write media_assets" on public.media_assets;
create policy "admin write media_assets"
  on public.media_assets for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────
-- 7) Storage Policies (باکت chinesh-media)
-- ─────────────────────────────────────────────
drop policy if exists "public read chinesh-media" on storage.objects;
create policy "public read chinesh-media"
  on storage.objects for select
  using (bucket_id = 'chinesh-media');

drop policy if exists "admin upload chinesh-media" on storage.objects;
create policy "admin upload chinesh-media"
  on storage.objects for insert
  with check (bucket_id = 'chinesh-media' and auth.role() = 'authenticated');

drop policy if exists "admin update chinesh-media" on storage.objects;
create policy "admin update chinesh-media"
  on storage.objects for update
  using (bucket_id = 'chinesh-media' and auth.role() = 'authenticated')
  with check (bucket_id = 'chinesh-media' and auth.role() = 'authenticated');

drop policy if exists "admin delete chinesh-media" on storage.objects;
create policy "admin delete chinesh-media"
  on storage.objects for delete
  using (bucket_id = 'chinesh-media' and auth.role() = 'authenticated');

-- ─────────────────────────────────────────────
-- 8) Seed — داده‌های اولیه
-- ─────────────────────────────────────────────

-- 8.1 تنظیمات صفحه اول
insert into public.site_settings (id, hero, hero_cards)
values (
  1,
  jsonb_build_object(
    'eyebrow',     jsonb_build_object('fa','پایگاه اطلاع رسانی مدیریت شهری','en','Urban Management News Portal'),
    'title1',      jsonb_build_object('fa','بینشی نو در','en','A new insight in'),
    'titleAccent', jsonb_build_object('fa','خبر','en','News'),
    'title2',      jsonb_build_object('fa','','en',''),
    'desc',        jsonb_build_object('fa','آخرین اخبار، تحلیل ها و گزارش ها را از پایگاه خبری چینش دنبال کنید','en','Follow the latest news, analyses and reports from Chinesh news portal')
  ),
  jsonb_build_object(
    'top',        jsonb_build_object('fa','افتتاح پروژه‌های عمرانی شهر','en','Urban development projects inaugurated'),
    'bottom',     jsonb_build_object('fa','گزارش لحظه‌ای','en','Live report'),
    'caption',    jsonb_build_object('fa','زیبایی‌های شهر','en','City Beauty'),
    'captionSub', jsonb_build_object('fa','البرز، نگین ایران','en','Alborz, the gem of Iran')
  )
)
on conflict (id) do nothing;

-- 8.2 منوهای پیش‌فرض
insert into public.nav_items (id, key, label, href, position) values
  ('home',     'home',     '{"fa":"خانه","en":"Home"}',                       '#home',         0),
  ('news',     'news',     '{"fa":"اخبار","en":"News"}',                      '#news',         1),
  ('articles', 'articles', '{"fa":"مقالات","en":"Articles"}',                 '#archive/all',  2),
  ('media',    'media',    '{"fa":"نگارخانه","en":"Gallery"}',                '#media',        3),
  ('city',     'city',     '{"fa":"مدیریت شهری","en":"City Management"}',     '#archive/city', 4),
  ('club',     'club',     '{"fa":"کلوپ چینش","en":"Chinesh Club"}',          '#club',         5),
  ('about',    'about',    '{"fa":"درباره ما","en":"About"}',                 '#about',        6),
  ('contact',  'contact',  '{"fa":"تماس","en":"Contact"}',                    '#about',        7)
on conflict (id) do nothing;

-- 8.3 اخبار فوری پیش‌فرض
insert into public.breaking_news (id, text, position) values
  ('breaking_0', '{"fa":"تعیین تکلیف سینما هجرت از مطالبات مهم شهروندان است","en":"Settlement of Hejrat Cinema is an important demand"}', 0),
  ('breaking_1', '{"fa":"تحقق کامل بودجه‌ی مناطق در گرو رفع موانع درآمدی است","en":"Full budget realization depends on removing income obstacles"}', 1),
  ('breaking_2', '{"fa":"میراث «قراردادهای شکست‌خورده» مانع جذب سرمایه‌گذار است","en":"Legacy of failed contracts hinders investor attraction"}', 2),
  ('breaking_3', '{"fa":"پیشبرد سرمایه‌گذاری با بهره‌گیری از توان بخش خصوصی","en":"Advancing investment through private sector"}', 3),
  ('breaking_4', '{"fa":"افتتاح پروژه‌های عمرانی شهرداری در هفته دولت","en":"Municipality opens construction projects in Government Week"}', 4)
on conflict (id) do nothing;

-- 8.4 نمونه اخبار بخش ویژه (تیتر یک)
insert into public.news_items (id, section, title, subtitle, excerpt, body, image_url, category, display_date, is_photo, position) values
  (
    'n1', 'featured',
    '{"fa":"حماسه تاسوعا و عاشورا الگوی ایستادگی برابر جبهه استکبار است","en":"Tasua and Ashura: A symbol of resistance against arrogance"}',
    null,
    '{"fa":"شهردار در آستانه فرارسیدن ایام تاسوعا و عاشورای حسینی، با تسلیت این ایام به عموم شهروندان، حماسه عاشورا را الگویی جاودان دانست.","en":"Mayor offered condolences to citizens and described the epic of Ashura as an eternal model."}',
    '{"fa":"شهردار در آستانه فرارسیدن ایام تاسوعا و عاشورای حسینی، با تسلیت این ایام به عموم شهروندان، حماسه عاشورا را الگویی جاودان برای ایستادگی دانست. وی از برنامه‌های ویژه فرهنگی و عمرانی شهرداری در این ایام خبر داد.","en":"The Mayor, marking the approaching days of Tasua and Ashura, offered condolences and announced special cultural programs."}',
    '/images/news-placeholder.jpg', 'society',
    '{"fa":"امروز","en":"Today"}', false, 0
  ),
  (
    'n2', 'featured',
    '{"fa":"دستگاه قضا عامل تقویت سلامت اداری و بهبود خدمات‌رسانی به مردم است","en":"Judiciary, a factor in strengthening administrative health"}',
    null,
    '{"fa":"شهردار گفت: دستگاه قضا عامل تقویت سلامت اداری و بهبود خدمتگزاری به مردم شریف است.","en":"Mayor stated: The judiciary strengthens administrative health."}',
    '{"fa":"شهردار در دیدار با مسئولین قضایی استان، بر اهمیت تعامل سازنده میان مدیریت شهری و دستگاه قضا تأکید کرد.","en":"The Mayor emphasized constructive interaction between urban management and judiciary."}',
    '/images/gallery1.jpg', 'city',
    '{"fa":"دیروز","en":"Yesterday"}', false, 1
  ),
  (
    'n3', 'featured',
    '{"fa":"رئیس‌جمهور از آتش‌نشان تجلیل کرد / قدردانی از فداکاری‌های سرخ‌پوشان","en":"President honored firefighter"}',
    '{"fa":"در جمع آتش‌نشانان برگزیده کشور","en":"Among top firefighters"}',
    '{"fa":"رئیس جمهور در آیین ملی پاسداشت آتش‌نشانان فداکار، از آتش‌نشان شایسته و پرتلاش شهرداری تجلیل کرد.","en":"The President honored the dedicated firefighter at the national ceremony."}',
    '{"fa":"در آیین ملی پاسداشت آتش‌نشانان فداکار کشور که با حضور رئیس جمهور برگزار شد، از آتش‌نشانان شایسته تجلیل به عمل آمد.","en":"At the national ceremony, outstanding firefighters were honored by the President."}',
    '/images/hero2.jpg', 'society',
    '{"fa":"۲ روز قبل","en":"2 days ago"}', false, 2
  ),
  (
    'n4', 'featured',
    '{"fa":"درس عاشورا، رمز ماندگاری نظام اسلامی است","en":"Ashura''s lesson is the secret of endurance"}',
    '{"fa":"شهردار","en":"Mayor"}',
    '{"fa":"شهردار با صدور پیامی به مناسبت آغاز ماه محرم‌الحرام، درس عاشورا را رمز ماندگاری نظام دانست.","en":"Mayor issued a statement marking Muharram."}',
    '{"fa":"شهردار در پیامی به مناسبت آغاز ماه محرم‌الحرام نوشت: درس عاشورا رمز ماندگاری نظام اسلامی است.","en":"The Mayor wrote a message for Muharram."}',
    '/images/gallery3.jpg', 'culture',
    '{"fa":"۲ روز قبل","en":"2 days ago"}', false, 3
  )
on conflict (id) do nothing;

-- 8.5 نمونه اخبار بخش آخرین اخبار
insert into public.news_items (id, section, title, subtitle, excerpt, body, image_url, category, display_date, is_photo, position) values
  (
    'l1', 'latest',
    '{"fa":"میادین و بازارهای میوه و تره‌بار در ایام عزاداری تعطیل است","en":"Fruit markets closed during mourning days"}',
    null,
    '{"fa":"رئیس سازمان ساماندهی مشاغل شهری از تعطیلی میادین میوه و تره‌بار خبر داد.","en":"Head of Urban Jobs Organization announced closure of markets."}',
    '{"fa":"میادین و بازارهای میوه و تره‌بار به مناسبت ایام سوگواری تعطیل خواهند بود.","en":"Markets will be closed during mourning days."}',
    '/images/news-placeholder.jpg', 'city',
    '{"fa":"۳ روز قبل","en":"3 days ago"}', false, 0
  ),
  (
    'l2', 'latest',
    '{"fa":"شناسایی کانون‌های پرحادثه / تخطی از سرعت، قاتل خاموش معابر","en":"Identifying accident hotspots"}',
    null,
    '{"fa":"معاون حمل‌ونقل و ترافیک از شناسایی و اولویت‌بندی نقاط پرحادثه شهر خبر داد.","en":"Transportation Deputy announced identification of accident-prone areas."}',
    '{"fa":"سرعت غیرمجاز همچنان مهم‌ترین عامل وقوع تصادفات منجر به فوت در معابر شهری است.","en":"Speeding remains the leading cause of fatal accidents."}',
    '/images/hero1.jpg', 'city',
    '{"fa":"۳ روز قبل","en":"3 days ago"}', false, 1
  ),
  (
    'l3', 'latest',
    '{"fa":"هنرمندان با «ترسیم عاشقی» به بدرقه می‌روند","en":"Artists pay tribute with Drawing of Love"}',
    '{"fa":"پارک ملی","en":"National Park"}',
    '{"fa":"ورکشاپ هنری «ترسیم عاشقی» با حضور هنرمندان برگزار شد.","en":"An art workshop was held with artists."}',
    '{"fa":"ورکشاپ هنری «ترسیم عاشقی» در محل پارک ملی با حضور هنرمندان تجسمی برگزار شد.","en":"Art workshop held at National Park."}',
    '/images/gallery2.jpg', 'culture',
    '{"fa":"۳ روز قبل","en":"3 days ago"}', false, 2
  ),
  (
    'l4', 'latest',
    '{"fa":"آتش‌نشانان در ۱۲ نقطه شهر مستقر می‌شوند","en":"Firefighters deployed at 12 city points"}',
    '{"fa":"حفظ ایمنی مراسم","en":"Ceremony safety"}',
    '{"fa":"رئیس سازمان آتش‌نشانی از آمادگی کامل نیروها با استقرار در ۱۲ نقطه شهر خبر داد.","en":"Fire Department announced full readiness at 12 locations."}',
    '{"fa":"ایستگاه‌های سیار در مسیرهای اصلی مستقر خواهند بود.","en":"Mobile stations on main routes."}',
    '/images/hero3.jpg', 'society',
    '{"fa":"۳ روز قبل","en":"3 days ago"}', false, 3
  ),
  (
    'l5', 'latest',
    '{"fa":"اتحاد آتش‌نشانی‌ها در مسیر تصمیم‌سازی تخصصی","en":"Fire department unity for specialized decisions"}',
    null,
    '{"fa":"سومین نشست هم‌اندیشی رؤسای سازمان‌های آتش‌نشانی برگزار شد.","en":"Third meeting of fire department heads was held."}',
    '{"fa":"نشست با هدف تقویت هماهنگی‌های تخصصی و تشکیل کمیته فنی مشترک برگزار شد.","en":"Meeting aimed to strengthen coordination."}',
    '/images/gallery1.jpg', 'city',
    '{"fa":"۳ روز قبل","en":"3 days ago"}', false, 4
  ),
  (
    'l6', 'latest',
    '{"fa":"جلسه هماهنگی با موضوع مصوبه جدید شورای امنیت برگزار شد","en":"Coordination meeting on Security Council resolution"}',
    '{"fa":"گزارش تصویری","en":"Photo report"}',
    '{"fa":"جلسه هماهنگی با موضوع ابلاغ مصوبه جدید شورای امنیت کشور برگزار شد.","en":"Meeting held on new Security Council resolution."}',
    '{"fa":"جلسه با حضور قائم‌مقام شهردار و مدیران مناطق برگزار شد.","en":"Meeting with Deputy Mayor and district managers."}',
    '/images/news-placeholder.jpg', 'photo',
    '{"fa":"۳ روز قبل","en":"3 days ago"}', true, 5
  )
on conflict (id) do nothing;

-- 8.6 نمونه اخبار بخش آرشیو
insert into public.news_items (id, section, title, subtitle, excerpt, body, image_url, category, display_date, is_photo, position) values
  (
    'h1', 'highlights',
    '{"fa":"طرح‌های فرهنگی به مناسبت هفته قوه قضاییه اکران شد","en":"Cultural designs for Judiciary Week"}',
    null,
    '{"fa":"اقدام به اکران طرح‌های فرهنگی در سطح شهر شده است.","en":"Cultural designs displayed throughout the city."}',
    '{"fa":"طرح‌ها با هدف ترویج فرهنگ قضایی و آگاهی‌بخشی طراحی و نصب شده‌اند.","en":"Designs promote judicial culture."}',
    '/images/gallery2.jpg', 'culture',
    '{"fa":"۳ روز قبل","en":"3 days ago"}', false, 0
  ),
  (
    'h2', 'highlights',
    '{"fa":"فرصت تعیین تکلیف آرای تخریب ساختمان‌ها تا پایان سال","en":"Settle demolition orders until year end"}',
    '{"fa":"قائم‌مقام شهردار","en":"Deputy Mayor"}',
    '{"fa":"ابلاغ مصوبه جدید شورای امنیت کشور برای تعیین تکلیف پرونده‌های تخریب.","en":"New resolution for demolition order settlement."}',
    '{"fa":"مالکان می‌توانند تا پایان سال از فرصت قانونی استفاده کنند.","en":"Owners can use legal opportunity until year end."}',
    '/images/news-placeholder.jpg', 'city',
    '{"fa":"۳ روز قبل","en":"3 days ago"}', false, 1
  ),
  (
    'h3', 'highlights',
    '{"fa":"ساعات فعالیت پارک مادر و کودک اعلام می‌شود","en":"Mother and Child Park hours announced"}',
    null,
    '{"fa":"ساعت فعالیت پارک «مادر و کودک» متعاقباً اعلام خواهد شد.","en":"Park hours will be announced."}',
    '{"fa":"این پارک با امکانات ویژه برای مادران و کودکان طراحی شده است.","en":"Park designed for mothers and children."}',
    '/images/hero1.jpg', 'society',
    '{"fa":"۵ روز قبل","en":"5 days ago"}', false, 2
  ),
  (
    'h4', 'highlights',
    '{"fa":"درخشش کارکنان شهرداری در لیگ ملی خلاقیت کلانشهرها","en":"Municipality staff shine in Creativity League"}',
    null,
    '{"fa":"کارکنان در دومین جشنواره ملی لیگ خلاقیت رتبه‌های برتر کسب کردند.","en":"Staff achieved top ranks at Creativity League."}',
    '{"fa":"توانمندی در نوآوری و مدیریت هوشمند شهری به نمایش گذاشته شد.","en":"Innovation and smart urban management showcased."}',
    '/images/gallery3.jpg', 'society',
    '{"fa":"۴ روز قبل","en":"4 days ago"}', false, 3
  ),
  (
    'h5', 'highlights',
    '{"fa":"تعلل در آموزش راهبر و خرید رام قطار توجیه‌پذیر نیست","en":"Delay in driver training unacceptable"}',
    '{"fa":"کمیسیون حقوقی شورای شهر","en":"City Council Legal Commission"}',
    '{"fa":"بر ضرورت تامین راهبر و رام قطار به تعداد مورد نیاز تاکید شد.","en":"Need for adequate train drivers emphasized."}',
    '{"fa":"مدیریت حمل و نقل ریلی بدون تامین راهبر و رام قطار به تعداد کافی ممکن نیست.","en":"Rail management impossible without adequate resources."}',
    '/images/hero2.jpg', 'city',
    '{"fa":"۴ روز قبل","en":"4 days ago"}', false, 4
  ),
  (
    'h6', 'highlights',
    '{"fa":"نمادهای محرم در شهر به جلوه درآمدند","en":"Muharram symbols displayed in the city"}',
    null,
    '{"fa":"۱۰ المان حجمی و ۷۰ المان نوری به مناسبت ماه محرم نصب شد.","en":"10 volumetric and 70 light elements installed."}',
    '{"fa":"المان‌ها برای ایجاد حال و هوای معنوی در سطح شهر نصب شده‌اند.","en":"Elements installed for spiritual atmosphere."}',
    '/images/gallery1.jpg', 'photo',
    '{"fa":"۵ روز قبل","en":"5 days ago"}', true, 5
  )
on conflict (id) do nothing;

-- 8.7 نمونه تصاویر نگارخانه
insert into public.gallery_images (id, src, label, span, position) values
  ('gallery_0', '/images/hero1.jpg',    '{"fa":"کوه‌های البرز","en":"Alborz Mountains"}',  'col-span-12 md:col-span-7 row-span-2 aspect-[16/11] md:aspect-auto md:h-[520px]', 0),
  ('gallery_1', '/images/gallery1.jpg', '{"fa":"بهار البرز","en":"Spring of Alborz"}',      'col-span-6 md:col-span-5 aspect-square md:h-[250px]', 1),
  ('gallery_2', '/images/hero3.jpg',    '{"fa":"دریاچه و طبیعت","en":"Lake & Nature"}',      'col-span-6 md:col-span-5 aspect-square md:h-[250px]', 2),
  ('gallery_3', '/images/gallery2.jpg', '{"fa":"پارک‌های شهری","en":"City Parks"}',          'col-span-6 md:col-span-4 aspect-square md:h-[280px]', 3),
  ('gallery_4', '/images/gallery3.jpg', '{"fa":"نمای شبانه شهر","en":"Night Cityscape"}',    'col-span-6 md:col-span-4 aspect-square md:h-[280px]', 4),
  ('gallery_5', '/images/hero2.jpg',    '{"fa":"غروب شهر","en":"City Sunset"}',              'col-span-12 md:col-span-4 aspect-[16/9] md:h-[280px]', 5)
on conflict (id) do nothing;

-- ─────────────────────────────────────────────
-- 9) Grants (دسترسی ویوها و توابع برای کلاینت)
-- ─────────────────────────────────────────────
grant select on public.v_all_news         to anon, authenticated;
grant select on public.v_home_news        to anon, authenticated;
grant select on public.v_category_counts  to anon, authenticated;
grant execute on function public.search_news(text, text, int)      to anon, authenticated;
grant execute on function public.get_archive(text, int, int)       to anon, authenticated;
grant execute on function public.get_dashboard_stats()             to anon, authenticated;

-- ═══════════════════════════════════════════════════════════════════
--  پایان اسکریپت — دیتابیس آماده است ✅
--
--  یادآوری مراحل بعدی:
--    1) Authentication > Users > Add user  (ایمیل = VITE_ADMIN_EMAIL)
--    2) در Vercel این env ها را تنظیم کنید:
--         VITE_SUPABASE_URL
--         VITE_SUPABASE_ANON_KEY
--         VITE_ADMIN_EMAIL
--         VITE_SUPABASE_MEDIA_BUCKET=chinesh-media
--    3) Redeploy در Vercel
-- ═══════════════════════════════════════════════════════════════════
