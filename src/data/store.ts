// Site data store — fully offline, all images local

export type NavKey = "home" | "news" | "articles" | "media" | "city" | "club" | "about" | "contact";

export type NavItem = { id?: string; key: NavKey; label: { fa: string; en: string }; href: string; position?: number };

export type NewsItem = {
  id: string;
  title: { fa: string; en: string };
  subtitle?: { fa: string; en: string };
  excerpt: { fa: string; en: string };
  body?: { fa: string; en: string };
  image: string;
  category: "city" | "culture" | "society" | "economy" | "sport" | "photo";
  date: { fa: string; en: string };
  isPhoto?: boolean;
  featured?: boolean;
  highlight?: boolean;
  section?: "featured" | "latest" | "highlights";
  createdAt?: string;
  updatedAt?: string;
};

export type GalleryImage = { id?: string; src: string; label: { fa: string; en: string }; span: string; position?: number };

export type HeroCards = {
  top: { fa: string; en: string };
  bottom: { fa: string; en: string };
  caption: { fa: string; en: string };
  captionSub: { fa: string; en: string };
};

export type HeroConfig = {
  eyebrow: { fa: string; en: string };
  title1: { fa: string; en: string };
  titleAccent: { fa: string; en: string };
  title2: { fa: string; en: string };
  desc: { fa: string; en: string };
};

export type SiteData = {
  featured: NewsItem[];
  latest: NewsItem[];
  highlights: NewsItem[];
  breaking: { id?: string; fa: string; en: string; position?: number }[];
  gallery: GalleryImage[];
  nav: NavItem[];
  newsletter: { id?: string; email: string; date: string }[];
  hero: HeroConfig;
  heroCards: HeroCards;
};

export const defaultHeroConfig: HeroConfig = {
  eyebrow: { fa: "پایگاه اطلاع رسانی مدیریت شهری", en: "Urban Management News Portal" },
  title1: { fa: "بینشی نو در", en: "A new insight in" },
  titleAccent: { fa: "خبر", en: "News" },
  title2: { fa: "", en: "" },
  desc: { fa: "آخرین اخبار، تحلیل ها و گزارش ها را از پایگاه خبری چینش دنبال کنید", en: "Follow the latest news, analyses and reports from Chinesh news portal" },
};

export const defaultHeroCards: HeroCards = {
  top: { fa: "افتتاح پروژه‌های عمرانی شهر", en: "Urban development projects inaugurated" },
  bottom: { fa: "گزارش لحظه‌ای", en: "Live report", },
  caption: { fa: "زیبایی‌های شهر", en: "City Beauty" },
  captionSub: { fa: "البرز، نگین ایران", en: "Alborz, the gem of Iran" },
};

// Placeholder image for news without custom image
const PH = "/images/news-placeholder.jpg";

