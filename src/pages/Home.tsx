import { useEffect, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ChevronRight, Shield, Zap, Leaf, Droplets, Sparkles, Package, CircleDot, MessageCircle,
} from "lucide-react";
import ClientsSlider from "@/components/ClientsSlider";
import Marquee from "@/components/Marquee";
import BeforeAfter from "@/components/BeforeAfter";
import { fadeUp, blurUp, fadeScale, staggerSlow as stagger } from "@/lib/motion";
import { useLang } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";
import { staticProducts, staticCategories } from "@/lib/products";
import type { Product } from "@/lib/types";

function ProductArt() {
  return (
    <svg viewBox="0 0 520 440" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-hidden="true">
      <circle cx="260" cy="220" r="200" stroke="#0D4261" strokeWidth="0.5" opacity="0.18" />
      <circle cx="260" cy="220" r="160" stroke="#A29475" strokeWidth="0.5" opacity="0.1" />
      <circle cx="260" cy="220" r="120" stroke="#0D4261" strokeWidth="0.5" opacity="0.08" />

      {/* Round bottle (left) */}
      <rect x="130" y="100" width="90" height="145" rx="16" fill="#111" stroke="#2a2a2a" strokeWidth="1.5" />
      <rect x="155" y="76" width="40" height="30" rx="8" fill="#161616" stroke="#2a2a2a" strokeWidth="1" />
      <rect x="149" y="94" width="52" height="10" rx="4" fill="#0D4261" opacity="0.85" />
      <rect x="140" y="145" width="70" height="55" rx="4" fill="#1a1a1a" stroke="#2e2e2e" strokeWidth="1" />
      <rect x="148" y="155" width="54" height="3" rx="1.5" fill="#A29475" opacity="0.45" />
      <rect x="148" y="163" width="38" height="2" rx="1" fill="#A29475" opacity="0.25" />
      <rect x="148" y="170" width="45" height="2" rx="1" fill="#A29475" opacity="0.18" />
      <rect x="133" y="108" width="10" height="55" rx="5" fill="white" opacity="0.03" />

      {/* Spray bottle (center-right) */}
      <path d="M 300 115 L 300 215 Q 300 228 313 228 L 360 228 Q 373 228 373 215 L 373 155 Q 373 142 360 142 L 335 142 L 332 115 Z" fill="#111" stroke="#2a2a2a" strokeWidth="1.5" />
      <path d="M 332 115 L 332 100 L 350 100 L 362 115" fill="#161616" stroke="#252525" strokeWidth="1" />
      <path d="M 358 100 Q 390 82 398 72" stroke="#129B82" strokeWidth="2" strokeLinecap="round" opacity="0.6" strokeDasharray="3 4" />
      <circle cx="400" cy="70" r="4" fill="#129B82" opacity="0.45" />
      <circle cx="407" cy="63" r="2.5" fill="#129B82" opacity="0.28" />
      <circle cx="412" cy="57" r="1.5" fill="#129B82" opacity="0.18" />
      <rect x="308" y="168" width="58" height="40" rx="3" fill="#1a1a1a" stroke="#2e2e2e" strokeWidth="1" />
      <rect x="315" y="177" width="44" height="3" rx="1.5" fill="#A29475" opacity="0.4" />
      <rect x="315" y="185" width="30" height="2" rx="1" fill="#A29475" opacity="0.22" />
      <rect x="303" y="124" width="9" height="48" rx="4.5" fill="white" opacity="0.025" />

      {/* Small jar (front) */}
      <ellipse cx="210" cy="318" rx="38" ry="10" fill="#151515" stroke="#252525" strokeWidth="1.5" />
      <rect x="172" y="270" width="76" height="50" rx="8" fill="#111" stroke="#252525" strokeWidth="1.5" />
      <ellipse cx="210" cy="270" rx="38" ry="10" fill="#161616" stroke="#252525" strokeWidth="1" />
      <ellipse cx="210" cy="270" rx="28" ry="7" fill="#1a1a1a" stroke="#0D4261" strokeWidth="0.8" opacity="0.6" />
      <rect x="181" y="286" width="58" height="2.5" rx="1.25" fill="#A29475" opacity="0.3" />
      <rect x="181" y="293" width="42" height="2" rx="1" fill="#A29475" opacity="0.18" />

      {/* Ground */}
      <line x1="80" y1="352" x2="440" y2="352" stroke="#1f1f1f" strokeWidth="1" />
      <ellipse cx="260" cy="355" rx="180" ry="9" fill="#0D4261" opacity="0.04" />

      {/* Sparkles */}
      <g opacity="0.55">
        <line x1="105" y1="88" x2="105" y2="100" stroke="#A29475" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="99" y1="94" x2="111" y2="94" stroke="#A29475" strokeWidth="1.5" strokeLinecap="round" />
      </g>
      <g opacity="0.4">
        <line x1="418" y1="145" x2="418" y2="155" stroke="#129B82" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="413" y1="150" x2="423" y2="150" stroke="#129B82" strokeWidth="1.5" strokeLinecap="round" />
      </g>
      <circle cx="100" cy="280" r="3" fill="#0D4261" opacity="0.35" />
      <circle cx="420" cy="260" r="2.5" fill="#A29475" opacity="0.3" />
      <circle cx="95" cy="195" r="2" fill="#129B82" opacity="0.3" />
    </svg>
  );
}

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
      .then(({ data }) => {
        if (data && data.length > 0) setDbProducts(data);
      });
  }, []);

  const featuredStatic = staticProducts.slice(0, 6);

  const pillars = [
    {
      icon: Shield,
      titleEn: "German-Grade Formulas",
      titleAr: "تركيبات بمعايير ألمانية",
      descEn: "Developed with European automotive chemistry — the same standards trusted by professional detailing studios worldwide.",
      descAr: "مطورة بكيمياء السيارات الأوروبية — نفس المعايير التي تثق بها محلات التفصيل الاحترافية حول العالم.",
    },
    {
      icon: Zap,
      titleEn: "Engineered for Results",
      titleAr: "مصمم للنتائج",
      descEn: "Concentrated, high-performance formulas that deliver measurable results with every application — for studios and enthusiasts alike.",
      descAr: "تركيبات مركزة وعالية الأداء تحقق نتائج قابلة للقياس مع كل تطبيق — للمحترفين والهواة على حد سواء.",
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
      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-[#0D4261] blur-[140px] opacity-18 animate-orb-breathe pointer-events-none" />
        <div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[#A29475] blur-[120px] opacity-6 animate-orb-breathe pointer-events-none"
          style={{ animationDelay: "3.5s" }}
        />
        <div className="absolute inset-0 bg-grid-subtle opacity-30 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center pt-24 pb-16">
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.p variants={fadeUp} className="text-[#129B82] text-xs font-semibold tracking-widest uppercase mb-4">
              {t("Automotive Detailing Products · Qatar & GCC", "منتجات العناية بالسيارات · قطر والخليج")}
            </motion.p>
            <motion.h1 variants={blurUp} className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] mb-6">
              {t("The Professional", "المعيار")}
              <br />
              <span className="text-[#A29475]">{t("Detailing", "الاحترافي")}</span>
              <br />
              {t("Standard.", "لعناية السيارات.")}
            </motion.h1>
            <motion.p variants={fadeUp} className="text-white/55 text-lg leading-relaxed mb-8 max-w-lg">
              {t(
                "Professional-grade automotive care formulas trusted by detailing studios, dealerships, and enthusiasts across Qatar and the GCC.",
                "تركيبات عناية سيارات احترافية موثوق بها من محلات التفصيل والوكلاء والهواة في جميع أنحاء قطر والخليج العربي."
              )}
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
              <Link
                href="/products"
                className="btn-brand inline-flex items-center gap-2 px-7 py-3.5 text-white font-semibold rounded"
              >
                {t("Shop the Catalogue", "تسوق الكتالوج")}
                <ChevronRight size={18} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/20 text-white/80 hover:border-[#A29475]/50 hover:text-white font-semibold rounded transition-colors"
              >
                {t("Request a Quote", "طلب عرض سعر")}
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.25 }}
            className="hidden lg:block h-[430px] animate-float-y"
          >
            <ProductArt />
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
                  <div className="w-12 h-12 rounded-lg border border-[#129B82]/25 bg-[#129B82]/10 flex items-center justify-center mb-5 group-hover:bg-[#129B82]/20 group-hover:border-[#129B82]/50 transition-all">
                    <Icon size={22} className="text-[#129B82]" />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2.5">{isAr ? p.titleAr : p.titleEn}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{isAr ? p.descAr : p.descEn}</p>
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
                const nameAr = isDb ? (product as Product).name : (product as typeof featuredStatic[0]).nameAr;
                const desc = isDb
                  ? (product as Product).description ?? ""
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
                      <p className="text-white/45 text-sm leading-relaxed mb-4 line-clamp-2">
                        {typeof desc === "string" ? desc : ""}
                      </p>
                      <Link
                        href="/products"
                        className="inline-flex items-center gap-1.5 text-[#129B82] hover:text-[#A29475] text-sm font-medium transition-colors"
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
              <motion.p variants={fadeUp} className="text-[#A29475] text-xs font-semibold tracking-widest uppercase mb-3">
                {t("Simple Process", "عملية بسيطة")}
              </motion.p>
              <motion.h2 variants={blurUp} className="text-4xl sm:text-5xl font-black text-white">
                {t("How It Works", "كيف يعمل")}
              </motion.h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  titleEn: "Browse Catalogue",
                  titleAr: "تصفح الكتالوج",
                  descEn: "Explore our full range of professional detailing products across 6 categories.",
                  descAr: "استكشف مجموعتنا الكاملة من منتجات التفصيل الاحترافية عبر 6 فئات.",
                },
                {
                  step: "02",
                  titleEn: "Request a Quote",
                  titleAr: "اطلب عرض سعر",
                  descEn: "Select your products and quantities, then submit a quote request in seconds.",
                  descAr: "اختر منتجاتك والكميات المطلوبة، ثم أرسل طلب عرض السعر في ثوانٍ.",
                },
                {
                  step: "03",
                  titleEn: "Fast Delivery",
                  titleAr: "توصيل سريع",
                  descEn: "We confirm your order and arrange delivery across Qatar within 24–48 hours.",
                  descAr: "نؤكد طلبك ونرتب التوصيل في جميع أنحاء قطر خلال 24–48 ساعة.",
                },
              ].map(({ step, titleEn, titleAr, descEn, descAr }) => (
                <motion.div
                  key={step}
                  variants={fadeScale}
                  className="relative glass card-shine rounded-xl p-8 hover:border-[#129B82]/30 transition-colors"
                >
                  <div className="absolute top-6 right-6 text-[#0D4261]/20 text-6xl font-black leading-none select-none">
                    {step}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#129B82] flex items-center justify-center mb-5 shadow-[0_0_16px_rgba(18,155,130,0.45)]">
                    <span className="text-white font-black text-sm">{step}</span>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-3">{isAr ? titleAr : titleEn}</h3>
                  <p className="text-white/45 text-sm leading-relaxed">{isAr ? descAr : descEn}</p>
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
              "Browse our professional catalogue and submit your requirements. Serving studios and businesses across Qatar and the GCC.",
              "تصفح كتالوجنا الاحترافي وأرسل متطلباتك. نخدم المحلات والشركات في قطر والخليج."
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
