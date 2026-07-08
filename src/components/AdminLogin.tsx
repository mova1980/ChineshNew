import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, User, Eye, EyeOff } from "lucide-react";
import { useApp } from "../context/AppContext";
import Logo from "./Logo";

export default function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const { lang, adminSignIn } = useApp();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await adminSignIn(user, pass);
    if (res.ok) {
      onSuccess();
      setErr("");
    } else {
      setErr(res.error || (lang === "fa" ? "نام کاربری یا رمز عبور اشتباه است" : "Invalid credentials"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-black" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-orange-500/15 blur-[120px]" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full bg-navy-600/30 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative w-full max-w-md glass rounded-3xl p-8 shadow-2xl"
        dir="rtl"
      >
        <div className="text-center mb-6 flex justify-center flex-col items-center">
          <Logo size="lg" />
          <h1 className="text-2xl font-black text-white mb-1 mt-4">پنل مدیریت چینش</h1>
          <p className="text-sm text-white/60">
            {lang === "fa" ? "ورود مدیر سایت" : "Admin login"}
          </p>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <div className="relative">
            <User size={16} className="absolute top-1/2 -translate-y-1/2 right-3 text-white/50" />
            <input
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="نام کاربری"
              className="w-full h-12 pr-10 pl-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-orange-500 outline-none"
            />
          </div>
          <div className="relative">
            <Lock size={16} className="absolute top-1/2 -translate-y-1/2 right-3 text-white/50" />
            <input
              type={show ? "text" : "password"}
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="رمز عبور"
              className="w-full h-12 pr-10 pl-10 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-orange-500 outline-none"
            />
            <button type="button" onClick={() => setShow(!show)} className="absolute top-1/2 -translate-y-1/2 left-3 text-white/50">
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {err && <div className="text-red-400 text-sm text-center">{err}</div>}

          <button
            type="submit"
            className="w-full h-12 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold shadow-lg shadow-orange-500/30 hover:scale-[1.02] transition-transform"
          >
            ورود به پنل
          </button>
        </form>
      </motion.div>
    </div>
  );
}
