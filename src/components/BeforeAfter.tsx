import { useState } from "react";
import { useLang } from "@/contexts/LanguageContext";

export default function BeforeAfter() {
  const { t } = useLang();
  const [pos, setPos] = useState(50);

  return (
    <div className="relative w-full h-64 lg:h-80 rounded-2xl overflow-hidden select-none">
      {/* After panel — clean, glossy */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0d0810] via-[#080808] to-[#050308]">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 320" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="sheen-after" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="transparent" />
              <stop offset="46%"  stopColor="rgba(255,255,255,0.02)" />
              <stop offset="50%"  stopColor="rgba(255,255,255,0.08)" />
              <stop offset="54%"  stopColor="rgba(255,255,255,0.02)" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <rect width="800" height="320" fill="url(#sheen-after)" />
          <line x1="0" y1="240" x2="800" y2="60" stroke="rgba(162,148,117,0.035)" strokeWidth="55" />
        </svg>
        <div className="absolute bottom-5 right-5 text-right">
          <p className="text-[#A29475] text-[11px] font-black tracking-[0.22em] uppercase">{t("AFTER", "بعد")}</p>
          <p className="text-white/35 text-[10px] mt-0.5">{t("Clean · Protected · Glossy", "نظيف · محمي · لامع")}</p>
        </div>
      </div>

      {/* Before panel — dull, contaminated (clipped) */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#1d1d1d] to-[#0d0d0d]"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 320" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <circle cx="158" cy="130" r="22" fill="rgba(255,255,255,0.022)" />
          <circle cx="300" cy="195" r="14" fill="rgba(255,255,255,0.018)" />
          <circle cx="480" cy="98"  r="19" fill="rgba(255,255,255,0.022)" />
          <circle cx="640" cy="240" r="12" fill="rgba(255,255,255,0.018)" />
          <path d="M 60 175 Q 200 162 340 182 Q 480 202 620 172" stroke="rgba(255,255,255,0.022)" strokeWidth="2.5" fill="none" />
          <path d="M 80 225 Q 220 212 360 232 Q 500 252 640 222" stroke="rgba(255,255,255,0.018)" strokeWidth="1.5" fill="none" />
          <circle cx="240" cy="58"  r="4"   fill="rgba(255,255,255,0.04)" />
          <circle cx="560" cy="268" r="3.5" fill="rgba(255,255,255,0.035)" />
          <circle cx="720" cy="110" r="2.5" fill="rgba(255,255,255,0.03)" />
        </svg>
        <div className="absolute bottom-5 left-5">
          <p className="text-white/35 text-[11px] font-black tracking-[0.22em] uppercase">{t("BEFORE", "قبل")}</p>
          <p className="text-white/22 text-[10px] mt-0.5">{t("Dull · Contaminated · Faded", "باهت · ملوث · متلاشٍ")}</p>
        </div>
      </div>

      {/* Divider */}
      <div
        className="absolute top-0 bottom-0 w-px bg-white/30 pointer-events-none z-10"
        style={{ left: `${pos}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-[0_0_16px_rgba(255,255,255,0.25)] flex items-center justify-center gap-0.5">
          <div className="w-[2px] h-3 rounded-full bg-neutral-400" />
          <div className="w-[2px] h-3 rounded-full bg-neutral-400" />
        </div>
      </div>

      {/* Invisible range input */}
      <input
        type="range"
        min="2"
        max="98"
        value={Math.round(pos)}
        onChange={(e) => setPos(Number(e.target.value))}
        className="ba-input"
        aria-label={t("Drag to compare before and after", "اسحب للمقارنة بين قبل وبعد")}
      />
    </div>
  );
}
