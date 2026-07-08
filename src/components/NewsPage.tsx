import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, Share2, Bookmark, ArrowDownRight } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function NewsPage({ newsId }: { newsId: string }) {
  const { t, lang, data } = useApp();
  const [allNews, setAllNews] = useState<typeof data.featured>([]);

  useEffect(() => {
    const all = [...data.featured, ...data.latest, ...data.highlights];
    const unique = new Map(all.map((n) => [n.id, n]));
    setAllNews(Array.from(unique.values()));
  }, [data]);

  const news = allNews.find((n) => n.id === newsId);

  if (!news) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center text-white text-xl">
        خبر یافت نشد / News not found
      </div>
    );
  }

  const related = allNews.filter((n) => n.id !== news.id && n.category === news.category).slice(0, 3);

  const cat = (c: string) => t.categories[c as keyof typeof t.categories] || c;
  // Arrow icon used for back navigation

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-white/60 mb-6">
          <a href="#home" className="hover:text-orange-400">{t.nav.home}</a>
          <span>/</span>
          <a href="#news" className="hover:text-orange-400">{t.nav.news}</a>
          <span>/</span>
          <span className="text-white">{news.title[lang].slice(0, 40)}...</span>
        </div>

        {/* Header */}
        <div className="mb-8 text-right">
          <span className="inline-block px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-300 text-xs font-bold mb-4">
            {cat(news.category)}
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
            {news.title[lang]}
          </h1>
          {news.subtitle && (
            <div className="text-orange-400 text-lg mb-4">{news.subtitle[lang]}</div>
          )}
          <div className="flex items-center gap-4 text-sm text-white/60 flex-row-reverse">
            <div className="flex items-center gap-1.5">
              <Clock size={14} /> <span>{news.date[lang]}</span>
            </div>
            <div className="h-4 w-px bg-white/20" />
            <span>{lang === "fa" ? "پایگاه خبری چینش" : "Chinesh News"}</span>
          </div>
        </div>

        {/* Hero image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative aspect-[16/9] rounded-3xl overflow-hidden mb-8 border border-white/10"
        >
          <img
            src={news.image}
            alt=""
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = "/images/news-placeholder.jpg"; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 to-transparent" />
        </motion.div>

        {/* Excerpt */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="relative p-6 md:p-8 rounded-2xl bg-gradient-to-br from-orange-500/15 to-navy-700/30 border border-orange-500/20 mb-8 text-right"
        >
          <div className="text-xs text-orange-400 mb-2 uppercase tracking-widest">خلاصه خبر</div>
          <p className="text-white text-lg md:text-xl leading-relaxed">{news.excerpt[lang]}</p>
        </motion.div>

        {/* Body */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="prose prose-invert max-w-none text-right mb-10"
        >
          <div className="text-white/85 text-base md:text-lg leading-loose whitespace-pre-line">
            {news.body?.[lang] || news.excerpt[lang]}
          </div>
        </motion.article>

        {/* Actions */}
        <div className="flex items-center gap-3 justify-end border-t border-white/10 pt-6 mb-12">
          <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-orange-500/20 border border-white/10 text-white text-sm">
            <Share2 size={14} /> {lang === "fa" ? "اشتراک" : "Share"}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-orange-500/20 border border-white/10 text-white text-sm">
            <Bookmark size={14} /> {lang === "fa" ? "ذخیره" : "Save"}
          </button>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div>
            <h3 className="text-2xl font-black text-white mb-6 text-right">{lang === "fa" ? "اخبار مرتبط" : "Related News"}</h3>
            <div className="grid md:grid-cols-3 gap-5">
              {related.map((n) => (
                <a
                  key={n.id}
                  href={`#news/${n.id}`}
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-navy-900/40 hover:border-orange-500/40 transition-all"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img src={n.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="p-4 text-right">
                    <h4 className="font-bold text-white leading-snug line-clamp-2 group-hover:text-orange-300 transition-colors text-sm">
                      {n.title[lang]}
                    </h4>
                    <div className="text-[10px] text-white/50 mt-2 flex items-center gap-1 justify-end">
                      <span>{n.date[lang]}</span>
                      <Clock size={10} />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 flex justify-center">
          <a href="#archive/all" className="inline-flex items-center gap-2 px-6 h-12 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold shadow-lg shadow-orange-500/30">
            <ArrowDownRight size={16} />
            {t.sections.viewAll}
          </a>
        </div>
      </div>
    </div>
  );
}
