import { defaultData, type GalleryImage, type HeroCards, type HeroConfig, type NavItem, type NewsItem, type SiteData } from "../data/store";
import { isSupabaseConfigured, MEDIA_BUCKET, supabase } from "./supabase";

const nowIso = () => new Date().toISOString();

function sectionOf(n: any): "featured" | "latest" | "highlights" {
  return n.section === "featured" || n.section === "latest" || n.section === "highlights"
    ? n.section
    : "latest";
}

function mapNewsRow(row: any): NewsItem {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle || undefined,
    excerpt: row.excerpt,
    body: row.body || undefined,
    image: row.image_url || "/images/news-placeholder.jpg",
    category: row.category,
    date: row.display_date || { fa: "", en: "" },
    isPhoto: Boolean(row.is_photo),
    section: sectionOf(row),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function newsToRow(section: "featured" | "latest" | "highlights", item: NewsItem, position = 0) {
  return {
    id: item.id,
    section,
    title: item.title,
    subtitle: item.subtitle || null,
    excerpt: item.excerpt,
    body: item.body || null,
    image_url: item.image,
    category: item.category,
    display_date: item.date,
    is_photo: Boolean(item.isPhoto),
    position,
    updated_at: nowIso(),
  };
}

function mapGalleryRow(row: any): GalleryImage {
  return {
    id: row.id,
    src: row.src,
    label: row.label,
    span: row.span,
    position: row.position,
  };
}

export async function fetchRemoteSiteData(): Promise<SiteData | null> {
  if (!isSupabaseConfigured || !supabase) return null;

  const [settingsRes, newsRes, galleryRes, navRes, breakingRes, newsletterRes] = await Promise.all([
    supabase.from("site_settings").select("*").eq("id", 1).maybeSingle(),
    supabase.from("news_items").select("*").order("position", { ascending: true }).order("created_at", { ascending: false }),
    supabase.from("gallery_images").select("*").order("position", { ascending: true }).order("created_at", { ascending: false }),
    supabase.from("nav_items").select("*").order("position", { ascending: true }),
    supabase.from("breaking_news").select("*").order("position", { ascending: true }).order("created_at", { ascending: false }),
    supabase.from("newsletter_subscribers").select("*").order("created_at", { ascending: false }),
  ]);

  // Log each error individually for easier debugging
  if (settingsRes.error)   console.error("[Chinesh] site_settings fetch error:", settingsRes.error);
  if (newsRes.error)       console.error("[Chinesh] news_items fetch error:", newsRes.error);
  if (galleryRes.error)    console.error("[Chinesh] gallery_images fetch error:", galleryRes.error);
  if (navRes.error)        console.error("[Chinesh] nav_items fetch error:", navRes.error);
  if (breakingRes.error)   console.error("[Chinesh] breaking_news fetch error:", breakingRes.error);
  if (newsletterRes.error) console.error("[Chinesh] newsletter_subscribers fetch error:", newsletterRes.error);

  // If ALL queries failed, give up. Otherwise continue with whatever succeeded.
  const allFailed =
    settingsRes.error && newsRes.error && galleryRes.error &&
    navRes.error && breakingRes.error && newsletterRes.error;
  if (allFailed) throw new Error("All Supabase queries failed — check RLS policies");

  const news = (newsRes.data || []).map(mapNewsRow);
  const featured = news.filter((n) => n.section === "featured");
  const latest = news.filter((n) => n.section === "latest");
  const highlights = news.filter((n) => n.section === "highlights");

  return {
    ...defaultData,
    hero: (settingsRes.data?.hero as HeroConfig) || defaultData.hero,
    heroCards: (settingsRes.data?.hero_cards as HeroCards) || defaultData.heroCards,
    nav: (navRes.data || []).map((r: any) => ({
      id: r.id,
      key: r.key,
      label: r.label,
      href: r.href,
      position: r.position,
    })) as NavItem[],
    breaking: (breakingRes.data || []).map((r: any) => ({
      id: r.id,
      fa: r.text.fa,
      en: r.text.en,
      position: r.position,
    })),
    gallery: (galleryRes.data || []).map(mapGalleryRow),
    featured,
    latest,
    highlights,
    newsletter: (newsletterRes.data || []).map((r: any) => ({
      id: r.id,
      email: r.email,
      date: r.created_at,
    })),
  };
}

export async function syncInitialData(data: SiteData) {
  if (!isSupabaseConfigured || !supabase) return;
  const remote = await fetchRemoteSiteData();
  const hasContent =
    remote &&
    (remote.featured.length || remote.latest.length || remote.highlights.length || remote.gallery.length || remote.nav.length);
  if (hasContent) return;

  await supabase.from("site_settings").upsert({ id: 1, hero: data.hero, hero_cards: data.heroCards, updated_at: nowIso() });
  await supabase.from("nav_items").upsert(
    data.nav.map((n, i) => ({
      id: n.id || n.key,
      key: n.key,
      label: n.label,
      href: n.href,
      position: i,
      updated_at: nowIso(),
    }))
  );
  await supabase.from("breaking_news").upsert(
    data.breaking.map((b, i) => ({
      id: b.id || `breaking_${i}`,
      text: { fa: b.fa, en: b.en },
      position: i,
      updated_at: nowIso(),
    }))
  );
  const allNews = [
    ...data.featured.map((n, i) => newsToRow("featured", n, i)),
    ...data.latest.map((n, i) => newsToRow("latest", n, i)),
    ...data.highlights.map((n, i) => newsToRow("highlights", n, i)),
  ];
  if (allNews.length) await supabase.from("news_items").upsert(allNews);
  if (data.gallery.length) {
    await supabase.from("gallery_images").upsert(
      data.gallery.map((g, i) => ({
        id: g.id || `gallery_${i}`,
        src: g.src,
        label: g.label,
        span: g.span,
        position: i,
        updated_at: nowIso(),
      }))
    );
  }
}

export async function saveRemoteHero(hero: HeroConfig, cards: HeroCards) {
  if (!isSupabaseConfigured || !supabase) return;
  const { error } = await supabase.from("site_settings").upsert({ id: 1, hero, hero_cards: cards, updated_at: nowIso() });
  if (error) throw error;
}

export async function saveRemoteNews(section: "featured" | "latest" | "highlights", item: NewsItem, position = 0) {
  if (!isSupabaseConfigured || !supabase) return;
  const { error } = await supabase.from("news_items").upsert(newsToRow(section, item, position));
  if (error) throw error;
}

export async function deleteRemoteNews(id: string) {
  if (!isSupabaseConfigured || !supabase) return;
  const { error } = await supabase.from("news_items").delete().eq("id", id);
  if (error) throw error;
}

export async function saveRemoteGallery(g: GalleryImage, position = 0): Promise<GalleryImage | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  const id = g.id || `gallery_${Date.now()}`;
  const { data, error } = await supabase
    .from("gallery_images")
    .upsert({ id, src: g.src, label: g.label, span: g.span, position, updated_at: nowIso() })
    .select("*")
    .single();
  if (error) throw error;
  return mapGalleryRow(data);
}

