import { motion } from "framer-motion";
import { useState } from "react";
import { Maximize2 } from "lucide-react";
import { useApp } from "../context/AppContext";
import GalleryLightbox from "./GalleryLightbox";

export default function Gallery() {
  const { t, lang, data } = useApp();
  const images = data.gallery;
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section id="media" className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-orange-500/15 blur-[150px] rounded-full pointer-events-none" />

      <div className="relative max-w-[1500px] mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <div className="text-xs md:text-sm text-orange-400 mb-2 tracking-widest uppercase">
            {lang === "fa" ? "نگارخانه" : "Gallery"}
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white">{t.sections.gallery}</h2>
          <p className="text-white/60 mt-2 max-w-2xl mx-auto">{t.sections.gallerySub}</p>
        </motion.div>

        {images.length === 0 ? (
          <div className="text-center py-20 text-white/30 border-2 border-dashed border-white/10 rounded-3xl">
            هنوز تصویری در نگارخانه ثبت نشده
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-4 md:gap-5">
            {images.map((g, i) => (
              <motion.button
                key={i}
                type="button"
                onClick={() => setOpenIdx(i)}
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.07, ease: [0.34, 1.56, 0.64, 1] }}
                whileHover={{ scale: 1.02 }}
                className={`group relative overflow-hidden rounded-2xl border border-white/10 cursor-pointer text-right ${g.span}`}
              >
                <img
                  src={g.src}
                  alt={g.label[lang]}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/news-placeholder.jpg";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/20 to-transparent opacity-90" />
                <div className="absolute bottom-4 right-4 text-right">
                  <div className="text-xs text-orange-300 mb-1">
                    {lang === "fa" ? "کرج" : "Karaj"}
                  </div>
                  <div className="text-white font-bold text-sm md:text-base">{g.label[lang]}</div>
                </div>
                {/* Zoom badge */}
                <div className="absolute top-3 left-3 w-9 h-9 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 size={14} />
                </div>
                <div className="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/8 transition-colors" />
              </motion.button>
            ))}
          </div>
        )}
      </div>

      <GalleryLightbox
        images={images}
        index={openIdx}
        onClose={() => setOpenIdx(null)}
        onNav={setOpenIdx}
      />
    </section>
  );
}
