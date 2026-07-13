import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Trash2, Edit3, Save,
  Newspaper, Images, Zap, List,
  Mail, LogOut, Menu,
  LayoutDashboard, ChevronRight,
  Eye, Check, Clock, Settings
} from "lucide-react";
import { useApp } from "../context/AppContext";
import type { NewsItem, GalleryImage, NavItem } from "../data/store";
import { HeroSettings, PasswordSettings } from "./AdminSettings";
import AdminMediaManager from "./AdminMediaManager";
import NewsEditorModal from "./NewsEditorModal";
import { uploadMedia } from "../lib/db";

/* ─────────────────────── helpers ─────────────────────── */
const todayFa = () => {
  const d = new Date();
  const months = ["فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریور","مهر","آبان","آذر","دی","بهمن","اسفند"];
  // Simple Gregorian→Solar approximation
  const month = d.getMonth();
  const day   = d.getDate();
  return `${day} ${months[month]}`;
};
const todayEn = () => new Date().toLocaleDateString("en-US", { month:"short", day:"numeric" });

const emptyNews = (): NewsItem => ({
  id: "n_" + Date.now(),
  title:   { fa: "", en: "" },
  excerpt: { fa: "", en: "" },
  body:    { fa: "", en: "" },
  image:   "",
  category: "city",
  date:    { fa: todayFa(), en: todayEn() },
});

/* ─────────────────────── toast ─────────────────────── */
function Toast({ msg, onHide }: { msg: string; onHide: () => void }) {
  useEffect(() => { const t = setTimeout(onHide, 2500); return () => clearTimeout(t); }, [onHide]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      className="fixed bottom-6 right-6 z-[999] flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-green-600 to-green-700 text-white shadow-2xl font-bold text-sm"
    >
      <Check size={16} /> {msg}
    </motion.div>
  );
}

/* ─────────────────────── bi-lingual field ─────────────────────── */
function BiField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs text-white/60 font-medium">{label}</label>
      {children}
    </div>
  );
}
const inp = "w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 outline-none focus:border-orange-500 transition-colors text-sm";

