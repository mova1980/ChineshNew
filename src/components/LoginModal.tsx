import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import Logo from "./Logo";

// Google Client ID — users should replace with their own
const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";

interface GoogleResponse {
  credential: string;
  select_by: string;
}

export default function LoginModal() {
  const { loginOpen, setLoginOpen, login, t, lang } = useApp();
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [googleError, setGoogleError] = useState("");
  const btnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loginOpen) return;

    // Load Google Sign-In script (only works with internet)
    try {
      if (!(window as any).google) {
        const s = document.createElement("script");
        s.src = "https://accounts.google.com/gsi/client";
        s.async = true;
        s.defer = true;
        s.onerror = () => { /* Silently fail offline — Google login requires internet */ };
        document.body.appendChild(s);
        s.onload = initGoogle;
      } else {
        initGoogle();
      }
    } catch { /* offline — skip Google */ }

    function initGoogle() {
      if (!(window as any).google?.accounts) return;
      (window as any).google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      });
      if (btnRef.current) {
        (window as any).google.accounts.id.renderButton(btnRef.current, {
          theme: "outline",
          size: "large",
          type: "standard",
          text: "continue_with",
          shape: "pill",
        });
      }
    }

    return () => {
      // Cleanup: remove rendered button if exists
    };
  }, [loginOpen]);

  const handleGoogleResponse = (response: GoogleResponse) => {
    try {
      // Decode JWT credential
      const payload = JSON.parse(atob(response.credential.split(".")[1]));
      login({
        name: payload.name || payload.email,
        email: payload.email,
        avatar: payload.picture,
        provider: "google",
      });
      setGoogleError("");
    } catch (e) {
      setGoogleError("خطا در ورود با گوگل / Google login failed");
    }
  };

  const handleGoogleMock = () => {
    // Fallback when Google Client ID is not set
    if (GOOGLE_CLIENT_ID.startsWith("YOUR_")) {
      login({
        name: lang === "fa" ? "کاربر گوگل" : "Google User",
        email: "user@gmail.com",
        avatar: "G",
        provider: "google",
      });
      return;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email) return;
    login({
      name: form.name || form.email.split("@")[0],
      email: form.email,
      provider: "email",
    });
  };

  return (
    <AnimatePresence>
      {loginOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-navy-950/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLoginOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md glass rounded-3xl p-8 shadow-2xl"
            dir={lang === "fa" ? "rtl" : "ltr"}
          >
            <button
              onClick={() => setLoginOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-orange-500/30 text-white flex items-center justify-center"
            >
              <X size={16} />
            </button>

            <div className="text-center mb-6 flex justify-center">
              <Logo size="lg" />
              <h3 className="text-2xl font-black text-white mt-4">
                {mode === "signin" ? t.auth.login : t.club.title}
              </h3>
              <p className="text-white/60 text-sm mt-1">{t.club.desc.split(".")[0]}</p>
            </div>

            {/* Google Button */}
            <div className="mb-4">
              <div
                ref={btnRef}
                className="w-full flex justify-center"
                onClick={handleGoogleMock}
              />
              {googleError && <div className="text-red-400 text-xs mt-2 text-center">{googleError}</div>}
              {GOOGLE_CLIENT_ID.startsWith("YOUR_") && (
                <div className="text-[10px] text-white/40 text-center mt-1">
                  {lang === "fa" ? "دموی ورود گوگل (برای استفاده واقعی، Client ID خود را وارد کنید)" : "Google sign-in demo (set real Client ID for production)"}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 my-4">
              <div className="h-px flex-1 bg-white/15" />
              <span className="text-xs text-white/50">{lang === "fa" ? "یا" : "or"}</span>
              <div className="h-px flex-1 bg-white/15" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {mode === "signup" && (
                <div className="relative">
                  <User size={16} className="absolute top-1/2 -translate-y-1/2 right-3 text-white/50" />
                  <input
                    type="text"
                    placeholder={lang === "fa" ? "نام و نام خانوادگی" : "Full name"}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full h-12 pr-10 pl-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-orange-500 outline-none"
                  />
                </div>
              )}
              <div className="relative">
                <Mail size={16} className="absolute top-1/2 -translate-y-1/2 right-3 text-white/50" />
                <input
                  type="email"
                  required
                  placeholder={lang === "fa" ? "ایمیل" : "Email"}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full h-12 pr-10 pl-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-orange-500 outline-none"
                />
              </div>
              <div className="relative">
                <Lock size={16} className="absolute top-1/2 -translate-y-1/2 right-3 text-white/50" />
                <input
                  type="password"
                  placeholder={lang === "fa" ? "رمز عبور" : "Password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full h-12 pr-10 pl-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-orange-500 outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full h-12 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold shadow-lg shadow-orange-500/30 hover:scale-[1.02] transition-transform"
              >
                {mode === "signin" ? t.auth.login : t.auth.signup}
              </button>
            </form>

            <div className="text-center mt-5 text-sm text-white/60">
              {mode === "signin" ? (
                <button onClick={() => setMode("signup")} className="text-orange-400 hover:text-orange-300">
                  {lang === "fa" ? "حساب ندارید؟ ثبت نام" : "No account? Sign up"}
                </button>
              ) : (
                <button onClick={() => setMode("signin")} className="text-orange-400 hover:text-orange-300">
                  {t.club.member}
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
