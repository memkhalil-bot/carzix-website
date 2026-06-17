import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Calculator, Droplets } from "lucide-react";
import { fadeUp, stagger } from "@/lib/motion";
import { useLang } from "@/contexts/LanguageContext";

interface CatalogueProduct {
  nameEn: string;
  nameAr: string;
  ratio: number | "rtu";
}

const CATALOGUE: CatalogueProduct[] = [
  { nameEn: "Snow Foam 100", nameAr: "سنو فوم 100", ratio: 100 },
  { nameEn: "Snow Foam 200", nameAr: "سنو فوم 200", ratio: 200 },
  { nameEn: "Snow Foam 400", nameAr: "سنو فوم 400", ratio: 400 },
  { nameEn: "Pre-Wash Shampoo", nameAr: "شامبو ما قبل الغسيل", ratio: 200 },
  { nameEn: "Polishing Wax", nameAr: "شمع التلميع", ratio: 50 },
  { nameEn: "Glass Cleaner", nameAr: "منظف الزجاج", ratio: 20 },
  { nameEn: "Interior Cleaner", nameAr: "منظف داخلي", ratio: 10 },
  { nameEn: "Engine Cleaner", nameAr: "منظف المحرك", ratio: "rtu" },
  { nameEn: "Tire Shine", nameAr: "ملمع الكفرات", ratio: 5 },
  { nameEn: "General All Purpose Dressing", nameAr: "منظف عام متعدد الاستخدامات", ratio: 4 },
  { nameEn: "Leather Conditioner", nameAr: "بلسم الجلد", ratio: "rtu" },
  { nameEn: "Quick Renew", nameAr: "كويك رينيو", ratio: "rtu" },
];

const CONTAINER_SIZES_L = [1, 5, 20];

const AVG_WASH_USAGE_L = 0.5;

function fmt(n: number): string {
  if (n === 0) return "0";
  if (n < 10) return n.toFixed(2);
  if (n < 100) return n.toFixed(1);
  return Math.round(n).toLocaleString();
}

export default function ProductDilutionCalculator() {
  const { t, isAr } = useLang();
  const [productIdx, setProductIdx] = useState(2);
  const [containerL, setContainerL] = useState(5);

  const product = CATALOGUE[productIdx];

  const result = useMemo(() => {
    if (product.ratio === "rtu") {
      return { finalVolume: containerL, washes: containerL / AVG_WASH_USAGE_L, isRtu: true };
    }
    const finalVolume = containerL * product.ratio;
    const washes = finalVolume / AVG_WASH_USAGE_L;
    return { finalVolume, washes, isRtu: false };
  }, [product, containerL]);

  const inputCls =
    "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#0D4261] transition-colors appearance-none cursor-pointer";

  return (
    <section className="py-20 bg-black border-y border-white/8 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#A29475]/6 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        variants={stagger}
        className="relative max-w-4xl mx-auto px-6 lg:px-8"
      >
        <motion.div variants={fadeUp} className="text-center mb-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#A29475]/10 border border-[#A29475]/22 mb-4">
            <Calculator size={13} className="text-[#A29475]" />
            <span className="text-[#A29475] text-xs font-semibold tracking-widest uppercase">
              {t("ROI Calculator", "حاسبة العائد على الاستثمار")}
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-3">
            {t("Product Dilution Calculator", "حاسبة تخفيف المنتج")}
          </h2>
        </motion.div>

        <motion.p variants={fadeUp} className="text-white/40 text-base text-center max-w-lg mx-auto mb-10">
          {t(
            "Pick a product and container size to see exactly how much ready-to-use solution you get.",
            "اختر منتجاً وحجم العبوة لمعرفة كمية المحلول الجاهز للاستخدام بالضبط."
          )}
        </motion.p>

        <motion.div variants={fadeUp} className="glass-dark rounded-2xl overflow-hidden">
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white/40 text-xs font-semibold mb-2 tracking-wider uppercase">
                {t("Product", "المنتج")}
              </label>
              <select
                value={productIdx}
                onChange={(e) => setProductIdx(Number(e.target.value))}
                className={inputCls}
              >
                {CATALOGUE.map((p, i) => (
                  <option key={p.nameEn} value={i} className="bg-zinc-900">
                    {isAr ? p.nameAr : p.nameEn}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-white/40 text-xs font-semibold mb-2 tracking-wider uppercase">
                {t("Container Size", "حجم العبوة")}
              </label>
              <select
                value={containerL}
                onChange={(e) => setContainerL(Number(e.target.value))}
                className={inputCls}
              >
                {CONTAINER_SIZES_L.map((l) => (
                  <option key={l} value={l} className="bg-zinc-900">
                    {l}L
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="border-t border-white/8 p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-xl bg-white/[0.03] border border-white/8 p-5 text-center">
                <p className="text-white/30 text-[10px] font-semibold uppercase tracking-widest mb-3">
                  {t("Dilution Result", "نتيجة التخفيف")}
                </p>
                <p className="text-white font-black text-3xl mb-1 tabular-nums">
                  {result.isRtu ? t("Ready to Use", "جاهز للاستخدام") : `1:${product.ratio}`}
                </p>
              </div>

              <div className="rounded-xl bg-white/[0.03] border border-white/8 p-5 text-center">
                <p className="text-white/30 text-[10px] font-semibold uppercase tracking-widest mb-3">
                  {t("Final RTU Volume", "الحجم الجاهز النهائي")}
                </p>
                <p className="text-[#129B82] font-black text-4xl mb-1 tabular-nums">
                  {fmt(result.finalVolume)}
                </p>
                <p className="text-white/20 text-xs">{t("liters", "لتر")}</p>
              </div>

              <div className="relative rounded-xl overflow-hidden border border-[#A29475]/40 p-5 text-center shadow-[0_0_28px_rgba(162,148,117,0.14)]">
                <div className="absolute inset-0 bg-gradient-to-b from-[#0D4261]/18 via-[#0D4261]/8 to-transparent pointer-events-none" />
                <p className="relative text-[#A29475]/55 text-[10px] font-semibold uppercase tracking-widest mb-3">
                  {t("Estimated Washes", "عدد الغسلات المقدر")}
                </p>
                <p className="relative text-[#A29475] font-black text-5xl mb-1 tabular-nums drop-shadow-[0_0_14px_rgba(162,148,117,0.45)]">
                  {Math.floor(result.washes).toLocaleString()}
                </p>
                <p className="relative text-[#A29475]/35 text-xs">{t("cars", "سيارة")}</p>
              </div>
            </div>
          </div>

          <div className="px-8 py-5 bg-[#0D4261]/15 border-t border-[#0D4261]/30 flex items-center justify-center gap-2 text-center">
            <Droplets size={14} className="text-[#129B82] shrink-0" />
            <p className="text-white/45 text-xs">
              {t(
                "Estimates based on average 0.5L ready-to-use solution per vehicle. Actual usage may vary.",
                "التقديرات تعتمد على استخدام متوسط 0.5 لتر من المحلول الجاهز لكل مركبة. قد يختلف الاستخدام الفعلي."
              )}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
