-- Chinesh News Portal - Complete Seed Data
-- This script adds default data without deleting existing records
-- Run this in Supabase SQL Editor

-- 1. Site Settings (Hero Configuration)
INSERT INTO public.site_settings (id, hero, hero_cards)
VALUES (
  1,
  '{
    "eyebrow": {"fa": "پایگاه اطلاع رسانی مدیریت شهری", "en": "Urban Management News Portal"},
    "title1": {"fa": "بینشی نو در", "en": "A new insight in"},
    "titleAccent": {"fa": "خبر", "en": "News"},
    "title2": {"fa": "", "en": ""},
    "desc": {"fa": "آخرین اخبار، تحلیل ها و گزارش ها را از پایگاه خبری چینش دنبال کنید", "en": "Follow the latest news, analyses and reports from Chinesh news portal"}
  }'::jsonb,
  '{
    "top": {"fa": "افتتاح پروژه‌های عمرانی شهر", "en": "Urban development projects inaugurated"},
    "bottom": {"fa": "گزارش لحظه‌ای", "en": "Live report"},
    "caption": {"fa": "زیبایی‌های شهر", "en": "City Beauty"},
    "captionSub": {"fa": "البرز، نگین ایران", "en": "Alborz, the gem of Iran"}
  }'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  hero = EXCLUDED.hero,
  hero_cards = EXCLUDED.hero_cards,
  updated_at = now();

-- 2. Navigation Menu Items
INSERT INTO public.nav_items (id, key, label, href, position)
VALUES
  ('home', 'home', '{"fa": "خانه", "en": "Home"}'::jsonb, '#home', 0),
  ('news', 'news', '{"fa": "اخبار", "en": "News"}'::jsonb, '#news', 1),
  ('articles', 'articles', '{"fa": "مقالات", "en": "Articles"}'::jsonb, '#archive/all', 2),
  ('media', 'media', '{"fa": "نگارخانه", "en": "Gallery"}'::jsonb, '#media', 3),
  ('city', 'city', '{"fa": "مدیریت شهری", "en": "City Management"}'::jsonb, '#archive/city', 4),
  ('club', 'club', '{"fa": "کلوپ چینش", "en": "Chinesh Club"}'::jsonb, '#club', 5),
  ('about', 'about', '{"fa": "درباره ما", "en": "About"}'::jsonb, '#about', 6),
  ('contact', 'contact', '{"fa": "تماس", "en": "Contact"}'::jsonb, '#about', 7)
ON CONFLICT (id) DO NOTHING;

-- 3. Breaking News (Ticker)
INSERT INTO public.breaking_news (id, text, position)
VALUES
  ('breaking_1', '{"fa": "تعیین تکلیف سینما هجرت از مطالبات مهم شهروندان است", "en": "Settlement of Hejrat Cinema is an important demand"}'::jsonb, 0),
  ('breaking_2', '{"fa": "تحقق کامل بودجه‌ی مناطق در گرو رفع موانع درآمدی است", "en": "Full budget realization depends on removing income obstacles"}'::jsonb, 1),
  ('breaking_3', '{"fa": "میراث «قراردادهای شکست‌خورده» مانع جذب سرمایه‌گذار است", "en": "Legacy of failed contracts hinders investor attraction"}'::jsonb, 2),
  ('breaking_4', '{"fa": "پیشبرد سرمایه‌گذاری با بهره‌گیری از توان بخش خصوصی", "en": "Advancing investment through private sector"}'::jsonb, 3),
  ('breaking_5', '{"fa": "افتتاح پروژه‌های عمرانی شهرداری در هفته دولت", "en": "Municipality opens construction projects in Government Week"}'::jsonb, 4)
ON CONFLICT (id) DO NOTHING;

