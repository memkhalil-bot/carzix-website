import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ChevronRight, FlaskConical, Info, Loader2 } from "lucide-react";
import { fadeUp, stagger } from "@/lib/motion";
import { useLang } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";
import type { Product } from "@/lib/types";

const DEFAULT_SIZES_L = [1, 5, 20];

function parseRatioDenominator(ratio: string | null): number | null {
  if (!ratio) return null;
  const match = ratio.match(/1\s*:\s*(\d+)/);
  return match ? Number(match[1]) : null;
}

function isReadyToUse(ratio: string | null): boolean {
  return !!ratio && /ready/i.test(ratio);
}

function hasUsableRatio(ratio: string | null): boolean {
  return !!ratio && ratio.trim() !== "" && (isReadyToUse(ratio) || parseRatioDenominator(ratio) !== null);
}

function parseSizeToLiters(size: string): number | null {
  const s = size.trim();
  const literMatch = s.match(/^([\d.]+)\s*l$/i);
  if (literMatch) return parseFloat(literMatch[1]);
  const mlMatch = s.match(/^([\d.]+)\s*ml$/i);
  if (mlMatch) return parseFloat(mlMatch[1]) / 1000;
  return null;
}

export default function DilutionCalculator() {
  const { t, isAr } = useLang();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string>("");
  const [packageLiters, setPackageLiters] = useState<number>(20);
  const [customLiters, setCustomLiters] = useState<string>("");

  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .eq("status", "active")
      .then(
        ({ data }) => {
          if (data) setProducts(data);
          setLoading(false);
        },
        () => setLoading(false)
      );
  }, []);

  const usableProducts = useMemo(
    () => products.filter((p) => hasUsableRatio(p.dilution_ratio)),
    [products]
  );

  useEffect(() => {
    if (selectedId || usableProducts.length === 0) return;
    const firstDiluted = usableProducts.find((p) => !isReadyToUse(p.dilution_ratio));
    setSelectedId((firstDiluted ?? usableProducts[0]).id);
  }, [usableProducts, selectedId]);

  const selectedProduct = usableProducts.find((p) => p.id === selectedId) ?? null;
  const ready = isReadyToUse(selectedProduct?.dilution_ratio ?? null);
  const ratioDenominator = parseRatioDenominator(selectedProduct?.dilution_ratio ?? null);

  const sizeOptions = useMemo(() => {
    const parsed = (selectedProduct?.sizes ?? [])
      .map(parseSizeToLiters)
      .filter((n): n is number => n !== null && n > 0);
    return Array.from(new Set([...DEFAULT_SIZES_L, ...parsed])).sort((a, b) => a - b);
  }, [selectedProduct]);

  const effectiveLiters = customLiters && Number(customLiters) > 0 ? Number(customLiters) : packageLiters;

  const readyToUseLiters = ratioDenominator ? effectiveLiters * ratioDenominator : null;
  const carsMin = readyToUseLiters ? Math.round(readyToUseLiters / 20) : null;
  const carsMax = readyToUseLiters ? Math.round(readyToUseLiters / 16) : null;

  const inputCls =
    "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3.5 text-white text-base font-semibold focus:outline-none focus:border-[#0D4261] transition-colors";

  return (
    <section className="py-20 bg-[#04090F] border-y border-white/8 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#0D4261]/8 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        variants={stagger}
        className="relative max-w-4xl mx-auto px-6 lg:px-8"
      >
        {/* Header */}
        <motion.div variants={fadeUp} className="text-center mb-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#129B82]/10 border border-[#129B82]/22 mb-4">
            <FlaskConical size={13} className="text-[#129B82]" />
            <span className="text-[#129B82] text-xs font-semibold tracking-widest uppercase">
              {t("B2B Savings Tool", "أداة توفير B2B")}
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-3">
            {t("Dilution Calculator", "حاسبة التخفيف")}
          </h2>
        </motion.div>

        {/* Intro line */}
        <motion.p variants={fadeUp} className="text-white/40 text-base text-center max-w-lg mx-auto mb-10">
          {t(
            "Select a product and package size to calculate the exact ready-to-use yield for your business.",
            "اختر المنتج وحجم العبوة لحساب كمية المحلول الجاهز للاستخدام بدقة لنشاطك."
          )}
        </motion.p>

        {/* Calculator card */}
        <motion.div variants={fadeUp} className="glass-dark rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center gap-3 p-16 text-white/40">
              <Loader2 size={22} className="animate-spin" />
              <span className="text-sm">{t("Loading products…", "جارٍ تحميل المنتجات…")}</span>
            </div>
          ) : usableProducts.length === 0 ? (
            <div className="flex items-center justify-center p-16 text-white/40 text-sm text-center">
              {t("No products with dilution data are available right now.", "لا توجد منتجات تحتوي على بيانات تخفيف متاحة حالياً.")}
            </div>
          ) : (
            <>
              {/* Inputs */}
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/40 text-xs font-semibold mb-2 tracking-wider uppercase">
                    {t("Product", "المنتج")}
                  </label>
                  <select
                    value={selectedId}
                    onChange={(e) => setSelectedId(e.target.value)}
                    className={inputCls}
                  >
                    {usableProducts.map((p) => (
                      <option key={p.id} value={p.id} className="bg-zinc-900">
                        {isAr ? p.name_ar || p.name : p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-white/40 text-xs font-semibold mb-2 tracking-wider uppercase">
                    {t("Package Size (Liters)", "حجم العبوة (لتر)")}
                  </label>
                  <select
                    value={customLiters ? "" : packageLiters}
                    onChange={(e) => {
                      setCustomLiters("");
                      setPackageLiters(Number(e.target.value));
                    }}
                    disabled={ready}
                    className={inputCls + (ready ? " opacity-40 cursor-not-allowed" : "")}
                  >
                    {sizeOptions.map((s) => (
                      <option key={s} value={s} className="bg-zinc-900">
                        {s} L
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Result */}
              <div className="border-t border-white/8 p-8">
                {ready ? (
                  <div className="rounded-xl bg-[#0D4261]/15 border border-[#0D4261]/30 p-6 flex items-start gap-3 text-center sm:text-start">
                    <Info size={18} className="text-[#A29475] shrink-0 mt-0.5" />
                    <p className="text-white/80 text-sm leading-relaxed">
                      {t(
                        "This product is ready to use with German-grade efficiency and does not require dilution.",
                        "هذا المنتج جاهز للاستخدام مباشرة بأعلى كفاءة ألمانية، ولا يتطلب أي تخفيف."
                      )}
                    </p>
                  </div>
                ) : readyToUseLiters !== null ? (
                  <div className="text-center">
                    <p className="text-white/40 text-sm mb-2">
                      {t("Produces up to", "تنتج لك حتى")}
                    </p>
                    <p className="text-[#129B82] font-black text-5xl sm:text-6xl tabular-nums mb-2 drop-shadow-[0_0_18px_rgba(18,155,130,0.35)]">
                      {readyToUseLiters.toLocaleString()}L
                    </p>
                    <p className="text-white/50 text-sm mb-6">
                      {t("of ready-to-use solution", "من المحلول الجاهز للاستخدام")}
                    </p>
                    {carsMin !== null && carsMax !== null && (
                      <p className="text-white/55 text-sm">
                        {isAr ? (
                          <>
                            يكفي لغسيل ما يقارب{" "}
                            <span className="text-white font-bold">{carsMin.toLocaleString()}</span>
                            {" "}إلى{" "}
                            <span className="text-white font-bold">{carsMax.toLocaleString()}</span>
                            {" "}سيارة
                          </>
                        ) : (
                          <>
                            Enough for approximately{" "}
                            <span className="text-white font-bold">{carsMin.toLocaleString()}</span>
                            {" "}to{" "}
                            <span className="text-white font-bold">{carsMax.toLocaleString()}</span>
                            {" "}cars
                          </>
                        )}
                      </p>
                    )}
                  </div>
                ) : null}
              </div>

              {/* Footer */}
              <div className="p-8 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-5">
                <p className="text-white/35 text-sm leading-relaxed max-w-md">
                  {t(
                    "Drastically reduce storage, shipping, and consumption costs for car washes, detailing centers, and dealerships.",
                    "تقليل كبير في تكاليف التخزين والشحن والاستهلاك للمغاسل ومراكز التلميع والوكالات."
                  )}
                </p>
                <Link
                  href="/contact"
                  className="btn-cta shrink-0 inline-flex items-center gap-2 px-7 py-3.5 text-[#111827] font-bold rounded"
                >
                  {t("Get Commercial Quote", "احصل على عرض سعر تجاري")}
                  <ChevronRight size={16} className={isAr ? "rotate-180" : ""} />
                </Link>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}
