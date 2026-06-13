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
  const [avgUsage, setAvgUsage] = useState(0.5);

  const monthlyCars = dailyCars * workingDays;
  const dilutedNeeded = monthlyCars * avgUsage;
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
        <motion.div variants={fadeUp} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#129B82]/10 border border-[#129B82]/22 mb-4">
            <FlaskConical size={13} className="text-[#129B82]" />
            <span className="text-[#129B82] text-xs font-semibold tracking-widest uppercase">
              {t("B2B Savings Tool", "أداة توفير B2B")}
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            {t("Dilution Calculator", "حاسبة التخفيف")}
          </h2>
          <p className="text-white/40 text-base max-w-lg mx-auto">
            {t(
              "Every 1 liter of CARZIX concentrate produces up to 400 liters of ready-to-use solution.",
              "كل لتر مركز CARZIX ينتج حتى 400 لتر جاهز للاستخدام."
            )}
          </p>
        </motion.div>

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
                {t("Avg. Usage / Car (L)", "متوسط الاستهلاك (لتر/سيارة)")}
              </label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={avgUsage}
                onChange={(e) => setAvgUsage(Math.max(0.1, Number(e.target.value) || 0.1))}
                className={inputCls}
              />
            </div>
          </div>

          {/* Results */}
          <div className="bg-white/[0.03] border-t border-white/8">
            <div className="grid grid-cols-3 divide-x divide-white/8">
              <div className="p-6 text-center">
                <p className="text-white/30 text-[10px] font-semibold uppercase tracking-widest mb-3">
                  {t("Cars / Month", "سيارات شهرياً")}
                </p>
                <p className="text-white font-black text-4xl mb-1">
                  {monthlyCars.toLocaleString()}
                </p>
                <p className="text-white/25 text-xs">{t("vehicles", "مركبة")}</p>
              </div>
              <div className="p-6 text-center">
                <p className="text-white/30 text-[10px] font-semibold uppercase tracking-widest mb-3">
                  {t("Ready-To-Use Solution", "محلول جاهز للاستخدام")}
                </p>
                <p className="text-[#129B82] font-black text-4xl mb-1">
                  {fmt(dilutedNeeded)}
                </p>
                <p className="text-white/25 text-xs">{t("liters", "لتر")}</p>
              </div>
              <div className="p-6 text-center">
                <p className="text-white/30 text-[10px] font-semibold uppercase tracking-widest mb-3">
                  {t("Concentrate Needed", "مركز مطلوب فقط")}
                </p>
                <p className="text-[#A29475] font-black text-4xl mb-1">
                  {fmt(concentrateNeeded)}
                </p>
                <p className="text-white/25 text-xs">{t("liters", "لتر")}</p>
              </div>
            </div>
          </div>

          {/* Highlight box */}
          <div className="px-8 py-5 bg-[#0D4261]/15 border-t border-[#0D4261]/30 text-center">
            <p className="text-white font-semibold text-base">
              {isAr
                ? <>
                    تحتاج فقط إلى{" "}
                    <span className="text-[#A29475] font-black">{fmt(concentrateNeeded)} {t("L", "لتر")}</span>
                    {" "}من المركز لخدمة{" "}
                    <span className="text-[#129B82] font-black">{monthlyCars.toLocaleString()}</span>
                    {" "}سيارة شهرياً
                  </>
                : <>
                    Only{" "}
                    <span className="text-[#A29475] font-black">{fmt(concentrateNeeded)} L</span>
                    {" "}of concentrate to serve{" "}
                    <span className="text-[#129B82] font-black">{monthlyCars.toLocaleString()}</span>
                    {" "}cars/month
                  </>
              }
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
              className="btn-brand shrink-0 inline-flex items-center gap-2 px-7 py-3.5 text-white font-semibold rounded"
            >
              {t("Request a Quote Now", "اطلب عرض سعر الآن")}
              <ChevronRight size={16} />
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