-- 4. Featured News (تیتر یک)
INSERT INTO public.news_items (id, section, title, subtitle, excerpt, body, image_url, category, display_date, is_photo, position)
VALUES
  (
    'n1',
    'featured',
    '{"fa": "حماسه تاسوعا و عاشورا الگوی ایستادگی برابر جبهه استکبار است", "en": "Tasua and Ashura: A symbol of resistance against arrogance"}'::jsonb,
    NULL,
    '{"fa": "شهردار در آستانه فرارسیدن ایام تاسوعا و عاشورای حسینی، با تسلیت این ایام به عموم شهروندان، حماسه عاشورا را الگویی جاودان برای ایستادگی در برابر جبهه استکبار دانست.", "en": "Mayor offered condolences to citizens and described the epic of Ashura as an eternal model of standing against arrogance."}'::jsonb,
    '{"fa": "شهردار در آستانه فرارسیدن ایام تاسوعا و عاشورای حسینی، با تسلیت این ایام به عموم شهروندان، حماسه عاشورا را الگویی جاودان برای ایستادگی در برابر جبهه استکبار دانست. وی با تأکید بر لزوم پاسداشت ارزش‌های عاشورایی در مدیریت شهری، از برنامه‌های ویژه فرهنگی و عمرانی شهرداری در این ایام خبر داد.", "en": "The Mayor, marking the approaching days of Tasua and Ashura, offered condolences and described the epic of Ashura as an eternal model of resistance."}'::jsonb,
    '/images/hero1.jpg',
    'society',
    '{"fa": "امروز", "en": "Today"}'::jsonb,
    false,
    0
  ),
  (
    'n2',
    'featured',
    '{"fa": "دستگاه قضا عامل تقویت سلامت اداری و بهبود خدمات‌رسانی به مردم است", "en": "Judiciary, a factor in strengthening administrative health"}'::jsonb,
    NULL,
    '{"fa": "شهردار گفت: دستگاه قضا عامل تقویت سلامت اداری و بهبود خدمتگزاری به مردم شریف است و حل بسیاری از معضلات شهری بدون همراهی این دستگاه ممکن نیست.", "en": "Mayor stated: The judiciary is a factor in strengthening administrative health and improving service to the noble people."}'::jsonb,
    '{"fa": "شهردار در دیدار با مسئولین قضایی استان، بر اهمیت تعامل سازنده میان مدیریت شهری و دستگاه قضا تأکید کرد. وی گفت حل بسیاری از معضلات شهری بدون همراهی قوه قضاییه ممکن نیست.", "en": "The Mayor emphasized constructive interaction between urban management and judiciary in a meeting with judicial officials."}'::jsonb,
    '/images/gallery1.jpg',
    'city',
    '{"fa": "دیروز", "en": "Yesterday"}'::jsonb,
    false,
    1
  ),
  (
    'n3',
    'featured',
    '{"fa": "رئیس‌جمهور از آتش‌نشان تجلیل کرد / قدردانی از فداکاری‌های سرخ‌پوشان", "en": "President honored firefighter / Appreciation of red uniforms"}'::jsonb,
    '{"fa": "در جمع آتش‌نشانان برگزیده کشور", "en": "Among top firefighters"}'::jsonb,
    '{"fa": "رئیس جمهور در آیین ملی پاسداشت آتش‌نشانان فداکار، از آتش‌نشان شایسته و پرتلاش شهرداری تجلیل کرد.", "en": "The President honored the dedicated firefighter at the national ceremony."}'::jsonb,
    '{"fa": "در آیین ملی پاسداشت آتش‌نشانان فداکار کشور که با حضور رئیس جمهور برگزار شد، از آتش‌نشانان شایسته و پرتلاش تجلیل به عمل آمد.", "en": "At the national ceremony honoring dedicated firefighters, outstanding firefighters were honored by the President."}'::jsonb,
    '/images/hero2.jpg',
    'society',
    '{"fa": "۲ روز قبل", "en": "2 days ago"}'::jsonb,
    false,
    2
  ),
  (
    'n4',
    'featured',
    '{"fa": "درس عاشورا، رمز ماندگاری نظام اسلامی است", "en": "Ashura lesson is the secret of Islamic system endurance"}'::jsonb,
    '{"fa": "شهردار", "en": "Mayor"}'::jsonb,
    '{"fa": "شهردار با صدور پیامی به مناسبت آغاز ماه محرم‌الحرام، درس عاشورا را رمز ماندگاری نظام دانست.", "en": "Mayor issued a statement marking Muharram, describing Ashura lesson as the secret of endurance."}'::jsonb,
    '{"fa": "شهردار در پیامی به مناسبت آغاز ماه محرم‌الحرام نوشت: درس عاشورا رمز ماندگاری نظام اسلامی است.", "en": "The Mayor wrote in a message for Muharram: Ashura lesson is the secret of the Islamic system endurance."}'::jsonb,
    '/images/gallery3.jpg',
    'culture',
    '{"fa": "۲ روز قبل", "en": "2 days ago"}'::jsonb,
    false,
    3
  )
