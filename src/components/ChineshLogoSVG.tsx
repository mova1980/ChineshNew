import { motion } from "framer-motion";

export default function ChineshLogoSVG({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 520 280"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="logoGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="50%" stopColor="#FFA500" />
          <stop offset="100%" stopColor="#FF8C00" />
        </linearGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Top 3 Yellow Dots */}
      <motion.g
        initial={{ opacity: 0, y: -15, scale: 0 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
      >
        <circle cx="180" cy="35" r="11" fill="url(#logoGold)" filter="url(#glow)" />
        <circle cx="215" cy="35" r="11" fill="url(#logoGold)" filter="url(#glow)" />
        <circle cx="250" cy="35" r="11" fill="url(#logoGold)" filter="url(#glow)" />
      </motion.g>

      {/* Main "چینش" Text - Exact geometric reconstruction */}
      <motion.g
        fill="#051838"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.5, type: "spring" }}
      >
        {/* Che (چ) - Large geometric shape with circular cutout */}
        <path d="M 35 180 
                 C 35 100, 90 70, 140 70 
                 C 190 70, 220 100, 220 150 
                 C 220 200, 180 230, 130 230 
                 C 80 230, 40 210, 35 180 Z 
                 M 95 150 
                 C 100 120, 125 110, 150 120 
                 C 175 130, 185 155, 180 180 
                 C 175 200, 155 215, 130 215 
                 C 105 215, 90 190, 95 150 Z" />

        {/* Ye (ی) - Vertical bar with slight curve */}
        <path d="M 245 75 L 275 75 L 275 225 L 245 225 Z" />

        {/* Noon (ن) - Triangle top + curved base */}
        <path d="M 295 210 L 345 120 L 395 210 Z M 325 200 L 345 160 L 365 200 Z" />
        <path d="M 295 210 L 345 235 L 395 210 L 395 230 L 345 255 L 295 230 Z" />

        {/* She (ش) - Box with curved right side */}
        <path d="M 415 75 L 470 75 
                 C 510 75, 540 105, 540 155 
                 C 540 205, 510 235, 470 235 
                 L 415 235 Z 
                 M 440 105 L 440 205 L 470 205 
                 C 495 205, 515 185, 515 155 
                 C 515 125, 495 105, 470 105 Z" />
      </motion.g>

      {/* Bottom 3 Yellow Dots */}
      <motion.g
        initial={{ opacity: 0, y: 15, scale: 0 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
      >
        <circle cx="425" cy="255" r="9" fill="url(#logoGold)" filter="url(#glow)" />
        <circle cx="455" cy="255" r="9" fill="url(#logoGold)" filter="url(#glow)" />
        <circle cx="485" cy="255" r="9" fill="url(#logoGold)" filter="url(#glow)" />
      </motion.g>

      {/* Subtext "پایگاه خبری" */}
      <motion.text
        x="480"
        y="290"
        fill="#051838"
        fontSize="22"
        fontFamily="'Vazirmatn', 'Tahoma', sans-serif"
        fontWeight="700"
        textAnchor="end"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
      >
        پایگاه خبری
      </motion.text>
    </svg>
  );
}
