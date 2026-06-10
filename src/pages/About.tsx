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
      descEn: "Our formulas are developed using cutting-edge German engineering, delivering professional results that meet international standards.",
      descAr: "تركيباتنا مطورة بتقنية ألمانية متطورة، تقدم نتائج احترافية تلبي المعايير الدولية.",
    },
    {
      icon: Shield,
      titleEn: "Premium Quality",
      titleAr: "جودة عالية",
      descEn: "Every product is rigorously tested to ensure it performs flawlessly in Qatar's demanding climate — extreme heat, dust, and humidity.",
      descAr: "كل منتج يُختبر بدقة لضمان أدائه في مناخ قطر القاسي — الحرارة الشديدة والغبار والرطوبة.",
    },
    {
      icon: Leaf,
      titleEn: "Eco-Friendly",
      titleAr: "صديق للبيئة",
      descEn: "Phosphate-free and biodegradable formulas that are safe for the environment and your family without compromising on power.",
      descAr: "تركيبات خالية من الفوسفات وقابلة للتحلل، آمنة للبيئة وعائلتك دون المساس بالقوة.",
    },
    {
      icon: Globe,
      titleEn: "Qatar-Focused",
      titleAr: "محور قطر",
      descEn: "Proudly distributed across Qatar. Our products are available to businesses, detailing shops, and individual car owners alike.",
      descAr: "موزع بفخر في جميع أنحاء قطر. منتجاتنا متاحة للشركات ومحلات التفصيل وأصحاب السيارات.",
    },
  ];

  const milestones = [
    {
      yearEn: "2022", yearAr: "2022",
      eventEn: "CARZIX brand established — focused on bringing premium car care formulas to Qatar.",
      eventAr: "تأسست علامة كارزيكس — مركزة على جلب تركيبات عناية سيارات فاخرة إلى قطر.",
    },
    {
      yearEn: "2023", yearAr: "2023",
      eventEn: "Launched full product catalogue covering shampoos, polishes, interior care, and tire care.",
      eventAr: "إطلاق كتالوج منتجات كامل يشمل الشامبوهات والمواد اللامعة والعناية الداخلية وعناية الكفرات.",
    },
    {
      yearEn: "2024", yearAr: "2024",
      eventEn: "Partnered with leading automotive businesses and detailing studios across Qatar.",
      eventAr: "شراكات مع كبرى الشركات التجارية في السيارات ومحلات التفصيل في قطر.",
    },
    {
      yearEn: "2025", yearAr: "2025",
      eventEn: "Expanding product line and distribution network to serve more customers nationwide.",
      eventAr: "توسيع خط المنتجات وشبكة التوزيع لخدمة المزيد من العملاء على مستوى المملكة.",
    },
  ];

  const stats = [
    { n: "13+", labelEn: "Products", labelAr: "منتجاً" },
    { n: "6", labelEn: "Categories", labelAr: "فئات" },
    { n: "100%", labelEn: "Professional Grade", labelAr: "درجة احترافية" },
    { n: "QAT", labelEn: "Based in Qatar", labelAr: "مقر في قطر" },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative pt-36 pb-24 bg-black overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,_rgba(138,21,56,0.25)_0%,_transparent_60%)]" />
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
              <span className="text-[#8A1538]">{t("Automotive", "العناية")}</span>
              <br />
              {t("Excellence", "بالسيارات")}
            </motion.h1>
            <motion.p variants={fadeUp} className="text-white/55 text-lg leading-relaxed">
              {t(
                "CARZIX is Qatar's dedicated car care products brand — bringing professional-grade formulas developed with German technology to enthusiasts, businesses, and everyday drivers alike.",
                "كارزيكس هي علامة منتجات العناية بالسيارات المخصصة في قطر — تجلب تركيبات احترافية مطورة بتكنولوجيا ألمانية للمهتمين والشركات وسائقي اليومية على حد سواء."
              )}
            </motion.p>
          </div>

          {/* Abstract logo visual */}
          <motion.div variants={fadeUp} className="hidden lg:flex items-center justify-center">
            <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-sm">
              <circle cx="200" cy="150" r="130" stroke="#8A1538" strokeWidth="1" opacity="0.2" />
              <circle cx="200" cy="150" r="100" stroke="#A29475" strokeWidth="0.5" opacity="0.15" />
              <circle cx="200" cy="150" r="70" stroke="#8A1538" strokeWidth="0.5" opacity="0.1" />
              <circle cx="200" cy="150" r="50" fill="#8A1538" opacity="0.08" />
              <path d="M 230 100 A 60 60 0 1 0 230 200" stroke="#8A1538" strokeWidth="8" strokeLinecap="round" fill="none" />
              <path d="M 238 108 L 275 108 L 238 162 L 275 162" stroke="#A29475" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <g transform="translate(80,60)" opacity="0.6">
                <line x1="0" y1="-6" x2="0" y2="6" stroke="#A29475" strokeWidth="1.5" />
                <line x1="-6" y1="0" x2="6" y2="0" stroke="#A29475" strokeWidth="1.5" />
              </g>
              <g transform="translate(330,90)" opacity="0.5">
                <line x1="0" y1="-5" x2="0" y2="5" stroke="#8A1538" strokeWidth="1.5" />
                <line x1="-5" y1="0" x2="5" y2="0" stroke="#8A1538" strokeWidth="1.5" />
              </g>
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-[#8A1538]/10 border-y border-[#8A1538]/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center"
          >
            {stats.map(({ n, labelEn, labelAr }) => (
              <motion.div key={labelEn} variants={fadeUp}>
                <div className="text-4xl font-black text-[#8A1538] mb-1">{n}</div>
                <div className="text-white/50 text-sm">{isAr ? labelAr : labelEn}</div>
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

            <div className="relative pl-8 border-l border-[#8A1538]/30 space-y-8">
              {milestones.map(({ yearEn, yearAr, eventEn, eventAr }) => (
                <motion.div key={yearEn} variants={fadeUp} className="relative">
                  <div className="absolute -left-[1.65rem] w-3 h-3 rounded-full bg-[#8A1538] ring-4 ring-zinc-950" />
                  <p className="text-[#8A1538] text-xs font-bold tracking-widest uppercase mb-1">
                    {isAr ? yearAr : yearEn}
                  </p>
                  <p className="text-white/65 text-sm leading-relaxed">
                    {isAr ? eventAr : eventEn}
                  </p>
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
                  className="p-7 rounded-xl border border-white/8 bg-white/3 hover:border-[#8A1538]/30 transition-colors"
                >
                  <div className="w-11 h-11 rounded-lg bg-[#8A1538]/15 flex items-center justify-center mb-4">
                    <Icon size={20} className="text-[#8A1538]" />
                  </div>
                  <h3 className="text-white font-bold text-base mb-2">{isAr ? titleAr : titleEn}</h3>
                  <p className="text-white/45 text-sm leading-relaxed">{isAr ? descAr : descEn}</p>
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
            {t("Explore Our Product Range", "استكشف نطاق منتجاتنا")}
          </h2>
          <p className="text-white/50 mb-8">
            {t(
              "Browse the full catalogue and request a quote for your business or personal use.",
              "تصفح الكتالوج الكامل واطلب عرض سعر لعملك أو استخدامك الشخصي."
            )}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#8A1538] hover:bg-[#6b1029] text-white font-semibold rounded transition-colors"
            >
              {t("Browse Products", "تصفح المنتجات")} <ChevronRight size={16} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 hover:border-white/40 text-white/70 hover:text-white font-semibold rounded transition-colors"
            >
              {t("Contact Us", "اتصل بنا")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