ON CONFLICT (id) DO NOTHING;

-- 5. Latest News (آخرین اخبار)
INSERT INTO public.news_items (id, section, title, subtitle, excerpt, body, image_url, category, display_date, is_photo, position)
VALUES
  (
    'l1',
    'latest',
    '{"fa": "میادین و بازارهای میوه و تره‌بار در ایام عزاداری تعطیل است", "en": "Fruit markets closed during mourning days"}'::jsonb,
    NULL,
    '{"fa": "رئیس سازمان ساماندهی مشاغل شهری از تعطیلی میادین میوه و تره‌بار به مناسبت ایام تاسوعا و عاشورای حسینی خبر داد.", "en": "Head of Urban Jobs Organization announced closure of fruit and vegetable markets."}'::jsonb,
    '{"fa": "میادین و بازارهای میوه و تره‌بار به مناسبت ایام سوگواری تعطیل خواهند بود.", "en": "Markets will be closed during mourning days."}'::jsonb,
    '/images/hero3.jpg',
    'city',
    '{"fa": "۳ روز قبل", "en": "3 days ago"}'::jsonb,
    false,
    0
  ),
  (
    'l2',
    'latest',
    '{"fa": "شناسایی کانون‌های پرحادثه / تخطی از سرعت، قاتل خاموش معابر", "en": "Identifying accident hotspots"}'::jsonb,
    NULL,
    '{"fa": "معاون حمل‌ونقل و ترافیک از شناسایی و اولویت‌بندی نقاط پرحادثه شهر خبر داد.", "en": "Transportation Deputy announced identification of accident-prone areas."}'::jsonb,
    '{"fa": "سرعت غیرمجاز همچنان مهم‌ترین عامل وقوع تصادفات منجر به فوت در معابر شهری است.", "en": "Speeding remains the leading cause of fatal accidents."}'::jsonb,
    '/images/hero1.jpg',
    'city',
    '{"fa": "۳ روز قبل", "en": "3 days ago"}'::jsonb,
    false,
    1
  ),
  (
    'l3',
    'latest',
    '{"fa": "هنرمندان با «ترسیم عاشقی» به بدرقه می‌روند", "en": "Artists pay tribute with Drawing of Love"}'::jsonb,
    '{"fa": "پارک ملی", "en": "National Park"}'::jsonb,
    '{"fa": "ورکشاپ هنری «ترسیم عاشقی» با حضور هنرمندان برگزار شد.", "en": "An art workshop titled Drawing of Love was held with artists."}'::jsonb,
    '{"fa": "ورکشاپ هنری «ترسیم عاشقی» در محل پارک ملی با حضور هنرمندان تجسمی برگزار شد.", "en": "Art workshop held at National Park."}'::jsonb,
    '/images/gallery2.jpg',
    'culture',
    '{"fa": "۳ روز قبل", "en": "3 days ago"}'::jsonb,
    false,
    2
  ),
  (
    'l4',
    'latest',
    '{"fa": "آتش‌نشانان در ۱۲ نقطه شهر مستقر می‌شوند", "en": "Firefighters deployed at 12 city points"}'::jsonb,
    '{"fa": "حفظ ایمنی مراسم", "en": "Ceremony safety"}'::jsonb,
    '{"fa": "رئیس سازمان آتش‌نشانی از آمادگی کامل نیروها با استقرار در ۱۲ نقطه شهر خبر داد.", "en": "Head of Fire Department announced full readiness at 12 locations."}'::jsonb,
    '{"fa": "ایستگاه‌های سیار در مسیرهای اصلی مستقر خواهند بود.", "en": "Mobile stations on main routes."}'::jsonb,
    '/images/hero3.jpg',
    'society',
    '{"fa": "۳ روز قبل", "en": "3 days ago"}'::jsonb,
    false,
    3
  ),
  (
    'l5',
    'latest',
    '{"fa": "اتحاد آتش‌نشانی‌ها در مسیر تصمیم‌سازی تخصصی", "en": "Fire department unity for specialized decisions"}'::jsonb,
    NULL,
    '{"fa": "سومین نشست هم‌اندیشی رؤسای سازمان‌های آتش‌نشانی برگزار شد.", "en": "Third meeting of fire department heads was held."}'::jsonb,
    '{"fa": "نشست با هدف تقویت هماهنگی‌های تخصصی و تشکیل کمیته فنی مشترک برگزار شد.", "en": "Meeting aimed to strengthen coordination."}'::jsonb,
    '/images/gallery1.jpg',
    'city',
    '{"fa": "۳ روز قبل", "en": "3 days ago"}'::jsonb,
    false,
    4
  ),
  (
    'l6',
    'latest',
    '{"fa": "جلسه هماهنگی با موضوع مصوبه جدید شورای امنیت برگزار شد", "en": "Coordination meeting on Security Council resolution"}'::jsonb,
    '{"fa": "گزارش تصویری", "en": "Photo report"}'::jsonb,
    '{"fa": "جلسه هماهنگی با موضوع ابلاغ مصوبه جدید شورای امنیت کشور برگزار شد.", "en": "Meeting held to address new Security Council resolution."}'::jsonb,
    '{"fa": "جلسه با حضور قائم‌مقام شهردار و مدیران مناطق برگزار شد.", "en": "Meeting with Deputy Mayor and district managers."}'::jsonb,
    '/images/hero2.jpg',
    'photo',
    '{"fa": "۳ روز قبل", "en": "3 days ago"}'::jsonb,
    true,
    5
  )
