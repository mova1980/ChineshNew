import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { translations, type Lang, type Dict } from "../i18n";
import type { SiteData, NewsItem, GalleryImage, NavItem, HeroConfig, HeroCards } from "../data/store";
import { loadSiteData, saveSiteData, defaultData } from "../data/store";
import {
  addRemoteNewsletter,
  clearRemoteNewsletter,
  deleteRemoteBreaking,
  deleteRemoteGallery,
  deleteRemoteNews,
  fetchRemoteSiteData,
  saveRemoteBreaking,
  saveRemoteGallery,
  saveRemoteHero,
  saveRemoteNav,
  saveRemoteNews,
  syncInitialData,
} from "../lib/db";
import { ADMIN_EMAIL, isSupabaseConfigured, supabase } from "../lib/supabase";

type User = { name: string; email: string; avatar?: string; provider?: "google" | "email" } | null;

const ADMIN_PASS_STORAGE_KEY = "chinesh_admin_pass";
const DEFAULT_ADMIN_PASS = "123";

function getAdminPassword(): string {
  try {
    return localStorage.getItem(ADMIN_PASS_STORAGE_KEY) || DEFAULT_ADMIN_PASS;
  } catch {
    return DEFAULT_ADMIN_PASS;
  }
}

type Ctx = {
  lang: Lang;
  dir: "rtl" | "ltr";
  t: Dict;
  setLang: (l: Lang) => void;
  user: User;
  login: (u: NonNullable<User>) => void;
  logout: () => void;
  loginOpen: boolean;
  setLoginOpen: (b: boolean) => void;
  data: SiteData;
  setData: (d: SiteData) => void;
  adminAuth: boolean;
  setAdminAuth: (b: boolean) => void;
  adminPass: string;
  setAdminPass: (p: string) => void;
  verifyAdminPass: (p: string) => boolean;
  adminSignIn: (username: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  changeAdminPassword: (current: string, next: string) => Promise<{ ok: boolean; error?: string }>;
  addNews: (section: "featured" | "latest" | "highlights", item: NewsItem) => void;
  updateNews: (section: "featured" | "latest" | "highlights", id: string, item: NewsItem) => void;
  deleteNews: (section: "featured" | "latest" | "highlights", id: string) => void;
  addGallery: (g: GalleryImage) => void;
  updateGallery: (idx: number, g: GalleryImage) => void;
  deleteGallery: (idx: number) => void;
  addBreaking: (t: { fa: string; en: string }) => void;
  updateBreaking: (idx: number, t: { fa: string; en: string }) => void;
  deleteBreaking: (idx: number) => void;
  updateNav: (idx: number, item: NavItem) => void;
  addNewsletter: (email: string) => void;
  clearNewsletter: () => void;
  updateHero: (h: Partial<HeroConfig>) => void;
  updateHeroCards: (c: Partial<HeroCards>) => void;
};

const AppContext = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fa");
  const [user, setUser] = useState<User>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [data, setDataState] = useState<SiteData>(defaultData);
  const [adminAuth, setAdminAuthState] = useState(false);
  const [adminPass, setAdminPassState] = useState<string>(DEFAULT_ADMIN_PASS);

  const dir = lang === "fa" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  useEffect(() => {
    const local = loadSiteData();
    setDataState(local);
    const saved = localStorage.getItem("chinesh_user");
    if (saved) setUser(JSON.parse(saved));
    const sl = localStorage.getItem("chinesh_lang") as Lang | null;
    if (sl) setLangState(sl);
    const aa = localStorage.getItem("chinesh_admin") === "1";
    setAdminAuthState(aa);
    setAdminPassState(getAdminPassword());

    // If Supabase is configured, hydrate the whole site from the database.
    if (isSupabaseConfigured && supabase) {
      console.log("[Chinesh] Supabase is configured — loading from database...");
      (async () => {
        try {
          const { data: sessionData } = await supabase.auth.getSession();
          const isSignedIn = Boolean(sessionData.session);
          if (isSignedIn) {
            setAdminAuthState(true);
            console.log("[Chinesh] Admin session detected");
            await syncInitialData(local);
          }

          const remote = await fetchRemoteSiteData();
          if (remote) {
            console.log("[Chinesh] Loaded from Supabase:", {
              featured: remote.featured.length,
              latest: remote.latest.length,
              highlights: remote.highlights.length,
              breaking: remote.breaking.length,
              gallery: remote.gallery.length,
              nav: remote.nav.length,
            });
            setDataState(remote);
            saveSiteData(remote);
          } else {
            console.warn("[Chinesh] Supabase returned empty data; using local");
          }
        } catch (error) {
          console.error("[Chinesh] Supabase load failed:", error);
        }
      })();
    } else {
      console.log("[Chinesh] Supabase NOT configured — using localStorage only");
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("chinesh_lang", l);
  };

  const setData = useCallback((d: SiteData) => {
    setDataState(d);
    saveSiteData(d);
  }, []);

  const login = (u: NonNullable<User>) => {
    setUser(u);
    localStorage.setItem("chinesh_user", JSON.stringify(u));
    setLoginOpen(false);
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem("chinesh_user");
  };

  const setAdminAuth = (b: boolean) => {
    setAdminAuthState(b);
    localStorage.setItem("chinesh_admin", b ? "1" : "0");
    if (!b && isSupabaseConfigured && supabase) {
      supabase.auth.signOut().catch(() => undefined);
    }
  };

  const setAdminPass = (p: string) => {
    setAdminPassState(p);
    localStorage.setItem(ADMIN_PASS_STORAGE_KEY, p);
  };

  const verifyAdminPass = (p: string) => p === getAdminPassword();

  const adminSignIn = async (username: string, password: string) => {
    if (username !== "admin") {
      return { ok: false, error: "نام کاربری یا رمز عبور اشتباه است" };
    }

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signInWithPassword({
        email: ADMIN_EMAIL,
        password,
      });
      if (error) return { ok: false, error: "ورود ناموفق بود. کاربر ادمین Supabase یا رمز عبور را بررسی کنید." };
      setAdminAuth(true);
      return { ok: true };
    }

    if (!verifyAdminPass(password)) {
      return { ok: false, error: "نام کاربری یا رمز عبور اشتباه است" };
    }
    setAdminAuth(true);
    return { ok: true };
  };

  const changeAdminPassword = async (current: string, next: string) => {
    if (isSupabaseConfigured && supabase) {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email: ADMIN_EMAIL, password: current });
      if (signInError) return { ok: false, error: "رمز فعلی اشتباه است" };
      const { error } = await supabase.auth.updateUser({ password: next });
      if (error) return { ok: false, error: "تغییر رمز در Supabase انجام نشد" };
      return { ok: true };
    }
    if (!verifyAdminPass(current)) return { ok: false, error: "رمز فعلی اشتباه است" };
    setAdminPass(next);
    return { ok: true };
  };

  const addNews = (section: "featured" | "latest" | "highlights", item: NewsItem) => {
    const next = { ...data, [section]: [item, ...data[section]] };
    setData(next);
    saveRemoteNews(section, item, 0).catch(console.error);
  };
  const updateNews = (section: "featured" | "latest" | "highlights", id: string, item: NewsItem) => {
    const next = { ...data, [section]: data[section].map((n) => (n.id === id ? item : n)) };
    setData(next);
    saveRemoteNews(section, item, data[section].findIndex((n) => n.id === id)).catch(console.error);
  };
  const deleteNews = (section: "featured" | "latest" | "highlights", id: string) => {
    setData({ ...data, [section]: data[section].filter((n) => n.id !== id) });
    deleteRemoteNews(id).catch(console.error);
  };

  const addGallery = (g: GalleryImage) => {
    setData({ ...data, gallery: [g, ...data.gallery] });
    saveRemoteGallery(g, 0).then((saved) => {
      if (!saved) return;
      setDataState((prev) => ({ ...prev, gallery: [saved, ...prev.gallery.filter((x) => x !== g)] }));
    }).catch(console.error);
  };
  const updateGallery = (idx: number, g: GalleryImage) => {
    const gallery = [...data.gallery];
    gallery[idx] = g;
    setData({ ...data, gallery });
    saveRemoteGallery(g, idx).catch(console.error);
  };
  const deleteGallery = (idx: number) => {
    const target = data.gallery[idx];
    setData({ ...data, gallery: data.gallery.filter((_, i) => i !== idx) });
    deleteRemoteGallery(target?.id).catch(console.error);
  };

  const addBreaking = (t: { fa: string; en: string }) => {
    setData({ ...data, breaking: [t, ...data.breaking] });
    saveRemoteBreaking(t, 0).catch(console.error);
  };
  const updateBreaking = (idx: number, t: { fa: string; en: string }) => {
    const breaking = [...data.breaking];
    breaking[idx] = { ...breaking[idx], ...t };
    setData({ ...data, breaking });
    saveRemoteBreaking(breaking[idx], idx).catch(console.error);
  };
  const deleteBreaking = (idx: number) => {
    const target = data.breaking[idx];
    setData({ ...data, breaking: data.breaking.filter((_, i) => i !== idx) });
    deleteRemoteBreaking(target?.id).catch(console.error);
  };

  const updateNav = (idx: number, item: NavItem) => {
    const nav = [...data.nav];
    nav[idx] = item;
    setData({ ...data, nav });
    saveRemoteNav(item, idx).catch(console.error);
  };

  const addNewsletter = (email: string) => {
    setData({ ...data, newsletter: [{ email, date: new Date().toISOString() }, ...data.newsletter] });
    addRemoteNewsletter(email).catch(console.error);
  };
  const clearNewsletter = () => {
    setData({ ...data, newsletter: [] });
    clearRemoteNewsletter().catch(console.error);
  };

  const updateHero = (h: Partial<HeroConfig>) => {
    const hero = { ...data.hero, ...h };
    setData({ ...data, hero });
    saveRemoteHero(hero, data.heroCards).catch(console.error);
  };

  const updateHeroCards = (c: Partial<HeroCards>) => {
    const heroCards = { ...data.heroCards, ...c };
    setData({ ...data, heroCards });
    saveRemoteHero(data.hero, heroCards).catch(console.error);
  };

  return (
    <AppContext.Provider
      value={{
        lang, dir, t: translations[lang], setLang,
        user, login, logout, loginOpen, setLoginOpen,
        data, setData,
        adminAuth, setAdminAuth,
        adminPass, setAdminPass, verifyAdminPass, adminSignIn, changeAdminPassword,
        addNews, updateNews, deleteNews,
        addGallery, updateGallery, deleteGallery,
        addBreaking, updateBreaking, deleteBreaking,
        updateNav,
        addNewsletter, clearNewsletter,
        updateHero, updateHeroCards,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
}
