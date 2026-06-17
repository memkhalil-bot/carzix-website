import { useEffect, useState } from "react";
import { Link, useParams } from "wouter";
import { motion } from "framer-motion";
import { ChevronRight, CheckCircle, Loader2, Package } from "lucide-react";
import Seo from "@/components/Seo";
import RequestQuoteModal from "@/components/RequestQuoteModal";
import { supabase } from "@/lib/supabase";
import type { Product } from "@/lib/types";
import { fadeUp, stagger, fadeScale } from "@/lib/motion";
import { useLang } from "@/contexts/LanguageContext";
import { staticProducts } from "@/lib/products";
import {
  type DisplayProduct,
  isDbProduct,
  productName,
  productDesc,
  productCat,
  productImage,
  productFeatures,
  productSizes,
  usageInstructions,
  productSlug,
} from "@/lib/productHelpers";

export default function ProductDetail() {
  const { t, isAr } = useLang();
  const { slug } = useParams<{ slug: string }>();
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quoteProduct, setQuoteProduct] = useState<DisplayProduct | null>(null);

  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .eq("status", "active")
      .then(({ data }) => {
        if (data && data.length > 0) setDbProducts(data);
        setLoading(false);
      });
  }, []);

  const allProducts: DisplayProduct[] = dbProducts.length > 0 ? dbProducts : staticProducts;
  const product = allProducts.find((p) => productSlug(p) === slug);
  const related = product
    ? allProducts.filter((p) => p !== product && productCat(p) === productCat(product)).slice(0, 3)
    : [];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-black">
        <Loader2 size={32} className="text-[#0D4261] animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-black text-center px-6">
        <Package size={40} className="text-white/20 mb-4" />
        <h1 className="text-white font-bold text-xl mb-2">
          {t("Product not found", "المنتج غير موجود")}
        </h1>
        <p className="text-white/40 text-sm mb-6">
          {t("This product may have been removed or the link is incorrect.", "قد يكون هذا المنتج محذوفاً أو الرابط غير صحيح.")}
        </p>
        <Link href="/products" className="px-6 py-3 bg-[#0D4261] hover:bg-[#0a3350] text-white text-sm font-semibold rounded transition-colors">
          {t("Browse All Products", "تصفح جميع المنتجات")}
        </Link>
      </div>
    );
  }

  const name = productName(product, isAr);
  const desc = productDesc(product, isAr);
  const features = productFeatures(product, isAr);
  const sizes = productSizes(product);
  const image = productImage(product);
  const dilutionRatio = isDbProduct(product) ? product.dilution_ratio : undefined;
  const suitableFor = isDbProduct(product) ? product.suitable_for : undefined;

  // Model number / SKU is not part of the current product data model
  // (neither the Supabase `products` table nor the static catalogue) —
  // intentionally omitted rather than invented. Add it here once available.

  return (
    <>
      <Seo
        title={name}
        description={desc || t("Professional-grade car care product by CARZIX.", "منتج عناية احترافي بالسيارات من CARZIX.")}
        image={image || undefined}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Product",
          name,
          description: desc || undefined,
          image: image || undefined,
          category: productCat(product) || undefined,
          brand: { "@type": "Brand", name: "CARZIX" },
        }}
      />

      {/* Breadcrumb */}
      <section className="pt-28 pb-6 bg-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-white/35">
            <Link href="/products" className="hover:text-[#A29475] transition-colors">
              {t("Products", "المنتجات")}
            </Link>
            <ChevronRight size={12} className={isAr ? "rotate-180" : ""} />
            <span className="text-white/55">{productCat(product)}</span>
            <ChevronRight size={12} className={isAr ? "rotate-180" : ""} />
            <span className="text-[#A29475] truncate max-w-[200px]">{name}</span>
          </nav>
        </div>
      </section>

      {/* Hero detail */}
      <section className="pb-20 bg-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="show"
            variants={stagger}
            className="grid lg:grid-cols-2 gap-12"
          >
            {/* Image */}
            <motion.div variants={fadeScale} className="relative rounded-2xl overflow-hidden bg-zinc-900 h-80 lg:h-[460px]">
              {image ? (
                <img src={image} alt={name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-900 to-black">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-[#0D4261]/15 border border-[#0D4261]/30 flex items-center justify-center mx-auto mb-3">
                      <span className="text-[#A29475] font-black text-2xl">CZ</span>
                    </div>
                  </div>
                </div>
              )}
              <span className="absolute top-4 start-4 px-3 py-1 bg-black/70 text-[#A29475] text-xs rounded">
                {productCat(product)}
              </span>
            </motion.div>

            {/* Info */}
            <motion.div variants={fadeUp}>
              <h1 className="text-3xl sm:text-4xl font-black text-white mb-3 leading-tight">{name}</h1>
              {dilutionRatio && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#0D4261]/20 border border-[#A29475]/40 text-[#A29475] text-sm font-bold tracking-wider mb-4">
                  {dilutionRatio}
                </span>
              )}
              {desc && <p className="text-white/55 text-base leading-relaxed mb-6">{desc}</p>}

              {sizes.length > 0 && (
                <div className="mb-6">
                  <p className="text-white/35 text-xs uppercase tracking-widest mb-2">{t("Available Sizes", "الأحجام المتاحة")}</p>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((s) => (
                      <span key={s} className="px-3 py-1.5 bg-[#0D4261]/10 border border-[#0D4261]/25 text-white/65 text-sm rounded font-mono">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {features.length > 0 && (
                <div className="mb-6">
                  <p className="text-white/35 text-xs uppercase tracking-widest mb-2">{t("Key Benefits", "المزايا الرئيسية")}</p>
                  <div className="flex flex-wrap gap-2">
                    {features.map((f) => (
                      <span key={f} className="px-3 py-1.5 bg-[#0D4261]/12 border border-[#A29475]/28 text-[#A29475] text-xs rounded">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {suitableFor && (
                <div className="mb-6">
                  <p className="text-white/35 text-xs uppercase tracking-widest mb-2">{t("Applications", "الاستخدامات")}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {suitableFor.split(/[,،]/).map((s) => (
                      <span key={s} className="px-2.5 py-1 bg-white/4 border border-white/10 text-white/55 text-xs rounded-full">
                        {s.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-8 rounded-xl bg-white/[0.03] border border-white/8 p-5">
                <p className="text-white/40 text-xs uppercase tracking-widest mb-1.5">{t("Usage Instructions", "تعليمات الاستخدام")}</p>
                <p className="text-white/70 text-sm leading-relaxed">{usageInstructions(product, t)}</p>
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                {[
                  { en: "Professional Grade", ar: "درجة احترافية" },
                  { en: "Phosphate Free", ar: "خالي من الفوسفات" },
                  { en: "GCC Climate Tested", ar: "مختبر لمناخ الخليج" },
                ].map(({ en, ar }) => (
                  <span key={en} className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#129B82]/10 border border-[#129B82]/22 text-[#129B82] text-[10px] rounded-full">
                    <CheckCircle size={9} /> {isAr ? ar : en}
                  </span>
                ))}
              </div>

              <button
                onClick={() => setQuoteProduct(product)}
                className="btn-cta inline-flex items-center gap-2 px-8 py-4 text-[#111827] font-bold rounded"
              >
                {t("Request a Quote", "طلب عرض سعر")}
                <ChevronRight size={18} className={isAr ? "rotate-180" : ""} />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Related products */}
      {related.length > 0 && (
        <section className="py-20 bg-zinc-950/50 border-t border-white/8">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              variants={stagger}
            >
              <motion.h2 variants={fadeUp} className="text-2xl font-black text-white mb-8">
                {t("Related Products", "منتجات ذات صلة")}
              </motion.h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {related.map((p) => (
                  <motion.div key={p.id} variants={fadeScale}>
                    <Link
                      href={`/products/${productSlug(p)}`}
                      className="group glass card-shine flex flex-col rounded-xl overflow-hidden hover:border-[#0D4261]/45 transition-all duration-300"
                    >
                      <div className="relative h-40 bg-zinc-900 overflow-hidden">
                        {productImage(p) ? (
                          <img
                            src={productImage(p)!}
                            alt={productName(p, isAr)}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-900 to-black">
                            <span className="text-[#A29475] font-black text-lg">CZ</span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-white font-bold text-sm leading-snug group-hover:text-[#A29475] transition-colors">
                          {productName(p, isAr)}
                        </h3>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      <RequestQuoteModal product={quoteProduct} onClose={() => setQuoteProduct(null)} />
    </>
  );
}
