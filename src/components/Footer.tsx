import { motion } from "framer-motion";
import { Mail, MapPin, Send } from "lucide-react";
import Logo from "./Logo";

const SocialIcon = ({ name }: { name: string }) => {
  const paths: Record<string, string> = {
    instagram: "M12 2.2c3.2 0 3.6 0 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s0 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23a3.7 3.7 0 01-.9 1.38c-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58 0-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 01-1.38-.9 3.7 3.7 0 01-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.2 15.58 2.2 15.2 2.2 12s0-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.2 8.8 2.2 12 2.2zm0 5.65a4.15 4.15 0 100 8.3 4.15 4.15 0 000-8.3zm0 6.85a2.7 2.7 0 110-5.4 2.7 2.7 0 010 5.4zm5.27-7.02a.97.97 0 11-1.94 0 .97.97 0 011.94 0z",
    twitter: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
    youtube: "M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 00.5 6.2 31 31 0 000 12a31 31 0 00.5 5.8 3 3 0 002.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 002.1-2.1 31 31 0 00.5-5.8 31 31 0 00-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z",
    facebook: "M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z",
  };
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d={paths[name]} />
    </svg>
  );
};
import { useApp } from "../context/AppContext";
import { useState } from "react";

export default function Footer() {
  const { t, lang, dir } = useApp();
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const links = [
    { key: "home" }, { key: "news" }, { key: "articles" }, { key: "media" }, { key: "city" }, { key: "club" }, { key: "about" }, { key: "contact" },
  ] as const;

  return (
    <footer id="about" className="relative pt-20 pb-8 overflow-hidden bg-gradient-to-b from-navy-950 to-black">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute -top-32 left-1/4 w-[400px] h-[400px] bg-orange-500/15 blur-[120px] rounded-full" />

      <div className="relative max-w-[1500px] mx-auto px-4 md:px-8">
        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-3xl p-6 md:p-10 mb-16 relative overflow-hidden"
        >
          <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-orange-500/20 blur-3xl" />
          <div className={`grid md:grid-cols-2 gap-6 items-center ${dir === "rtl" ? "md:[direction:rtl]" : ""}`}>
            <div className={dir === "rtl" ? "text-right" : "text-left"}>
              <h3 className="text-2xl md:text-3xl font-black text-white mb-2">
                {t.sections.newsletter}
              </h3>
              <p className="text-white/70">
                {lang === "fa"
                  ? "آخرین اخبار و گزارش‌های مدیریت شهری کرج را در ایمیل خود دریافت کنید."
                  : "Get the latest news of Karaj urban management in your inbox."}
              </p>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email) {
                  setDone(true);
                  setEmail("");
                  setTimeout(() => setDone(false), 3000);
                }
              }}
              className={`flex gap-2 ${dir === "rtl" ? "flex-row-reverse" : ""}`}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.footer.newsletter}
                className="flex-1 h-14 px-5 rounded-full bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-orange-500 outline-none"
              />
              <button
                type="submit"
                className="h-14 px-6 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold shadow-lg shadow-orange-500/30 flex items-center gap-2 hover:scale-105 transition-transform"
              >
                {done ? "✓" : t.footer.subscribe}
                <Send size={14} className={dir === "rtl" ? "flip-x" : ""} />
              </button>
            </form>
          </div>
        </motion.div>

        {/* Footer grid */}
        <div className={`grid md:grid-cols-12 gap-10 mb-12 ${dir === "rtl" ? "md:[direction:rtl]" : ""}`}>
          {/* Brand */}
          <div className={`md:col-span-4 ${dir === "rtl" ? "text-right" : "text-left"}`}>
            <div className="flex items-center gap-4 mb-4">
              <Logo size="sm" />
              <div className="hidden sm:block">
                <div className="font-nastaliq text-2xl text-white">
                  {lang === "fa" ? "چینش" : "Chinesh"}
                </div>
                <div className="text-xs text-orange-300">{t.tagline}</div>
              </div>
            </div>
            <p className="text-white/65 text-sm leading-relaxed mb-5">
              {t.footer.aboutText}
            </p>
            <div className={`flex gap-2 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
              {["instagram", "twitter", "youtube", "facebook"].map((name) => (
                <motion.a
                  key={name}
                  href="#"
                  whileHover={{ y: -4, scale: 1.1 }}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-orange-400 hover:border-orange-500/40 transition-colors"
                >
                  <SocialIcon name={name} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className={`md:col-span-3 ${dir === "rtl" ? "text-right" : "text-left"}`}>
            <h4 className="text-white font-bold mb-4">{t.footer.quickLinks}</h4>
            <ul className="space-y-2">
              {links.map((l) => (
                <li key={l.key}>
                  <a href={`#${l.key}`} className="text-white/65 hover:text-orange-400 text-sm transition-colors">
                    {t.nav[l.key as keyof typeof t.nav]}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className={`md:col-span-2 ${dir === "rtl" ? "text-right" : "text-left"}`}>
            <h4 className="text-white font-bold mb-4">{t.sections.categories}</h4>
            <ul className="space-y-2">
              {Object.entries(t.categories).map(([k, v]) => (
                <li key={k}>
                  <a href="#news" className="text-white/65 hover:text-orange-400 text-sm transition-colors">
                    {v}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className={`md:col-span-3 ${dir === "rtl" ? "text-right" : "text-left"}`}>
            <h4 className="text-white font-bold mb-4">{t.footer.contactUs}</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li className={`flex gap-2 items-start ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                <MapPin size={14} className="text-orange-400 mt-1 shrink-0" />
                <span>{t.footer.address}</span>
              </li>
              <li className={`flex gap-2 items-center ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                <Mail size={14} className="text-orange-400" />
                <span>{t.footer.email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="text-xs text-white/50">{t.footer.rights}</div>
          <div className="text-xs text-white/40 font-nastaliq text-lg">
            {lang === "fa" ? "چینش ؛ بینش در خبر" : "Chinesh — Insight in News"}
          </div>
          <a
            href="#admin"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-orange-400 hover:border-orange-500/40 text-xs transition-colors"
            title="ورود به پنل مدیریت (Ctrl+Shift+A)"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span>{lang === "fa" ? "ورود مدیر" : "Admin"}</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
