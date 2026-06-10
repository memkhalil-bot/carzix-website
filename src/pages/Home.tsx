import { useEffect, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ChevronRight, Shield, Zap, Leaf, Droplets, Sparkles, Package, CircleDot,
} from "lucide-react";
import ClientsSlider from "@/components/ClientsSlider";
import { fadeUp, staggerSlow as stagger } from "@/lib/motion";
import { useLang } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";
import { staticProducts, staticCategories } from "@/lib/products";
import type { Product } from "@/lib/types";

/* ─── abstract product visual ─── */
function ProductArt() {
  return (
    <svg viewBox="0 0 500 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-hidden="true">
      <circle cx="250" cy="210" r="190" stroke="#8A1538" strokeWidth="0.7" opacity="0.15" />
      <circle cx="250" cy="210" r="145" stroke="#A29475" strokeWidth="0.5" opacity="0.10" />
      {/* Bottle silhouette */}
      <rect x="175" y="95" width="70" height="110" rx="10" fill="#1a1a1a" stroke="#2a2a2a" strokeWidth="1.5" />
      <rect x="197" y="75" width="26" height="25" rx="5" fill="#222" stroke="#2a2a2a" strokeWidth="1" />
      <rect x="193" y="88" width="34" height="8" rx="3" fill="#8A1538" opacity="0.7" />
      <rect x="182" y="135" width="56" height="3" rx="1.5" fill="#A29475" opacity="0.4" />
      <rect x="182" y="148" width="40" height="2" rx="1" fill="#A29475" opacity="0.25" />
      {/* Spray bottle */}
      <path d="M 270 130 L 270 215 Q 270 225 280 225 L 320 225 Q 330 225 330 215 L 330 155 Q 330 145 320 145 L 298 145 L 295 130 Z" fill="#1a1a1a" stroke="#2a2a2a" strokeWidth="1.5" />
      <path d="M 295 130 L 295 118 L 310 118 L 320 130" fill="#222" stroke="#2a2a2a" strokeWidth="1" />
      <path d="M 308 118 Q 340 100 348 90" stroke="#8A1538" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <circle cx="348" cy="88" r="3" fill="#8A1538" opacity="0.6" />
      <rect x="278" y="175" width="44" height="3" rx="1.5" fill="#A29475" opacity="0.35" />
      {/* Small accent dots */}
      <circle cx="155" cy="155" r="4" fill="#8A1538" opacity="0.4" />
      <circle cx="345" cy="265" r="3" fill="#A29475" opacity="0.35" />
      <circle cx="200" cy="280" r="2.5" fill="#8A1538" opacity="0.3" />
      {/* Sparkle lines */}
      <line x1="140" y1="100" x2="140" y2="112" stroke="#A29475" strokeWidth="1.5" opacity="0.5" strokeLinecap="round" />
      <line x1="134" y1="106" x2="146" y2="106" stroke="#A29475" strokeWidth="1.5" opacity="0.5" strokeLinecap="round" />
      <line x1="370" y1="140" x2="370" y2="150" stroke="#8A1538" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
      <line x1="365" y1="145" x2="375" y2="145" stroke="#8A1538" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
      {/* Ground line */}
      <line x1="80" y1="330" x2="420" y2="330" stroke="#1a1a1a" strokeWidth="1" />
      <ellipse cx="250" cy="330" rx="170" ry="8" fill="#8A1538" opacity="0.05" />
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
      titleEn: "Premium Quality",
      titleAr: "جودة عالية",
      descEn: "Professional-grade formulas with German technology, tested for superior performance.",
      descAr: "تركيبات احترافية بتكنولوجيا ألمانية، مختبرة لأداء متفوق.",
    },
    {
      icon: Zap,
      titleEn: "High Performance",
      titleAr: "أداء عالٍ",
      descEn: "Concentrated formulas deliver exceptional results with minimal product required.",
      descAr: "تركيبات مركزة تحقق نتائج استثنائية مع كمية أقل من المنتج.",
    },
    {
      icon: Leaf,
      titleEn: "Eco-Friendly",
      titleAr: "صديق للبيئة",
      descEn: "Safe for the environment and user health. Phosphate-free, biodegradable formulas.",
      descAr: "آمن للبيئة وصحة المستخدم. تركيبات خالية من الفوسفات وقابلة للتحلل.",
    },
  ];

  return (
    <div className="bg-black">
      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_40%_50%,_rgba(138,21,56,0.22)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,_rgba(162,148,117,0.06)_0%,_transparent_50%)]" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center pt-24 pb-16">
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.p variants={fadeUp} className="text-[#A29475] text-xs font-semibold tracking-widest uppercase mb-4">
              {t("Qatar's Premier Car Care", "المتجر الرائد للعناية بالسيارات في قطر")}
            </motion.p>
            <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] mb-6">
              {t("Professional", "منتجات")}
              <br />
              <span className="text-[#8A1538]">{t("Car Care", "عناية السيارات")}</span>
              <br />
              {t("Products", "الاحترافية")}
            </motion.h1>
            <motion.p variants={fadeUp} className="text-white/55 text-lg leading-relaxed mb-8 max-w-lg">
              {t(
                "Premium automotive care products engineered for Qatar's climate. From professional detailing to everyday maintenance — every product is built for results.",
                "منتجات عناية سيارات فاخرة مصممة لمناخ قطر. من التفصيل الاحترافي إلى الصيانة اليومية — كل منتج مصمم للنتائج."
              )}
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#8A1538] hover:bg-[#6b1029] text-white font-semibold rounded transition-colors"
              >
                {t("Explore Catalogue", "استكشف الكتالوج")}
                <ChevronRight size={18} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/20 text-white/80 hover:border-[#A29475]/50 hover:text-white font-semibold rounded transition-colors"
              >
                {t("Request Quote", "طلب عرض سعر")}
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block h-96"
          >
            <ProductArt />
          </motion.div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
          <div className="w-px h-10 bg-white/50" />
          <p className="text-white text-xs tracking-widest uppercase">{t("Scroll", "مرر")}</p>
        </div>
      </section>

      {/* ── Brand Pillars ── */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {pillars.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="p-8 border border-white/8 rounded-lg hover:border-[#8A1538]/40 transition-colors group"
                >
                  <div className="w-12 h-12 rounded border border-[#8A1538]/30 bg-[#8A1538]/10 flex items-center justify-center mb-5 group-hover:bg-[#8A1538]/20 transition-colors">
                    <Icon size={22} className="text-[#8A1538]" />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">
                    {isAr ? p.titleAr : p.titleEn}
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed">
                    {isAr ? p.descAr : p.descEn}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── Product Categories ── */}
      <section className="py-20 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
          >
            <motion.p variants={fadeUp} className="text-[#A29475] text-xs font-semibold tracking-widest uppercase mb-3">
              {t("What We Offer", "ما نقدمه")}
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-black text-white mb-12">
              {t("Product Categories", "فئات المنتجات")}
            </motion.h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {staticCategories.slice(1).map((cat) => {
                const Icon = categoryIcons[cat.id] ?? Package;
                return (
                  <motion.div key={cat.id} variants={fadeUp}>
                    <Link
                      href="/products"
                      className="flex flex-col items-center gap-3 p-5 border border-white/8 rounded-lg text-center hover:border-[#A29475]/40 hover:bg-white/3 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-full border border-[#A29475]/20 bg-[#A29475]/5 flex items-center justify-center group-hover:bg-[#A29475]/15 transition-colors">
                        <Icon size={18} className="text-[#A29475]" />
                      </div>
                      <span className="text-white/70 group-hover:text-white text-xs font-medium leading-tight transition-colors">
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
      <section className="py-20">
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
                <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-black text-white">
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
                    variants={fadeUp}
                    className="group border border-white/8 rounded-lg overflow-hidden hover:border-[#8A1538]/40 transition-all"
                  >
                    {/* Product image / placeholder */}
                    <div className="h-52 bg-zinc-900 relative overflow-hidden">
                      {imageUrl ? (
                        <img src={imageUrl} alt={nameEn} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-[#8A1538]/15 border border-[#8A1538]/30 flex items-center justify-center mx-auto mb-3">
                              <span className="text-[#8A1538] font-black text-xl">CZ</span>
                            </div>
                            <span className="text-[#A29475] text-xs tracking-widest uppercase">{category}</span>
                          </div>
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 bg-black/60 border border-white/10 text-white/60 text-xs rounded">
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
                        className="inline-flex items-center gap-1.5 text-[#8A1538] hover:text-[#A29475] text-sm font-medium transition-colors"
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

      {/* ── Clients Slider ── */}
      <ClientsSlider />

      {/* ── CTA Banner ── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#8A1538]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,_rgba(0,0,0,0.35)_0%,_transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,_rgba(162,148,117,0.15)_0%,_transparent_50%)]" />

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center"
        >
          <motion.p variants={fadeUp} className="text-white/60 text-xs font-semibold tracking-widest uppercase mb-4">
            {t("Ready to Order?", "مستعد للطلب؟")}
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-black text-white mb-5">
            {t("Request a Quote Today", "اطلب عرض سعر اليوم")}
          </motion.h2>
          <motion.p variants={fadeUp} className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
            {t(
              "Browse our full catalogue and send us your requirements. We'll respond within 24 hours.",
              "تصفح كتالوجنا الكامل وأرسل لنا متطلباتك. سنرد خلال 24 ساعة."
            )}
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-3">
            <Link
              href="/products"
              className="px-8 py-3.5 bg-white text-[#8A1538] font-bold rounded hover:bg-white/90 transition-colors"
            >
              {t("Browse Products", "تصفح المنتجات")}
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3.5 border border-white/40 text-white font-semibold rounded hover:bg-white/10 transition-colors"
            >
              {t("Contact Us", "اتصل بنا")}
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