function InlineUploadButton({ onUploaded }: { onUploaded: (url: string) => void }) {
  const [busy, setBusy] = useState(false);
  const upload = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    try {
      const url = await uploadMedia(file);
      onUploaded(url);
    } catch (error) {
      console.error(error);
      alert("آپلود تصویر انجام نشد. اگر Supabase تنظیم نشده باشد، از تصاویر آماده یا URL آنلاین استفاده کنید.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <label className="inline-flex items-center justify-center h-9 px-3 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-300 hover:bg-orange-500/25 text-xs font-bold cursor-pointer transition-colors">
      {busy ? "در حال آپلود..." : "آپلود از PC"}
      <input type="file" accept="image/*" className="hidden" disabled={busy} onChange={(e) => upload(e.target.files?.[0])} />
    </label>
  );
}

/* ═══════════════════════════════════════════════════════ */
export default function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const {
    data,
    addNews, updateNews, deleteNews,
    addGallery, updateGallery, deleteGallery,
    addBreaking, updateBreaking, deleteBreaking,
    updateNav, clearNewsletter,
  } = useApp();

  type TabId = "dashboard"|"hero"|"featured"|"latest"|"highlights"|"breaking"|"gallery"|"media"|"nav"|"newsletter"|"settings";
  const [tab, setTab]         = useState<TabId>("dashboard");
  const [sideOpen, setSideOpen] = useState(false);
  const [toast, setToast]     = useState("");
  const [editing, setEditing] = useState<NewsItem | null>(null);

  // Breaking
  const [bIdx, setBIdx]   = useState<number|null>(null);
  const [bForm, setBForm] = useState({ fa:"", en:"" });
  // Gallery
  const [gIdx, setGIdx]   = useState<number|null>(null);
  const [gForm, setGForm] = useState<GalleryImage>({ src:"", label:{fa:"",en:""}, span:"col-span-6 md:col-span-4 md:h-[280px]" });
  // Nav
  const [nIdx, setNIdx]   = useState<number|null>(null);
  const [nForm, setNForm] = useState<NavItem>({ key:"home", label:{fa:"",en:""}, href:"#" });

  const ok = (msg: string) => setToast(msg);



  /* ── tabs config ── */
  const tabs = [
    { id:"dashboard",  label:"داشبورد",            icon: LayoutDashboard },
    { id:"hero",       label:"صفحه اصلی (هیرو)",   icon: Eye },
    { id:"featured",   label:"اخبار ویژه (تیتر یک)", icon: Newspaper },
    { id:"latest",     label:"آخرین اخبار",         icon: Newspaper },
    { id:"highlights", label:"آرشیو اخبار",          icon: Newspaper },
    { id:"breaking",   label:"اخبار فوری",          icon: Zap },
    { id:"gallery",    label:"نگارخانه",            icon: Images },
    { id:"media",      label:"رسانه‌ها / آپلود",    icon: Images },
    { id:"nav",        label:"منوها",               icon: List },
    { id:"newsletter", label:"خبرنامه‌ها",         icon: Mail },
    { id:"settings",   label:"تنظیمات / رمز عبور", icon: Settings },
  ] as const;

  /* ══════════════════════════════════════════════════════
     NEWS EDITOR MODAL
  ══════════════════════════════════════════════════════ */

  /* ══════════════════════════════════════════════════════
     NEWS LIST SECTION
  ══════════════════════════════════════════════════════ */
  const NewsList = ({ section }: { section:"featured"|"latest"|"highlights" }) => {
    const label = { featured:"اخبار ویژه (تیتر یک)", latest:"آخرین اخبار", highlights:"آرشیو اخبار" }[section];
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-white">{label}</h2>
            <p className="text-xs text-white/40 mt-0.5">{data[section].length} خبر — خبرهای جدید در بالای سایت نمایش داده می‌شوند</p>
          </div>
          <button onClick={()=>setEditing(emptyNews())}
            className="flex items-center gap-2 px-4 h-10 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-sm shadow-lg shadow-orange-500/20 hover:scale-105 transition-transform">
            <Plus size={14} /> خبر جدید
          </button>
        </div>

        {data[section].length === 0 ? (
          <div className="text-center py-16 text-white/30 border-2 border-dashed border-white/10 rounded-2xl">
            <Newspaper size={40} className="mx-auto mb-3 opacity-30" />
            <p>هنوز خبری ثبت نشده</p>
          </div>
        ) : (
          <div className="space-y-2">
            {data[section].map((n, idx) => (
              <motion.div key={n.id}
                initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
                transition={{ delay: idx*0.04 }}
                className="flex items-center gap-3 p-3 rounded-2xl glass border border-white/5 hover:border-orange-500/20 transition-colors group">
                {/* thumb */}
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-navy-800">
                  {n.image ? (
                    <img src={n.image} alt="" className="w-full h-full object-cover"
                      onError={e=>{(e.target as HTMLImageElement).src="/images/news-placeholder.jpg"}} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20"><Newspaper size={20}/></div>
                  )}
                </div>
                {/* info */}
                <div className="flex-1 min-w-0 text-right">
                  <div className="flex items-center gap-2 justify-end mb-0.5">
                    <span className="text-[10px] text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full">{n.category}</span>
                    <span className="flex items-center gap-1 text-[10px] text-white/40"><Clock size={10}/>{n.date.fa}</span>
                  </div>
                  <p className="text-sm font-bold text-white truncate">{n.title.fa || <em className="opacity-30">بدون عنوان</em>}</p>
                  <p className="text-[11px] text-white/40 truncate">{n.title.en}</p>
                </div>
                {/* actions */}
                <div className="flex gap-1.5 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
                  <button onClick={()=>setEditing(n)}
                    className="w-8 h-8 rounded-full bg-orange-500/10 hover:bg-orange-500/30 text-orange-300 flex items-center justify-center transition-colors">
                    <Edit3 size={13}/>
                  </button>
                  <button onClick={()=>{ if(confirm("حذف این خبر؟")) { deleteNews(section,n.id); ok("خبر حذف شد"); } }}
                    className="w-8 h-8 rounded-full bg-red-500/10 hover:bg-red-500/30 text-red-300 flex items-center justify-center transition-colors">
                    <Trash2 size={13}/>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Editor modal */}
        <NewsEditorModal
          open={editing !== null}
          news={editing}
          existingNews={data[section]}
          onClose={() => setEditing(null)}
          onSave={(item) => {
            const exists = data[section].find((n) => n.id === item.id);
            if (exists) {
              updateNews(section, item.id, item);
              ok("خبر ویرایش شد ✓");
            } else {
              addNews(section, item);
              ok("خبر جدید اضافه شد ✓");
            }
            setEditing(null);
          }}
        />
      </div>
    );
  };

  /* ══════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-navy-950" dir="rtl">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 pt-24 pb-12">

        {/* ── Top bar inside page ── */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-white">پنل مدیریت چینش</h1>
            <p className="text-xs text-white/40 mt-0.5">مدیریت کامل محتوای سایت</p>
          </div>
          <div className="flex items-center gap-2">
            <a href="#home" className="hidden md:flex items-center gap-2 px-4 h-9 rounded-full bg-white/5 border border-white/10 text-white/70 text-xs hover:bg-white/10 transition-colors">
              <Eye size={13}/> مشاهده سایت
            </a>
            <button onClick={onLogout}
              className="flex items-center gap-2 px-4 h-9 rounded-full bg-red-500/15 border border-red-500/30 text-red-300 text-xs hover:bg-red-500/25 transition-colors">
              <LogOut size={13}/> خروج
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-[240px_1fr] gap-5">
          {/* ── Sidebar ── */}
          <button className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm mb-3"
            onClick={()=>setSideOpen(!sideOpen)}>
            <Menu size={16}/> منو — {tabs.find(t=>t.id===tab)?.label}
          </button>

          <aside className={`${sideOpen?"block":"hidden"} lg:block bg-navy-900/60 rounded-2xl border border-white/5 p-2 h-fit sticky top-24`}>
            {(() => {
              // Split tabs into logical groups
              const groups: { title: string; ids: string[] }[] = [
                { title: "کلی", ids: ["dashboard"] },
                { title: "محتوای صفحه اول", ids: ["hero", "breaking"] },
                { title: "اخبار", ids: ["featured", "latest", "highlights"] },
                { title: "رسانه و منو", ids: ["gallery", "media", "nav"] },
                { title: "کاربران و تنظیمات", ids: ["newsletter", "settings"] },
              ];
              return groups.map((g, gi) => (
                <div key={gi} className={gi > 0 ? "mt-3 pt-3 border-t border-white/5" : ""}>
                  <p className="px-3 py-1.5 text-[10px] uppercase text-white/30 tracking-widest font-bold">{g.title}</p>
                  {tabs.filter(tb => g.ids.includes(tb.id)).map(tb => (
                    <button key={tb.id}
                      onClick={()=>{ setTab(tb.id); setSideOpen(false); }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-right transition-all mb-0.5 ${
                        tab===tb.id
                          ? "bg-gradient-to-l from-orange-500/20 to-orange-600/5 text-orange-300 border border-orange-500/20 font-bold"
                          : "text-white/60 hover:bg-white/5 hover:text-white"
                      }`}>
                      <tb.icon size={15} className={tab===tb.id?"text-orange-400":"text-white/40"}/>
                      <span className="flex-1">{tb.label}</span>
                      {tab===tb.id && <ChevronRight size={13} className="text-orange-400"/>}
                    </button>
                  ))}
                </div>
              ));
            })()}
          </aside>

          {/* ── Main content ── */}
          <main className="bg-navy-900/40 rounded-2xl border border-white/5 p-5 md:p-6 min-h-[500px]">

            {/* DASHBOARD */}
            {tab === "dashboard" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-black text-white mb-1">داشبورد</h2>
                  <p className="text-xs text-white/40">خلاصه وضعیت سایت پایگاه خبری چینش</p>
                </div>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  {[
                    { l:"اخبار ویژه", v:data.featured.length, c:"from-orange-500 to-orange-700", onClick:()=>setTab("featured") },
                    { l:"آخرین اخبار", v:data.latest.length,   c:"from-navy-600 to-navy-800",   onClick:()=>setTab("latest") },
                    { l:"آرشیو اخبار", v:data.highlights.length,c:"from-orange-700 to-red-700",  onClick:()=>setTab("highlights") },
                    { l:"اخبار فوری", v:data.breaking.length,  c:"from-red-600 to-orange-500",  onClick:()=>setTab("breaking") },
                    { l:"گالری",      v:data.gallery.length,   c:"from-navy-700 to-navy-900",   onClick:()=>setTab("gallery") },
                    { l:"منوها",      v:data.nav.length,       c:"from-orange-600 to-yellow-600",onClick:()=>setTab("nav") },
                    { l:"خبرنامه",   v:data.newsletter.length, c:"from-navy-500 to-orange-700", onClick:()=>setTab("newsletter") },
                    { l:"صفحه اصلی", v:1, c:"from-orange-400 to-orange-600", onClick:()=>setTab("hero") },
                    { l:"تنظیمات",   v:1, c:"from-navy-700 to-orange-700",     onClick:()=>setTab("settings") },
                  ].map((s,i)=>(
                    <motion.button key={i} onClick={s.onClick}
                      whileHover={{ y:-3, scale:1.03 }} transition={{ type:"spring", stiffness:300 }}
                      className={`relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br ${s.c} border border-white/10 text-right shadow-lg cursor-pointer`}>
                      <div className="text-3xl font-black text-white mb-0.5">{s.v}</div>
                      <div className="text-xs text-white/80">{s.l}</div>
                      <div className="absolute -bottom-3 -left-3 w-16 h-16 rounded-full bg-white/10 blur-xl"/>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* NEWS SECTIONS */}
            {(tab === "featured" || tab === "latest" || tab === "highlights") && (
              <NewsList section={tab} />
            )}

            {/* BREAKING NEWS */}
            {tab === "breaking" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-black text-white">اخبار فوری</h2>
                    <p className="text-xs text-white/40 mt-0.5">در نوار لرزان بالای صفحه نمایش داده می‌شود</p>
                  </div>
                  <button onClick={()=>{ setBForm({fa:"",en:""}); setBIdx(-1); }}
                    className="flex items-center gap-2 px-4 h-10 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-sm shadow-lg shadow-orange-500/20">
                    <Plus size={14}/> افزودن
                  </button>
                </div>

                {/* form */}
                <AnimatePresence>
                  {bIdx !== null && (
                    <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}
                      className="glass rounded-2xl p-4 space-y-3 border border-orange-500/20">
                      <BiField label="متن فارسی *">
                        <input value={bForm.fa} onChange={e=>setBForm({...bForm,fa:e.target.value})} className={inp} placeholder="خبر فوری به فارسی..."/>
                      </BiField>
                      <BiField label="English text">
                        <input value={bForm.en} onChange={e=>setBForm({...bForm,en:e.target.value})} className={inp} placeholder="Breaking news..." dir="ltr"/>
                      </BiField>
                      <div className="flex gap-2">
                        <button onClick={()=>{
                          if(!bForm.fa.trim()){alert("متن فارسی الزامی است");return;}
                          if(bIdx===-1) addBreaking(bForm);
                          else updateBreaking(bIdx,bForm);
                          setBIdx(null); setBForm({fa:"",en:""}); ok("اخبار فوری ذخیره شد ✓");
                        }} className="flex-1 h-10 rounded-xl bg-orange-500 text-white font-bold flex items-center justify-center gap-2 text-sm">
                          <Save size={14}/> ذخیره
                        </button>
                        <button onClick={()=>setBIdx(null)} className="h-10 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm">انصراف</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-2">
                  {data.breaking.map((b,i)=>(
                    <div key={i} className="flex items-center gap-3 p-3 glass rounded-xl border border-white/5">
                      <Zap size={15} className="text-orange-400 shrink-0"/>
                      <div className="flex-1 text-right min-w-0">
                        <div className="text-sm text-white truncate">{b.fa}</div>
                        <div className="text-[11px] text-white/40 truncate">{b.en}</div>
                      </div>
                      <button onClick={()=>{setBForm(b);setBIdx(i);}} className="w-8 h-8 rounded-full bg-orange-500/10 hover:bg-orange-500/30 text-orange-300 flex items-center justify-center"><Edit3 size={13}/></button>
                      <button onClick={()=>{if(confirm("حذف؟")){deleteBreaking(i);ok("حذف شد");}}} className="w-8 h-8 rounded-full bg-red-500/10 hover:bg-red-500/30 text-red-300 flex items-center justify-center"><Trash2 size={13}/></button>
                    </div>
                  ))}
                  {data.breaking.length===0 && <p className="text-center py-10 text-white/30 text-sm">خبر فوری‌ای ثبت نشده</p>}
                </div>
              </div>
            )}

            {/* GALLERY */}
            {tab === "gallery" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-black text-white">نگارخانه</h2>
                    <p className="text-xs text-white/40 mt-0.5">تصاویر در بخش نگارخانه سایت نمایش داده می‌شوند</p>
                  </div>
                  <button onClick={()=>{setGForm({src:"",label:{fa:"",en:""},span:"col-span-6 md:col-span-4 md:h-[280px]"});setGIdx(-1);}}
                    className="flex items-center gap-2 px-4 h-10 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-sm">
                    <Plus size={14}/> افزودن تصویر
                  </button>
                </div>

                <AnimatePresence>
                  {gIdx !== null && (
                    <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}
                      className="glass rounded-2xl p-4 space-y-3 border border-orange-500/20">
                      <BiField label="آدرس تصویر (URL) *">
                        <div className="flex gap-2">
                          <input value={gForm.src} onChange={e=>setGForm({...gForm,src:e.target.value})} className={inp + " flex-1"} placeholder="https://..." dir="ltr"/>
                          <InlineUploadButton onUploaded={(url)=>setGForm({...gForm,src:url})} />
                        </div>
                        {gForm.src && <div className="mt-2 h-32 rounded-xl overflow-hidden border border-white/10"><img src={gForm.src} alt="" className="w-full h-full object-cover"/></div>}
                      </BiField>
                      <div className="grid grid-cols-2 gap-2">
                        <BiField label="عنوان فارسی"><input value={gForm.label.fa} onChange={e=>setGForm({...gForm,label:{...gForm.label,fa:e.target.value}})} className={inp} placeholder="عنوان..."/></BiField>
                        <BiField label="English label"><input value={gForm.label.en} onChange={e=>setGForm({...gForm,label:{...gForm.label,en:e.target.value}})} className={inp} placeholder="Label..." dir="ltr"/></BiField>
                      </div>
                      <BiField label="اندازه تصویر">
                        <select value={gForm.span} onChange={e=>setGForm({...gForm,span:e.target.value})} className={inp}>
                          <option value="col-span-12 md:col-span-7 row-span-2 aspect-[16/11] md:aspect-auto md:h-[520px]">بزرگ (7 ستون)</option>
                          <option value="col-span-6 md:col-span-5 aspect-square md:h-[250px]">متوسط (5 ستون)</option>
                          <option value="col-span-6 md:col-span-4 aspect-square md:h-[280px]">کوچک (4 ستون)</option>
                          <option value="col-span-12 md:col-span-4 aspect-[16/9] md:h-[280px]">عریض (4 ستون)</option>
                        </select>
                      </BiField>
                      <BiField label="تاریخ عکس (اختیاری)">
                        <input
                          type="date"
                          value={gForm.createdAt ? gForm.createdAt.split('T')[0] : ''}
                          onChange={(e) => setGForm({ ...gForm, createdAt: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
                          className={inp}
                          dir="ltr"
                        />
                        <p className="text-[10px] text-white/40 mt-1">برای نمایش تاریخ در نگارخانه</p>
                      </BiField>
                      <div className="flex gap-2">
                        <button onClick={()=>{
                          if(!gForm.src.trim()){alert("آدرس تصویر الزامی است");return;}
                          if(gIdx===-1) addGallery(gForm);
                          else updateGallery(gIdx,gForm);
                          setGIdx(null); ok("تصویر ذخیره شد ✓");
                        }} className="flex-1 h-10 rounded-xl bg-orange-500 text-white font-bold flex items-center justify-center gap-2 text-sm">
                          <Save size={14}/> ذخیره
                        </button>
                        <button onClick={()=>setGIdx(null)} className="h-10 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm">انصراف</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {data.gallery.map((g,i)=>(
                    <div key={i} className="group relative rounded-xl overflow-hidden border border-white/10">
                      <img src={g.src} alt="" className="w-full h-28 object-cover"
                        onError={e=>{(e.target as HTMLImageElement).src="/images/news-placeholder.jpg"}}/>
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-950 to-transparent"/>
                      <div className="absolute bottom-2 right-2 text-[11px] text-white font-bold truncate max-w-[70%]">{g.label.fa}</div>
                      <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={()=>{setGForm(g);setGIdx(i);}} className="w-7 h-7 rounded-full bg-black/50 hover:bg-orange-500/70 text-white flex items-center justify-center"><Edit3 size={11}/></button>
                        <button onClick={()=>{if(confirm("حذف؟")){deleteGallery(i);ok("حذف شد");}}} className="w-7 h-7 rounded-full bg-black/50 hover:bg-red-500/70 text-white flex items-center justify-center"><Trash2 size={11}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* NAV */}
            {tab === "nav" && (
              <div className="space-y-4">
                <h2 className="text-xl font-black text-white">مدیریت منوها</h2>
                <AnimatePresence>
                  {nIdx !== null && (
                    <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}
                      className="glass rounded-2xl p-4 space-y-3 border border-orange-500/20">
                      <div className="grid grid-cols-2 gap-2">
                        <BiField label="عنوان فارسی"><input value={nForm.label.fa} onChange={e=>setNForm({...nForm,label:{...nForm.label,fa:e.target.value}})} className={inp} placeholder="عنوان..."/></BiField>
                        <BiField label="English label"><input value={nForm.label.en} onChange={e=>setNForm({...nForm,label:{...nForm.label,en:e.target.value}})} className={inp} placeholder="Label..." dir="ltr"/></BiField>
                      </div>
                      <BiField label="لینک (href)">
                        <input value={nForm.href} onChange={e=>setNForm({...nForm,href:e.target.value})} className={inp} placeholder="#section" dir="ltr"/>
                      </BiField>
                      <div className="flex gap-2">
                        <button onClick={()=>{updateNav(nIdx,nForm);setNIdx(null);ok("منو ذخیره شد ✓");}} className="flex-1 h-10 rounded-xl bg-orange-500 text-white font-bold flex items-center justify-center gap-2 text-sm"><Save size={14}/> ذخیره</button>
                        <button onClick={()=>setNIdx(null)} className="h-10 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm">انصراف</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="space-y-2">
                  {data.nav.map((n,i)=>(
                    <div key={i} className="flex items-center gap-3 p-3 glass rounded-xl border border-white/5">
                      <div className="w-7 h-7 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-300 text-xs font-black shrink-0">{i+1}</div>
                      <div className="flex-1 text-right">
                        <div className="text-sm font-bold text-white">{n.label.fa}</div>
                        <div className="text-[11px] text-white/40">{n.label.en} → {n.href}</div>
                      </div>
                      <button onClick={()=>{setNForm(n);setNIdx(i);}} className="w-8 h-8 rounded-full bg-orange-500/10 hover:bg-orange-500/30 text-orange-300 flex items-center justify-center"><Edit3 size={13}/></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* NEWSLETTER */}
            {tab === "newsletter" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-black text-white">اشتراک‌های خبرنامه</h2>
                    <p className="text-xs text-white/40 mt-0.5">{data.newsletter.length} عضو</p>
                  </div>
                  {data.newsletter.length > 0 && (
                    <button onClick={()=>{if(confirm("حذف همه ایمیل‌ها؟")){clearNewsletter();ok("همه ایمیل‌ها حذف شدند");}}}
                      className="flex items-center gap-2 px-4 h-9 rounded-full bg-red-500/15 border border-red-500/30 text-red-300 text-sm">
                      <Trash2 size={13}/> حذف همه
                    </button>
                  )}
                </div>
                {data.newsletter.length === 0 ? (
                  <p className="text-center py-16 text-white/30 text-sm">هنوز کسی عضو خبرنامه نشده</p>
                ) : (
                  <div className="space-y-2">
                    {data.newsletter.map((n,i)=>(
                      <div key={i} className="flex items-center gap-3 p-3 glass rounded-xl border border-white/5">
                        <Mail size={15} className="text-orange-400 shrink-0"/>
                        <div className="flex-1 text-right">
                          <div className="text-sm text-white">{n.email}</div>
                          <div className="text-[11px] text-white/40">{new Date(n.date).toLocaleDateString("fa-IR")}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === "hero" && <HeroSettings ok={ok} />}

            {tab === "media" && <AdminMediaManager ok={ok} />}

            {tab === "settings" && <PasswordSettings ok={ok} />}

          </main>
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast msg={toast} onHide={()=>setToast("")}/>}
      </AnimatePresence>
    </div>
  );
}
