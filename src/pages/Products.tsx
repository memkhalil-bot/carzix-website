import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, Loader2, Package, Filter } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Product } from "@/lib/types";
import { fadeUp, stagger } from "@/lib/motion";
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
      : allProducts.filter((p) => {
          const cat = isDbProduct(p) ? p.category : p.category;
          return cat === activeCategory;
        });

  /* derive category list */
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
    const id = isDbProduct(product) ? product.id : product.id;
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
    isAr && !isDbProduct(p) ? p.nameAr : isDbProduct(p) ? p.name : p.nameEn;
  const productDesc = (p: DisplayProduct) =>
    isAr && !isDbProduct(p)
      ? p.descriptionAr
      : isDbProduct(p)
      ? p.description ?? ""
      : p.descriptionEn;
  const productCat = (p: DisplayProduct) => (isDbProduct(p) ? p.category : p.category);
  const productImage = (p: DisplayProduct) => (isDbProduct(p) ? p.image_url : null);

  return (
    <>
      {/* Hero */}
      <section className="relative pt-36 pb-20 bg-black overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,_rgba(138,21,56,0.25)_0%,_transparent_60%)]" />
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
              "Professional-grade car care products for every need — from washing and polishing to interior care and tire protection.",
              "منتجات عناية سيارات احترافية لكل احتياج — من الغسيل والتلميع إلى العناية الداخلية وحماية الكفرات."
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
                    ? "bg-[#8A1538] text-white"
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
              <Loader2 size={32} className="text-[#8A1538] animate-spin" />
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
                  variants={fadeUp}
                  custom={i}
                  className="group flex flex-col rounded-xl border border-white/8 bg-white/3 overflow-hidden hover:border-[#8A1538]/40 transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative h-48 bg-zinc-900 overflow-hidden">
                    {productImage(product) ? (
                      <img
                        src={productImage(product)!}
                        alt={productName(product)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-900 to-black">
                        <div className="text-center">
                          <div className="w-14 h-14 rounded-full bg-[#8A1538]/15 border border-[#8A1538]/30 flex items-center justify-center mx-auto mb-2">
                            <span className="text-[#8A1538] font-black text-lg">CZ</span>
                          </div>
                        </div>
                      </div>
                    )}
                    {productCat(product) && (
                      <span className="absolute top-3 left-3 px-2 py-0.5 bg-black/70 text-[#A29475] text-xs rounded">
                        {productCat(product)}
                      </span>
                    )}
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
                    {/* Features for static products */}
                    {!isDbProduct(product) && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {(isAr ? product.featuresAr : product.featuresEn).slice(0, 2).map((f, fi) => (
                          <span key={fi} className="px-2 py-0.5 bg-[#8A1538]/10 border border-[#8A1538]/20 text-[#A29475] text-xs rounded">
                            {f}
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
                        className="px-3 py-1.5 bg-[#8A1538] hover:bg-[#6b1029] text-white text-xs font-semibold rounded transition-colors"
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

      {/* Request modal */}
      <AnimatePresence>
        {modalProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && closeModal()}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-zinc-950 border border-white/12 rounded-2xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={closeModal}
                className="absolute top-5 right-5 text-white/40 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>

              {submitted ? (
                <div className="flex flex-col items-center py-6 text-center">
                  <CheckCircle size={40} className="text-[#8A1538] mb-4" />
                  <h3 className="text-white font-bold text-xl mb-2">
                    {t("Request Sent!", "تم إرسال الطلب!")}
                  </h3>
                  <p className="text-white/50 text-sm mb-6">
                    {t("We'll get back to you shortly regarding", "سنتواصل معك قريباً بخصوص")}{" "}
                    <span className="text-[#A29475]">{productName(modalProduct)}</span>.
                  </p>
                  <button
                    onClick={closeModal}
                    className="px-6 py-2.5 bg-[#8A1538] text-white text-sm font-semibold rounded hover:bg-[#6b1029] transition-colors"
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
                      <label className="block text-white/60 text-xs font-medium mb-1.5">
                        {t("Full Name *", "الاسم الكامل *")}
                      </label>
                      <input
                        type="text"
                        required
                        value={form.customer_name}
                        onChange={(e) => setForm((f) => ({ ...f, customer_name: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#8A1538] transition-colors"
                        placeholder={t("Your full name", "اسمك الكامل")}
                      />
                    </div>
                    <div>
                      <label className="block text-white/60 text-xs font-medium mb-1.5">
                        {t("Email *", "البريد الإلكتروني *")}
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#8A1538] transition-colors"
                        placeholder="you@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-white/60 text-xs font-medium mb-1.5">
                        {t("Phone", "رقم الهاتف")}
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#8A1538] transition-colors"
                        placeholder="+974 XXXX XXXX"
                      />
                    </div>
                    <div>
                      <label className="block text-white/60 text-xs font-medium mb-1.5">
                        {t("Product", "المنتج")}
                      </label>
                      <input
                        type="text"
                        value={form.product_name}
                        onChange={(e) => setForm((f) => ({ ...f, product_name: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#8A1538] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-white/60 text-xs font-medium mb-1.5">
                        {t("Quantity", "الكمية")}
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={form.quantity}
                        onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#8A1538] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-white/60 text-xs font-medium mb-1.5">
                        {t("Notes", "ملاحظات")}
                      </label>
                      <textarea
                        rows={3}
                        value={form.notes}
                        onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#8A1538] transition-colors resize-none"
                        placeholder={t("Any additional notes…", "أي ملاحظات إضافية…")}
                      />
                    </div>

                    {error && <p className="text-red-400 text-sm">{error}</p>}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3.5 bg-[#8A1538] hover:bg-[#6b1029] disabled:opacity-60 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
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
