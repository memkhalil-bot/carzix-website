import { motion } from "framer-motion";
import { Link } from "wouter";
import { ChevronRight, FlaskConical, Headphones, Truck, Building2, Percent, Wrench, Network, Car } from "lucide-react";
import { fadeUp, fadeScale, staggerSlow as stagger } from "@/lib/motion";
import { useLang } from "@/contexts/LanguageContext";
import Seo from "@/components/Seo";

export default function Partners() {
  const { t, isAr } = useLang();

  const benefits = [
    {
      icon: FlaskConical,
      titleEn: "Professional, High-Concentration Products",
      titleAr: "منتجات احترافية فائقة التركيز",
      descEn: "German-engineered formulas delivering superior, measurable results across your entire operation.",
      descAr: "تركيبات ألمانية المنشأ تمنحك نتائج فائقة وقابلة للقياس في جميع عملياتك.",
    },
    {
      icon: Headphones,
      titleEn: "Dedicated Commercial & Technical Support",
      titleAr: "دعم تجاري وفني",
      descEn: "A direct line to our team for product guidance, training, and account management.",
      descAr: "تواصل مباشر مع فريقنا للحصول على إرشادات المنتج والتدريب وإدارة الحساب.",
    },
    {
      icon: Truck,
      titleEn: "Fast Local Supply Within Qatar",
      titleAr: "إمداد محلي سريع داخل قطر",
      descEn: "Direct distribution through Doha International Trading Company keeps your stock moving.",
      descAr: "التوزيع المباشر عبر شركة الدوحة العالمية للتجارة يضمن استمرارية مخزونك.",
    },
    {
      icon: Building2,
      titleEn: "Solutions Tailored for Studios, Agencies & Fleets",
      titleAr: "حلول مناسبة لمراكز التلميع والوكالات والأساطيل",
      descEn: "Product ranges and packaging sized for detailing centers, dealerships, and fleet operations.",
      descAr: "تشكيلات منتجات وتعبئات مصممة لمراكز التلميع والوكالات وعمليات الأساطيل.",
    },
    {
      icon: Percent,
      titleEn: "Commercial Pricing Based on Volume",
      titleAr: "أسعار تجارية حسب الكميات",
      descEn: "Tiered, volume-based pricing structured to protect your margins as you scale.",
      descAr: "تسعير تجاري متدرج حسب الكميات لحماية هوامش ربحك مع نمو أعمالك.",
    },
  ];

  const segments = [
    { icon: Wrench, en: "Detailing Centers", ar: "مراكز التلميع" },
    { icon: Network, en: "Distribution Companies", ar: "شركات التوزيع" },
    { icon: Building2, en: "Authorized Agencies", ar: "الوكالات المعتمدة" },
    { icon: Car, en: "Fleet Operators", ar: "مشغلو الأساطيل" },
  ];

  return (
    <>
      <Seo
        title={t("Become a Partner", "كن شريكاً معنا")}
        description={t(
          "Partner with CARZIX in Qatar — join the professional supply network for high-concentration car care products, backed by German formulas and exclusive local distribution.",
          "كن شريكاً مع CARZIX في قطر — انضم إلى شبكة الإمداد الاحترافية لمنتجات العناية بالسيارات فائقة التركيز، بدعم تركيبات ألمانية وتوزيع محلي حصري."
        )}
      />

      {/* Hero */}
      <section className="relative pt-36 pb-20 bg-black overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,_rgba(13,66,97,0.25)_0%,_transparent_60%)]" />
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center"
        >
          <motion.p variants={fadeUp} className="text-[#A29475] text-xs font-semibold tracking-widest uppercase mb-4">
            {t("Distribution & Partnerships", "التوزيع والشراكات")}
          </motion.p>
          <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-5">
            {t("Partner with CARZIX in Qatar", "كن شريكاً مع CARZIX في قطر")}
          </motion.h1>
          <motion.p variants={fadeUp} className="text-white/55 text-lg leading-relaxed max-w-2xl mx-auto mb-4">
            {t(
              "Join the professional supply network for high-concentration car care products.",
              "انضم إلى شبكة الإمداد الاحترافية لمنتجات العناية بالسيارات فائقة التركيز."
            )}
          </motion.p>
          <motion.p variants={fadeUp} className="text-white/45 text-base leading-relaxed max-w-2xl mx-auto">
            {t(
              "We're opening the door to detailing centers, distribution companies, agencies, and fleet operators across Qatar — delivering high-performance professional car care solutions, backed by German high-concentration formulas and direct local supply through Doha International Trading Company.",
              "نفتح باب التعاون مع مراكز التلميع، شركات التوزيع، الوكالات، ومشغلي الأساطيل داخل دولة قطر لتوفير حلول عناية احترافية عالية الأداء، مدعومة بتركيبات ألمانية فائقة التركيز وإمداد محلي مباشر عبر شركة الدوحة العالمية للتجارة."
            )}
          </motion.p>
          <motion.div variants={fadeUp} className="mt-9">
            <Link
              href="/contact"
              className="btn-cta inline-flex items-center gap-2 px-8 py-4 text-[#111827] font-bold rounded"
            >
              {t("Request a Partnership", "اطلب شراكة تجارية")}
              <ChevronRight size={18} className={isAr ? "rotate-180" : ""} />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Who we partner with */}
      <section className="py-16 bg-[#0D4261]/10 border-y border-[#0D4261]/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {segments.map(({ icon: Icon, en, ar }) => (
              <motion.div key={en} variants={fadeScale} className="glass card-shine rounded-xl py-7 px-4 text-center">
                <div className="w-11 h-11 rounded-lg bg-[#0D4261]/12 border border-[#0D4261]/28 flex items-center justify-center mx-auto mb-3">
                  <Icon size={20} className="text-[#A29475]" />
                </div>
                <div className="text-white font-bold text-sm">{isAr ? ar : en}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="text-center mb-14">
              <p className="text-[#A29475] text-xs font-semibold tracking-widest uppercase mb-3">
                {t("Why Partner With Us", "لماذا الشراكة معنا")}
              </p>
              <h2 className="text-4xl font-black text-white">{t("Partnership Benefits", "مزايا الشراكة")}</h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map(({ icon: Icon, titleEn, titleAr, descEn, descAr }) => (
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
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#0D4261]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,_rgba(0,0,0,0.5)_0%,_transparent_65%)]" />
        <div className="absolute inset-0 bg-grid-subtle opacity-15 pointer-events-none" />
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="relative max-w-3xl mx-auto px-6 lg:px-8 text-center"
        >
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-black text-white mb-4">
            {t("Ready to Grow Your Business with CARZIX?", "مستعد لتطوير أعمالك مع CARZIX؟")}
          </motion.h2>
          <motion.p variants={fadeUp} className="text-white/70 mb-8 max-w-xl mx-auto">
            {t(
              "Tell us about your business and our team will follow up with a tailored commercial proposal.",
              "أخبرنا عن نشاطك التجاري وسيتواصل فريقنا معك بعرض تجاري مخصص."
            )}
          </motion.p>
          <motion.div variants={fadeUp}>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#0D4261] font-bold rounded hover:bg-white/92 transition-colors shadow-[0_4px_20px_rgba(255,255,255,0.18)]"
            >
              {t("Request a Partnership", "اطلب شراكة تجارية")} <ChevronRight size={16} className={isAr ? "rotate-180" : ""} />
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}
