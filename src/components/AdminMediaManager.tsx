import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Copy, Image, Loader2, UploadCloud } from "lucide-react";
import { uploadMedia } from "../lib/db";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

type MediaAsset = {
  id: string;
  public_url: string;
  file_name: string;
  mime_type: string | null;
  size: number | null;
  created_at: string;
};

export default function AdminMediaManager({ ok }: { ok: (m: string) => void }) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    if (!isSupabaseConfigured || !supabase) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("media_assets")
      .select("*")
      .order("created_at", { ascending: false });
    setLoading(false);
    if (error) {
      console.error(error);
      return;
    }
    setAssets(data || []);
  };

  useEffect(() => {
    load();
  }, []);

  const onUpload = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    try {
      await uploadMedia(file);
      ok("تصویر آپلود شد و آدرس آن آماده است");
      await load();
    } catch (error) {
      console.error(error);
      alert("آپلود انجام نشد. تنظیمات Supabase Storage و ورود ادمین را بررسی کنید.");
    } finally {
      setUploading(false);
    }
  };

  const copy = async (url: string) => {
    await navigator.clipboard.writeText(url);
    ok("آدرس تصویر کپی شد");
  };

  if (!isSupabaseConfigured) {
    return (
      <div className="rounded-2xl border border-orange-500/20 bg-orange-500/10 p-5 text-right">
        <h2 className="text-xl font-black text-white mb-2">مدیریت رسانه</h2>
        <p className="text-sm text-white/70 leading-relaxed">
          برای آپلود واقعی تصویر، ابتدا متغیرهای VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY را در Vercel تنظیم کنید و اسکریپت دیتابیس Supabase را اجرا کنید.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-white">مدیریت رسانه</h2>
          <p className="text-xs text-white/50 mt-0.5">
            ابتدا تصاویر را از PC آپلود کنید، سپس URL تولید شده را در خبرها یا نگارخانه استفاده کنید.
          </p>
        </div>
        <label className="relative inline-flex items-center gap-2 px-5 h-11 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-sm cursor-pointer shadow-lg shadow-orange-500/30 hover:scale-[1.02] transition-transform">
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
          {uploading ? "در حال آپلود..." : "آپلود تصویر"}
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer"
            disabled={uploading}
            onChange={(e) => onUpload(e.target.files?.[0])}
          />
        </label>
      </div>

      {loading ? (
        <div className="py-20 text-center text-white/40">
          <Loader2 size={32} className="animate-spin mx-auto mb-3" />
          در حال دریافت رسانه‌ها...
        </div>
      ) : assets.length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed border-white/10 rounded-3xl text-white/35">
          <Image size={42} className="mx-auto mb-3 opacity-40" />
          هنوز تصویری آپلود نشده است.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {assets.map((asset) => (
            <motion.div
              key={asset.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03]"
            >
              <div className="aspect-[16/10] bg-navy-900 overflow-hidden">
                <img src={asset.public_url} alt={asset.file_name} className="w-full h-full object-cover" />
              </div>
              <div className="p-3 space-y-2 text-right">
                <div className="text-xs font-bold text-white truncate" title={asset.file_name}>{asset.file_name}</div>
                <div className="text-[10px] text-white/40 truncate" dir="ltr">{asset.public_url}</div>
                <button
                  onClick={() => copy(asset.public_url)}
                  className="w-full h-9 rounded-xl bg-white/5 border border-white/10 hover:bg-orange-500/20 hover:border-orange-500/30 text-white text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Copy size={13} /> کپی آدرس تصویر
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
