import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X, CheckCircle, Loader2, Package } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Product } from "@/lib/types";
import { fadeUp, stagger } from "@/lib/motion";

interface RequestForm {
  name: string;
  email: string;
  phone: string;
  product_name: string;
  quantity: string;
  message: string;
}

const emptyForm: RequestForm = {
  name: "",
  email: "",
  phone: "",
  product_name: "",
  quantity: "1",
  message: "",
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<RequestForm>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) {
          setProducts(data);
          const cats = Array.from(
            new Set(data.map((p) => p.category).filter(Boolean))
          ) as string[];
          if (cats.length > 0) setCategories(["All", ...cats]);
        }
        setLoading(false);
      });
  }, []);

  const filtered =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  function openModal(product: Product) {
    setModalProduct(product);
    setForm({ ...emptyForm, product_name: product.name });
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
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      product_name: form.product_name,
      quantity: parseInt(form.quantity) || 1,
      message: form.message || null,
    });

    setSubmitting(false);
    if (err) {
      setError("Something went wrong. Please try again.");
    } else {
      setSubmitted(true);
    }
  }

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
            Shop
          </motion.p>
          <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl font-black text-white mb-5">
            Our Products
          </motion.h1>
          <motion.p variants={fadeUp} className="text-white/50 max-w-xl mx-auto text-lg">
            Professional-grade car care products sourced and used by our specialists — available for you to order.
          </motion.p>
        </motion.div>
      </section>

      {/* Filter bar */}
      {categories.length > 1 && (
        <div className="bg-zinc-950 border-y border-white/8 sticky top-16 lg:top-20 z-30">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex gap-1 overflow-x-auto py-3 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`shrink-0 px-4 py-1.5 rounded text-sm font-medium transition-colors ${
                    activeCategory === cat
                      ? "bg-[#8A1538] text-white"
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Products grid */}
      <section className="py-16 bg-black min-h-[40vh]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-24">
              <Loader2 size={32} className="text-[#8A1538] animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center py-24 text-center">
              <Package size={40} className="text-white/20 mb-4" />
              <p className="text-white/40">No products available yet.</p>
            </div>
          ) : (
            <motion.div
              initial="hidden"
              animate="show"
              variants={stagger}
              className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            >
              {filtered.map((product) => (
                <motion.div
                  key={product.id}
                  variants={fadeUp}
                  className="group flex flex-col rounded-xl border border-white/8 bg-white/3 overflow-hidden hover:border-[#8A1538]/40 transition-all duration-300"
                >
                  {/* Product image / placeholder */}
                  <div className="relative h-48 bg-zinc-900 overflow-hidden">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-900 to-black">
                        <ShoppingBag size={36} className="text-[#8A1538]/40" />
                      </div>
                    )}
                    {!product.in_stock && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-white/60 text-xs font-medium border border-white/20 px-3 py-1 rounded">
                          Out of Stock
                        </span>
                      </div>
                    )}
                    {product.category && (
                      <span className="absolute top-3 left-3 px-2 py-0.5 bg-black/70 text-[#A29475] text-xs rounded">
                        {product.category}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex flex-col flex-1 p-5">
                    <h3 className="text-white font-bold text-base mb-1 leading-snug">{product.name}</h3>
                    {product.description && (
                      <p className="text-white/40 text-xs leading-relaxed mb-4 flex-1 line-clamp-3">
                        {product.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-auto">
                      {product.price != null ? (
                        <span className="text-[#A29475] font-bold">
                          QAR {product.price.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-white/30 text-sm">Contact for price</span>
                      )}
                      <button
                        onClick={() => openModal(product)}
                        disabled={!product.in_stock}
                        className="px-3 py-1.5 bg-[#8A1538] hover:bg-[#6b1029] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold rounded transition-colors"
                      >
                        Request
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
                  <h3 className="text-white font-bold text-xl mb-2">Request Sent!</h3>
                  <p className="text-white/50 text-sm mb-6">
                    We'll get back to you shortly regarding your request for{" "}
                    <span className="text-[#A29475]">{modalProduct.name}</span>.
                  </p>
                  <button
                    onClick={closeModal}
                    className="px-6 py-2.5 bg-[#8A1538] text-white text-sm font-semibold rounded hover:bg-[#6b1029] transition-colors"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="text-white font-bold text-xl mb-1">Request Product</h3>
                  <p className="text-[#A29475] text-sm mb-6">{modalProduct.name}</p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {[
                      { id: "name", label: "Full Name *", type: "text", required: true },
                      { id: "email", label: "Email *", type: "email", required: true },
                      { id: "phone", label: "Phone", type: "tel", required: false },
                    ].map(({ id, label, type, required }) => (
                      <div key={id}>
                        <label className="block text-white/60 text-xs font-medium mb-1.5">{label}</label>
                        <input
                          type={type}
                          required={required}
                          value={form[id as keyof RequestForm]}
                          onChange={(e) => setForm((f) => ({ ...f, [id]: e.target.value }))}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#8A1538] transition-colors placeholder:text-white/20"
                        />
                      </div>
                    ))}

                    <div>
                      <label className="block text-white/60 text-xs font-medium mb-1.5">Product</label>
                      <input
                        type="text"
                        value={form.product_name}
                        onChange={(e) => setForm((f) => ({ ...f, product_name: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#8A1538] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-white/60 text-xs font-medium mb-1.5">Quantity</label>
                      <input
                        type="number"
                        min="1"
                        value={form.quantity}
                        onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#8A1538] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-white/60 text-xs font-medium mb-1.5">Notes</label>
                      <textarea
                        rows={3}
                        value={form.message}
                        onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#8A1538] transition-colors resize-none placeholder:text-white/20"
                        placeholder="Any additional notes…"
                      />
                    </div>

                    {error && <p className="text-red-400 text-sm">{error}</p>}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3.5 bg-[#8A1538] hover:bg-[#6b1029] disabled:opacity-60 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <><Loader2 size={16} className="animate-spin" /> Sending…</>
                      ) : (
                        "Submit Request"
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
