import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { fadeUp, stagger } from "@/lib/motion";
import { useLang } from "@/contexts/LanguageContext";

const reasons = [
  { en: "German Engineered Formula", ar: "تركيبة ألمانية" },
  { en: "Up To 400L From 1L Concentrate", ar: "1 لتر ينتج حتى 400 لتر" },
  { en: "Phosphate Free", ar: "خالي من الفوسفات" },
  { en: "GCC Climate Ready", ar: "مناسب لمناخ الخليج" },
  { en: "Consistent Professional Results", ar: "نتائج احترافية ثابتة" },
  { en: "Commercial Support", ar: "دعم تجاري للمراكز والوكالات" },
  { en: "Exclusive Distributor In Qatar", ar: "موزع حصري في قطر" },
];

export default function WhyProfessionals() {
  const { t, isAr } = useLang();

  return (
    <section className="py-20 bg-zinc-950 border-t border-white/8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.div variants={fadeUp} className="text-center mb-12">
            <p className="text-[#A29475] text-xs font-semibold tracking-widest uppercase mb-3">
              {t("Trusted by Professionals", "موثوق به من المحترفين")}
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              {t("Why Professionals Choose CARZIX", "لماذا يختارنا المحترفون؟")}
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 max-w-5xl mx-auto">
            {reasons.map(({ en, ar }) => (
              <motion.div
                key={en}
                variants={fadeUp}
                className="glass flex items-center gap-3 p-4 rounded-xl"
              >
                <div className="w-7 h-7 rounded-full bg-[#129B82]/12 border border-[#129B82]/28 flex items-center justify-center shrink-0">
                  <CheckCircle size={13} className="text-[#129B82]" />
                </div>
                <span className="text-[#D1D5DB] text-sm font-medium leading-tight">
                  {isAr ? ar : en}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
