import { useEffect, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ChevronRight, Shield, Zap, Leaf, Droplets, Sparkles, Package, CircleDot, MessageCircle,
} from "lucide-react";
import ClientsSlider from "@/components/ClientsSlider";
import Marquee from "@/components/Marquee";
import BeforeAfter from "@/components/BeforeAfter";
import DilutionCalculator from "@/components/DilutionCalculator";
import ConcentrationSection from "@/components/ConcentrationSection";
import Seo from "@/components/Seo";
import { trackEvent } from "@/lib/analytics";
import { trackEvent as trackInternalEvent } from "@/lib/internalAnalytics";
import { fadeUp, blurUp, fadeScale, staggerSlow as stagger } from "@/lib/motion";
import { useLang } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";
import { staticProducts, staticCategories } from "@/lib/products";
import type { Product } from "@/lib/types";

const categoryIcons: Record<string, React.ElementType> = {
  Shampoos: Droplets,
  Polishing: Sparkles,
  "Glass Care": CircleDot,
  "Interior Care": Shield,
  "Multi-Purpose": Package,
  "Tire Care": CircleDot,
};

export default function Home() {
  const { t, isAr } = useLang();
  const [dbProducts, setDbProducts] = useState<Product[]>([]);

  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .eq("status", "active")
      .limit(6)
      .then(
        ({ data }) => {
          if (data && data.length > 0) setDbProducts(data);
        },
        () => {}
      );
  }, []);

  const featuredStatic = staticProducts.slice(0, 6);

  const pillars = [
    {
      icon: Shield,
      titleEn: "German-Grade Formulas",
      titleAr: "هندسة ألمانية فائقة",
      descEn: "Developed with European automotive chemistry — the same standards trusted by professional detailing studios worldwide.",
      descAr: "تركيباتنا نتاج كيمياء أوروبية متقدمة، مطورة ومصممة خصيصاً لتلبي المعايير الدولية الصارمة التي تبحث عنها كبرى مراكز التلميع والوكالات في دولة قطر.",
    },
    {
      icon: Zap,
      titleEn: "Engineered for Results",
      titleAr: "كفاءة تشغيلية واقتصادية",
      descEn: "Concentrated, high-performance formulas that deliver measurable results with every application — for detailing studios and professional businesses alike.",
      descAr: "تركيبات فائقة التركيز وعالية الأداء تحقق نتائج مذهلة وقابلة للقياس مع كل تطبيق؛ مصممة خصيصاً للمحترفين وأصحاب الأعمال لخفض التكاليف التشغيلية ومضاعفة الأرباح.",
    },
    {
      icon: Leaf,
      titleEn: "Eco-Certified Safe",
      titleAr: "معتمد بيئياً وآمن",
      descEn: "Phosphate-free, biodegradable formulas safe for your vehicle, your team, and Qatar's environment.",
      descAr: "تركيبات خالية من الفوسفات وقابلة للتحلل، آمنة لمركبتك وفريقك وبيئة قطر.",
    },
  ];

  return (
    <div className="bg-black">
      <Seo
        title={t("Professional Car Care Products in Qatar", "منتجات عناية احترافية بالسيارات في قطر")}
        description={t(
          "CARZIX supplies German-engineered, professional-grade car care concentrates for detailing studios, dealerships, and automotive fleets across Qatar. Bulk supply available through our exclusive distributor, Doha International Trading Company.",
          "توفر CARZIX منتجات عناية بالسيارات المركزة بتقنية ألمانية بدرجة احترافية لكبرى مراكز التلميع والوكالات المعتمدة وأساطيل السيارات في دولة قطر، عبر وكيلنا الحصري شركة الدوحة العالمية للتجارة. التوريد بالجملة متوفر."
        )}
      />
      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-[#0D4261] blur-[140px] opacity-18 animate-orb-breathe pointer-events-none" />
        <div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[#A29475] blur-[120px] opacity-6 animate-orb-breathe pointer-events-none"
          style={{ animationDelay: "3.5s" }}
        />
        <div className="absolute inset-0 bg-grid-subtle opacity-30 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center pt-24 pb-16">
          {/* Video — above text on mobile, right column on desktop */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="order-first lg:order-last"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(13,66,97,0.22)]">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-56 sm:h-72 lg:h-[430px] object-cover"
              >
                <source src="/videos/hero.mp4" type="video/mp4" />
              </video>
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/15 pointer-events-none" />
              {/* Subtle border */}
              <div className="absolute inset-0 rounded-2xl ring-1 ring-white/8 pointer-events-none" />
            </div>
          </motion.div>

          {/* Text — below video on mobile, left column on desktop */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={stagger}
            className="order-last lg:order-first"
          >
            <motion.p variants={fadeUp} className="text-[#A29475] text-xs font-semibold tracking-widest uppercase mb-4">
              {t("Professional Car Care · Qatar", "منتجات العناية الاحترافية · قطر")}
            </motion.p>
            <motion.h1
              variants={blurUp}
              className={
                isAr
                  ? "text-4xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.15] sm:leading-[1.05] mb-5"
                  : "text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] mb-5"
              }
            >
              {isAr ? (
                <>
                  المعيار الاحترافي
                  <br />
                  <span className="text-[#A29475]">لنتائج فائقة.</span>
                </>
              ) : (
                <>
                  The New Standard
                  <br />
                  <span className="text-[#A29475]">in Professional Detailing.</span>
                </>
              )}
            </motion.h1>
            <motion.p variants={fadeUp} className="text-white/55 text-base sm:text-lg leading-relaxed mb-5 max-w-lg">
              {t(
                "German-engineered high-concentration formulas built for detailing studios, dealerships and automotive fleets across Qatar.",
                "تركيبات كيميائية ألمانية فائقة التركيز، تمنح مراكز التلميع والوكالات في دولة قطر أداءً استثنائياً وتوفيراً تشغيلياً لا يضاهى، معتمدة وموزعة حصرياً عبر شركة الدوحة العالمية للتجارة."
              )}
            </motion.p>
            {/* Concentration callout */}
            <motion.div variants={fadeUp} className="inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#0D4261]/18 border border-[#0D4261]/35 mb-7">
              <span className="text-[#A29475] font-black text-sm sm:text-base">
                {t(
                  "High-concentration formulas with product-specific dilution ratios",
                  "تركيبات عالية التركيز بنسب تخفيف مختلفة حسب كل منتج"
                )}
              </span>
            </motion.div>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                onClick={() => trackInternalEvent("quote_click", { source: "hero" })}
                className="btn-cta inline-flex items-center gap-2 px-7 py-3.5 text-[#111827] font-bold rounded"
              >
                {t("Request a Quote", "اطلب عرض سعر")}
                <ChevronRight size={18} />
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/20 text-[#D1D5DB] hover:border-[#A29475]/50 hover:text-white font-semibold rounded transition-colors"
              >
                {t("Explore Products", "استكشف المنتجات")}
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-25">
          <div className="w-px h-10 bg-gradient-to-b from-transparent via-white to-transparent" />
          <p className="text-white text-xs tracking-widest uppercase">{t("Scroll", "مرر")}</p>
        </div>
      </section>

      {/* ── Marquee ── */}
      <Marquee />

      {/* ── Brand Pillars ── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {pillars.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={i}
                  variants={fadeScale}
                  className="glass card-shine p-8 rounded-xl hover:border-[#129B82]/30 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-lg border border-[#0D4261]/35 bg-[#0D4261]/12 flex items-center justify-center mb-5 group-hover:bg-[#0D4261]/22 group-hover:border-[#0D4261]/55 transition-all">
                    <Icon size={22} className="text-[#A29475]" />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2.5">{isAr ? p.titleAr : p.titleEn}</h3>
                  <p className="text-[#9CA3AF] text-sm leading-relaxed">{isAr ? p.descAr : p.descEn}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── Product Categories ── */}
      <section className="py-20 bg-zinc-950/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-dots-subtle opacity-30 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
          >
            <motion.p variants={fadeUp} className="text-[#A29475] text-xs font-semibold tracking-widest uppercase mb-3">
              {t("What We Offer", "ما نقدمه")}
            </motion.p>
            <motion.h2 variants={blurUp} className="text-4xl sm:text-5xl font-black text-white mb-12">
              {t("Product Categories", "فئات المنتجات")}
            </motion.h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {staticCategories.slice(1).map((cat) => {
                const Icon = categoryIcons[cat.id] ?? Package;
                return (
                  <motion.div key={cat.id} variants={fadeScale}>
                    <Link
                      href="/products"
                      className="glass card-shine flex flex-col items-center gap-4 p-8 rounded-xl text-center hover:border-[#A29475]/40 transition-all group"
                    >
                      <div className="w-14 h-14 rounded-full border border-[#A29475]/20 bg-[#A29475]/5 flex items-center justify-center group-hover:bg-[#A29475]/15 group-hover:border-[#A29475]/45 transition-all">
                        <Icon size={24} className="text-[#A29475]" />
                      </div>
                      <span className="text-white/65 group-hover:text-white text-sm font-semibold leading-tight transition-colors">
                        {isAr ? cat.nameAr : cat.nameEn}
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
          >
            <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
              <div>
                <motion.p variants={fadeUp} className="text-[#A29475] text-xs font-semibold tracking-widest uppercase mb-3">
                  {t("Bestsellers", "الأكثر مبيعاً")}
                </motion.p>
                <motion.h2 variants={blurUp} className="text-4xl sm:text-5xl font-black text-white">
                  {t("Featured Products", "المنتجات المميزة")}
                </motion.h2>
              </div>
              <motion.div variants={fadeUp}>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 text-[#A29475] hover:text-white text-sm font-medium transition-colors"
                >
                  {t("View all products", "عرض جميع المنتجات")}
                  <ChevronRight size={16} />
                </Link>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(dbProducts.length > 0 ? dbProducts : featuredStatic).map((product, i) => {
                const isDb = dbProducts.length > 0;
                const nameEn = isDb ? (product as Product).name : (product as typeof featuredStatic[0]).nameEn;
                const nameAr = isDb
                  ? ((product as Product).name_ar || (product as Product).name)
                  : (product as typeof featuredStatic[0]).nameAr;
                const desc = isDb
                  ? (isAr
                    ? ((product as Product).description_ar || (product as Product).description || "")
                    : (product as Product).description ?? "")
                  : isAr
                  ? (product as typeof featuredStatic[0]).descriptionAr
                  : (product as typeof featuredStatic[0]).descriptionEn;
                const category = isDb ? (product as Product).category : (product as typeof featuredStatic[0]).category;
                const imageUrl = isDb ? (product as Product).image_url : null;

                return (
                  <motion.div
                    key={product.id ?? i}
                    variants={fadeScale}
                    className="group glass card-shine rounded-xl overflow-hidden hover:border-[#0D4261]/50 hover:shadow-[0_6px_32px_rgba(13,66,97,0.18)] transition-all duration-300"
                  >
                    <div className="h-56 bg-zinc-900 relative overflow-hidden">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={nameEn}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-900 to-black flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-[#0D4261]/15 border border-[#0D4261]/30 flex items-center justify-center mx-auto mb-3 group-hover:border-[#0D4261]/55 group-hover:bg-[#0D4261]/25 animate-glow-pulse transition-all">
                              <span className="text-[#A29475] font-black text-xl">CZ</span>
                            </div>
                            <span className="text-[#A29475]/60 text-xs tracking-widest uppercase">{category}</span>
                          </div>
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 bg-black/70 border border-white/10 text-[#A29475] text-xs rounded">
                          {category}
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="text-white font-bold text-base mb-1.5 leading-tight">
                        {isAr ? nameAr : nameEn}
                      </h3>
                      {isDb && (product as Product).dilution_ratio && (
                        <div className="mb-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#0D4261]/20 border border-[#A29475]/35 text-[#A29475] text-xs font-bold tracking-wider">
                            {(product as Product).dilution_ratio}
                          </span>
                        </div>
                      )}
                      <p className="text-white/45 text-sm leading-relaxed mb-4 line-clamp-2">
                        {typeof desc === "string" ? desc : ""}
                      </p>
                      <Link
                        href="/products"
                        className="inline-flex items-center gap-1.5 text-[#A29475] hover:text-white text-sm font-medium transition-colors"
                      >
                        {t("View details", "عرض التفاصيل")}
                        <ChevronRight size={14} />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Before / After ── */}
      <section className="py-24 bg-zinc-950/60 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            <div>
              <motion.p variants={fadeUp} className="text-[#A29475] text-xs font-semibold tracking-widest uppercase mb-3">
                {t("See the Difference", "شاهد الفرق")}
              </motion.p>
              <motion.h2 variants={blurUp} className="text-4xl sm:text-5xl font-black text-white mb-5">
                {t("Results You Can See", "نتائج يمكنك رؤيتها")}
              </motion.h2>
              <motion.p variants={fadeUp} className="text-white/50 text-base leading-relaxed mb-8">
                {t(
                  "CARZIX products deliver a visible transformation every time. Drag the slider to see the difference professional-grade formulas make.",
                  "تحقق منتجات كارزيكس تحولاً مرئياً في كل مرة. اسحب الشريط لترى الفرق الذي تحدثه التركيبات الاحترافية."
                )}
              </motion.p>
              <motion.div variants={fadeUp}>
                <Link href="/products" className="btn-brand inline-flex items-center gap-2 px-6 py-3 text-white font-semibold rounded text-sm">
                  {t("Shop Products", "تسوق المنتجات")} <ChevronRight size={16} />
                </Link>
              </motion.div>
            </div>
            <motion.div variants={fadeScale}>
              <BeforeAfter />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
          >
            <div className="text-center mb-14">
              <motion.h2 variants={blurUp} className="text-4xl sm:text-5xl font-black text-white">
                {t("How It Works", "كيف يعمل")}
              </motion.h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  titleEn: "Browse Catalogue",
                  titleAr: "استكشف الكتالوج الفني",
                  descEn: "Explore our full range of professional detailing products across our main categories.",
                  descAr: "استعرض مجموعتنا المتكاملة من التركيبات والمنظفات الألمانية الموزعة عبر فئات رئيسية مصممة لتلبية احتياجات منشأتك.",
                },
                {
                  step: "02",
                  titleEn: "Request a Quote",
                  titleAr: "حدد الكميات التجارية",
                  descEn: "Select your products and quantities, then submit a quote request in seconds.",
                  descAr: "حدد المنتجات والعبوات المطلوبة مثل 5L و20L، ثم أرسل طلب التسعير التجاري المخصص في ثوانٍ.",
                },
                {
                  step: "03",
                  titleEn: "Fast Delivery",
                  titleAr: "إمداد فوري وتوصيل مباشر",
                  descEn: "We confirm your order and arrange delivery across Qatar within 24–48 hours.",
                  descAr: "نقوم بتأكيد طلبك فوراً وتأمين الشحن والإمداد المباشر إلى مركزك في أي مكان داخل دولة قطر خلال 24–48 ساعة عبر وكيلنا الحصري.",
                },
              ].map(({ step, titleEn, titleAr, descEn, descAr }) => (
                <motion.div
                  key={step}
                  variants={fadeScale}
                  className="relative glass card-shine rounded-xl p-8 hover:border-[#0D4261]/40 transition-colors"
                >
                  <div className="absolute top-6 right-6 text-[#0D4261]/20 text-6xl font-black leading-none select-none">
                    {step}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#0D4261] flex items-center justify-center mb-5 shadow-[0_0_14px_rgba(13,66,97,0.5)]">
                    <span className="text-white font-black text-sm">{step}</span>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-3">{isAr ? titleAr : titleEn}</h3>
                  <p className="text-[#9CA3AF] text-sm leading-relaxed">{isAr ? descAr : descEn}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Clients Slider ── */}
      <ClientsSlider />

      {/* ── WhatsApp CTA Strip ── */}
      <section className="py-14 bg-zinc-950/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-[#A29475] text-xs font-semibold tracking-widest uppercase mb-2">
              {t("Need help choosing?", "تحتاج مساعدة في الاختيار؟")}
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {t("Talk to our product team", "تحدث مع فريق المنتجات")}
            </h2>
            <p className="text-white/40 text-sm mt-2">
              {t("Available on WhatsApp · Responds within hours", "متاح على واتساب · يرد في غضون ساعات")}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <a
              href="https://wa.me/97472252572"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                trackEvent("click_whatsapp", { source_page: "/" });
                trackInternalEvent("whatsapp_click", { source: "contact_section" });
              }}
              className="btn-teal inline-flex items-center gap-2 px-6 py-3.5 text-white font-semibold rounded"
            >
              <MessageCircle size={16} /> {t("WhatsApp Us", "واتساب")}
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 border border-white/20 text-white/70 hover:border-[#A29475]/50 hover:text-white font-semibold rounded transition-colors"
            >
              {t("Contact Sales", "تواصل مع المبيعات")}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why Concentrated Products? ── */}
      <ConcentrationSection />

      {/* ── Dilution Calculator ── */}
      <DilutionCalculator />

      {/* ── CTA Banner ── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#0D4261]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,_rgba(0,0,0,0.5)_0%,_transparent_65%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,_rgba(162,148,117,0.12)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-grid-subtle opacity-15 pointer-events-none" />

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center"
        >
          <motion.p variants={fadeUp} className="text-white/50 text-xs font-semibold tracking-widest uppercase mb-4">
            {t("Ready to Order?", "مستعد للطلب؟")}
          </motion.p>
          <motion.h2 variants={blurUp} className="text-4xl sm:text-5xl font-black text-white mb-5">
            {t("Request a Quote for Your Business", "اطلب عرض سعر لعملك")}
          </motion.h2>
          <motion.p variants={fadeUp} className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
            {t(
              "Browse our professional catalogue and submit your requirements. Serving detailing centers, agencies, and fleets across Qatar.",
              "تصفح كتالوجنا الاحترافي وأرسل متطلباتك. نخدم مراكز التلميع والوكالات والأساطيل في دولة قطر."
            )}
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-3">
            <Link
              href="/products"
              className="px-8 py-3.5 bg-white text-[#0D4261] font-bold rounded hover:bg-white/92 transition-colors shadow-[0_4px_20px_rgba(255,255,255,0.18)]"
            >
              {t("Browse Products", "تصفح المنتجات")}
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3.5 border border-white/35 text-white font-semibold rounded hover:bg-white/10 hover:border-white/55 transition-colors"
            >
              {t("Contact Us", "اتصل بنا")}
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
