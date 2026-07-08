import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function ClubSection() {
  const { t, dir, setLoginOpen, user } = useApp();

  const features = [t.club.f1, t.club.f2, t.club.f3, t.club.f4];

  return (
    <section id="club" className="relative py-20 md:py-28 overflow-hidden">
      {/* Bg */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900" />
      <div className="absolute inset-0 grid-bg opacity-30" />
      <motion.div
        className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-orange-500/30 blur-[140px]"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-navy-500/40 blur-[140px]"
        animate={{ scale: [1.2, 1, 1.2] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      <div className="relative max-w-[1400px] mx-auto px-4 md:px-8">
        <div className={`grid lg:grid-cols-2 gap-12 items-center ${dir === "rtl" ? "lg:[direction:rtl]" : ""}`}>
          {/* Left text */}
          <motion.div
            initial={{ opacity: 0, x: dir === "rtl" ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className={dir === "rtl" ? "text-right" : "text-left"}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/15 border border-orange-500/30 mb-5">
              <Sparkles size={14} className="text-orange-400" />
              <span className="text-orange-300 text-xs">{t.sections.club}</span>
            </div>

            <h2 className="text-4xl md:text-6xl font-black text-white mb-5 leading-tight">
              {t.club.title.split(" ").map((w, i) => (
                <span key={i} className={i === 1 ? "gradient-text" : ""}>
                  {w}{" "}
                </span>
              ))}
            </h2>

            <p className="text-white/70 text-lg mb-8 max-w-lg">{t.club.desc}</p>

            <ul className="space-y-3 mb-10">
              {features.map((f, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: dir === "rtl" ? 20 : -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex items-center gap-3 text-white/85 ${dir === "rtl" ? "flex-row-reverse text-right" : ""}`}
                >
                  <span className="shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center">
                    <Check size={14} className="text-white" />
                  </span>
                  <span>{f}</span>
                </motion.li>
              ))}
            </ul>

            {!user ? (
              <div className={`flex flex-wrap gap-3 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setLoginOpen(true)}
                  className="inline-flex items-center gap-3 px-6 h-14 rounded-full bg-white text-navy-900 font-bold shadow-2xl hover:shadow-orange-500/30 transition-shadow"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  {t.club.joinGoogle}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setLoginOpen(true)}
                  className="inline-flex items-center px-6 h-14 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold shadow-2xl shadow-orange-500/30"
                >
                  {t.club.joinEmail}
                </motion.button>
              </div>
            ) : (
              <div className="inline-flex items-center gap-3 px-6 h-14 rounded-full bg-orange-500/20 border border-orange-500/40 text-white">
                <Check size={18} className="text-orange-400" />
                <span>{t.auth.welcome}، {user.name}</span>
              </div>
            )}
          </motion.div>

          {/* Right visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-square max-w-md mx-auto">
              {/* Member card stack */}
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  initial={{ rotate: 0 }}
                  animate={{ rotate: (i - 1) * 6, y: i * 12 }}
                  whileHover={{ rotate: 0, scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="absolute inset-0 rounded-3xl"
                  style={{ zIndex: 3 - i }}
                >
                  <div
                    className="w-full h-full rounded-3xl p-6 shadow-2xl border border-white/20 relative overflow-hidden"
                    style={{
                      background: i === 0
                        ? "linear-gradient(135deg, #ff7a1a 0%, #1f2d8c 100%)"
                        : i === 1
                          ? "linear-gradient(135deg, #1f2d8c 0%, #060a26 100%)"
                          : "linear-gradient(135deg, #14205e 0%, #ff5e00 100%)",
                    }}
                  >
                    <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
                    <div className="flex items-center justify-between mb-12">
                      <img src="/images/logo.png" className="w-12 h-12 bg-white/95 rounded-full p-1.5" alt="" />
                      <Sparkles className="text-white/90" />
                    </div>
                    <div className="text-white">
                      <div className="text-xs opacity-70 mb-1">CHINESH CLUB</div>
                      <div className="font-mono text-lg tracking-widest mb-8">•••• 2025</div>
                      <div className="flex justify-between items-end">
                        <div>
                          <div className="text-[10px] opacity-60">MEMBER</div>
                          <div className="font-bold">{user?.name || "Your Name"}</div>
                        </div>
                        <div className="text-xs px-2 py-1 rounded-full bg-white/20">
                          {i === 0 ? "GOLD" : i === 1 ? "PLATINUM" : "VIP"}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
