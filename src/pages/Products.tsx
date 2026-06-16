import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, Loader2, Package, Filter } from "lucide-react";
import DilutionCalculator from "@/components/DilutionCalculator";
import { supabase } from "@/lib/supabase";
import type { Product } from "@/lib/types";
import { fadeUp, stagger, fadeScale } from "@/lib/motion";
import { useLang } from "@/contexts/LanguageContext";
import { staticProducts, staticCategories } from "@/lib/products";
import { validateName, validateEmail, validatePhone, validateQuantity, validateNotes } from "@/lib/validation";

interface RequestForm {
  customer_name: string;
  email: string;
  phone: string;
  product_name: string;
  product_id: string;
  quantity: string;
  notes: string;
}

interface FormErrors {
  customer_name?: string;
  email?: string;
  phone?: string;
  quantity?: string;
  notes?: string;
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
  const [errors, setErrors] = useState<FormErrors>({});

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
    setErrors({});
  }

  function closeModal() {
    setModalProduct(null);
    setSubmitted(false);
    setErrors({});
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const errs: FormErrors = {};
    const nameErr = validateName(form.customer_name);
    if (nameErr) errs.customer_name = isAr ? nameErr.ar : nameErr.en;
    const emailErr = validateEmail(form.email);
    if (emailErr) errs.email = isAr ? emailErr.ar : emailErr.en;
    const phoneErr = validatePhone(form.phone);
    if (phoneErr) errs.phone = isAr ? phoneErr.ar : phoneErr.en;
    const qtyErr = validateQuantity(form.quantity);
    if (qtyErr) errs.quantity = isAr ? qtyErr.ar : qtyErr.en;
    const notesErr = validateNotes(form.notes);
    if (notesErr) errs.notes = isAr ? notesErr.ar : notesErr.en;

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setSubmitting(true);
    setError("");

    const payload = {
      customer_name: form.customer_name,
      email: form.email,
      phone: form.phone || null,
      product_id: isDbProduct(modalProduct!) ? modalProduct!.id : null,
      product_name: form.product_name,
      quantity: parseInt(form.quantity) || 1,
      notes: form.notes || null,
    };

    console.log("[QuoteForm] Submitting quote request", payload);

    const { data, error: err } = await supabase
      .from("product_requests")
      .insert(payload)
      .select();

    console.log("[QuoteForm] Insert result", { data, error: err });

    setSubmitting(false);
    if (err) {
      console.error("[QuoteForm] Insert failed", err);
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
                      <span className="absolute top-3 start-3 px-2 py-0.5 bg-black/70 text-[#A29475] text-xs rounded">
                        {productCat(product)}
                      </span>
                    )}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 gap-2">
                      <button
                        onClick={() => setQuickView(product)}
                        className="w-full py-2 bg-white/8 backdrop-blur-sm border border-white/18 text-[#D1D5DB] text-xs font-semibold rounded hover:bg-white/18 transition-colors"
                      >
                        {t("Quick View", "عرض سريع")}
                      </button>
                      <button
                        onClick={() => openModal(product)}
                        className="w-full py-2 btn-cta text-[#111827] text-xs font-bold rounded"
                      >
                        {t("Request Quote", "طلب عرض سعر")}
                      </button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex flex-col flex-1 p-5">
                    <h3 className="text-white font-bold text-base mb-1.5 leading-snug">
                      {productName(product)}
                    </h3>
                    {isDbProduct(product) && product.dilution_ratio && (
                      <div className="mb-2.5">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0D4261]/20 border border-[#A29475]/35 text-xs font-bold">
                          <span className="text-white/35 font-medium">{t("Dilution:", "نسبة التخفيف:")}</span>
                          <span className="text-[#A29475] tracking-wider">{product.dilution_ratio}</span>
                        </span>
                      </div>
                    )}
                    {productDesc(product) && (
                      <p className="text-white/40 text-xs leading-relaxed mb-3 flex-1 line-clamp-2">
                        {productDesc(product)}
                      </p>
                    )}
                    {productSizes(product).length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {productSizes(product).map((s, si) => (
                          <span key={si} className="px-2 py-0.5 bg-[#0D4261]/10 border border-[#0D4261]/22 text-white/45 text-[10px] rounded font-mono">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                    {isDbProduct(product) && product.suitable_for && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {product.suitable_for.split(/[,،]/).map((s, si) => (
                          <span key={si} className="px-2 py-0.5 bg-white/4 border border-white/10 text-white/40 text-[10px] rounded">
                            {s.trim()}
                          </span>
                        ))}
                      </div>
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
                        className="btn-cta px-3 py-1.5 text-[#111827] text-xs font-bold rounded"
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

      {/* ── Dilution Calculator ── */}
      <DilutionCalculator />

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
                  <span className="absolute bottom-4 start-4 px-3 py-1 bg-black/70 text-[#A29475] text-xs rounded">
                    {productCat(quickView)}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-8">
                <h2 className="text-white font-black text-2xl mb-2 leading-tight">
                  {productName(quickView)}
                </h2>
                {isDbProduct(quickView) && quickView.dilution_ratio && (
                  <div className="mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#0D4261]/20 border border-[#A29475]/40 text-[#A29475] text-sm font-bold tracking-wider shadow-[0_0_12px_rgba(162,148,117,0.12)]">
                      {quickView.dilution_ratio}
                    </span>
                  </div>
                )}
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
                          className="px-3 py-1.5 bg-[#0D4261]/12 border border-[#A29475]/28 text-[#A29475] text-xs rounded"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Operational Information */}
                <div className="mb-7">
                  <p className="text-white/35 text-xs uppercase tracking-widest mb-3">
                    {t("Operational Information", "معلومات التشغيل")}
                  </p>
                  <div className="rounded-xl bg-white/[0.03] border border-white/8 p-5 space-y-3">
                    {isDbProduct(quickView) && quickView.dilution_ratio && (
                      <div className="flex items-center justify-between">
                        <span className="text-white/40 text-xs">{t("Dilution Ratio", "نسبة التخفيف")}</span>
                        <span className="text-[#A29475] font-bold text-sm">{quickView.dilution_ratio}</span>
                      </div>
                    )}
                    {isDbProduct(quickView) && quickView.suitable_for && (
                      <div>
                        <span className="text-white/40 text-xs block mb-2">{t("Suitable For", "مناسب لـ")}</span>
                        <div className="flex flex-wrap gap-1.5">
                          {quickView.suitable_for.split(/[,،]/).map((s, i) => (
                            <span key={i} className="px-2.5 py-1 bg-[#0D4261]/15 border border-[#0D4261]/30 text-white/60 text-xs rounded-full">
                              {s.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {productSizes(quickView).length > 0 && (
                      <div>
                        <span className="text-white/40 text-xs block mb-2">{t("Available Sizes", "الأحجام المتاحة")}</span>
                        <div className="flex flex-wrap gap-1.5">
                          {productSizes(quickView).map((s, i) => (
                            <span key={i} className="px-2.5 py-1 bg-[#0D4261]/10 border border-[#0D4261]/22 text-white/50 text-xs rounded font-mono">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="pt-2 border-t border-white/8 flex flex-wrap gap-2">
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
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => { openModal(quickView); setQuickView(null); }}
                    className="flex-1 btn-cta py-3.5 text-[#111827] font-bold rounded"
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
                      {errors.customer_name && <p className="text-red-400 text-xs mt-1">{errors.customer_name}</p>}
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
                      {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
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
                      {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                    </div>
                    <div>
                      <label className="block text-white/55 text-xs font-medium mb-1.5">
                        {t("Product", "المنتج")}
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={form.product_name}
                        className={inputCls + " cursor-not-allowed opacity-60"}
                      />
                    </div>
                    <div>
                      <label className="block text-white/55 text-xs font-medium mb-1.5">
                        {t("Quantity *", "الكمية *")}
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="9999"
                        required
                        value={form.quantity}
                        onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
                        className={inputCls}
                      />
                      {errors.quantity && <p className="text-red-400 text-xs mt-1">{errors.quantity}</p>}
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
                      {errors.notes && <p className="text-red-400 text-xs mt-1">{errors.notes}</p>}
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
