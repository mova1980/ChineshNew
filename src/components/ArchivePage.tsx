import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock, ArrowUpRight, Search, ChevronRight, ChevronLeft,
  Filter, X, Newspaper, Image as ImageIcon,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import type { NewsItem } from "../data/store";

const PAGE_SIZE = 9;

/**
 * Full archive page with search, category filter, and pagination.
 * Accepts an optional initial category from URL hash: #archive/culture
 */
export default function ArchivePage({ initialCategory }: { initialCategory?: string }) {
  const { t, lang, data } = useApp();

  const [category, setCategory] = useState<string>(initialCategory || "all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [showFilter, setShowFilter] = useState(false);

  // Reset to first page when filters change
  useEffect(() => {
    setPage(1);
  }, [category, query]);

  useEffect(() => {
    if (initialCategory) setCategory(initialCategory);
  }, [initialCategory]);

  // Combine & de-dupe news items from all sections
  const allNews: NewsItem[] = useMemo(() => {
    const map = new Map<string, NewsItem>();
    [...data.featured, ...data.latest, ...data.highlights].forEach((n) => {
      if (!map.has(n.id)) map.set(n.id, n);
    });
    return Array.from(map.values());
  }, [data]);

  // Filter
  const filtered = useMemo(() => {
    return allNews.filter((n) => {
      if (category !== "all" && n.category !== category) return false;
      if (query.trim()) {
        const q = query.trim().toLowerCase();
        const inTitle = n.title[lang].toLowerCase().includes(q);
        const inExcerpt = n.excerpt[lang].toLowerCase().includes(q);
        const inBody = (n.body?.[lang] || "").toLowerCase().includes(q);
        if (!inTitle && !inExcerpt && !inBody) return false;
      }
      return true;
    });
  }, [allNews, category, query, lang]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const categories = [
    { id: "all", fa: "همه", en: "All" },
    { id: "city", fa: "شهری", en: "Urban" },
    { id: "culture", fa: "فرهنگی", en: "Culture" },
    { id: "society", fa: "اجتماعی", en: "Society" },
    { id: "economy", fa: "اقتصادی", en: "Economy" },
    { id: "sport", fa: "ورزشی", en: "Sport" },
    { id: "photo", fa: "تصویری", en: "Photo" },
  ];

  const cat = (c: string) => t.categories[c as keyof typeof t.categories] || c;

  return (
    <div className="min-h-screen pt-28 pb-16 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
      <div className="absolute top-40 -right-40 w-[600px] h-[600px] rounded-full bg-orange-500/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-navy-600/20 blur-[150px] pointer-events-none" />

      <div className="relative max-w-[1400px] mx-auto px-4 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-right"
        >
          <div className="flex items-center gap-2 text-sm text-white/50 mb-3">
            <a href="#home" className="hover:text-orange-400 transition-colors">
              {t.nav.home}
            </a>
            <ChevronLeft size={12} />
            <span className="text-white">{t.sections.titr3}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
            {t.sections.titr3}
          </h1>
          <p className="text-white/60 mt-3 text-base md:text-lg max-w-2xl">
            {lang === "fa"
              ? "مجموعه کامل اخبار، مقالات و گزارش‌های پایگاه خبری چینش. با فیلتر و جستجو دقیقاً همان چیزی را که می‌خواهید پیدا کنید."
              : "Complete collection of news, articles and reports of Chinesh news portal."}
          </p>
        </motion.div>

        {/* Filter bar */}
        <div className="glass rounded-2xl p-3 md:p-4 mb-6 border-white/10">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={lang === "fa" ? "جستجو در آرشیو..." : "Search archive..."}
                className="w-full h-11 pr-10 pl-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 outline-none focus:border-orange-500 transition-colors text-sm"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Mobile filter toggle */}
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="md:hidden flex items-center gap-2 h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white/80 text-sm"
            >
              <Filter size={14} /> فیلتر
            </button>

            {/* Category chips — desktop */}
            <div className="hidden md:flex items-center gap-1.5 flex-wrap">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className={`px-3.5 h-9 rounded-full text-xs font-medium transition-all ${
                    category === c.id
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30"
                      : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10"
                  }`}
                >
                  {c[lang]}
                </button>
              ))}
            </div>
          </div>

          {/* Category chips — mobile */}
          <AnimatePresence>
            {showFilter && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden overflow-hidden"
              >
                <div className="flex items-center gap-1.5 flex-wrap pt-3 mt-3 border-t border-white/10">
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => { setCategory(c.id); setShowFilter(false); }}
                      className={`px-3 h-8 rounded-full text-xs font-medium transition-all ${
                        category === c.id
                          ? "bg-orange-500 text-white"
                          : "bg-white/5 text-white/70 border border-white/10"
                      }`}
                    >
                      {c[lang]}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results info */}
        <div className="flex items-center justify-between mb-5 text-xs text-white/60">
          <div>
            {filtered.length} {lang === "fa" ? "خبر یافت شد" : "results"}
            {category !== "all" && (
              <span className="mr-2">
                — {lang === "fa" ? "دسته:" : "Category:"}{" "}
                <span className="text-orange-300">{categories.find(c => c.id === category)?.[lang]}</span>
              </span>
            )}
          </div>
          {totalPages > 1 && (
            <div>
              {lang === "fa" ? "صفحه" : "Page"} <span className="text-white">{page}</span> {lang === "fa" ? "از" : "of"}{" "}
              <span className="text-white">{totalPages}</span>
            </div>
          )}
        </div>

        {/* Results grid */}
        {pageItems.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-white/10 rounded-3xl">
            <Newspaper size={48} className="mx-auto mb-4 text-white/20" />
            <p className="text-white/50">
              {lang === "fa" ? "خبری با این معیارها یافت نشد" : "No news matches your criteria"}
            </p>
            <button
              onClick={() => { setCategory("all"); setQuery(""); }}
              className="mt-4 text-sm text-orange-400 hover:text-orange-300"
            >
              {lang === "fa" ? "پاک کردن فیلترها" : "Clear filters"}
            </button>
          </div>
        ) : (
          <motion.div
            layout
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            <AnimatePresence mode="popLayout">
              {pageItems.map((n, i) => (
                <motion.a
                  key={n.id}
                  layout
                  href={`#news/${n.id}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: (i % 3) * 0.08 }}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-navy-900/40 hover:border-orange-500/40 transition-all sweep flex flex-col cursor-pointer"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={n.image}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => { (e.target as HTMLImageElement).src = "/images/news-placeholder.jpg"; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent opacity-80" />
                    <div className="absolute top-3 right-3 flex gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-navy-900/80 backdrop-blur text-white text-[10px] font-bold border border-white/10">
                        {cat(n.category)}
                      </span>
                      {n.isPhoto && (
                        <span className="px-2.5 py-1 rounded-full bg-orange-500/90 text-white text-[10px] font-bold flex items-center gap-1">
                          <ImageIcon size={10} /> {lang === "fa" ? "تصویری" : "Photo"}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col text-right">
                    {n.subtitle && (
                      <div className="text-[10px] text-orange-400 mb-1.5">{n.subtitle[lang]}</div>
                    )}
                    <h3 className="font-bold text-white leading-snug line-clamp-2 group-hover:text-orange-300 transition-colors mb-2">
                      {n.title[lang]}
                    </h3>
                    <p className="text-xs text-white/60 line-clamp-2 mb-4 flex-1">{n.excerpt[lang]}</p>
                    <div className="flex items-center justify-between text-xs text-white/50">
                      <div className="flex items-center gap-1.5">
                        <Clock size={11} />
                        <span>{n.date[lang]}</span>
                      </div>
                      <span className="text-orange-400 group-hover:-translate-x-1 transition-transform flex items-center gap-1">
                        <ArrowUpRight size={12} /> {t.sections.readMore}
                      </span>
                    </div>
                  </div>
                </motion.a>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1 mt-10">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-orange-500/20 hover:border-orange-500/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
              const nearby = Math.abs(p - page) <= 1 || p === 1 || p === totalPages;
              const showEllipsis =
                (p === 2 && page > 4) || (p === totalPages - 1 && page < totalPages - 3);
              if (showEllipsis) {
                return (
                  <span key={p} className="w-10 h-10 flex items-center justify-center text-white/40">
                    …
                  </span>
                );
              }
              if (!nearby) return null;
              return (
                <button
                  key={p}
                  onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className={`w-10 h-10 rounded-full text-sm font-bold transition-all ${
                    page === p
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/40"
                      : "bg-white/5 border border-white/10 text-white hover:bg-orange-500/20 hover:border-orange-500/40"
                  }`}
                >
                  {lang === "fa" ? p.toLocaleString("fa-IR") : p}
                </button>
              );
            })}
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-orange-500/20 hover:border-orange-500/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
