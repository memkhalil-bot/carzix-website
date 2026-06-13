import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ChevronRight, FlaskConical } from "lucide-react";
import { fadeUp, stagger } from "@/lib/motion";
import { useLang } from "@/contexts/LanguageContext";

function fmt(n: number): string {
  if (n === 0) return "0";
  if (n < 0.01) return n.toFixed(3);
  if (n < 10) return n.toFixed(2);
  if (n < 100) return n.toFixed(1);
  return Math.round(n).toLocaleString();
}

export default function DilutionCalculator() {
  const { t, isAr } = useLang();
  const [dailyCars, setDailyCars] = useState(50);
  const [workingDays, setWorkingDays] = useState(26);
  const [avgUsageMl, setAvgUsageMl] = useState(500);

  const monthlyCars = dailyCars * workingDays;
  const dilutedNeeded = monthlyCars * (avgUsageMl / 1000);
  const concentrateNeeded = dilutedNeeded / 400;

  const inputCls =
    "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3.5 text-white text-xl font-bold text-center focus:outline-none focus:border-[#0D4261] transition-colors";

  return (
    <section className="py-20 bg-[#04090F] border-y border-white/8 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#0D4261]/8 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        variants={stagger}
        className="relative max-w-4xl mx-auto px-6 lg:px-8"
      >
        {/* Header */}
        <motion.div variants={fadeUp} className="text-center mb-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#129B82]/10 border border-[#129B82]/22 mb-4">
            <FlaskConical size={13} className="text-[#129B82]" />
            <span className="text-[#129B82] text-xs font-semibold tracking-widest uppercase">
              {t("B2B Savings Tool", "أداة توفير B2B")}
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-3">
            {t("Dilution Calculator", "حاسبة التخفيف")}
          </h2>
        </motion.div>

        {/* Intro line */}
        <motion.p variants={fadeUp} className="text-white/40 text-base text-center max-w-lg mx-auto mb-10">
          {t(
            "Calculate exactly how much concentrate your business needs.",
            "اكتشف كمية المنتج المركز التي يحتاجها نشاطك خلال ثوانٍ."
          )}
        </motion.p>

        {/* Calculator card */}
        <motion.div variants={fadeUp} className="glass-dark rounded-2xl overflow-hidden">
          {/* Inputs */}
          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-white/40 text-xs font-semibold mb-2 tracking-wider uppercase">
                {t("Cars Per Day", "عدد السيارات يومياً")}
              </label>
              <input
                type="number"
                min="1"
                value={dailyCars}
                onChange={(e) => setDailyCars(Math.max(1, Number(e.target.value) || 1))}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-white/40 text-xs font-semibold mb-2 tracking-wider uppercase">
                {t("Working Days / Month", "أيام العمل شهرياً")}
              </label>
              <input
                type="number"
                min="1"
                max="31"
                value={workingDays}
                onChange={(e) => setWorkingDays(Math.min(31, Math.max(1, Number(e.target.value) || 1)))}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-white/40 text-xs font-semibold mb-2 tracking-wider uppercase">
                {t("Avg. Usage Per Car (ml)", "متوسط الاستهلاك (مل/سيارة)")}
              </label>
              <input
                type="number"
                min="10"
                step="10"
                value={avgUsageMl}
                onChange={(e) => setAvgUsageMl(Math.max(10, Number(e.target.value) || 10))}
                className={inputCls}
              />
            </div>
          </div>

          {/* Premium KPI results */}
          <div className="border-t border-white/8 p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Monthly Cars */}
              <div className="rounded-xl bg-white/[0.03] border border-white/8 p-5 text-center">
                <p className="text-white/30 text-[10px] font-semibold uppercase tracking-widest mb-3">
                  {t("Monthly Cars", "السيارات شهرياً")}
                </p>
                <p className="text-white font-black text-4xl mb-1 tabular-nums">
                  {monthlyCars.toLocaleString()}
                </p>
                <p className="text-white/20 text-xs">{t("vehicles", "مركبة")}</p>
              </div>

              {/* Monthly Ready-To-Use Requirement */}
              <div className="rounded-xl bg-white/[0.03] border border-white/8 p-5 text-center">
                <p className="text-white/30 text-[10px] font-semibold uppercase tracking-widest mb-3">
                  {t("Monthly Ready-To-Use Req.", "احتياجك من المحلول الجاهز")}
                </p>
                <p className="text-[#129B82] font-black text-4xl mb-1 tabular-nums">
                  {fmt(dilutedNeeded)}
                </p>
                <p className="text-white/20 text-xs">{t("liters", "لتر")}</p>
              </div>

              {/* Monthly Concentrate Requirement — HIGHLIGHTED */}
              <div className="relative rounded-xl overflow-hidden border border-[#A29475]/40 p-5 text-center shadow-[0_0_28px_rgba(162,148,117,0.14)]">
                <div className="absolute inset-0 bg-gradient-to-b from-[#0D4261]/18 via-[#0D4261]/8 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,_rgba(162,148,117,0.1)_0%,_transparent_65%)] pointer-events-none" />
                <p className="relative text-[#A29475]/55 text-[10px] font-semibold uppercase tracking-widest mb-3">
                  {t("Monthly Concentrate Req.", "احتياجك من المركز")}
                </p>
                <p className="relative text-[#A29475] font-black text-5xl mb-1 tabular-nums drop-shadow-[0_0_14px_rgba(162,148,117,0.45)]">
                  {fmt(concentrateNeeded)}
                </p>
                <p className="relative text-[#A29475]/35 text-xs">{t("liters", "لتر")}</p>
              </div>
            </div>
          </div>

          {/* Insight strip */}
          <div className="px-8 py-5 bg-[#0D4261]/15 border-t border-[#0D4261]/30 text-center space-y-1">
            <p className="text-white font-semibold text-base">
              {isAr ? (
                <>
                  تحتاج فقط إلى{" "}
                  <span className="text-[#A29475] font-black">{fmt(concentrateNeeded)} {t("L", "لتر")}</span>
                  {" "}من المركز لخدمة{" "}
                  <span className="text-[#129B82] font-black">{monthlyCars.toLocaleString()}</span>
                  {" "}سيارة شهرياً
                </>
              ) : (
                <>
                  Only{" "}
                  <span className="text-[#A29475] font-black">{fmt(concentrateNeeded)} L</span>
                  {" "}of concentrate to serve{" "}
                  <span className="text-[#129B82] font-black">{monthlyCars.toLocaleString()}</span>
                  {" "}cars/month
                </>
              )}
            </p>
            <p className="text-white/30 text-xs">
              {t("Every 1L of CARZIX produces up to 400L ready-to-use.", "كل لتر من CARZIX ينتج حتى 400 لتر جاهز للاستخدام.")}
            </p>
          </div>

          {/* Footer */}
          <div className="p-8 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-5">
            <p className="text-white/35 text-sm leading-relaxed max-w-md">
              {t(
                "Drastically reduce storage, shipping, and consumption costs for car washes, detailing centers, and dealerships.",
                "تقليل كبير في تكاليف التخزين والشحن والاستهلاك للمغاسل ومراكز التلميع والوكالات."
              )}
            </p>
            <Link
              href="/contact"
              className="btn-cta shrink-0 inline-flex items-center gap-2 px-7 py-3.5 text-[#111827] font-bold rounded"
            >
              {t("Get Commercial Quote", "احصل على عرض سعر تجاري")}
              <ChevronRight size={16} />
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
