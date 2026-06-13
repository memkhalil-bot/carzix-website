import { motion } from "framer-motion";
import { Link } from "wouter";
import { Award, Shield, Leaf, Globe, ChevronRight } from "lucide-react";
import { fadeUp, staggerSlow as stagger } from "@/lib/motion";
import { useLang } from "@/contexts/LanguageContext";

export default function About() {
  const { t, isAr } = useLang();

  const values = [
    {
      icon: Award,
      titleEn: "German Technology",
      titleAr: "تكنولوجيا ألمانية",
      descEn: "Our formulas are developed using cutting-edge European automotive chemistry, delivering professional results that meet international detailing standards.",
      descAr: "تركيباتنا مطورة بكيمياء السيارات الأوروبية المتطورة، تقدم نتائج احترافية تلبي معايير التفصيل الدولية.",
    },
    {
      icon: Shield,
      titleEn: "Premium Quality",
      titleAr: "جودة عالية",
      descEn: "Every product is rigorously tested to perform flawlessly in Qatar's demanding climate — extreme heat, dust, and humidity.",
      descAr: "كل منتج يُختبر بدقة لضمان أدائه في مناخ قطر القاسي — الحرارة الشديدة والغبار والرطوبة.",
    },
    {
      icon: Leaf,
      titleEn: "Eco-Friendly",
      titleAr: "صديق للبيئة",
      descEn: "Phosphate-free, biodegradable formulas that are safe for the environment and your team without compromising on performance.",
      descAr: "تركيبات خالية من الفوسفات وقابلة للتحلل، آمنة للبيئة وفريقك دون المساس بالأداء.",
    },
    {
      icon: Globe,
      titleEn: "Qatar & GCC",
      titleAr: "قطر والخليج",
      descEn: "Proudly serving Qatar and the wider GCC region — supplying detailing studios, dealerships, and enthusiasts with professional-grade products.",
      descAr: "نخدم بفخر قطر ومنطقة الخليج العربي — نزود محلات التفصيل والوكلاء والهواة بمنتجات احترافية.",
    },
  ];

  const milestones = [
    {
      year: "2022",
      eventEn: "CARZIX brand established in Qatar — focused on bringing premium professional-grade detailing formulas to the region.",
      eventAr: "تأسست علامة كارزيكس في قطر — مركزة على جلب تركيبات تفصيل احترافية فاخرة إلى المنطقة.",
    },
    {
      year: "2023",
      eventEn: "Launched full product catalogue spanning shampoos, polishes, interior care, glass care, and tire products.",
      eventAr: "إطلاق كتالوج منتجات كامل يشمل الشامبوهات والمواد اللامعة والعناية الداخلية وعناية الزجاج والكفرات.",
    },
    {
      year: "2024",
      eventEn: "Partnered with leading automotive businesses and detailing studios across Qatar — growing into a trusted professional supply partner.",
      eventAr: "شراكات مع كبرى الشركات في مجال السيارات ومحلات التفصيل في قطر — نمو لتصبح شريك إمداد احترافي موثوق.",
    },
    {
      year: "2025",
      eventEn: "Expanding product line and distribution network to serve more studios and businesses across Qatar and the GCC.",
      eventAr: "توسيع خط المنتجات وشبكة التوزيع لخدمة المزيد من المحلات والشركات في قطر والخليج.",
    },
    {
      year: "2026",
      eventEn: "Partnership agreement with Doha International Trading Company as the exclusive distributor of CARZIX products in Qatar.",
      eventAr: "الاتفاق مع شركة الدوحة العالمية للتجارة كموزع حصري لمنتجات CARZIX في دولة قطر.",
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative pt-36 pb-24 bg-black overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,_rgba(13,66,97,0.25)_0%,_transparent_60%)]" />
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          className="relative max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center"
        >
          <div>
            <motion.p variants={fadeUp} className="text-[#A29475] text-xs font-semibold tracking-widest uppercase mb-4">
              {t("About CARZIX", "عن كارزيكس")}
            </motion.p>
            <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl font-black text-white leading-tight mb-6">
              {t("Built for", "مصنوع لـ")}
              <br />
              <span className="text-[#A29475]">{t("Automotive", "التفصيل")}</span>
              <br />
              {t("Detailing.", "الاحترافي.")}
            </motion.h1>
            <motion.p variants={fadeUp} className="text-white/55 text-lg leading-relaxed">
              {t(
                "CARZIX is Qatar's dedicated automotive detailing products brand — bringing professional-grade formulas developed with European technology to studios, dealerships, and enthusiasts across the GCC.",
                "كارزيكس هي علامة منتجات التفصيل الاحترافية في قطر — تجلب تركيبات احترافية مطورة بتكنولوجيا أوروبية للمحلات والوكلاء والهواة في جميع أنحاء الخليج."
              )}
            </motion.p>
          </div>

          {/* Abstract logo visual */}
          <motion.div variants={fadeUp} className="hidden lg:flex items-center justify-center">
            <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-sm">
              <circle cx="200" cy="150" r="130" stroke="#0D4261" strokeWidth="1" opacity="0.22" />
              <circle cx="200" cy="150" r="100" stroke="#A29475" strokeWidth="0.5" opacity="0.15" />
              <circle cx="200" cy="150" r="70" stroke="#0D4261" strokeWidth="0.5" opacity="0.1" />
              <circle cx="200" cy="150" r="50" fill="#0D4261" opacity="0.06" />
              <path d="M 230 100 A 60 60 0 1 0 230 200" stroke="#0D4261" strokeWidth="8" strokeLinecap="round" fill="none" opacity="0.7" />
              <path d="M 238 108 L 275 108 L 238 162 L 275 162" stroke="#A29475" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <g transform="translate(80,60)" opacity="0.6">
                <line x1="0" y1="-6" x2="0" y2="6" stroke="#A29475" strokeWidth="1.5" />
                <line x1="-6" y1="0" x2="6" y2="0" stroke="#A29475" strokeWidth="1.5" />
              </g>
              <g transform="translate(330,90)" opacity="0.5">
                <line x1="0" y1="-5" x2="0" y2="5" stroke="#129B82" strokeWidth="1.5" />
                <line x1="-5" y1="0" x2="5" y2="0" stroke="#129B82" strokeWidth="1.5" />
              </g>
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* Pillars strip */}
      <section className="py-16 bg-[#0D4261]/10 border-y border-[#0D4261]/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center"
          >
            {[
              { labelEn: "Professional Grade", labelAr: "درجة احترافية", subEn: "All products", subAr: "جميع المنتجات" },
              { labelEn: "German Technology", labelAr: "تكنولوجيا ألمانية", subEn: "Formula standards", subAr: "معايير التركيبة" },
              { labelEn: "Qatar & GCC", labelAr: "قطر والخليج", subEn: "Service region", subAr: "منطقة الخدمة" },
              { labelEn: "6 Categories", labelAr: "6 فئات", subEn: "Product range", subAr: "نطاق المنتجات" },
            ].map(({ labelEn, labelAr, subEn, subAr }) => (
              <motion.div key={labelEn} variants={fadeUp} className="glass card-shine rounded-xl py-6 px-4">
                <div className="text-white font-black text-lg mb-1">{isAr ? labelAr : labelEn}</div>
                <div className="text-white/40 text-xs">{isAr ? subAr : subEn}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our story */}
      <section className="py-24 bg-zinc-950 border-b border-white/8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="max-w-3xl mx-auto"
          >
            <motion.p variants={fadeUp} className="text-[#A29475] text-xs font-semibold tracking-widest uppercase mb-3 text-center">
              {t("Our Journey", "رحلتنا")}
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl font-black text-white text-center mb-10">
              {t("From Vision to Market", "من الرؤية إلى السوق")}
            </motion.h2>

            <div className="relative ps-8 border-s border-[#0D4261]/35 space-y-8">
              {milestones.map(({ year, eventEn, eventAr }) => (
                <motion.div key={year} variants={fadeUp} className="relative">
                  <div className="absolute -start-[1.65rem] w-3 h-3 rounded-full bg-[#0D4261] ring-4 ring-zinc-950 shadow-[0_0_8px_rgba(13,66,97,0.7)]" />
                  <p className="text-[#A29475] text-xs font-bold tracking-widest uppercase mb-1">{year}</p>
                  <p className="text-[#D1D5DB] text-sm leading-relaxed">{isAr ? eventAr : eventEn}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="text-center mb-14">
              <p className="text-[#A29475] text-xs font-semibold tracking-widest uppercase mb-3">
                {t("What We Stand For", "ما نؤمن به")}
              </p>
              <h2 className="text-4xl font-black text-white">{t("Our Values", "قيمنا")}</h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map(({ icon: Icon, titleEn, titleAr, descEn, descAr }) => (
                <motion.div
                  key={titleEn}
                  variants={fadeUp}
                  className="glass card-shine p-7 rounded-xl hover:border-[#0D4261]/35 transition-colors"
                >
                  <div className="w-11 h-11 rounded-lg bg-[#0D4261]/12 border border-[#0D4261]/28 flex items-center justify-center mb-4">
                    <Icon size={20} className="text-[#A29475]" />
                  </div>
                  <h3 className="text-white font-bold text-base mb-2">{isAr ? titleAr : titleEn}</h3>
                  <p className="text-[#9CA3AF] text-sm leading-relaxed">{isAr ? descAr : descEn}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-zinc-950 border-t border-white/8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black text-white mb-4">
            {t("Explore Our Professional Range", "استكشف نطاقنا الاحترافي")}
          </h2>
          <p className="text-white/45 mb-8 max-w-xl mx-auto">
            {t(
              "Browse the full product catalogue and request a quote for your studio, dealership, or business.",
              "تصفح كتالوج المنتجات الكامل واطلب عرض سعر لمحلك أو وكالتك أو شركتك."
            )}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#0D4261] hover:bg-[#0a3350] text-white font-semibold rounded transition-colors"
            >
              {t("Browse Products", "تصفح المنتجات")} <ChevronRight size={16} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 border border-white/18 hover:border-white/35 text-white/65 hover:text-white font-semibold rounded transition-colors"
            >
              {t("Contact Us", "اتصل بنا")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
