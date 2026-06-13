import { useState } from "react";
import { useLang } from "@/contexts/LanguageContext";

export default function BeforeAfter() {
  const { t } = useLang();
  const [pos, setPos] = useState(50);

  return (
    <div className="relative w-full h-72 lg:h-96 rounded-2xl overflow-hidden select-none shadow-[0_0_60px_rgba(13,66,97,0.2)]">
      {/* AFTER panel — clean, glossy, cool blue */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#071B2E] via-[#040F1A] to-[#020810]">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 384" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <radialGradient id="gloss-after" cx="35%" cy="30%" r="55%">
              <stop offset="0%" stopColor="rgba(13,66,97,0.55)" />
              <stop offset="60%" stopColor="rgba(13,66,97,0.12)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <linearGradient id="sheen-after" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="48%" stopColor="rgba(255,255,255,0.04)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.12)" />
              <stop offset="52%" stopColor="rgba(255,255,255,0.04)" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <rect width="800" height="384" fill="url(#gloss-after)" />
          <rect width="800" height="384" fill="url(#sheen-after)" />
          {/* Clean horizontal reflection lines */}
          <line x1="0" y1="120" x2="800" y2="80" stroke="rgba(255,255,255,0.06)" strokeWidth="40" />
          <line x1="0" y1="280" x2="800" y2="240" stroke="rgba(255,255,255,0.03)" strokeWidth="20" />
          {/* Deep blue glow spots */}
          <circle cx="600" cy="100" r="120" fill="rgba(18,155,130,0.06)" />
          <circle cx="150" cy="300" r="80" fill="rgba(13,66,97,0.12)" />
        </svg>
        <div className="absolute bottom-5 end-5 text-end">
          <p className="text-[#129B82] text-sm font-black tracking-[0.18em] uppercase drop-shadow-[0_0_8px_rgba(18,155,130,0.8)]">
            {t("AFTER", "بعد")}
          </p>
          <p className="text-[#129B82]/65 text-xs mt-0.5 font-medium">
            {t("Glossy · Protected", "لامع · محمي")}
          </p>
        </div>
      </div>

      {/* BEFORE panel — dirty, dull, warm amber-brown */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#221508] via-[#160E04] to-[#0C0802]"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 384" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <radialGradient id="grime-1" cx="30%" cy="40%" r="40%">
              <stop offset="0%" stopColor="rgba(120,80,20,0.18)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <radialGradient id="grime-2" cx="70%" cy="65%" r="35%">
              <stop offset="0%" stopColor="rgba(100,60,10,0.14)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
          <rect width="800" height="384" fill="url(#grime-1)" />
          <rect width="800" height="384" fill="url(#grime-2)" />
          {/* Water spots */}
          <circle cx="160" cy="120" r="28" stroke="rgba(180,130,60,0.18)" strokeWidth="2" fill="rgba(180,130,60,0.05)" />
          <circle cx="300" cy="220" r="18" stroke="rgba(160,110,40,0.15)" strokeWidth="1.5" fill="rgba(160,110,40,0.04)" />
          <circle cx="480" cy="90" r="22" stroke="rgba(180,130,60,0.18)" strokeWidth="2" fill="rgba(180,130,60,0.05)" />
          <circle cx="620" cy="280" r="14" stroke="rgba(160,110,40,0.15)" strokeWidth="1.5" fill="rgba(160,110,40,0.04)" />
          <circle cx="100" cy="310" r="10" stroke="rgba(180,130,60,0.12)" strokeWidth="1" fill="none" />
          <circle cx="540" cy="180" r="8" stroke="rgba(160,110,40,0.1)" strokeWidth="1" fill="none" />
          {/* Swirl marks */}
          <path d="M 60 175 Q 200 155 340 185 Q 480 215 620 172" stroke="rgba(180,130,60,0.12)" strokeWidth="2" fill="none" />
          <path d="M 80 240 Q 240 218 390 248 Q 520 268 670 235" stroke="rgba(160,110,40,0.09)" strokeWidth="1.5" fill="none" />
          <path d="M 40 310 Q 180 295 320 315 Q 460 338 600 308" stroke="rgba(140,90,20,0.08)" strokeWidth="1" fill="none" />
          {/* Dust particles */}
          <circle cx="240" cy="55" r="3" fill="rgba(200,150,60,0.2)" />
          <circle cx="560" cy="268" r="2.5" fill="rgba(180,130,50,0.18)" />
          <circle cx="720" cy="110" r="2" fill="rgba(200,150,60,0.15)" />
          <circle cx="400" cy="340" r="3.5" fill="rgba(160,110,40,0.15)" />
        </svg>
        <div className="absolute bottom-5 start-5">
          <p className="text-[#C4924A] text-sm font-black tracking-[0.18em] uppercase">
            {t("BEFORE", "قبل")}
          </p>
          <p className="text-[#C4924A]/55 text-xs mt-0.5 font-medium">
            {t("Dull · Dirty", "باهت · متسخ")}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div
        className="absolute top-0 bottom-0 w-[2px] pointer-events-none z-10"
        style={{
          left: `${pos}%`,
          background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.7) 20%, white 50%, rgba(255,255,255,0.7) 80%, transparent)",
          boxShadow: "0 0 20px rgba(255,255,255,0.5), 0 0 40px rgba(13,66,97,0.4)",
        }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white shadow-[0_0_24px_rgba(255,255,255,0.6),0_0_48px_rgba(13,66,97,0.4)] flex items-center justify-center gap-1">
          <div className="w-[2.5px] h-4 rounded-full bg-[#0D4261]/60" />
          <div className="w-[2.5px] h-4 rounded-full bg-[#0D4261]/60" />
        </div>
      </div>

      {/* Range input */}
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
