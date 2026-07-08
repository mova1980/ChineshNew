import { Zap } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function BreakingTicker() {
  const { lang, t, dir, data } = useApp();
  // Use live data from store
  const items = data.breaking.map(b => b[lang]);
  if (!items.length) return null;
  const dup = [...items, ...items, ...items];

  return (
    <div className="relative z-20 border-y border-orange-500/30 bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900">
      <div className={`flex items-stretch ${dir === "rtl" ? "flex-row-reverse" : "flex-row"}`}>
        <div className="shrink-0 px-5 md:px-7 py-3 bg-gradient-to-r from-orange-500 to-orange-600 flex items-center gap-2 text-white font-bold text-sm">
          <Zap size={16} className="animate-pulse" />
          <span>{t.sections.breaking}</span>
        </div>
        <div className="relative flex-1 overflow-hidden">
          <div
            className={`flex gap-12 py-3 whitespace-nowrap ${dir === "rtl" ? "marquee-rtl" : "marquee-ltr"}`}
            style={{ width: "200%" }}
          >
            {dup.map((it, i) => (
              <span key={i} className="text-white/90 text-sm flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                {it}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
