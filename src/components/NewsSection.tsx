import { motion } from "framer-motion";
import { Clock, ArrowUpRight, Image as ImageIcon } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function NewsSection() {
  const { t, lang, data } = useApp();

  const cat = (c: string) =>
    t.categories[c as keyof typeof t.categories] || c;

  return (
    <section id="news" className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] rounded-full bg-orange-500/10 blur-[150px]" />

      <div className="relative max-w-[1500px] mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12"
        >
          <div className="text-right">
            <div className="text-xs md:text-sm text-orange-400 mb-2 tracking-widest uppercase">
              {t.sections.titr1}
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white">
              {t.sections.latest}
            </h2>
            <p className="text-white/60 mt-2">{t.sections.latestSub}</p>
          </div>
          <a href="#archive/all" className="self-start md:self-auto inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 text-sm font-medium">
            {t.sections.viewAll} <ArrowUpRight size={16} />
          </a>
        </motion.div>

        {/* Featured grid */}
        <div className="grid lg:grid-cols-12 gap-6 mb-16">
          <motion.article
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 group relative overflow-hidden rounded-3xl border border-white/10 bg-navy-900/50 sweep tilt cursor-pointer"
            onClick={() => {
              if (data.featured[0]) window.location.hash = `#news/${data.featured[0].id}`;
            }}
          >
            <div className="relative aspect-[16/11] overflow-hidden">
              <img
                src={data.featured[0]?.image}
                alt=""
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => { (e.target as HTMLImageElement).src = "/images/news-placeholder.jpg"; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent" />
              <span className="absolute top-5 right-5 px-3 py-1.5 rounded-full bg-orange-500 text-white text-xs font-bold">
                {cat(data.featured[0]?.category || "city")}
              </span>
            </div>
            <div className="absolute bottom-0 inset-x-0 p-6 md:p-8 text-right">
              <div className="flex items-center gap-2 justify-end text-xs text-white/70 mb-3">
                <span>{data.featured[0]?.date[lang]}</span>
                <Clock size={12} />
              </div>
              <h3 className="text-2xl md:text-4xl font-black text-white mb-3 leading-snug group-hover:gradient-text transition-all">
                {data.featured[0]?.title[lang]}
              </h3>
              <p className="text-white/75 line-clamp-2 max-w-2xl mr-auto">
                {data.featured[0]?.excerpt[lang]}
              </p>
            </div>
          </motion.article>

          <div className="lg:col-span-5 flex flex-col gap-6">
            {data.featured.slice(1, 4).map((n, i) => (
              <motion.article
                key={n.id}
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                onClick={() => (window.location.hash = `#news/${n.id}`)}
                className="group relative flex gap-4 p-3 rounded-2xl border border-white/10 bg-navy-900/40 hover:bg-navy-800/60 hover:border-orange-500/40 transition-all sweep cursor-pointer flex-row-reverse"
              >
                <div className="shrink-0 w-28 h-28 md:w-32 md:h-32 rounded-xl overflow-hidden">
                  <img
                    src={n.image}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => { (e.target as HTMLImageElement).src = "/images/news-placeholder.jpg"; }}
                  />
                </div>
                <div className="flex-1 min-w-0 text-right">
                  {n.subtitle && <div className="text-[10px] text-orange-400 mb-1">{n.subtitle[lang]}</div>}
                  <h4 className="text-sm md:text-base font-bold text-white leading-snug line-clamp-2 group-hover:text-orange-300 transition-colors">
                    {n.title[lang]}
                  </h4>
                  <p className="text-xs text-white/60 line-clamp-2 mt-1">{n.excerpt[lang]}</p>
                  <div className="flex items-center gap-2 justify-end text-[10px] text-white/50 mt-2">
                    <span>{n.date[lang]}</span>
                    <Clock size={10} />
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        {/* Highlights */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-12">
          <div className="flex items-center gap-3 mb-8 flex-row-reverse">
            <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />
            <h3 className="text-2xl md:text-3xl font-black text-white whitespace-nowrap px-3">{t.sections.titr3}</h3>
            <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />
          </div>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...data.latest, ...data.highlights].slice(0, 9).map((n, i) => (
            <motion.article
              key={n.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
              onClick={() => (window.location.hash = `#news/${n.id}`)}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-navy-900/40 hover:border-orange-500/40 transition-all sweep tilt cursor-pointer flex flex-col"
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
                  <span className="px-2.5 py-1 rounded-full bg-navy-900/80 backdrop-blur text-white text-[10px] font-bold border border-white/10">{cat(n.category)}</span>
                  {n.isPhoto && (
                    <span className="px-2.5 py-1 rounded-full bg-orange-500/90 text-white text-[10px] font-bold flex items-center gap-1">
                      <ImageIcon size={10} /> {lang === "fa" ? "تصویری" : "Photo"}
                    </span>
                  )}
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col text-right">
                {n.subtitle && <div className="text-[10px] text-orange-400 mb-1.5">{n.subtitle[lang]}</div>}
                <h4 className="font-bold text-white leading-snug line-clamp-2 group-hover:text-orange-300 transition-colors mb-2">{n.title[lang]}</h4>
                <p className="text-xs text-white/60 line-clamp-2 mb-4 flex-1">{n.excerpt[lang]}</p>
                <div className="flex items-center justify-between text-xs text-white/50 flex-row-reverse">
                  <div className="flex items-center gap-1.5">
                    <span>{n.date[lang]}</span>
                    <Clock size={11} />
                  </div>
                  <span className="text-orange-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    <ArrowUpRight size={12} />
                    {t.sections.readMore}
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