ON CONFLICT (id) DO NOTHING;

-- 6. Highlights / Archive News (آرشیو اخبار)
INSERT INTO public.news_items (id, section, title, subtitle, excerpt, body, image_url, category, display_date, is_photo, position)
VALUES
  (
    'h1',
    'highlights',
    '{"fa": "طرح‌های فرهنگی به مناسبت هفته قوه قضاییه اکران شد", "en": "Cultural designs for Judiciary Week"}'::jsonb,
    NULL,
    '{"fa": "اقدام به اکران طرح‌های فرهنگی در سطح شهر شده است.", "en": "Cultural designs displayed throughout the city."}'::jsonb,
    '{"fa": "طرح‌ها با هدف ترویج فرهنگ قضایی و آگاهی‌بخشی طراحی و نصب شده‌اند.", "en": "Designs promote judicial culture."}'::jsonb,
    '/images/gallery2.jpg',
    'culture',
    '{"fa": "۳ روز قبل", "en": "3 days ago"}'::jsonb,
    false,
    0
  ),
  (
    'h2',
    'highlights',
    '{"fa": "فرصت تعیین تکلیف آرای تخریب ساختمان‌ها تا پایان سال", "en": "Settle demolition orders until year end"}'::jsonb,
    '{"fa": "قائم‌مقام شهردار", "en": "Deputy Mayor"}'::jsonb,
    '{"fa": "ابلاغ مصوبه جدید شورای امنیت کشور برای تعیین تکلیف پرونده‌های تخریب.", "en": "New resolution for demolition order settlement."}'::jsonb,
    '{"fa": "مالکان می‌توانند تا پایان سال از فرصت قانونی استفاده کنند.", "en": "Owners can use legal opportunity until year end."}'::jsonb,
    '/images/hero1.jpg',
    'city',
    '{"fa": "۳ روز قبل", "en": "3 days ago"}'::jsonb,
    false,
    1
  ),
  (
    'h3',
    'highlights',
    '{"fa": "ساعات فعالیت پارک مادر و کودک اعلام می‌شود", "en": "Mother and Child Park hours announced"}'::jsonb,
    NULL,
    '{"fa": "ساعت فعالیت پارک «مادر و کودک» متعاقباً اعلام خواهد شد.", "en": "Park hours will be announced."}'::jsonb,
    '{"fa": "این پارک با امکانات ویژه برای مادران و کودکان طراحی شده است.", "en": "Park designed for mothers and children."}'::jsonb,
    '/images/hero2.jpg',
    'society',
    '{"fa": "۵ روز قبل", "en": "5 days ago"}'::jsonb,
    false,
    2
  ),
  (
    'h4',
    'highlights',
    '{"fa": "درخشش کارکنان شهرداری در لیگ ملی خلاقیت کلانشهرها", "en": "Municipality staff shine in Creativity League"}'::jsonb,
    NULL,
    '{"fa": "کارکنان در دومین جشنواره ملی لیگ خلاقیت رتبه‌های برتر کسب کردند.", "en": "Staff achieved top ranks at Creativity League."}'::jsonb,
    '{"fa": "توانمندی در نوآوری و مدیریت هوشمند شهری به نمایش گذاشته شد.", "en": "Innovation and smart urban management showcased."}'::jsonb,
    '/images/gallery3.jpg',
    'society',
    '{"fa": "۴ روز قبل", "en": "4 days ago"}'::jsonb,
    false,
    3
  ),
  (
    'h5',
    'highlights',
    '{"fa": "تعلل در آموزش راهبر و خرید رام قطار توجیه‌پذیر نیست", "en": "Delay in driver training unacceptable"}'::jsonb,
    '{"fa": "کمیسیون حقوقی شورای شهر", "en": "City Council Legal Commission"}'::jsonb,
    '{"fa": "بر ضرورت تامین راهبر و رام قطار به تعداد مورد نیاز تاکید شد.", "en": "Need for adequate train drivers emphasized."}'::jsonb,
    '{"fa": "مدیریت حمل و نقل ریلی بدون تامین راهبر و رام قطار به تعداد کافی ممکن نیست.", "en": "Rail management impossible without adequate resources."}'::jsonb,
    '/images/hero3.jpg',
    'city',
    '{"fa": "۴ روز قبل", "en": "4 days ago"}'::jsonb,
    false,
    4
  ),
  (
    'h6',
    'highlights',
    '{"fa": "نمادهای محرم در شهر به جلوه درآمدند", "en": "Muharram symbols displayed in the city"}'::jsonb,
    NULL,
    '{"fa": "۱۰ المان حجمی و ۷۰ المان نوری به مناسبت ماه محرم نصب شد.", "en": "10 volumetric and 70 light elements installed."}'::jsonb,
    '{"fa": "المان‌ها برای ایجاد حال و هوای معنوی در سطح شهر نصب شده‌اند.", "en": "Elements installed for spiritual atmosphere."}'::jsonb,
    '/images/gallery1.jpg',
    'photo',
    '{"fa": "۵ روز قبل", "en": "5 days ago"}'::jsonb,
    true,
    5
  )
