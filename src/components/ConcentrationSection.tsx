import { useEffect, useRef, useState } from "react";
import { Archive, Truck, Zap, Droplets, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { fadeUp, fadeScale, staggerSlow as stagger } from "@/lib/motion";
import { useLang } from "@/contexts/LanguageContext";

function Counter({ to, duration = 1800 }: { to: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const t0 = Date.now();
          const tick = () => {
            const progress = Math.min((Date.now() - t0) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * to));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [to, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

const benefits = [
  { icon: Archive,    en: "Less Storage",               ar: "خفض تكاليف التخزين" },
  { icon: Truck,      en: "Lower Shipping Cost",         ar: "خفض تكاليف الشحن" },
  { icon: Zap,        en: "Operational Efficiency",      ar: "رفع كفاءة التشغيل" },
  { icon: Droplets,   en: "Reduced Product Consumption", ar: "تقليل استهلاك المنتجات" },
  { icon: TrendingUp, en: "Higher Profit Margins",       ar: "زيادة هامش الربح" },
];

export default function ConcentrationSection() {
  const { t, isAr } = useLang();

  return (
    <section className="py-24 bg-zinc-950/70 border-y border-white/6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,_rgba(13,66,97,0.14)_0%,_transparent_65%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
        >
          {/* Section heading */}
          <motion.div variants={fadeUp} className="text-center mb-16">
            <p className="text-[#129B82] text-xs font-semibold tracking-widest uppercase mb-3">
              {t("The Concentration Advantage", "ميزة التركيز")}
            </p>
            <h2 className="text-4xl sm:text-5xl font-black text-white">
              {t("Why Concentrated Products?", "لماذا المنتجات المركزة؟")}
            </h2>
          </motion.div>

          {/* 1L → 400L animated display */}
          <motion.div variants={fadeScale} className="text-center mb-16">
            <div className="inline-flex flex-col items-center">
              {/* 1 */}
              <div>
                <div className="text-[110px] sm:text-[140px] lg:text-[160px] font-black leading-none text-white tabular-nums">
                  1
                </div>
                <p className="text-white/35 text-sm font-semibold uppercase tracking-[0.22em] -mt-2 mb-4">
                  {t("Liter Concentrate", "لتر مركز")}
                </p>
              </div>

              {/* Arrow */}
              <div className="flex flex-col items-center gap-1 my-2">
                <div className="w-px h-8 bg-gradient-to-b from-[#0D4261]/60 to-[#A29475]/60" />
                <div
                  className="w-4 h-4 border-e-2 border-b-2 border-[#A29475]/70 rotate-45"
                  style={{ marginTop: "-6px" }}
                />
              </div>

              {/* 400 */}
              <div>
                <div className="text-[110px] sm:text-[140px] lg:text-[160px] font-black leading-none text-[#A29475] tabular-nums drop-shadow-[0_0_30px_rgba(162,148,117,0.3)]">
                  <Counter to={400} />
                </div>
                <p className="text-[#A29475]/50 text-sm font-semibold uppercase tracking-[0.22em] -mt-2">
                  {t("Liters Ready-To-Use", "لتر جاهز للاستخدام")}
                </p>
              </div>
            </div>

            {/* Ratio badge */}
            <div className="mt-8 inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#0D4261]/20 border border-[#0D4261]/45 shadow-[0_0_24px_rgba(13,66,97,0.2)]">
              <span className="text-white/50 text-sm">{t("Concentration ratio", "نسبة التركيز")}</span>
              <span className="text-[#A29475] font-black text-xl tracking-wider">1 : 400</span>
            </div>
          </motion.div>

          {/* "Stop Paying For Water" headline */}
          <motion.div variants={fadeUp} className="text-center mb-12">
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-5 leading-tight">
              {isAr ? (
                <>لا تدفع مقابل الماء…<br /><span className="text-[#A29475]">ادفع مقابل الأداء.</span></>
              ) : (
                <>Stop Paying For Water.<br /><span className="text-[#A29475]">Start Paying For Performance.</span></>
              )}
            </h3>
            <p className="text-white/40 text-base max-w-xl mx-auto leading-relaxed">
              {t(
                "Reduce storage and transportation costs while maximizing operational efficiency with CARZIX concentrated formulas.",
                "وفر تكاليف التخزين والشحن وحقق أقصى استفادة من كل لتر مركز مع تركيبات كارزيكس."
              )}
            </p>
          </motion.div>

          {/* Benefit cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {benefits.map(({ icon: Icon, en, ar }) => (
              <motion.div
                key={en}
                variants={fadeScale}
                className="glass card-shine rounded-xl p-5 text-center hover:border-[#129B82]/35 transition-colors group"
              >
                <div className="w-11 h-11 rounded-lg bg-[#129B82]/10 border border-[#129B82]/22 flex items-center justify-center mx-auto mb-3 group-hover:bg-[#129B82]/20 group-hover:border-[#129B82]/45 transition-all">
                  <Icon size={20} className="text-[#129B82]" />
                </div>
                <p className="text-white/70 text-sm font-semibold leading-snug">
                  {isAr ? ar : en}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