export const defaultData: SiteData = {
  nav: [
    { key: "home", label: { fa: "خانه", en: "Home" }, href: "#home" },
    { key: "news", label: { fa: "اخبار", en: "News" }, href: "#news" },
    { key: "articles", label: { fa: "مقالات", en: "Articles" }, href: "#archive/all" },
    { key: "media", label: { fa: "نگارخانه", en: "Gallery" }, href: "#media" },
    { key: "city", label: { fa: "مدیریت شهری", en: "City Management" }, href: "#archive/city" },
    { key: "club", label: { fa: "کلوپ چینش", en: "Chinesh Club" }, href: "#club" },
    { key: "about", label: { fa: "درباره ما", en: "About" }, href: "#about" },
    { key: "contact", label: { fa: "تماس", en: "Contact" }, href: "#about" },
  ],
  featured: [
    {
      id: "n1",
      title: {
        fa: "حماسه تاسوعا و عاشورا الگوی ایستادگی برابر جبهه استکبار است",
        en: "Tasua and Ashura: A symbol of resistance against arrogance",
      },
      excerpt: {
        fa: "شهردار در آستانه فرارسیدن ایام تاسوعا و عاشورای حسینی، با تسلیت این ایام به عموم شهروندان، حماسه عاشورا را الگویی جاودان برای ایستادگی در برابر جبهه استکبار دانست.",
        en: "Mayor offered condolences to citizens and described the epic of Ashura as an eternal model of standing against arrogance.",
      },
      body: {
        fa: "شهردار در آستانه فرارسیدن ایام تاسوعا و عاشورای حسینی، با تسلیت این ایام به عموم شهروندان، حماسه عاشورا را الگویی جاودان برای ایستادگی در برابر جبهه استکبار دانست. وی با تأکید بر لزوم پاسداشت ارزش‌های عاشورایی در مدیریت شهری، از برنامه‌های ویژه فرهنگی و عمرانی شهرداری در این ایام خبر داد.",
        en: "The Mayor, marking the approaching days of Tasua and Ashura, offered condolences and described the epic of Ashura as an eternal model of resistance.",
      },
      image: PH,
      category: "society",
      date: { fa: "امروز", en: "Today" },
    },
    {
      id: "n2",
      title: {
        fa: "دستگاه قضا عامل تقویت سلامت اداری و بهبود خدمات‌رسانی به مردم است",
        en: "Judiciary, a factor in strengthening administrative health",
      },
      excerpt: {
        fa: "شهردار گفت: دستگاه قضا عامل تقویت سلامت اداری و بهبود خدمتگزاری به مردم شریف است و حل بسیاری از معضلات شهری بدون همراهی این دستگاه ممکن نیست.",
        en: "Mayor stated: The judiciary is a factor in strengthening administrative health and improving service to the noble people.",
      },
      body: {
        fa: "شهردار در دیدار با مسئولین قضایی استان، بر اهمیت تعامل سازنده میان مدیریت شهری و دستگاه قضا تأکید کرد. وی گفت حل بسیاری از معضلات شهری بدون همراهی قوه قضاییه ممکن نیست.",
        en: "The Mayor emphasized constructive interaction between urban management and judiciary in a meeting with judicial officials.",
      },
      image: "/images/gallery1.jpg",
      category: "city",
      date: { fa: "دیروز", en: "Yesterday" },
    },
    {
      id: "n3",
      title: {
        fa: "رئیس‌جمهور از آتش‌نشان تجلیل کرد / قدردانی از فداکاری‌های سرخ‌پوشان",
        en: "President honored firefighter / Appreciation of red uniforms",
      },
      subtitle: { fa: "در جمع آتش‌نشانان برگزیده کشور", en: "Among top firefighters" },
      excerpt: {
        fa: "رئیس جمهور در آیین ملی پاسداشت آتش‌نشانان فداکار، از آتش‌نشان شایسته و پرتلاش شهرداری تجلیل کرد.",
        en: "The President honored the dedicated firefighter at the national ceremony.",
      },
      body: {
        fa: "در آیین ملی پاسداشت آتش‌نشانان فداکار کشور که با حضور رئیس جمهور برگزار شد، از آتش‌نشانان شایسته و پرتلاش تجلیل به عمل آمد.",
        en: "At the national ceremony honoring dedicated firefighters, outstanding firefighters were honored by the President.",
      },
      image: "/images/hero2.jpg",
      category: "society",
      date: { fa: "۲ روز قبل", en: "2 days ago" },
    },
    {
      id: "n4",
      title: { fa: "درس عاشورا، رمز ماندگاری نظام اسلامی است", en: "Ashura's lesson is the secret of Islamic system's endurance" },
      subtitle: { fa: "شهردار", en: "Mayor" },
      excerpt: {
        fa: "شهردار با صدور پیامی به مناسبت آغاز ماه محرم‌الحرام، درس عاشورا را رمز ماندگاری نظام دانست.",
        en: "Mayor issued a statement marking Muharram, describing Ashura's lesson as the secret of endurance.",
      },
      body: {
        fa: "شهردار در پیامی به مناسبت آغاز ماه محرم‌الحرام نوشت: درس عاشورا رمز ماندگاری نظام اسلامی است.",
        en: "The Mayor wrote in a message for Muharram: Ashura's lesson is the secret of the Islamic system's endurance.",
      },
      image: "/images/gallery3.jpg",
      category: "culture",
      date: { fa: "۲ روز قبل", en: "2 days ago" },
    },
  ],
  latest: [
    {
      id: "l1",
      title: { fa: "میادین و بازارهای میوه و تره‌بار در ایام عزاداری تعطیل است", en: "Fruit markets closed during mourning days" },
      excerpt: {
        fa: "رئیس سازمان ساماندهی مشاغل شهری از تعطیلی میادین میوه و تره‌بار به مناسبت ایام تاسوعا و عاشورای حسینی خبر داد.",
        en: "Head of Urban Jobs Organization announced closure of fruit and vegetable markets.",
      },
      body: { fa: "میادین و بازارهای میوه و تره‌بار به مناسبت ایام سوگواری تعطیل خواهند بود.", en: "Markets will be closed during mourning days." },
      image: PH,
      category: "city",
      date: { fa: "۳ روز قبل", en: "3 days ago" },
    },
    {
      id: "l2",
      title: { fa: "شناسایی کانون‌های پرحادثه / تخطی از سرعت، قاتل خاموش معابر", en: "Identifying accident hotspots" },
      excerpt: {
        fa: "معاون حمل‌ونقل و ترافیک از شناسایی و اولویت‌بندی نقاط پرحادثه شهر خبر داد.",
        en: "Transportation Deputy announced identification of accident-prone areas.",
      },
      body: { fa: "سرعت غیرمجاز همچنان مهم‌ترین عامل وقوع تصادفات منجر به فوت در معابر شهری است.", en: "Speeding remains the leading cause of fatal accidents." },
      image: "/images/hero1.jpg",
      category: "city",
      date: { fa: "۳ روز قبل", en: "3 days ago" },
    },
    {
      id: "l3",
      title: { fa: "هنرمندان با «ترسیم عاشقی» به بدرقه می‌روند", en: "Artists pay tribute with 'Drawing of Love'" },
      subtitle: { fa: "پارک ملی", en: "National Park" },
      excerpt: {
        fa: "ورکشاپ هنری «ترسیم عاشقی» با حضور هنرمندان برگزار شد.",
        en: "An art workshop titled 'Drawing of Love' was held with artists.",
      },
      body: { fa: "ورکشاپ هنری «ترسیم عاشقی» در محل پارک ملی با حضور هنرمندان تجسمی برگزار شد.", en: "Art workshop held at National Park." },
      image: "/images/gallery2.jpg",
      category: "culture",
      date: { fa: "۳ روز قبل", en: "3 days ago" },
    },
    {
      id: "l4",
      title: { fa: "آتش‌نشانان در ۱۲ نقطه شهر مستقر می‌شوند", en: "Firefighters deployed at 12 city points" },
      subtitle: { fa: "حفظ ایمنی مراسم", en: "Ceremony safety" },
      excerpt: {
        fa: "رئیس سازمان آتش‌نشانی از آمادگی کامل نیروها با استقرار در ۱۲ نقطه شهر خبر داد.",
        en: "Head of Fire Department announced full readiness at 12 locations.",
      },
      body: { fa: "ایستگاه‌های سیار در مسیرهای اصلی مستقر خواهند بود.", en: "Mobile stations on main routes." },
      image: "/images/hero3.jpg",
      category: "society",
      date: { fa: "۳ روز قبل", en: "3 days ago" },
    },
    {
      id: "l5",
      title: { fa: "اتحاد آتش‌نشانی‌ها در مسیر تصمیم‌سازی تخصصی", en: "Fire department unity for specialized decisions" },
      excerpt: {
        fa: "سومین نشست هم‌اندیشی رؤسای سازمان‌های آتش‌نشانی برگزار شد.",
        en: "Third meeting of fire department heads was held.",
      },
      body: { fa: "نشست با هدف تقویت هماهنگی‌های تخصصی و تشکیل کمیته فنی مشترک برگزار شد.", en: "Meeting aimed to strengthen coordination." },
      image: "/images/gallery1.jpg",
      category: "city",
      date: { fa: "۳ روز قبل", en: "3 days ago" },
    },
    {
      id: "l6",
      title: { fa: "جلسه هماهنگی با موضوع مصوبه جدید شورای امنیت برگزار شد", en: "Coordination meeting on Security Council resolution" },
      subtitle: { fa: "گزارش تصویری", en: "Photo report" },
      excerpt: {
        fa: "جلسه هماهنگی با موضوع ابلاغ مصوبه جدید شورای امنیت کشور برگزار شد.",
        en: "Meeting held to address new Security Council resolution.",
      },
      body: { fa: "جلسه با حضور قائم‌مقام شهردار و مدیران مناطق برگزار شد.", en: "Meeting with Deputy Mayor and district managers." },
      image: PH,
      category: "photo",
      date: { fa: "۳ روز قبل", en: "3 days ago" },
      isPhoto: true,
    },
  ],
  highlights: [
    {
      id: "h1",
      title: { fa: "طرح‌های فرهنگی به مناسبت هفته قوه قضاییه اکران شد", en: "Cultural designs for Judiciary Week" },
      excerpt: { fa: "اقدام به اکران طرح‌های فرهنگی در سطح شهر شده است.", en: "Cultural designs displayed throughout the city." },
      body: { fa: "طرح‌ها با هدف ترویج فرهنگ قضایی و آگاهی‌بخشی طراحی و نصب شده‌اند.", en: "Designs promote judicial culture." },
      image: "/images/gallery2.jpg",
      category: "culture",
      date: { fa: "۳ روز قبل", en: "3 days ago" },
    },
    {
      id: "h2",
      title: { fa: "فرصت تعیین تکلیف آرای تخریب ساختمان‌ها تا پایان سال", en: "Settle demolition orders until year end" },
      subtitle: { fa: "قائم‌مقام شهردار", en: "Deputy Mayor" },
      excerpt: { fa: "ابلاغ مصوبه جدید شورای امنیت کشور برای تعیین تکلیف پرونده‌های تخریب.", en: "New resolution for demolition order settlement." },
      body: { fa: "مالکان می‌توانند تا پایان سال از فرصت قانونی استفاده کنند.", en: "Owners can use legal opportunity until year end." },
      image: PH,
      category: "city",
      date: { fa: "۳ روز قبل", en: "3 days ago" },
    },
    {
      id: "h3",
      title: { fa: "ساعات فعالیت پارک مادر و کودک اعلام می‌شود", en: "Mother and Child Park hours announced" },
      excerpt: { fa: "ساعت فعالیت پارک «مادر و کودک» متعاقباً اعلام خواهد شد.", en: "Park hours will be announced." },
      body: { fa: "این پارک با امکانات ویژه برای مادران و کودکان طراحی شده است.", en: "Park designed for mothers and children." },
      image: "/images/hero1.jpg",
      category: "society",
      date: { fa: "۵ روز قبل", en: "5 days ago" },
    },
    {
      id: "h4",
      title: { fa: "درخشش کارکنان شهرداری در لیگ ملی خلاقیت کلانشهرها", en: "Municipality staff shine in Creativity League" },
      excerpt: { fa: "کارکنان در دومین جشنواره ملی لیگ خلاقیت رتبه‌های برتر کسب کردند.", en: "Staff achieved top ranks at Creativity League." },
      body: { fa: "توانمندی در نوآوری و مدیریت هوشمند شهری به نمایش گذاشته شد.", en: "Innovation and smart urban management showcased." },
      image: "/images/gallery3.jpg",
      category: "society",
      date: { fa: "۴ روز قبل", en: "4 days ago" },
    },
    {
      id: "h5",
      title: { fa: "تعلل در آموزش راهبر و خرید رام قطار توجیه‌پذیر نیست", en: "Delay in driver training unacceptable" },
      subtitle: { fa: "کمیسیون حقوقی شورای شهر", en: "City Council Legal Commission" },
      excerpt: { fa: "بر ضرورت تامین راهبر و رام قطار به تعداد مورد نیاز تاکید شد.", en: "Need for adequate train drivers emphasized." },
      body: { fa: "مدیریت حمل و نقل ریلی بدون تامین راهبر و رام قطار به تعداد کافی ممکن نیست.", en: "Rail management impossible without adequate resources." },
      image: "/images/hero2.jpg",
      category: "city",
      date: { fa: "۴ روز قبل", en: "4 days ago" },
    },
    {
      id: "h6",
      title: { fa: "نمادهای محرم در شهر به جلوه درآمدند", en: "Muharram symbols displayed in the city" },
      excerpt: { fa: "۱۰ المان حجمی و ۷۰ المان نوری به مناسبت ماه محرم نصب شد.", en: "10 volumetric and 70 light elements installed." },
      body: { fa: "المان‌ها برای ایجاد حال و هوای معنوی در سطح شهر نصب شده‌اند.", en: "Elements installed for spiritual atmosphere." },
      image: "/images/gallery1.jpg",
      category: "photo",
      date: { fa: "۵ روز قبل", en: "5 days ago" },
      isPhoto: true,
    },
  ],
  breaking: [
    { fa: "تعیین تکلیف سینما هجرت از مطالبات مهم شهروندان است", en: "Settlement of Hejrat Cinema is an important demand" },
    { fa: "تحقق کامل بودجه‌ی مناطق در گرو رفع موانع درآمدی است", en: "Full budget realization depends on removing income obstacles" },
    { fa: "میراث «قراردادهای شکست‌خورده» مانع جذب سرمایه‌گذار است", en: "Legacy of failed contracts hinders investor attraction" },
    { fa: "پیشبرد سرمایه‌گذاری با بهره‌گیری از توان بخش خصوصی", en: "Advancing investment through private sector" },
    { fa: "افتتاح پروژه‌های عمرانی شهرداری در هفته دولت", en: "Municipality opens construction projects in Government Week" },
  ],
  gallery: [
    { src: "/images/hero1.jpg", label: { fa: "کوه‌های البرز", en: "Alborz Mountains" }, span: "col-span-12 md:col-span-7 row-span-2 aspect-[16/11] md:aspect-auto md:h-[520px]" },
    { src: "/images/gallery1.jpg", label: { fa: "بهار البرز", en: "Spring of Alborz" }, span: "col-span-6 md:col-span-5 aspect-square md:h-[250px]" },
    { src: "/images/hero3.jpg", label: { fa: "دریاچه و طبیعت", en: "Lake & Nature" }, span: "col-span-6 md:col-span-5 aspect-square md:h-[250px]" },
    { src: "/images/gallery2.jpg", label: { fa: "پارک‌های شهری", en: "City Parks" }, span: "col-span-6 md:col-span-4 aspect-square md:h-[280px]" },
    { src: "/images/gallery3.jpg", label: { fa: "نمای شبانه شهر", en: "Night Cityscape" }, span: "col-span-6 md:col-span-4 aspect-square md:h-[280px]" },
    { src: "/images/hero2.jpg", label: { fa: "غروب شهر", en: "City Sunset" }, span: "col-span-12 md:col-span-4 aspect-[16/9] md:h-[280px]" },
  ],
  newsletter: [],
  hero: { ...defaultHeroConfig },
  heroCards: { ...defaultHeroCards },
};

const STORAGE_KEY = "chinesh_site_data";
export function loadSiteData(): SiteData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return defaultData;
}
export function saveSiteData(d: SiteData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(d));
}
