import { motion } from "framer-motion";

interface LogoProps {
  size?: "xs" | "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = "md", showText = false, className = "" }: LogoProps) {
  const dim = {
    xs: 36,
    sm: 48,
    md: 64,
    lg: 80,
  }[size];

  return (
    <div className={`relative flex items-center gap-3 ${className}`}>
      <div className="relative flex items-center justify-center" style={{ width: dim, height: dim }}>
        {/* Pulsing glow behind the logo */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(255,140,40,0.6) 0%, rgba(255,100,0,0.3) 50%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* The logo image — transparent background, glowing */}
        <motion.img
          src="/images/logo.png"
          alt="Chinesh"
          className="relative z-10 w-full h-full object-contain"
          style={{
            filter: "drop-shadow(0 0 8px rgba(255,150,40,0.8)) drop-shadow(0 0 16px rgba(255,120,0,0.6))",
          }}
          animate={{
            filter: [
              "drop-shadow(0 0 6px rgba(255,150,40,0.7)) drop-shadow(0 0 12px rgba(255,120,0,0.5))",
              "drop-shadow(0 0 12px rgba(255,170,50,1)) drop-shadow(0 0 24px rgba(255,130,0,0.9)) drop-shadow(0 0 36px rgba(255,100,0,0.5))",
              "drop-shadow(0 0 6px rgba(255,150,40,0.7)) drop-shadow(0 0 12px rgba(255,120,0,0.5))",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{ scale: 1.1 }}
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <motion.span
            className="text-2xl md:text-[1.75rem] leading-none text-white"
            style={{
              fontFamily: "'Noto Nastaliq Urdu', 'IranNastaliq', 'Nastaliq', 'Vazirmatn Variable', serif",
              fontWeight: 700,
              textShadow: "0 0 20px rgba(255,130,30,0.7), 0 0 40px rgba(255,180,0,0.4)",
            }}
            animate={{
              textShadow: [
                "0 0 20px rgba(255,130,30,0.7), 0 0 40px rgba(255,180,0,0.4)",
                "0 0 30px rgba(255,180,50,1), 0 0 60px rgba(255,200,0,0.6)",
                "0 0 20px rgba(255,130,30,0.7), 0 0 40px rgba(255,180,0,0.4)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            چینش
          </motion.span>
          <span className="text-[11px] text-orange-300/90 mt-0 tracking-wide font-medium">
            بینش در خبر
          </span>
        </div>
      )}
    </div>
  );
}