export async function deleteRemoteGallery(id?: string) {
  if (!isSupabaseConfigured || !supabase || !id) return;
  const { error } = await supabase.from("gallery_images").delete().eq("id", id);
  if (error) throw error;
}

export async function saveRemoteBreaking(item: { id?: string; fa: string; en: string }, position = 0) {
  if (!isSupabaseConfigured || !supabase) return;
  const id = item.id || `breaking_${Date.now()}`;
  const { error } = await supabase
    .from("breaking_news")
    .upsert({ id, text: { fa: item.fa, en: item.en }, position, updated_at: nowIso() });
  if (error) throw error;
}

export async function deleteRemoteBreaking(id?: string) {
  if (!isSupabaseConfigured || !supabase || !id) return;
  const { error } = await supabase.from("breaking_news").delete().eq("id", id);
  if (error) throw error;
}

export async function saveRemoteNav(item: NavItem, position = 0) {
  if (!isSupabaseConfigured || !supabase) return;
  const { error } = await supabase.from("nav_items").upsert({
    id: item.id || item.key,
    key: item.key,
    label: item.label,
    href: item.href,
    position,
    updated_at: nowIso(),
  });
  if (error) throw error;
}

export async function addRemoteNewsletter(email: string) {
  if (!isSupabaseConfigured || !supabase) return;
  const { error } = await supabase.from("newsletter_subscribers").upsert({ email }, { onConflict: "email" });
  if (error) throw error;
}

export async function clearRemoteNewsletter() {
  if (!isSupabaseConfigured || !supabase) return;
  const { error } = await supabase.from("newsletter_subscribers").delete().neq("email", "");
  if (error) throw error;
}

export async function uploadMedia(file: File): Promise<string> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
  }
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const path = `${new Date().getFullYear()}/${Date.now()}-${safeName}`;
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
  const publicUrl = data.publicUrl;
  await supabase.from("media_assets").insert({ path, public_url: publicUrl, file_name: file.name, mime_type: file.type, size: file.size });
  return publicUrl;
}