ON CONFLICT (id) DO NOTHING;

-- 7. Gallery Images (نگارخانه)
INSERT INTO public.gallery_images (id, src, label, span, position, created_at)
VALUES
  ('gallery_1', '/images/hero1.jpg', '{"fa": "کوه‌های البرز", "en": "Alborz Mountains"}'::jsonb, 'col-span-12 md:col-span-7 row-span-2 aspect-[16/11] md:aspect-auto md:h-[520px]', 0, NOW() - INTERVAL '30 days'),
  ('gallery_2', '/images/gallery1.jpg', '{"fa": "بهار البرز", "en": "Spring of Alborz"}'::jsonb, 'col-span-6 md:col-span-5 aspect-square md:h-[250px]', 1, NOW() - INTERVAL '25 days'),
  ('gallery_3', '/images/hero3.jpg', '{"fa": "دریاچه و طبیعت", "en": "Lake & Nature"}'::jsonb, 'col-span-6 md:col-span-5 aspect-square md:h-[250px]', 2, NOW() - INTERVAL '20 days'),
  ('gallery_4', '/images/gallery2.jpg', '{"fa": "پارک‌های شهری", "en": "City Parks"}'::jsonb, 'col-span-6 md:col-span-4 aspect-square md:h-[280px]', 3, NOW() - INTERVAL '15 days'),
  ('gallery_5', '/images/gallery3.jpg', '{"fa": "نمای شبانه شهر", "en": "Night Cityscape"}'::jsonb, 'col-span-6 md:col-span-4 aspect-square md:h-[280px]', 4, NOW() - INTERVAL '10 days'),
  ('gallery_6', '/images/hero2.jpg', '{"fa": "غروب شهر", "en": "City Sunset"}'::jsonb, 'col-span-12 md:col-span-4 aspect-[16/9] md:h-[280px]', 5, NOW() - INTERVAL '5 days')
ON CONFLICT (id) DO NOTHING;

-- Verification Query (optional - run this to check counts)
SELECT 'site_settings' as table_name, COUNT(*) as count FROM public.site_settings
UNION ALL
SELECT 'nav_items', COUNT(*) FROM public.nav_items
UNION ALL
SELECT 'breaking_news', COUNT(*) FROM public.breaking_news
UNION ALL
SELECT 'news_items', COUNT(*) FROM public.news_items
UNION ALL
SELECT 'gallery_images', COUNT(*) FROM public.gallery_images;
