import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { trackEvent } from "@/lib/analytics";
import { trackEvent as trackInternalEvent } from "@/lib/internalAnalytics";
import { useLang } from "@/contexts/LanguageContext";
import { type DisplayProduct, isDbProduct, productName } from "@/lib/productHelpers";
import {
  validateName,
  validateEmail,
  validatePhone,
  validateQuantity,
  validateNotes,
  validateCompanyName,
  validateCity,
  validateBusinessType,
} from "@/lib/validation";

const BUSINESS_TYPES = [
  { value: "Car Wash", labelEn: "Car Wash", labelAr: "مغسلة سيارات" },
  { value: "Detailing Center", labelEn: "Detailing Center", labelAr: "مركز تلميع" },
  { value: "Distributor", labelEn: "Distributor", labelAr: "موزع" },
  { value: "Retail Shop", labelEn: "Retail Shop", labelAr: "محل بيع بالتجزئة" },
  { value: "Fleet Company", labelEn: "Fleet Company", labelAr: "شركة أسطول" },
  { value: "Other", labelEn: "Other", labelAr: "أخرى" },
];

interface RequestForm {
  customer_name: string;
  email: string;
  phone: string;
  product_name: string;
  product_id: string;
  quantity: string;
  notes: string;
  company_name: string;
  city: string;
  business_type: string;
}

interface FormErrors {
  customer_name?: string;
  email?: string;
  phone?: string;
  quantity?: string;
  notes?: string;
  company_name?: string;
  city?: string;
  business_type?: string;
}

const emptyForm: RequestForm = {
  customer_name: "",
  email: "",
  phone: "",
  product_name: "",
  product_id: "",
  quantity: "1",
  notes: "",
  company_name: "",
  city: "",
  business_type: "",
};

interface RequestQuoteModalProps {
  product: DisplayProduct | null;
  onClose: () => void;
}

export default function RequestQuoteModal({ product, onClose }: RequestQuoteModalProps) {
  const { t, isAr } = useLang();
  const [form, setForm] = useState<RequestForm>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (!product) return;
    const nameEn = isDbProduct(product) ? product.name : product.nameEn;
    setForm({ ...emptyForm, product_name: nameEn, product_id: product.id });
    setSubmitted(false);
    setError("");
    setErrors({});
  }, [product]);

  const inputCls =
    "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#0D4261] transition-colors";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!product) return;

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
    const companyErr = validateCompanyName(form.company_name);
    if (companyErr) errs.company_name = isAr ? companyErr.ar : companyErr.en;
    const cityErr = validateCity(form.city);
    if (cityErr) errs.city = isAr ? cityErr.ar : cityErr.en;
    const businessTypeErr = validateBusinessType(form.business_type);
    if (businessTypeErr) errs.business_type = isAr ? businessTypeErr.ar : businessTypeErr.en;

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setSubmitting(true);
    setError("");

    const basePayload = {
      customer_name: form.customer_name,
      email: form.email,
      phone: form.phone || null,
      product_id: isDbProduct(product) ? product.id : null,
      product_name: form.product_name,
      quantity: parseInt(form.quantity) || 1,
      notes: form.notes || null,
    };
    const extendedPayload = {
      ...basePayload,
      company_name: form.company_name,
      city: form.city,
      business_type: form.business_type,
    };

    console.log("[QuoteForm] Submitting quote request", extendedPayload);

    let { error: err } = await supabase.from("product_requests").insert(extendedPayload).select();

    if (err && (err.code === "PGRST204" || /column .* does not exist/i.test(err.message))) {
      console.warn("[QuoteForm] Extended fields not yet supported by schema, retrying with base payload", err);
      ({ error: err } = await supabase.from("product_requests").insert(basePayload).select());
    }

    console.log("[QuoteForm] Insert result", { error: err });

    setSubmitting(false);
    if (err) {
      console.error("[QuoteForm] Insert failed", err);
      setError(t("Something went wrong. Please try again.", "حدث خطأ ما. يرجى المحاولة مرة أخرى."));
    } else {
      setSubmitted(true);
      trackEvent("submit_quote_request", {
        product_name: form.product_name,
        language: isAr ? "ar" : "en",
      });
      trackInternalEvent("quote_submit", {
        product_id: isDbProduct(product) ? product.id : null,
        product_name: form.product_name || null,
        metadata: { business_type: form.business_type || null, city: form.city || null },
      });
    }
  }

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md glass-dark rounded-2xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={onClose}
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
                  <span className="text-[#A29475]">{productName(product, isAr)}</span>.
                </p>
                <button
                  onClick={onClose}
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
                <p className="text-[#A29475] text-sm mb-6">{productName(product, isAr)}</p>

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
                      {t("Company Name *", "اسم الشركة *")}
                    </label>
                    <input
                      type="text"
                      required
                      value={form.company_name}
                      onChange={(e) => setForm((f) => ({ ...f, company_name: e.target.value }))}
                      className={inputCls}
                      placeholder={t("Your company name", "اسم شركتك")}
                    />
                    {errors.company_name && <p className="text-red-400 text-xs mt-1">{errors.company_name}</p>}
                  </div>
                  <div>
                    <label className="block text-white/55 text-xs font-medium mb-1.5">
                      {t("City *", "المدينة *")}
                    </label>
                    <input
                      type="text"
                      required
                      value={form.city}
                      onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                      className={inputCls}
                      placeholder={t("e.g. Doha", "مثال: الدوحة")}
                    />
                    {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-white/55 text-xs font-medium mb-1.5">
                      {t("Business Type *", "نوع النشاط التجاري *")}
                    </label>
                    <select
                      required
                      value={form.business_type}
                      onChange={(e) => setForm((f) => ({ ...f, business_type: e.target.value }))}
                      className={inputCls}
                    >
                      <option value="" disabled className="bg-zinc-900">
                        {t("Select business type", "اختر نوع النشاط التجاري")}
                      </option>
                      {BUSINESS_TYPES.map(({ value, labelEn, labelAr }) => (
                        <option key={value} value={value} className="bg-zinc-900">
                          {isAr ? labelAr : labelEn}
                        </option>
                      ))}
                    </select>
                    {errors.business_type && <p className="text-red-400 text-xs mt-1">{errors.business_type}</p>}
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
  );
}
