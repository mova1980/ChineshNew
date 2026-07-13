import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, Calendar } from "lucide-react";
import type { GalleryImage } from "../data/store";
import { useApp } from "../context/AppContext";

interface Props {
  images: GalleryImage[];
  index: number | null;
  onClose: () => void;
  onNav: (i: number) => void;
}

export default function GalleryLightbox({ images, index, onClose, onNav }: Props) {
  const { lang } = useApp();
  const [zoom, setZoom] = useState(1);

  const open = index !== null;
  const current = open ? images[index] : null;

  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") prev();
      if (e.key === "ArrowLeft") next();
    };
    window.addEventListener("keydown", key);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", key);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, index]);

  useEffect(() => {
    setZoom(1);
  }, [index]);

  const next = () => {
    if (index === null) return;
    onNav((index + 1) % images.length);
  };
  const prev = () => {
    if (index === null) return;
    onNav((index - 1 + images.length) % images.length);
  };

  return (
    <AnimatePresence>
      {open && current && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-xl flex items-center justify-center"
          onClick={onClose}
        >
          {/* Top bar */}
          <div
            className="absolute top-0 inset-x-0 z-10 flex items-center justify-between px-4 md:px-8 py-4 bg-gradient-to-b from-black/60 to-transparent"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-right">
              <div className="text-xs text-orange-300">
                {index !== null && index + 1} / {images.length}
              </div>
              <div className="text-white font-bold text-sm md:text-base mt-0.5">
                {current.label[lang]}
              </div>
              {current.createdAt && (
                <div className="flex items-center gap-1 text-[10px] text-white/60 mt-1">
                  <Calendar size={10} />
                  <span>{new Date(current.createdAt).toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
                title={lang === "fa" ? "کوچک‌نمایی" : "Zoom out"}
              >
                <ZoomOut size={16} />
              </button>
              <div className="text-xs text-white/70 min-w-[3rem] text-center">
                {Math.round(zoom * 100)}%
              </div>
              <button
                onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
                title={lang === "fa" ? "بزرگ‌نمایی" : "Zoom in"}
              >
                <ZoomIn size={16} />
              </button>
              <a
                href={current.src}
                download
                onClick={(e) => e.stopPropagation()}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
                title={lang === "fa" ? "دانلود" : "Download"}
              >
                <Download size={16} />
              </a>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-orange-500/80 hover:bg-orange-500 text-white flex items-center justify-center"
                title={lang === "fa" ? "بستن" : "Close"}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Image */}
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="relative max-w-[90vw] max-h-[80vh] flex items-center justify-center overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={current.src}
              alt={current.label[lang]}
              style={{ transform: `scale(${zoom})`, transition: "transform 0.3s ease" }}
              className="max-w-full max-h-[80vh] object-contain select-none"
              draggable={false}
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/images/news-placeholder.jpg";
              }}
            />
          </motion.div>

          {/* Prev / Next */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-orange-500/80 text-white flex items-center justify-center transition-colors"
                title={lang === "fa" ? "قبلی" : "Previous"}
              >
                <ChevronRight size={22} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-orange-500/80 text-white flex items-center justify-center transition-colors"
                title={lang === "fa" ? "بعدی" : "Next"}
              >
                <ChevronLeft size={22} />
              </button>
            </>
          )}

          {/* Thumbnails */}
          <div
            className="absolute bottom-0 inset-x-0 px-4 md:px-8 py-4 bg-gradient-to-t from-black/70 to-transparent"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex gap-2 justify-center overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => onNav(i)}
                  className={`shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                    i === index
                      ? "border-orange-500 scale-110 shadow-lg shadow-orange-500/50"
                      : "border-white/10 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img.src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
