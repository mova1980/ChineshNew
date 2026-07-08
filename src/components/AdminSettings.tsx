import { useState } from "react";
import { motion } from "framer-motion";
import {
  Save, Lock, Check, AlertCircle, Eye, EyeOff, Info,
  Type as TypeIcon, Sparkles, Layers,
} from "lucide-react";
import { useApp } from "../context/AppContext";

/* ─────────────────────── shared styles ─────────────────────── */
const inp =
  "w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 outline-none focus:border-orange-500 transition-colors text-sm";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs text-white/70 font-medium">{label}</label>
      {children}
      {hint && <p className="text-[10px] text-white/40 leading-relaxed">{hint}</p>}
    </div>
  );
}

function Card({
  icon: Icon,
  title,
  hint,
  children,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-4 md:p-5 rounded-2xl bg-white/[0.02] border border-white/10">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-orange-500/15 border border-orange-500/25 flex items-center justify-center shrink-0">
          <Icon size={16} className="text-orange-400" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-white">{title}</h3>
          {hint && <p className="text-[11px] text-white/50 mt-0.5 leading-relaxed">{hint}</p>}
        </div>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   HERO SETTINGS
═══════════════════════════════════════════════════════ */
export function HeroSettings({ ok }: { ok: (m: string) => void }) {
  const { data, updateHero, updateHeroCards } = useApp();
  const [h, setH] = useState(data.hero);
  const [c, setC] = useState(data.heroCards);
  const [dirty, setDirty] = useState(false);

  const changeHero = (patch: Partial<typeof h>) => {
    setH((prev) => ({ ...prev, ...patch }));
    setDirty(true);
  };
  const changeCards = (patch: Partial<typeof c>) => {
    setC((prev) => ({ ...prev, ...patch }));
    setDirty(true);
  };

  const save = () => {
    updateHero(h);
    updateHeroCards(c);
    setDirty(false);
    ok("تنظیمات صفحه اول ذخیره شد");
  };

  const reset = () => {
    setH(data.hero);
    setC(data.heroCards);
    setDirty(false);
  };

  const BilingualInput = ({
    valueFa,
    valueEn,
    onFa,
    onEn,
    placeholderFa = "فارسی",
    placeholderEn = "English",
    textarea = false,
    rows = 2,
  }: {
    valueFa: string;
    valueEn: string;
    onFa: (v: string) => void;
    onEn: (v: string) => void;
    placeholderFa?: string;
    placeholderEn?: string;
    textarea?: boolean;
    rows?: number;
  }) => (
    <div className="grid grid-cols-2 gap-2">
      <div>
        <div className="text-[10px] text-white/40 mb-1">فارسی</div>
        {textarea ? (
          <textarea value={valueFa} onChange={(e) => onFa(e.target.value)} rows={rows}
            placeholder={placeholderFa} className={inp + " resize-none"} />
        ) : (
          <input value={valueFa} onChange={(e) => onFa(e.target.value)}
            placeholder={placeholderFa} className={inp} />
        )}
      </div>
      <div>
        <div className="text-[10px] text-white/40 mb-1">English</div>
        {textarea ? (
          <textarea value={valueEn} onChange={(e) => onEn(e.target.value)} rows={rows}
            placeholder={placeholderEn} className={inp + " resize-none"} dir="ltr" />
        ) : (
          <input value={valueEn} onChange={(e) => onEn(e.target.value)}
            placeholder={placeholderEn} className={inp} dir="ltr" />
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-xl font-black text-white">صفحه اصلی (هیرو)</h2>
          <p className="text-xs text-white/50 mt-0.5">
            متن‌ها، عنوان و کارت‌های شناور صفحه اول را از اینجا مدیریت کنید.
          </p>
        </div>
        {dirty && (
          <div className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-yellow-500/15 border border-yellow-500/30 text-yellow-300">
            <AlertCircle size={12} /> تغییرات ذخیره نشده
          </div>
        )}
      </div>

      {/* Live preview strip */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-navy-900 to-navy-800 border border-white/10">
        <div className="text-[10px] uppercase tracking-widest text-white/40 mb-2">پیش‌نمایش زنده</div>
        <div className="space-y-1">
          {h.eyebrow.fa && (
            <div className="text-[10px] text-orange-300">{h.eyebrow.fa}</div>
          )}
          <div className="text-xl md:text-2xl font-black text-white leading-snug">
            {h.title1.fa}{" "}
            <span className="gradient-text">{h.titleAccent.fa}</span>
            {h.title2.fa ? ` ${h.title2.fa}` : ""}
          </div>
          {h.desc.fa && (
            <p className="text-xs text-white/60 leading-relaxed pt-1">{h.desc.fa}</p>
          )}
        </div>
      </div>

      {/* Eyebrow */}
      <Card icon={Sparkles} title="نوار بالای عنوان (Eyebrow)"
        hint="متن کوتاهی که در بالای عنوان اصلی، درون یک کپسول شیشه‌ای نمایش داده می‌شود.">
        <BilingualInput
          valueFa={h.eyebrow.fa} valueEn={h.eyebrow.en}
          onFa={(v) => changeHero({ eyebrow: { ...h.eyebrow, fa: v } })}
          onEn={(v) => changeHero({ eyebrow: { ...h.eyebrow, en: v } })}
        />
      </Card>

      {/* Title parts */}
      <Card icon={TypeIcon} title="عنوان اصلی صفحه"
        hint="عنوان به سه بخش تقسیم می‌شود: بخش قبل، کلمه با افکت (که با گرادیانت و درخشش خاص نمایش داده می‌شود)، و بخش بعد (اختیاری).">
        <Field label="بخش اول (قبل از کلمه با افکت)">
          <BilingualInput
            valueFa={h.title1.fa} valueEn={h.title1.en}
            onFa={(v) => changeHero({ title1: { ...h.title1, fa: v } })}
            onEn={(v) => changeHero({ title1: { ...h.title1, en: v } })}
          />
        </Field>
        <Field label="کلمه با افکت درخشش">
          <BilingualInput
            valueFa={h.titleAccent.fa} valueEn={h.titleAccent.en}
            onFa={(v) => changeHero({ titleAccent: { ...h.titleAccent, fa: v } })}
            onEn={(v) => changeHero({ titleAccent: { ...h.titleAccent, en: v } })}
          />
        </Field>
        <Field label="بخش دوم (اختیاری)">
          <BilingualInput
            valueFa={h.title2.fa} valueEn={h.title2.en}
            onFa={(v) => changeHero({ title2: { ...h.title2, fa: v } })}
            onEn={(v) => changeHero({ title2: { ...h.title2, en: v } })}
            placeholderFa="(اختیاری — خالی بگذارید تا حذف شود)"
            placeholderEn="(optional)"
          />
        </Field>
      </Card>

      {/* Description */}
      <Card icon={Info} title="توضیح زیر عنوان">
        <BilingualInput
          valueFa={h.desc.fa} valueEn={h.desc.en}
          onFa={(v) => changeHero({ desc: { ...h.desc, fa: v } })}
          onEn={(v) => changeHero({ desc: { ...h.desc, en: v } })}
          textarea rows={3}
        />
      </Card>

      {/* Floating cards */}
      <Card icon={Layers} title="کارت‌های شناور روی تصویر"
        hint="این کارت‌ها روی تصویر سمت راست صفحه اول (کنار متن) نمایش داده می‌شوند.">
        <Field label="کارت بالا — اخبار فوری">
          <BilingualInput
            valueFa={c.top.fa} valueEn={c.top.en}
            onFa={(v) => changeCards({ top: { ...c.top, fa: v } })}
            onEn={(v) => changeCards({ top: { ...c.top, en: v } })}
          />
        </Field>
        <Field label="کارت پایین — عنوان (مثال: گزارش لحظه‌ای)">
          <BilingualInput
            valueFa={c.bottom.fa} valueEn={c.bottom.en}
            onFa={(v) => changeCards({ bottom: { ...c.bottom, fa: v } })}
            onEn={(v) => changeCards({ bottom: { ...c.bottom, en: v } })}
          />
        </Field>
        <Field label="زیرنویس روی تصویر اصلی — بالا (رنگ نارنجی)">
          <BilingualInput
            valueFa={c.caption.fa} valueEn={c.caption.en}
            onFa={(v) => changeCards({ caption: { ...c.caption, fa: v } })}
            onEn={(v) => changeCards({ caption: { ...c.caption, en: v } })}
          />
        </Field>
        <Field label="زیرنویس روی تصویر اصلی — پایین (متن اصلی)">
          <BilingualInput
            valueFa={c.captionSub.fa} valueEn={c.captionSub.en}
            onFa={(v) => changeCards({ captionSub: { ...c.captionSub, fa: v } })}
            onEn={(v) => changeCards({ captionSub: { ...c.captionSub, en: v } })}
          />
        </Field>
      </Card>

      {/* Save / Reset */}
      <div className="flex gap-2 sticky bottom-0 bg-navy-950/80 backdrop-blur-md p-3 -mx-3 rounded-2xl border border-white/5">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={save}
          disabled={!dirty}
          className={`flex-1 h-11 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
            dirty
              ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30"
              : "bg-white/5 text-white/40 cursor-not-allowed"
          }`}
        >
          <Save size={16} /> ذخیره تغییرات
        </motion.button>
        {dirty && (
          <button
            onClick={reset}
            className="h-11 px-5 rounded-2xl bg-white/5 border border-white/10 text-white font-medium text-sm hover:bg-white/10 transition-colors"
          >
            انصراف
          </button>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   PASSWORD SETTINGS
═══════════════════════════════════════════════════════ */
export function PasswordSettings({ ok }: { ok: (m: string) => void }) {
  const { changeAdminPassword } = useApp();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setMsg("");

    if (!current) return setErr("رمز فعلی را وارد کنید");
    if (next.length < 3) return setErr("رمز جدید باید حداقل ۳ کاراکتر باشد");
    if (next === current) return setErr("رمز جدید نباید با رمز فعلی یکسان باشد");
    if (next !== confirm) return setErr("تکرار رمز جدید مطابقت ندارد");

    const res = await changeAdminPassword(current, next);
    if (!res.ok) return setErr(res.error || "تغییر رمز انجام نشد");
    setMsg("رمز عبور با موفقیت تغییر کرد");
    setCurrent(""); setNext(""); setConfirm("");
    ok("رمز عبور تغییر کرد");
  };

  // Strength meter
  const strength = (() => {
    if (!next) return 0;
    let s = 0;
    if (next.length >= 3) s++;
    if (next.length >= 6) s++;
    if (next.length >= 10) s++;
    if (/[A-Z]/.test(next) || /[۰-۹0-9]/.test(next)) s++;
    if (/[^A-Za-z0-9]/.test(next)) s++;
    return s;
  })();

  const strengthLabel = ["ضعیف", "ضعیف", "متوسط", "خوب", "قوی", "بسیار قوی"][strength];
  const strengthColor =
    strength <= 1 ? "bg-red-500" :
    strength === 2 ? "bg-orange-500" :
    strength === 3 ? "bg-yellow-500" :
    "bg-green-500";

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-black text-white">تنظیمات امنیتی</h2>
        <p className="text-xs text-white/50 mt-0.5">تغییر رمز عبور ورود به پنل مدیریت</p>
      </div>

      <Card icon={Info} title="اطلاعات حساب">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-white/60">نام کاربری:</span>
          <span className="font-mono text-orange-300 bg-orange-500/10 px-2 py-0.5 rounded">admin</span>
          <span className="text-[10px] text-white/40 mr-2">(ثابت است و قابل تغییر نیست)</span>
        </div>
      </Card>

      <form onSubmit={submit} className="space-y-4">
        <Card icon={Lock} title="تغییر رمز عبور">
          <Field label="رمز عبور فعلی">
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                className={inp + " pl-10"}
                placeholder="••••"
                autoComplete="current-password"
              />
              <button type="button" onClick={() => setShowCurrent(!showCurrent)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white">
                {showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </Field>

          <Field label="رمز عبور جدید" hint="حداقل ۳ کاراکتر — پیشنهاد می‌شود از ترکیب حروف، اعداد و علائم استفاده کنید.">
            <div className="relative">
              <input
                type={showNext ? "text" : "password"}
                value={next}
                onChange={(e) => setNext(e.target.value)}
                className={inp + " pl-10"}
                placeholder="رمز جدید"
                autoComplete="new-password"
              />
              <button type="button" onClick={() => setShowNext(!showNext)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white">
                {showNext ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {next && (
              <div className="mt-2 space-y-1">
                <div className="flex gap-1 h-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className={`flex-1 rounded-full transition-colors ${
                      i <= strength ? strengthColor : "bg-white/10"
                    }`} />
                  ))}
                </div>
                <div className="text-[10px] text-white/50">قدرت: {strengthLabel}</div>
              </div>
            )}
          </Field>

          <Field label="تکرار رمز عبور جدید">
            <input
              type={showNext ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={inp}
              placeholder="تکرار رمز جدید"
              autoComplete="new-password"
            />
            {confirm && next && confirm !== next && (
              <div className="mt-1 text-[10px] text-red-400 flex items-center gap-1">
                <AlertCircle size={10} /> با رمز جدید مطابقت ندارد
              </div>
            )}
            {confirm && next && confirm === next && (
              <div className="mt-1 text-[10px] text-green-400 flex items-center gap-1">
                <Check size={10} /> مطابقت دارد
              </div>
            )}
          </Field>
        </Card>

        {err && (
          <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5">
            <AlertCircle size={14} /> {err}
          </div>
        )}
        {msg && (
          <div className="flex items-center gap-2 text-sm text-green-400 bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-2.5">
            <Check size={14} /> {msg}
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full h-11 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30"
        >
          <Lock size={16} /> تغییر رمز عبور
        </motion.button>
      </form>
    </div>
  );
}
