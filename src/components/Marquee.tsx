import { useLang } from "@/contexts/LanguageContext";

const EN = [
  "German Engineered",
  "Qatar Tested",
  "Professional Grade",
  "Eco Certified",
  "Phosphate Free",
  "UV Protected",
  "Biodegradable Formula",
  "Safe For All Surfaces",
];

const AR = [
  "تقنية ألمانية",
  "مختبر في قطر",
  "درجة احترافية",
  "معتمد بيئياً",
  "خالٍ من الفوسفات",
  "محمي من الأشعة UV",
  "تركيبة قابلة للتحلل",
  "آمن لجميع الأسطح",
];

export default function Marquee() {
  const { isAr } = useLang();
  const items = isAr ? AR : EN;
  const doubled = [...items, ...items];

  return (
    <div className="w-full py-3 bg-[#0a0a0a] border-y border-white/5 overflow-hidden" aria-hidden="true">
      <div className="flex">
        <div className="marquee-track flex items-center shrink-0">
          {doubled.map((item, i) => (
            <span key={i} className="flex items-center shrink-0">
              <span className="text-[#A29475] text-[11px] font-semibold tracking-[0.18em] uppercase px-6">
                {item}
              </span>
              <span className="text-[#129B82] text-[9px]">◆</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
