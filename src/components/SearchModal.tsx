import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Clock, ArrowUpLeft } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { data, lang } = useApp();
  const [query, setQuery] = useState("");

  const allNews = useMemo(() => {
    return [...data.featured, ...data.latest, ...data.highlights];
  }, [data]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    return allNews.filter((n) => {
      const t = n.title[lang].toLowerCase();
      const e = n.excerpt[lang].toLowerCase();
      const b = n.body?.[lang]?.toLowerCase() || "";
      return t.includes(q) || e.includes(q) || b.includes(q);
    });
  }, [query, allNews, lang]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-navy-950/90 backdrop-blur-lg flex items-start justify-center pt-24 md:pt-32 px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl glass rounded-3xl shadow-2xl overflow-hidden"
            dir="rtl"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
              <Search size={20} className="text-orange-400 shrink-0" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={lang === "fa" ? "جستجو در اخبار، مقالات و آرشیو..." : "Search news, articles and archive..."}
                className="flex-1 bg-transparent text-white placeholder-white/40 outline-none text-base"
              />
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-orange-500/30 text-white flex items-center justify-center transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto">
              {query.trim() === "" ? (
                <div className="p-8 text-center text-white/40 text-sm">
                  <Search size={32} className="mx-auto mb-3 opacity-30" />
                  {lang === "fa" ? "عبارت مورد نظر را تایپ کنید" : "Type your search query"}
                </div>
              ) : results.length === 0 ? (
                <div className="p-8 text-center text-white/40 text-sm">
                  <Search size={32} className="mx-auto mb-3 opacity-30" />
                  {lang === "fa" ? "نتیجه‌ای یافت نشد" : "No results found"}
                </div>
              ) : (
                <div className="p-3 space-y-2">
                  <div className="px-3 py-1 text-[10px] text-white/40 uppercase tracking-wider">
                    {results.length} {lang === "fa" ? "نتیجه" : "result"}
                  </div>
                  {results.map((n) => (
                    <a
                      key={n.id}
                      href={`#news/${n.id}`}
                      onClick={onClose}
                      className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 hover:bg-orange-500/10 border border-white/5 hover:border-orange-500/20 transition-all group"
                    >
                      <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-navy-800">
                        <img
                          src={n.image}
                          alt=""
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = "/images/news-placeholder.jpg"; }}
                        />
                      </div>
                      <div className="flex-1 min-w-0 text-right">
                        <h4 className="text-sm font-bold text-white truncate group-hover:text-orange-300 transition-colors">
                          {n.title[lang]}
                        </h4>
                        <p className="text-[11px] text-white/50 line-clamp-1 mt-0.5">{n.excerpt[lang]}</p>
                        <div className="flex items-center gap-2 justify-end text-[10px] text-white/40 mt-1">
                          <span>{n.date[lang]}</span>
                          <Clock size={9} />
                        </div>
                      </div>
                      <ArrowUpLeft size={14} className="text-white/30 group-hover:text-orange-400 transition-colors shrink-0" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
