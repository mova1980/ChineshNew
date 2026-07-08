import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { ArrowRight, ArrowLeft, Play, Newspaper } from "lucide-react";
import { useApp } from "../context/AppContext";

// Local sample images bundled with the project (fully offline)
const heroImages = [
  "/images/hero1.jpg",
  "/images/hero2.jpg",
  "/images/hero3.jpg",
];

/**
 * Hero background video. Two ways to enable a video background:
 *
 *   OPTION A) Fully offline — place your video file at:
 *     public/videos/hero-bg.mp4
 *
 *   OPTION B) Use a remote URL (default sample below works when online).
 *     If the file at /videos/hero-bg.mp4 doesn't exist, the code will
 *     automatically fall back to this remote URL. If both fail, the
 *     cinematic Ken-Burns image slideshow is shown instead.
 */
const HERO_VIDEO_LOCAL = "/videos/hero-bg.mp4";
const HERO_VIDEO_REMOTE =
  "https://videos.pexels.com/video-files/16292446/16292446-uhd_3840_2160_24fps.mp4";

export default function Hero() {
  const { t, dir, lang, data } = useApp();
  const hero = data.hero;
  const heroCards = data.heroCards;

  const [activeImg, setActiveImg] = useState(0);
  const [videoSrc, setVideoSrc] = useState<string>(HERO_VIDEO_LOCAL);
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveImg((p) => (p + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleVideoError = () => {
    // 1st failure → try remote URL. 2nd failure → fall back to image slideshow.
    if (videoSrc === HERO_VIDEO_LOCAL) {
      setVideoSrc(HERO_VIDEO_REMOTE);
    } else {
      setVideoFailed(true);
    }
  };

  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  return (
    <section id="home" className="relative min-h-screen pt-28 pb-16 overflow-hidden">
      {/* ── Background: video (with fallback to image slideshow) ── */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-navy-950">
        {!videoFailed ? (
          <video
            ref={videoRef}
            key={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            poster={heroImages[0]}
            className="w-full h-full object-cover scale-110"
            src={videoSrc}
            onError={handleVideoError}
          />
        ) : (
          <AnimatePresence mode="sync">
            <motion.div
              key={activeImg}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <img
                src={heroImages[activeImg]}
                alt=""
                className="w-full h-full object-cover ken-burns"
              />
            </motion.div>
          </AnimatePresence>
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/60 via-navy-950/30 to-navy-950/90" />
        <div className="absolute inset-0 grid-bg opacity-20" />
      </div>

      {/* Aurora orbs */}
      <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full bg-orange-500/20 blur-[120px] aurora pointer-events-none" />
      <div
        className="absolute bottom-0 -right-32 w-[500px] h-[500px] rounded-full bg-navy-600/40 blur-[120px] aurora pointer-events-none"
        style={{ animationDelay: "3s" }}
      />

      <div className="relative z-10 max-w-[1500px] mx-auto px-4 md:px-8">
        <div
          className={`grid lg:grid-cols-12 gap-10 lg:gap-14 items-center ${
            dir === "rtl" ? "lg:[direction:rtl]" : ""
          }`}
        >
          {/* ── Text block ── */}
          <div className="lg:col-span-6 space-y-7">
            {hero.eyebrow[lang] && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-orange-500/30"
              >
                <Newspaper size={14} className="text-orange-400" />
                <span className="text-xs md:text-sm text-orange-200">
                  {hero.eyebrow[lang]}
                </span>
              </motion.div>
            )}

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.4,
                duration: 0.8,
                ease: [0.34, 1.56, 0.64, 1],
              }}
              className={`font-black leading-[1.1] text-white ${
                lang === "fa"
                  ? "text-4xl md:text-6xl lg:text-7xl"
                  : "text-5xl md:text-7xl lg:text-8xl"
              }`}
              style={{ letterSpacing: lang === "en" ? "-0.04em" : "0" }}
            >
              {hero.title1[lang]}{" "}
              <AccentWord word={hero.titleAccent[lang]} />
              {hero.title2[lang] ? ` ${hero.title2[lang]}` : ""}
            </motion.h1>

            {hero.desc[lang] && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.7 }}
                className="text-base md:text-lg text-white/75 max-w-xl leading-relaxed"
              >
                {hero.desc[lang]}
              </motion.p>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 }}
              className="flex flex-wrap gap-4"
            >
              <motion.a
                href="#news"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="group inline-flex items-center gap-2 px-7 h-14 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold shadow-2xl shadow-orange-500/40"
              >
                {t.hero.ctaPrimary}
                <Arrow
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </motion.a>
              <motion.a
                href="#club"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-7 h-14 rounded-full glass border-white/20 text-white font-medium hover:border-orange-500/50 transition-colors"
              >
                <Play size={16} className="text-orange-400" />
                {t.hero.ctaSecondary}
              </motion.a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="grid grid-cols-3 gap-4 md:gap-6 pt-6 border-t border-white/10"
            >
              {[
                { n: "+۳۲۰", l: t.hero.stat1, en: "+320" },
                { n: "+۴۵", l: t.hero.stat2, en: "+45" },
                { n: "۱.۲M", l: t.hero.stat3, en: "1.2M" },
              ].map((s, i) => (
                <div key={i} className="text-center md:text-start">
                  <div className="text-2xl md:text-3xl font-black gradient-text">
                    {lang === "fa" ? s.n : s.en}
                  </div>
                  <div className="text-xs md:text-sm text-white/60 mt-1">
                    {s.l}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Image carousel with floating cards ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="lg:col-span-6 relative"
          >
            <div className="relative aspect-[4/5] md:aspect-[5/6] max-w-[560px] mx-auto">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-6 rounded-[2rem] border border-dashed border-orange-500/30 pointer-events-none"
              />

              <div className="relative w-full h-full rounded-[2rem] overflow-hidden shadow-2xl shadow-navy-900/80 border border-white/10">
                <AnimatePresence mode="sync">
                  <motion.div
                    key={activeImg}
                    initial={{ opacity: 0, scale: 1.15, filter: "blur(10px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 0.95, filter: "blur(6px)" }}
                    transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
                    className="absolute inset-0"
                  >
                    <img
                      src={heroImages[activeImg]}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent" />
                  </motion.div>
                </AnimatePresence>

                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between z-10">
                  <div>
                    <div className="text-xs text-orange-300 mb-1">
                      {heroCards.caption[lang]}
                    </div>
                    <div className="text-lg md:text-xl font-bold text-white">
                      {heroCards.captionSub[lang]}
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    {heroImages.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImg(i)}
                        className={`h-1.5 rounded-full transition-all ${
                          i === activeImg
                            ? "w-8 bg-orange-500"
                            : "w-3 bg-white/40"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating card — top (Breaking) */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className={`absolute ${
                  dir === "rtl" ? "-left-4 md:-left-10" : "-right-4 md:-right-10"
                } top-10 w-44 glass rounded-2xl p-4 shadow-2xl`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                  <span className="text-xs text-orange-300">
                    {t.sections.breaking}
                  </span>
                </div>
                <div className="text-sm font-medium text-white leading-snug">
                  {heroCards.top[lang]}
                </div>
              </motion.div>

              {/* Floating card — bottom (Live) */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className={`absolute ${
                  dir === "rtl" ? "-right-4 md:-right-8" : "-left-4 md:-left-8"
                } bottom-16 w-40 glass rounded-2xl p-3 shadow-2xl flex items-center gap-3`}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center">
                  <Play size={16} className="text-white" />
                </div>
                <div>
                  <div className="text-[10px] text-white/60">
                    {heroCards.bottom[lang]}
                  </div>
                  <div className="text-xs text-white font-bold">
                    {lang === "fa" ? "از قلب شهر" : "From the city"}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─────────── Accent word with hover shimmer + glow ─────────── */
function AccentWord({ word }: { word: string }) {
  if (!word) return null;
  return (
    <span className="group relative inline-block px-2 cursor-default align-middle">
      {/* Ambient glow */}
      <motion.span
        className="absolute inset-0 bg-orange-500/20 blur-2xl rounded-full -z-10 group-hover:bg-orange-500/40 transition-colors duration-500"
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.55, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      {/* Shine sweep on hover */}
      <span className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-xl">
        <span className="absolute inset-y-0 -left-full w-1/2 skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:left-[150%] transition-[left] duration-700 ease-out" />
      </span>
      {/* The word */}
      <span className="gradient-text relative z-10 inline-block transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:scale-110">
        {word}
      </span>
      {/* Expanding glowing underline */}
      <span className="pointer-events-none absolute -bottom-1 left-1/2 h-[3px] w-0 -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-orange-400 to-transparent shadow-[0_0_12px_rgba(255,140,0,0.9)] group-hover:w-full transition-all duration-500 ease-out" />
      {/* Sparks */}
      <span className="pointer-events-none absolute -top-2 left-1/4 h-1.5 w-1.5 rounded-full bg-yellow-300 opacity-0 group-hover:opacity-100 group-hover:-translate-y-3 transition-all duration-700 shadow-[0_0_8px_rgba(255,220,0,1)]" />
      <span className="pointer-events-none absolute top-0 right-1/4 h-1 w-1 rounded-full bg-orange-400 opacity-0 group-hover:opacity-100 group-hover:-translate-y-4 transition-all duration-[900ms] delay-100 shadow-[0_0_8px_rgba(255,140,0,1)]" />
    </span>
  );
}
