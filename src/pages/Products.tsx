import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, Loader2, Package, Filter } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Product } from "@/lib/types";
import { fadeUp, stagger, fadeScale } from "@/lib/motion";
import { useLang } from "@/contexts/LanguageContext";
import { staticProducts, staticCategories } from "@/lib/products";

interface RequestForm {
  customer_name: string;
  email: string;
  phone: string;
  product_name: string;
  product_id: string;
  quantity: string;
  notes: string;
}

const emptyForm: RequestForm = {
  customer_name: "",
  email: "",
  phone: "",
  product_name: "",
  product_id: "",
  quantity: "1",
  notes: "",
};

type DisplayProduct = Product | typeof staticProducts[0];

function isDbProduct(p: DisplayProduct): p is Product {
  return "status" in p;
}

export default function Products() {
  const { t, isAr } = useLang();
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [modalProduct, setModalProduct] = useState<DisplayProduct | null>(null);
  const [quickView, setQuickView] = useState<DisplayProduct | null>(null);
  const [form, setForm] = useState<RequestForm>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) setDbProducts(data);
        setLoading(false);
      });
  }, []);

  const useStatic = dbProducts.length === 0;
  const allProducts: DisplayProduct[] = useStatic ? staticProducts : dbProducts;

  const filtered =
    activeCategory === "all"
      ? allProducts
      : allProducts.filter((p) => p.category === activeCategory);

  const cats = useStatic
    ? staticCategories
    : [
        { id: "all", nameEn: "All Products", nameAr: "جميع المنتجات" },
        ...Array.from(new Set(dbProducts.map((p) => p.category).filter(Boolean))).map((c) => ({
          id: c,
          nameEn: c,
          nameAr: c,
        })),
      ];

  function openModal(product: DisplayProduct) {
    const name = isDbProduct(product) ? product.name : product.nameEn;
    const id = product.id;
    setModalProduct(product);
    setForm({ ...emptyForm, product_name: name, product_id: id });
    setSubmitted(false);
    setError("");
  }

  function closeModal() {
    setModalProduct(null);
    setSubmitted(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const { error: err } = await supabase.from("product_requests").insert({
      customer_name: form.customer_name,
      email: form.email,
      phone: form.phone || null,
      product_id: isDbProduct(modalProduct!) ? modalProduct!.id : null,
      product_name: form.product_name,
      quantity: parseInt(form.quantity) || 1,
      notes: form.notes || null,
    });

    setSubmitting(false);
    if (err) {
      setError(t("Something went wrong. Please try again.", "حدث خطأ ما. يرجى المحاولة مرة أخرى."));
    } else {
      setSubmitted(true);
    }
  }

  const productName = (p: DisplayProduct) =>
    isAr
      ? (isDbProduct(p) ? (p.name_ar || p.name) : p.nameAr)
      : (isDbProduct(p) ? p.name : p.nameEn);
  const productDesc = (p: DisplayProduct) =>
    isAr
      ? (isDbProduct(p) ? (p.description_ar || p.description || "") : p.descriptionAr)
      : (isDbProduct(p) ? p.description ?? "" : p.descriptionEn);
  const productCat = (p: DisplayProduct) => p.category;
  const productImage = (p: DisplayProduct) => (isDbProduct(p) ? p.image_url : null);
  const productFeatures = (p: DisplayProduct): string[] => {
    if (isDbProduct(p)) return (isAr ? (p.features_ar || p.features) : p.features) ?? [];
    return isAr ? p.featuresAr : p.featuresEn;
  };
  const productSizes = (p: DisplayProduct): string[] => {
    if (isDbProduct(p)) return p.sizes ?? [];
    return p.sizes ?? [];
  };

  const inputCls =
    "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#0D4261] transition-colors";

  return (
    <>
      {/* Hero */}
      <section className="relative pt-36 pb-20 bg-black overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,_rgba(13,66,97,0.25)_0%,_transparent_60%)]" />
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center"
        >
          <motion.p variants={fadeUp} className="text-[#A29475] text-xs font-semibold tracking-widest uppercase mb-4">
            {t("Catalogue", "الكتالوج")}
          </motion.p>
          <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl font-black text-white mb-5">
            {t("Our Products", "منتجاتنا")}
          </motion.h1>
          <motion.p variants={fadeUp} className="text-white/50 max-w-xl mx-auto text-lg">
            {t(
              "Professional-grade detailing and car care products for every need — shampoos, polishes, interior care, glass, and tires.",
              "منتجات تفصيل وعناية سيارات احترافية لكل احتياج — شامبوهات وتلميع وعناية داخلية وزجاج وكفرات."
            )}
          </motion.p>
        </motion.div>
      </section>

      {/* Filter bar */}
      <div className="bg-zinc-950 border-y border-white/8 sticky top-16 lg:top-20 z-30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-3 overflow-x-auto py-3 scrollbar-none">
            <Filter size={14} className="text-white/30 shrink-0" />
            {cats.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`shrink-0 px-4 py-1.5 rounded text-sm font-medium transition-colors ${
                  activeCategory === cat.id
                    ? "bg-[#0D4261] text-white"
                    : "text-white/50 hover:text-white"
                }`}
              >
                {isAr ? cat.nameAr : cat.nameEn}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products grid */}
      <section className="py-16 bg-black min-h-[50vh]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-24">
              <Loader2 size={32} className="text-[#0D4261] animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center py-24 text-center">
              <Package size={40} className="text-white/20 mb-4" />
              <p className="text-white/40">{t("No products found.", "لم يتم العثور على منتجات.")}</p>
            </div>
          ) : (
            <motion.div
              key={activeCategory}
              initial="hidden"
              animate="show"
              variants={stagger}
              className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            >
              {filtered.map((product, i) => (
                <motion.div
                  key={isDbProduct(product) ? product.id : product.id}
                  variants={fadeScale}
                  custom={i}
                  className="group glass card-shine flex flex-col rounded-xl overflow-hidden hover:border-[#0D4261]/45 hover:shadow-[0_4px_32px_rgba(13,66,97,0.14)] transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative h-52 bg-zinc-900 overflow-hidden">
                    {productImage(product) ? (
                      <img
                        src={productImage(product)!}
                        alt={productName(product)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-900 to-black">
                        <div className="text-center">
                          <div className="w-14 h-14 rounded-full bg-[#0D4261]/15 border border-[#0D4261]/30 flex items-center justify-center mx-auto mb-2">
                            <span className="text-[#A29475] font-black text-lg">CZ</span>
                          </div>
                        </div>
                      </div>
                    )}
                    {productCat(product) && (
                      <span className="absolute top-3 left-3 px-2 py-0.5 bg-black/70 text-[#A29475] text-xs rounded">
                        {productCat(product)}
                      </span>
                    )}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 gap-2">
                      <button
                        onClick={() => setQuickView(product)}
                        className="w-full py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold rounded hover:bg-white/20 transition-colors"
                      >
                        {t("Quick View", "عرض سريع")}
                      </button>
                      <button
                        onClick={() => openModal(product)}
                        className="w-full py-2 btn-brand text-white text-xs font-semibold rounded"
                      >
                        {t("Request Quote", "طلب عرض سعر")}
                      </button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex flex-col flex-1 p-5">
                    <h3 className="text-white font-bold text-base mb-1 leading-snug">
                      {productName(product)}
                    </h3>
                    {productDesc(product) && (
                      <p className="text-white/40 text-xs leading-relaxed mb-4 flex-1 line-clamp-3">
                        {productDesc(product)}
                      </p>
                    )}
                    {productFeatures(product).slice(0, 2).length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {productFeatures(product).slice(0, 2).map((f, fi) => (
                          <span
                            key={fi}
                            className="px-2 py-0.5 bg-[#129B82]/10 border border-[#129B82]/22 text-[#129B82] text-xs rounded"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    )}
                    {isDbProduct(product) && product.dilution_ratio && (
                      <p className="text-white/35 text-xs mb-3">
                        <span className="text-white/25">{t("Dilution", "نسبة التخفيف")}: </span>
                        {product.dilution_ratio}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-auto pt-1">
                      {isDbProduct(product) && product.price != null ? (
                        <span className="text-[#A29475] font-bold text-sm">
                          QAR {product.price.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-white/30 text-xs">{t("Contact for price", "تواصل للسعر")}</span>
                      )}
                      <button
                        onClick={() => openModal(product)}
                        className="btn-brand px-3 py-1.5 text-white text-xs font-semibold rounded"
                      >
                        {t("Request Quote", "طلب عرض سعر")}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ── Quick View Modal ── */}
      <AnimatePresence>
        {quickView && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && setQuickView(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              className="relative w-full max-w-2xl glass-dark rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Image area */}
              <div className="relative h-52 bg-zinc-900 flex items-center justify-center">
                {productImage(quickView) ? (
                  <img
                    src={productImage(quickView)!}
                    alt={productName(quickView)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-[#0D4261]/20 border border-[#0D4261]/40 flex items-center justify-center">
                      <span className="text-[#A29475] font-black text-xl">CZ</span>
                    </div>
                    <span className="text-[#A29475]/60 text-xs tracking-widest uppercase">{productCat(quickView)}</span>
                  </div>
                )}
                <button
                  onClick={() => setQuickView(null)}
                  className="absolute top-4 right-4 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
                {productCat(quickView) && (
                  <span className="absolute bottom-4 left-4 px-3 py-1 bg-black/70 text-[#A29475] text-xs rounded">
                    {productCat(quickView)}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-8">
                <h2 className="text-white font-black text-2xl mb-3 leading-tight">
                  {productName(quickView)}
                </h2>
                {productDesc(quickView) && (
                  <p className="text-white/55 text-sm leading-relaxed mb-6">{productDesc(quickView)}</p>
                )}

                {productFeatures(quickView).length > 0 && (
                  <div className="mb-5">
                    <p className="text-white/35 text-xs uppercase tracking-widest mb-3">
                      {t("Key Features", "المميزات الرئيسية")}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {productFeatures(quickView).map((f, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 bg-[#129B82]/10 border border-[#129B82]/25 text-[#129B82] text-xs rounded"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {productSizes(quickView).length > 0 && (
                  <div className="mb-5">
                    <p className="text-white/35 text-xs uppercase tracking-widest mb-3">
                      {t("Available Sizes", "الأحجام المتاحة")}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {productSizes(quickView).map((s, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 glass border-white/12 text-white/65 text-xs rounded"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {isDbProduct(quickView) && (quickView.dilution_ratio || quickView.suitable_for) && (
                  <div className="mb-7 grid grid-cols-2 gap-4">
                    {quickView.dilution_ratio && (
                      <div>
                        <p className="text-white/35 text-xs uppercase tracking-widest mb-1">
                          {t("Dilution Ratio", "نسبة التخفيف")}
                        </p>
                        <p className="text-white/70 text-sm">{quickView.dilution_ratio}</p>
                      </div>
                    )}
                    {quickView.suitable_for && (
                      <div>
                        <p className="text-white/35 text-xs uppercase tracking-widest mb-1">
                          {t("Suitable For", "مناسب لـ")}
                        </p>
                        <p className="text-white/70 text-sm">{quickView.suitable_for}</p>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => { openModal(quickView); setQuickView(null); }}
                    className="flex-1 btn-brand py-3.5 text-white font-semibold rounded"
                  >
                    {t("Request a Quote", "طلب عرض سعر")}
                  </button>
                  <button
                    onClick={() => setQuickView(null)}
                    className="px-6 py-3.5 border border-white/15 text-white/55 hover:text-white text-sm rounded transition-colors"
                  >
                    {t("Close", "إغلاق")}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Request Quote Modal ── */}
      <AnimatePresence>
        {modalProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && closeModal()}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md glass-dark rounded-2xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={closeModal}
                className="absolute top-5 right-5 text-white/40 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>

              {submitted ? (
                <div className="flex flex-col items-center py-6 text-center">
                  <CheckCircle size={40} className="text-[#129B82] mb-4" />
                  <h3 className="text-white font-bold text-xl mb-2">
                    {t("Request Sent!", "تم إرسال الطلب!")}
                  </h3>
                  <p className="text-white/50 text-sm mb-6">
                    {t("We'll get back to you shortly regarding", "سنتواصل معك قريباً بخصوص")}{" "}
                    <span className="text-[#A29475]">{productName(modalProduct)}</span>.
                  </p>
                  <button
                    onClick={closeModal}
                    className="px-6 py-2.5 bg-[#0D4261] text-white text-sm font-semibold rounded hover:bg-[#0a3350] transition-colors"
                  >
                    {t("Close", "إغلاق")}
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="text-white font-bold text-xl mb-1">
                    {t("Request a Quote", "طلب عرض سعر")}
                  </h3>
                  <p className="text-[#A29475] text-sm mb-6">{productName(modalProduct)}</p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-white/55 text-xs font-medium mb-1.5">
                        {t("Full Name *", "الاسم الكامل *")}
                      </label>
                      <input
                        type="text"
                        required
                        value={form.customer_name}
                        onChange={(e) => setForm((f) => ({ ...f, customer_name: e.target.value }))}
                        className={inputCls}
                        placeholder={t("Your full name", "اسمك الكامل")}
                      />
                    </div>
                    <div>
                      <label className="block text-white/55 text-xs font-medium mb-1.5">
                        {t("Email *", "البريد الإلكتروني *")}
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        className={inputCls}
                        placeholder="you@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-white/55 text-xs font-medium mb-1.5">
                        {t("Phone", "رقم الهاتف")}
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                        className={inputCls}
                        placeholder="+974 XXXX XXXX"
                      />
                    </div>
                    <div>
                      <label className="block text-white/55 text-xs font-medium mb-1.5">
                        {t("Product", "المنتج")}
                      </label>
                      <input
                        type="text"
                        value={form.product_name}
                        onChange={(e) => setForm((f) => ({ ...f, product_name: e.target.value }))}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="block text-white/55 text-xs font-medium mb-1.5">
                        {t("Quantity", "الكمية")}
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={form.quantity}
                        onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="block text-white/55 text-xs font-medium mb-1.5">
                        {t("Notes", "ملاحظات")}
                      </label>
                      <textarea
                        rows={3}
                        value={form.notes}
                        onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                        className={inputCls + " resize-none"}
                        placeholder={t("Any additional notes…", "أي ملاحظات إضافية…")}
                      />
                    </div>

                    {error && <p className="text-red-400 text-sm">{error}</p>}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3.5 bg-[#0D4261] hover:bg-[#0a3350] disabled:opacity-60 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <><Loader2 size={16} className="animate-spin" /> {t("Sending…", "جارٍ الإرسال…")}</>
                      ) : (
                        t("Submit Request", "إرسال الطلب")
                      )}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
