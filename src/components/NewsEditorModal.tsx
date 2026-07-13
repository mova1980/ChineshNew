import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, X } from "lucide-react";
import type { NewsItem } from "../data/store";

interface Props {
  open: boolean;
  news: NewsItem | null;
  existingNews: NewsItem[];
  onClose: () => void;
  onSave: (news: NewsItem) => void;
}

const inp = "w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 outline-none focus:border-orange-500 transition-colors text-sm";

export default function NewsEditorModal({ open, news, existingNews, onClose, onSave }: Props) {
  const [item, setItem] = useState<NewsItem>(news || {
    id: "n_" + Date.now(),
    title: { fa: "", en: "" },
    excerpt: { fa: "", en: "" },
    body: { fa: "", en: "" },
    image: "",
    category: "city",
    date: { fa: "امروز", en: "Today" },
  });

  const save = () => {
    if (!item.title.fa.trim()) {
      alert("عنوان فارسی الزامی است");
      return;
    }
    onSave(item);
  };

  return (
    <AnimatePresence>
      {open && item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[500] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.9, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 30 }}
            className="w-full max-w-2xl glass rounded-3xl shadow-2xl overflow-hidden"
            dir="rtl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-gradient-to-l from-orange-500/10 to-transparent">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                {existingNews.find((n) => n.id === item.id) ? "ویرایش خبر" : "افزودن خبر جدید"}
              </h3>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-red-500/30 text-white flex items-center justify-center"
              >
                <X size={15} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
              {/* Title */}
              <div className="space-y-2">
                <div>
                  <label className="block text-xs text-white/60 font-medium mb-1">عنوان فارسی *</label>
                  <input
                    value={item.title.fa}
                    onChange={(e) => setItem({ ...item, title: { ...item.title, fa: e.target.value } })}
                    placeholder="عنوان خبر به فارسی..."
                    className={inp}
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/60 font-medium mb-1">Title (English)</label>
                  <input
                    value={item.title.en}
                    onChange={(e) => setItem({ ...item, title: { ...item.title, en: e.target.value } })}
                    placeholder="News title in English..."
                    className={inp}
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Subtitle */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-white/60 font-medium mb-1">زیرعنوان فارسی</label>
                  <input
                    value={item.subtitle?.fa || ""}
                    onChange={(e) => setItem({ ...item, subtitle: { fa: e.target.value, en: item.subtitle?.en || "" } })}
                    placeholder="اختیاری..."
                    className={inp}
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/60 font-medium mb-1">Subtitle EN</label>
                  <input
                    value={item.subtitle?.en || ""}
                    onChange={(e) => setItem({ ...item, subtitle: { fa: item.subtitle?.fa || "", en: e.target.value } })}
                    placeholder="Optional..."
                    className={inp}
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div className="space-y-2">
                <div>
                  <label className="block text-xs text-white/60 font-medium mb-1">خلاصه خبر (فارسی) *</label>
                  <textarea
                    value={item.excerpt.fa}
                    rows={3}
                    onChange={(e) => setItem({ ...item, excerpt: { ...item.excerpt, fa: e.target.value } })}
                    placeholder="خلاصه خبر..."
                    className={inp + " resize-none"}
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/60 font-medium mb-1">Excerpt (English)</label>
                  <textarea
                    value={item.excerpt.en}
                    rows={2}
                    onChange={(e) => setItem({ ...item, excerpt: { ...item.excerpt, en: e.target.value } })}
                    placeholder="News excerpt..."
                    className={inp + " resize-none"}
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Body */}
              <div className="space-y-2">
                <div>
                  <label className="block text-xs text-white/60 font-medium mb-1">متن کامل خبر (فارسی)</label>
                  <textarea
                    value={item.body?.fa || ""}
                    rows={5}
                    onChange={(e) => setItem({ ...item, body: { fa: e.target.value, en: item.body?.en || "" } })}
                    placeholder="متن کامل..."
                    className={inp + " resize-none"}
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/60 font-medium mb-1">Full body (English)</label>
                  <textarea
                    value={item.body?.en || ""}
                    rows={4}
                    onChange={(e) => setItem({ ...item, body: { fa: item.body?.fa || "", en: e.target.value } })}
                    placeholder="Full news body..."
                    className={inp + " resize-none"}
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Image */}
              <div>
                <label className="block text-xs text-white/60 font-medium mb-1">آدرس تصویر (URL)</label>
                <input
                  value={item.image}
                  onChange={(e) => setItem({ ...item, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className={inp}
                  dir="ltr"
                />
                {item.image && (
                  <div className="mt-2 rounded-xl overflow-hidden h-36 border border-white/10">
                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Category & Date */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-white/60 font-medium mb-1">دسته‌بندی</label>
                  <select
                    value={item.category}
                    onChange={(e) => setItem({ ...item, category: e.target.value as any })}
                    className={inp}
                  >
                    <option value="city" className="bg-navy-900">شهری / Urban</option>
                    <option value="culture" className="bg-navy-900">فرهنگی / Culture</option>
                    <option value="society" className="bg-navy-900">اجتماعی / Society</option>
                    <option value="economy" className="bg-navy-900">اقتصادی / Economy</option>
                    <option value="sport" className="bg-navy-900">ورزشی / Sport</option>
                    <option value="photo" className="bg-navy-900">تصویری / Photo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-white/60 font-medium mb-1">تاریخ نمایش (فارسی)</label>
                  <input
                    value={item.date.fa}
                    onChange={(e) => setItem({ ...item, date: { ...item.date, fa: e.target.value } })}
                    placeholder="مثال: ۱۰ مهر ۱۴۰۵"
                    className={inp}
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/60 font-medium mb-1">Date (English)</label>
                  <input
                    value={item.date.en}
                    onChange={(e) => setItem({ ...item, date: { ...item.date, en: e.target.value } })}
                    placeholder="e.g., Oct 10, 2025"
                    className={inp}
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Actual news date for relative time calculation */}
              <div>
                <label className="block text-xs text-white/60 font-medium mb-1">تاریخ واقعی خبر (برای محاسبه خودکار زمان نسبی)</label>
                <input
                  type="date"
                  value={item.createdAt ? item.createdAt.split('T')[0] : ''}
                  onChange={(e) => setItem({ ...item, createdAt: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
                  className={inp}
                  dir="ltr"
                />
                <p className="text-[10px] text-white/40 mt-1">اگر این فیلد را پر کنید، زمان نسبی (مثلاً «۳ روز قبل») به‌طور خودکار محاسبه می‌شود</p>
              </div>

              {/* Photo checkbox */}
              <label className="flex items-center gap-2 text-white/75 text-sm cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={!!item.isPhoto}
                  onChange={(e) => setItem({ ...item, isPhoto: e.target.checked })}
                  className="w-4 h-4 accent-orange-500 rounded"
                />
                گزارش تصویری
              </label>
            </div>

            {/* Footer */}
            <div className="flex gap-3 px-6 py-4 border-t border-white/10 bg-navy-950/30">
              <button
                onClick={save}
                className="flex-1 h-11 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30"
              >
                <Save size={16} /> ذخیره خبر
              </button>
              <button
                onClick={onClose}
                className="h-11 px-5 rounded-2xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-colors"
              >
                انصراف
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
