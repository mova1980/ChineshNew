import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Globe, Menu, X, User as UserIcon, LogOut, Search, ChevronDown } from "lucide-react";
import { useApp } from "../context/AppContext";
import Logo from "./Logo";
import SearchModal from "./SearchModal";

export default function Header() {
  const { t, lang, setLang, user, logout, setLoginOpen, data } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [newsDropdown, setNewsDropdown] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const navItems = data.nav.slice(0, 8);
  
  const newsCategories = [
    { fa: "همه اخبار", en: "All News", href: "#archive/all" },
    { fa: "شهری", en: "Urban", href: "#archive/city" },
    { fa: "فرهنگی", en: "Culture", href: "#archive/culture" },
    { fa: "اجتماعی", en: "Society", href: "#archive/society" },
    { fa: "اقتصادی", en: "Economy", href: "#archive/economy" },
    { fa: "ورزشی", en: "Sport", href: "#archive/sport" },
    { fa: "گزارش تصویری", en: "Photo Report", href: "#archive/photo" },
  ];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass shadow-2xl shadow-orange-500/10"
          : "bg-gradient-to-b from-navy-950/80 to-transparent backdrop-blur-sm"
      }`}
    >
      <div className="max-w-[1500px] mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-20">

          {/* ── LOGO + SITE NAME ── */}
          <a href="#home" className="flex-shrink-0">
            <Logo size="md" showText={true} />
          </a>

          {/* ── Desktop NAV ── */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navItems.map((item, i) => {
              const isNews = item.key === "news";
              return (
                <div 
                  key={item.key} 
                  className="relative"
                  onMouseEnter={() => isNews && setNewsDropdown(true)}
                  onMouseLeave={() => isNews && setNewsDropdown(false)}
                >
                  <motion.a
                    href={item.href}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.04 }}
                    className="group flex items-center gap-1 px-3 py-2 text-[13px] font-medium text-white/80 hover:text-white transition-colors rounded-xl"
                  >
                    <span className="relative z-10">{item.label[lang]}</span>
                    {isNews && <ChevronDown size={12} className={`transition-transform duration-300 ${newsDropdown ? "rotate-180" : ""}`} />}
                    <span className="absolute inset-0 rounded-xl bg-orange-500/0 group-hover:bg-orange-500/10 transition-colors" />
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-orange-400 group-hover:w-5 transition-all duration-300 rounded-full" />
                  </motion.a>

                  {/* Dropdown for News */}
                  {isNews && (
                    <AnimatePresence>
                      {newsDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full right-0 w-48 glass rounded-2xl p-2 shadow-2xl z-50 border border-white/10"
                        >
                          <div className="grid grid-cols-1 gap-1">
                            {newsCategories.map((cat, idx) => (
                              <a
                                key={idx}
                                href={cat.href}
                                className="px-4 py-2 rounded-xl text-white/70 hover:bg-orange-500/20 hover:text-white transition-all text-xs text-right"
                              >
                                {cat[lang]}
                              </a>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              );
            })}
          </nav>

          {/* ── Actions ── */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSearchOpen(true)}
              className="hidden md:flex w-9 h-9 items-center justify-center rounded-full bg-white/5 hover:bg-orange-500/20 border border-white/10 text-white/70 hover:text-white transition-colors"
            >
              <Search size={15} />
            </motion.button>

            {/* Language toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setLang(lang === "fa" ? "en" : "fa")}
              className="flex items-center gap-1.5 px-3 h-9 rounded-full bg-white/5 border border-white/10 text-white text-xs font-bold hover:border-orange-500/50 hover:bg-orange-500/10 transition-all"
            >
              <Globe size={13} />
              <span>{lang === "fa" ? "EN" : "فا"}</span>
            </motion.button>

            {/* User */}
            {user ? (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setUserMenu(!userMenu)}
                  className="flex items-center gap-2 h-9 px-2 rounded-full bg-orange-500/20 border border-orange-500/40"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-orange-700 flex items-center justify-center text-white text-xs font-bold">
                    {user.name[0].toUpperCase()}
                  </div>
                  <span className="hidden md:block text-xs text-white">{user.name}</span>
                </motion.button>
                <AnimatePresence>
                  {userMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className="absolute top-11 right-0 w-52 glass rounded-2xl p-2 shadow-2xl z-50"
                    >
                      <div className="px-3 py-2 border-b border-white/10 mb-1">
                        <div className="text-[10px] text-white/50">{t.auth.welcome}</div>
                        <div className="text-xs text-white truncate">{user.email}</div>
                      </div>
                      <a href="#profile" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/5 text-white/80 text-xs">
                        <UserIcon size={13} /> {t.auth.profile}
                      </a>
                      <button
                        onClick={() => { logout(); setUserMenu(false); }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-orange-500/20 text-orange-300 text-xs"
                      >
                        <LogOut size={13} /> {t.auth.logout}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setLoginOpen(true)}
                className="hidden md:flex h-9 px-4 items-center rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold shadow-lg shadow-orange-500/30"
              >
                {t.auth.login}
              </motion.button>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white"
            >
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden overflow-hidden border-t border-white/10"
            >
              <nav className="py-3 flex flex-col gap-1">
                {navItems.map((item) => (
                  <div key={item.key}>
                    <div 
                      className="flex items-center justify-between px-4 py-2.5 rounded-xl text-white/80 hover:bg-orange-500/10 hover:text-orange-300 transition-colors text-sm text-right cursor-pointer"
                      onClick={() => {
                        if (item.key === "news") setNewsDropdown(!newsDropdown);
                        else { setMobileOpen(false); window.location.href = item.href; }
                      }}
                    >
                      {item.label[lang]}
                      {item.key === "news" && <ChevronDown size={14} className={newsDropdown ? "rotate-180" : ""} />}
                    </div>
                    {item.key === "news" && newsDropdown && (
                      <div className="bg-white/5 mx-4 rounded-xl overflow-hidden mb-2">
                        {newsCategories.map((cat, idx) => (
                          <a
                            key={idx}
                            href={cat.href}
                            onClick={() => { setMobileOpen(false); setNewsDropdown(false); }}
                            className="block px-6 py-2 text-xs text-white/60 hover:text-orange-400 border-b border-white/5 last:border-0"
                          >
                            {cat[lang]}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {!user && (
                  <button
                    onClick={() => { setMobileOpen(false); setLoginOpen(true); }}
                    className="mt-2 mx-4 h-10 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-sm"
                  >
                    {t.auth.login}
                  </button>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </motion.header>
  );
}
