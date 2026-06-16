import { useEffect, useState, useCallback, useRef } from "react";
import { useLocation } from "wouter";
import {
  LayoutDashboard, Package, Users, MessageSquare, ClipboardList,
  LogOut, Trash2, Plus, RefreshCw, Loader2, X, Check, Menu,
  ChevronDown, Pencil, Upload,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Client, ContactMessage, ProductRequest } from "@/lib/types";

// ── Extended Product type with new optional fields ───────────────────
interface Product {
  id: string;
  name: string;
  name_ar?: string | null;
  category?: string | null;
  description?: string | null;
  description_ar?: string | null;
  price?: number | null;
  image_url?: string | null;
  status?: string | null;
  features?: string[] | null;
  features_ar?: string[] | null;
  sizes?: string[] | null;
  suitable_for?: string | null;
  dilution_ratio?: string | null;
  created_at: string;
}

// ── Color tokens (light admin) ────────────────────────────────────────
const C = {
  bg:      "#F6F7F9",
  sidebar: "#111827",
  card:    "#FFFFFF",
  border:  "#E5E7EB",
  action:  "#2563EB",
  success: "#16A34A",
  warning: "#F59E0B",
  danger:  "#DC2626",
  text:    "#111827",
  muted:   "#6B7280",
} as const;

// ── Bilingual labels ──────────────────────────────────────────────────
type Lang = "ar" | "en";

const T = {
  overview:      { ar: "الرئيسية",            en: "Overview" },
  products:      { ar: "المنتجات",            en: "Products" },
  clients:       { ar: "العملاء",             en: "Clients" },
  messages:      { ar: "الرسائل",             en: "Messages" },
  requests:      { ar: "طلبات الأسعار",       en: "Quote Requests" },
  addProduct:    { ar: "إضافة منتج",          en: "Add Product" },
  editProduct:   { ar: "تعديل منتج",          en: "Edit Product" },
  delete:        { ar: "حذف",                  en: "Delete" },
  status:        { ar: "الحالة",               en: "Status" },
  category:      { ar: "الفئة",               en: "Category" },
  price:         { ar: "السعر (ريال)",         en: "Price (QAR)" },
  description:   { ar: "الوصف",               en: "Description" },
  imageUrl:      { ar: "صورة المنتج",           en: "Product Image" },
  uploadImg:     { ar: "رفع صورة",             en: "Upload Image" },
  replaceImg:    { ar: "استبدال",              en: "Replace" },
  removeImg:     { ar: "إزالة الصورة",         en: "Remove Image" },
  uploading:     { ar: "جارٍ الرفع…",          en: "Uploading…" },
  uploadFailed:  { ar: "فشل الرفع: ",          en: "Upload failed: " },
  uploadHint:    { ar: "JPG، PNG، WebP — حد أقصى 5MB", en: "JPG, PNG, WebP — max 5 MB" },
  save:          { ar: "حفظ",                  en: "Save" },
  cancel:        { ar: "إلغاء",               en: "Cancel" },
  nameEn:        { ar: "الاسم (إنجليزي)",      en: "Name (EN)" },
  nameAr:        { ar: "الاسم (عربي)",         en: "Name (AR)" },
  descEn:        { ar: "الوصف (إنجليزي)",      en: "Description (EN)" },
  descAr:        { ar: "الوصف (عربي)",         en: "Description (AR)" },
  featuresEn:    { ar: "المميزات (إنجليزي)",   en: "Features (EN)" },
  featuresAr:    { ar: "المميزات (عربي)",      en: "Features (AR)" },
  sizes:         { ar: "الأحجام المتاحة",      en: "Available Sizes" },
  suitableFor:   { ar: "مناسب لـ",             en: "Suitable For" },
  dilutionRatio: { ar: "نسبة التخفيف",         en: "Dilution Ratio" },
  active:        { ar: "نشط",                  en: "Active" },
  inactive:      { ar: "غير نشط",             en: "Inactive" },
  activate:      { ar: "تفعيل",               en: "Activate" },
  deactivate:    { ar: "إلغاء التفعيل",       en: "Deactivate" },
  edit:          { ar: "تعديل",               en: "Edit" },
  logout:        { ar: "تسجيل الخروج",        en: "Logout" },
  adminPanel:    { ar: "لوحة الإدارة",         en: "Admin Panel" },
  noProducts:    { ar: "لا توجد منتجات.",      en: "No products found." },
  noClients:     { ar: "لا يوجد عملاء.",       en: "No clients yet." },
  noMessages:    { ar: "لا توجد رسائل.",       en: "No messages yet." },
  noRequests:    { ar: "لا توجد طلبات.",       en: "No quote requests yet." },
  commaHintEn:   { ar: "مفصولة بفواصل (EN)", en: "Comma-separated (EN)" },
  commaHintAr:   { ar: "مفصولة بفواصل (AR)", en: "Comma-separated (AR)" },
  commaSizes:    { ar: "مثال: 500ml, 1L",     en: "e.g. 500ml, 1L" },
  thumbnail:     { ar: "صورة مصغرة",          en: "Thumbnail" },
  name:          { ar: "الاسم",               en: "Name" },
  logo:          { ar: "الشعار",              en: "Logo" },
  order:         { ar: "الترتيب",             en: "Order" },
  actions:       { ar: "الإجراءات",           en: "Actions" },
  addClient:     { ar: "إضافة عميل",          en: "Add Client" },
  newClient:     { ar: "عميل جديد",           en: "New Client" },
  clientName:    { ar: "الاسم / العلامة التجارية", en: "Client / Brand name" },
  logoUrl:       { ar: "رابط الشعار",         en: "Logo URL" },
  websiteUrl:    { ar: "رابط الموقع",          en: "Website URL" },
  displayOrder:  { ar: "ترتيب العرض",          en: "Display Order" },
  saveClient:    { ar: "حفظ العميل",           en: "Save Client" },
  saving:        { ar: "جاري الحفظ…",         en: "Saving…" },
  hide:          { ar: "إخفاء",               en: "Hide" },
  show:          { ar: "إظهار",               en: "Show" },
  hidden:        { ar: "مخفي",               en: "Hidden" },
  refresh:       { ar: "تحديث",               en: "Refresh" },
  contactMsgs:   { ar: "رسائل الاتصال",        en: "Contact Messages" },
  quoteReqs:     { ar: "طلبات الأسعار",        en: "Quote Requests" },
  markRead:      { ar: "تحديد كمقروء",        en: "Mark as Read" },
  replyEmail:    { ar: "الرد بالبريد الإلكتروني", en: "Reply by Email" },
  markFulfilled:  { ar: "تحديد كمنجز",           en: "Mark Fulfilled" },
  cancelReq:      { ar: "إلغاء",                en: "Cancel" },
  resetPending:   { ar: "إعادة للانتظار",        en: "Reset to Pending" },
  markContacted:  { ar: "تحديد كـ: تم التواصل", en: "Mark Contacted" },
  markQuoted:     { ar: "تحديد كـ: تم تسعيره",  en: "Mark Quoted" },
  markClosed:     { ar: "تحديد كـ: مغلق",       en: "Mark Closed" },
  reopenReq:      { ar: "إعادة فتح",            en: "Reopen" },
  contacted:      { ar: "تم التواصل",           en: "Contacted" },
  quoted:         { ar: "تم التسعير",           en: "Quoted" },
  closed:         { ar: "مغلق",                en: "Closed" },
  newBadge:      { ar: "جديد",               en: "New" },
  inCatalogue:   { ar: "في الكتالوج",         en: "In catalogue" },
  logoSlider:    { ar: "شريط الشعار",          en: "Logo slider" },
  contactForm:   { ar: "نموذج الاتصال",        en: "Contact form" },
  productReqs:   { ar: "طلبات المنتجات",       en: "Product requests" },
  recentMsgs:    { ar: "أحدث الرسائل",         en: "Recent Messages" },
  recentReqs:    { ar: "أحدث طلبات الأسعار",  en: "Recent Quote Requests" },
  noMsgsYet:     { ar: "لا توجد رسائل بعد.",  en: "No messages yet." },
  noReqsYet:     { ar: "لا توجد طلبات بعد.",  en: "No requests yet." },
  noProduct:     { ar: "لا يوجد منتج",        en: "No product" },
  qty:           { ar: "الكمية",              en: "Qty" },
  email:         { ar: "البريد الإلكتروني",   en: "Email" },
  phone:         { ar: "الهاتف",              en: "Phone" },
  notes:         { ar: "ملاحظات",             en: "Notes" },
  clientsSlider: { ar: "العملاء (شريط الشعار)", en: "Clients (Logo Slider)" },
  required:      { ar: "(مطلوب)",             en: "(required)" },
  imagePreview:  { ar: "معاينة الصورة",       en: "Image Preview" },
} as const;

function t(key: keyof typeof T, lang: Lang): string {
  return T[key][lang];
}

// ── Category options ──────────────────────────────────────────────────
const CATEGORIES = [
  "Shampoos",
  "Polishing",
  "Glass Care",
  "Interior Care",
  "Multi-Purpose",
  "Tire Care",
];

// ── parseArr helper ───────────────────────────────────────────────────
function parseArr(s: string): string[] {
  return s.split(",").map((x) => x.trim()).filter(Boolean);
}

// ── Helper components ──────────────────────────────────────────────────
function Badge({
  color,
  children,
}: {
  color: "blue" | "green" | "red" | "gray" | "yellow";
  children: React.ReactNode;
}) {
  const colors = {
    blue:   { bg: "#2563EB18", color: "#2563EB", border: "#2563EB30" },
    green:  { bg: "#16A34A18", color: "#16A34A", border: "#16A34A30" },
    red:    { bg: "#DC262618", color: "#DC2626", border: "#DC262630" },
    yellow: { bg: "#F59E0B18", color: "#F59E0B", border: "#F59E0B30" },
    gray:   { bg: "#6B728018", color: "#6B7280", border: "#6B728030" },
  };
  const s = colors[color];
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold"
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
    >
      {children}
    </span>
  );
}

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: number | string;
  sub?: string;
  accent?: string;
}) {
  return (
    <div
      className="rounded-xl p-5"
      style={{ background: C.card, border: `1px solid ${C.border}` }}
    >
      <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: C.muted }}>
        {label}
      </p>
      <p className="text-3xl font-black" style={{ color: accent ?? C.text }}>
        {value}
      </p>
      {sub && (
        <p className="text-xs mt-1" style={{ color: C.muted }}>
          {sub}
        </p>
      )}
    </div>
  );
}

function Th({ children, lang }: { children: React.ReactNode; lang: Lang }) {
  return (
    <th
      className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider ${lang === "ar" ? "text-right" : "text-left"}`}
      style={{ color: C.muted, background: "#F9FAFB", borderBottom: `1px solid ${C.border}` }}
    >
      {children}
    </th>
  );
}

function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <td
      className={`px-4 py-3 text-sm ${className}`}
      style={{ color: C.text, borderBottom: `1px solid ${C.border}` }}
    >
      {children}
    </td>
  );
}

function TableWrap({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: `1px solid ${C.border}` }}
    >
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">{children}</table>
      </div>
    </div>
  );
}

function SectionHeader({
  title,
  count,
  onRefresh,
  loading,
  children,
}: {
  title: string;
  count?: number;
  onRefresh: () => void;
  loading: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-bold" style={{ color: C.text }}>
          {title}
        </h2>
        {count !== undefined && (
          <span
            className="px-2 py-0.5 rounded text-xs font-semibold"
            style={{ background: C.bg, color: C.muted, border: `1px solid ${C.border}` }}
          >
            {count}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        {children}
        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{ background: C.card, color: C.muted, border: `1px solid ${C.border}` }}
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
        </button>
      </div>
    </div>
  );
}

function statusBadge(status: string | null | undefined, lang: Lang) {
  const s = (status ?? "").toLowerCase();
  if (s === "active")    return <Badge color="green">{t("active", lang)}</Badge>;
  if (s === "inactive")  return <Badge color="red">{t("inactive", lang)}</Badge>;
  if (s === "fulfilled") return <Badge color="green">Fulfilled</Badge>;
  if (s === "cancelled") return <Badge color="red">Cancelled</Badge>;
  if (s === "contacted") return <Badge color="blue">{t("contacted", lang)}</Badge>;
  if (s === "quoted")    return <Badge color="yellow">{t("quoted", lang)}</Badge>;
  if (s === "closed")    return <Badge color="green">{t("closed", lang)}</Badge>;
  return <Badge color="yellow">{t("newBadge", lang)}</Badge>;
}

// ── Input / Label styles ──────────────────────────────────────────────
function inputStyle(): React.CSSProperties {
  return {
    background: C.card,
    border: `1px solid ${C.border}`,
    borderRadius: 8,
    padding: "8px 12px",
    color: C.text,
    fontSize: 13,
    width: "100%",
    outline: "none",
  };
}

function LabelEl({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-medium mb-1" style={{ color: C.muted }}>
      {children}
    </label>
  );
}

// ── Product Form Modal ────────────────────────────────────────────────
interface ProductFormState {
  name: string;
  name_ar: string;
  category: string;
  description: string;
  description_ar: string;
  price: string;
  image_url: string;
  status: string;
  features: string;
  features_ar: string;
  sizes: string;
  suitable_for: string;
  dilution_ratio: string;
}

const EMPTY_FORM: ProductFormState = {
  name: "",
  name_ar: "",
  category: CATEGORIES[0],
  description: "",
  description_ar: "",
  price: "",
  image_url: "",
  status: "active",
  features: "",
  features_ar: "",
  sizes: "",
  suitable_for: "",
  dilution_ratio: "",
};

function productToForm(p: Product): ProductFormState {
  return {
    name: p.name ?? "",
    name_ar: p.name_ar ?? "",
    category: p.category ?? CATEGORIES[0],
    description: p.description ?? "",
    description_ar: p.description_ar ?? "",
    price: p.price != null ? String(p.price) : "",
    image_url: p.image_url ?? "",
    status: p.status ?? "active",
    features: p.features?.join(", ") ?? "",
    features_ar: p.features_ar?.join(", ") ?? "",
    sizes: p.sizes?.join(", ") ?? "",
    suitable_for: p.suitable_for ?? "",
    dilution_ratio: p.dilution_ratio ?? "",
  };
}

interface ProductModalProps {
  lang: Lang;
  editProduct: Product | null;
  onClose: () => void;
  onSaved: () => void;
}

function ProductModal({ lang, editProduct, onClose, onSaved }: ProductModalProps) {
  const [form, setForm] = useState<ProductFormState>(
    editProduct ? productToForm(editProduct) : EMPTY_FORM
  );
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEdit = editProduct !== null;

  function setField<K extends keyof ProductFormState>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleImageUpload(file: File) {
    if (!file.type.startsWith("image/")) return;
    setUploading(true);
    setUploadProgress(10);
    setError(null);

    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: uploadErr } = await supabase.storage
      .from("products")
      .upload(path, file, { upsert: false, cacheControl: "3600" });

    if (uploadErr) {
      // Log full error details to browser console for debugging
      console.error("[Storage] Upload error:", {
        message: uploadErr.message,
        name: (uploadErr as { name?: string }).name,
        cause: (uploadErr as { cause?: unknown }).cause,
        stack: (uploadErr as { stack?: string }).stack,
      });
      setError(t("uploadFailed", lang) + uploadErr.message);
      setUploading(false);
      setUploadProgress(0);
      return;
    }

    setUploadProgress(90);
    const { data } = supabase.storage.from("products").getPublicUrl(path);
    setField("image_url", data.publicUrl);
    setUploadProgress(100);
    setUploading(false);
  }

  async function removeImage() {
    const url = form.image_url.trim();
    if (url) {
      const match = url.match(/\/storage\/v1\/object\/public\/products\/(.+)/);
      if (match?.[1]) {
        await supabase.storage.from("products").remove([match[1]]);
      }
    }
    setField("image_url", "");
    setUploadProgress(0);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    setError(null);

    const base = {
      name: form.name.trim(),
      category: form.category,
      description: form.description.trim() || null,
      description_ar: form.description_ar.trim() || null,
      name_ar: form.name_ar.trim() || null,
      price: form.price ? parseFloat(form.price) : null,
      image_url: form.image_url.trim() || null,
      status: form.status,
      features: parseArr(form.features).length ? parseArr(form.features) : null,
      features_ar: parseArr(form.features_ar).length ? parseArr(form.features_ar) : null,
      sizes: parseArr(form.sizes).length ? parseArr(form.sizes) : null,
      suitable_for: form.suitable_for.trim() || null,
      dilution_ratio: form.dilution_ratio.trim() || null,
    };

    let err: { message?: string } | null = null;
    if (isEdit && editProduct) {
      const res = await supabase.from("products").update({ ...base, updated_at: new Date().toISOString() }).eq("id", editProduct.id);
      err = res.error;
    } else {
      const res = await supabase.from("products").insert(base);
      err = res.error;
    }

    setSaving(false);
    if (err) {
      setError(err.message ?? "Error saving product.");
      return;
    }
    onSaved();
  }

  const inp = inputStyle();

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto"
      style={{ background: "rgba(0,0,0,0.45)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-2xl my-8 mx-4 rounded-2xl shadow-xl"
        style={{ background: C.card, border: `1px solid ${C.border}` }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: `1px solid ${C.border}` }}
        >
          <h2 className="text-base font-bold" style={{ color: C.text }}>
            {isEdit ? t("editProduct", lang) : t("addProduct", lang)}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg"
            style={{ color: C.muted, background: C.bg }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Row: name EN + name AR */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <LabelEl>{t("nameEn", lang)} <span style={{ color: C.danger }}>*</span></LabelEl>
              <input
                required
                style={inp}
                placeholder="Product name in English"
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
              />
            </div>
            <div>
              <LabelEl>{t("nameAr", lang)}</LabelEl>
              <input
                style={inp}
                placeholder="اسم المنتج بالعربية"
                value={form.name_ar}
                onChange={(e) => setField("name_ar", e.target.value)}
                dir="rtl"
              />
            </div>
          </div>

          {/* Row: category + price */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <LabelEl>{t("category", lang)}</LabelEl>
              <select
                style={inp}
                value={form.category}
                onChange={(e) => setField("category", e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <LabelEl>{t("price", lang)}</LabelEl>
              <input
                type="number"
                min="0"
                step="0.01"
                style={inp}
                placeholder="0.00"
                value={form.price}
                onChange={(e) => setField("price", e.target.value)}
              />
            </div>
          </div>

          {/* Image upload */}
          <div>
            <LabelEl>{t("imageUrl", lang)}</LabelEl>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleImageUpload(f);
                e.target.value = "";
              }}
            />
            {form.image_url.trim() ? (
              <div className="relative rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
                <img
                  src={form.image_url.trim()}
                  alt="preview"
                  className="w-full h-40 object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = ""; }}
                />
                {/* Overlay buttons */}
                <div className="absolute top-2 end-2 flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold"
                    style={{ background: "rgba(0,0,0,0.72)", color: "#fff" }}
                  >
                    <Upload size={11} /> {t("replaceImg", lang)}
                  </button>
                  <button
                    type="button"
                    onClick={removeImage}
                    disabled={uploading}
                    className="p-1.5 rounded-lg"
                    style={{ background: "rgba(220,38,38,0.82)", color: "#fff" }}
                    title={t("removeImg", lang)}
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full flex flex-col items-center justify-center gap-2 rounded-xl py-10 transition-colors"
                style={{
                  background: C.bg,
                  border: `2px dashed ${uploading ? C.action : C.border}`,
                  color: uploading ? C.action : C.muted,
                  cursor: uploading ? "wait" : "pointer",
                }}
              >
                {uploading ? (
                  <>
                    <Loader2 size={22} className="animate-spin" />
                    <span className="text-xs font-medium">{t("uploading", lang)}</span>
                  </>
                ) : (
                  <>
                    <Upload size={22} />
                    <span className="text-xs font-semibold">{t("uploadImg", lang)}</span>
                    <span className="text-xs opacity-50">{t("uploadHint", lang)}</span>
                  </>
                )}
              </button>
            )}
            {/* Progress bar */}
            {uploading && (
              <div
                className="mt-2 h-1 rounded-full overflow-hidden"
                style={{ background: C.border }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ background: C.action, width: `${uploadProgress}%` }}
                />
              </div>
            )}
          </div>

          {/* Status */}
          <div>
            <LabelEl>{t("status", lang)}</LabelEl>
            <div className="flex items-center gap-4">
              {(["active", "inactive"] as const).map((val) => (
                <label key={val} className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: C.text }}>
                  <input
                    type="radio"
                    name="product-status"
                    value={val}
                    checked={form.status === val}
                    onChange={() => setField("status", val)}
                    style={{ accentColor: C.action }}
                  />
                  {val === "active" ? t("active", lang) : t("inactive", lang)}
                </label>
              ))}
            </div>
          </div>

          {/* Desc EN */}
          <div>
            <LabelEl>{t("descEn", lang)}</LabelEl>
            <textarea
              rows={3}
              style={{ ...inp, resize: "vertical" }}
              placeholder="Product description (English)"
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
            />
          </div>

          {/* Desc AR */}
          <div>
            <LabelEl>{t("descAr", lang)}</LabelEl>
            <textarea
              rows={3}
              style={{ ...inp, resize: "vertical" }}
              placeholder="وصف المنتج بالعربية"
              value={form.description_ar}
              onChange={(e) => setField("description_ar", e.target.value)}
              dir="rtl"
            />
          </div>

          {/* Features EN */}
          <div>
            <LabelEl>{t("featuresEn", lang)} <span className="text-xs font-normal" style={{ color: C.muted }}>— {t("commaHintEn", lang)}</span></LabelEl>
            <input
              style={inp}
              placeholder="Fast drying, Streak-free, UV protection"
              value={form.features}
              onChange={(e) => setField("features", e.target.value)}
            />
          </div>

          {/* Features AR */}
          <div>
            <LabelEl>{t("featuresAr", lang)} <span className="text-xs font-normal" style={{ color: C.muted }}>— {t("commaHintAr", lang)}</span></LabelEl>
            <input
              style={inp}
              placeholder="جفاف سريع، خالي من الخطوط"
              value={form.features_ar}
              onChange={(e) => setField("features_ar", e.target.value)}
              dir="rtl"
            />
          </div>

          {/* Sizes */}
          <div>
            <LabelEl>{t("sizes", lang)} <span className="text-xs font-normal" style={{ color: C.muted }}>— {t("commaSizes", lang)}</span></LabelEl>
            <input
              style={inp}
              placeholder="500ml, 1L, 5L"
              value={form.sizes}
              onChange={(e) => setField("sizes", e.target.value)}
            />
          </div>

          {/* Row: suitable_for + dilution_ratio */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <LabelEl>{t("suitableFor", lang)}</LabelEl>
              <input
                style={inp}
                placeholder="All car surfaces"
                value={form.suitable_for}
                onChange={(e) => setField("suitable_for", e.target.value)}
              />
            </div>
            <div>
              <LabelEl>{t("dilutionRatio", lang)}</LabelEl>
              <input
                style={inp}
                placeholder="1:10"
                value={form.dilution_ratio}
                onChange={(e) => setField("dilution_ratio", e.target.value)}
              />
            </div>
          </div>

          {error && (
            <p className="text-sm px-3 py-2 rounded-lg" style={{ color: C.danger, background: "#DC262610", border: `1px solid #DC262630` }}>
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold disabled:opacity-60"
              style={{ background: C.action, color: "#fff" }}
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : null}
              {saving ? t("saving", lang) : t("save", lang)}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg text-sm font-medium"
              style={{ background: C.bg, color: C.text, border: `1px solid ${C.border}` }}
            >
              {t("cancel", lang)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Overview Tab ─────────────────────────────────────────────────────
function OverviewTab({
  lang,
  stats,
  recentMessages,
  recentRequests,
}: {
  lang: Lang;
  stats: { products: number; clients: number; messages: number; requests: number };
  recentMessages: ContactMessage[];
  recentRequests: ProductRequest[];
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label={t("products", lang)}  value={stats.products}  sub={t("inCatalogue", lang)} />
        <StatCard label={t("clients", lang)}   value={stats.clients}   sub={t("logoSlider", lang)} />
        <StatCard label={t("messages", lang)}  value={stats.messages}  sub={t("contactForm", lang)} accent={C.warning} />
        <StatCard label={t("requests", lang)}  value={stats.requests}  sub={t("productReqs", lang)} accent={C.action} />
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="rounded-xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
          <p className="text-sm font-semibold mb-4" style={{ color: C.text }}>{t("recentMsgs", lang)}</p>
          {recentMessages.length === 0 ? (
            <p className="text-sm" style={{ color: C.muted }}>{t("noMsgsYet", lang)}</p>
          ) : (
            <div className="space-y-3">
              {recentMessages.map((m) => (
                <div key={m.id} className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: C.text }}>{m.full_name}</p>
                    <p className="text-xs truncate" style={{ color: C.muted }}>{m.email}</p>
                  </div>
                  <p className="text-xs shrink-0" style={{ color: C.muted }}>
                    {new Date(m.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
          <p className="text-sm font-semibold mb-4" style={{ color: C.text }}>{t("recentReqs", lang)}</p>
          {recentRequests.length === 0 ? (
            <p className="text-sm" style={{ color: C.muted }}>{t("noReqsYet", lang)}</p>
          ) : (
            <div className="space-y-3">
              {recentRequests.map((r) => (
                <div key={r.id} className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: C.text }}>{r.customer_name}</p>
                    <p className="text-xs truncate" style={{ color: C.muted }}>{r.product_name ?? "—"}</p>
                  </div>
                  {statusBadge(r.status, lang)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Products Tab ─────────────────────────────────────────────────────
function ProductsTab({ lang }: { lang: Lang }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Product | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setProducts((data ?? []) as Product[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function toggleStatus(id: string, current: string | null) {
    const next = current === "active" ? "inactive" : "active";
    await supabase.from("products").update({ status: next }).eq("id", id);
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, status: next } : p));
  }

  async function deleteProduct(id: string) {
    const confirmed = window.confirm(lang === "ar" ? "هل أنت متأكد من حذف هذا المنتج؟" : "Delete this product?");
    if (!confirmed) return;
    await supabase.from("products").delete().eq("id", id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  function openAdd() {
    setEditTarget(null);
    setModalOpen(true);
  }

  function openEdit(p: Product) {
    setEditTarget(p);
    setModalOpen(true);
  }

  function handleSaved() {
    setModalOpen(false);
    setEditTarget(null);
    load();
  }

  return (
    <div>
      <SectionHeader
        title={t("products", lang)}
        count={products.length}
        onRefresh={load}
        loading={loading}
      >
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
          style={{ background: C.action, color: "#fff" }}
        >
          <Plus size={14} /> {t("addProduct", lang)}
        </button>
      </SectionHeader>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={28} style={{ color: C.action }} className="animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <p className="text-sm py-8 text-center" style={{ color: C.muted }}>{t("noProducts", lang)}</p>
      ) : (
        <TableWrap>
          <thead>
            <tr>
              <Th lang={lang}>{t("thumbnail", lang)}</Th>
              <Th lang={lang}>{t("name", lang)}</Th>
              <Th lang={lang}>{t("category", lang)}</Th>
              <Th lang={lang}>{t("price", lang)}</Th>
              <Th lang={lang}>{t("status", lang)}</Th>
              <Th lang={lang}>{t("actions", lang)}</Th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} style={{ background: C.card }}>
                <Td>
                  {p.image_url ? (
                    <img
                      src={p.image_url}
                      alt={p.name}
                      className="h-10 w-10 object-cover rounded-lg"
                      style={{ border: `1px solid ${C.border}` }}
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  ) : (
                    <div
                      className="h-10 w-10 rounded-lg flex items-center justify-center text-xs"
                      style={{ background: C.bg, color: C.muted, border: `1px solid ${C.border}` }}
                    >
                      —
                    </div>
                  )}
                </Td>
                <Td>
                  <div>
                    <p className="font-medium">{p.name}</p>
                    {p.name_ar && (
                      <p className="text-xs mt-0.5" style={{ color: C.muted, direction: "rtl" }}>{p.name_ar}</p>
                    )}
                  </div>
                </Td>
                <Td><span style={{ color: C.muted }}>{p.category}</span></Td>
                <Td>
                  {p.price != null ? (
                    <span style={{ color: C.warning }}>QAR {p.price.toLocaleString()}</span>
                  ) : (
                    <span style={{ color: C.muted }}>—</span>
                  )}
                </Td>
                <Td>{statusBadge(p.status, lang)}</Td>
                <Td>
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Edit */}
                    <button
                      onClick={() => openEdit(p)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium"
                      style={{ background: "#2563EB15", color: C.action, border: `1px solid #2563EB30` }}
                      title={t("edit", lang)}
                    >
                      <Pencil size={12} /> {t("edit", lang)}
                    </button>
                    {/* Toggle */}
                    <button
                      onClick={() => toggleStatus(p.id, p.status ?? null)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium"
                      style={{
                        background: p.status === "active" ? "#DC262615" : "#16A34A15",
                        color:      p.status === "active" ? C.danger     : C.success,
                        border:     `1px solid ${p.status === "active" ? "#DC262630" : "#16A34A30"}`,
                      }}
                    >
                      {p.status === "active"
                        ? <><X size={12} /> {t("deactivate", lang)}</>
                        : <><Check size={12} /> {t("activate", lang)}</>
                      }
                    </button>
                    {/* Delete */}
                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="p-1.5 rounded text-xs"
                      style={{ color: C.danger, background: "#DC262615", border: `1px solid #DC262630` }}
                      title={t("delete", lang)}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      )}

      {modalOpen && (
        <ProductModal
          lang={lang}
          editProduct={editTarget}
          onClose={() => { setModalOpen(false); setEditTarget(null); }}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}

// ── Clients Tab ──────────────────────────────────────────────────────
function ClientsTab({ lang }: { lang: Lang }) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newClient, setNewClient] = useState({ name: "", logo_url: "", website_url: "", display_order: "0" });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("clients").select("*").order("display_order");
    setClients(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function toggleActive(id: string, current: boolean) {
    await supabase.from("clients").update({ active: !current }).eq("id", id);
    setClients((prev) => prev.map((c) => c.id === id ? { ...c, active: !current } : c));
  }

  async function deleteClient(id: string) {
    if (!confirm(lang === "ar" ? "حذف هذا العميل؟" : "Delete this client?")) return;
    await supabase.from("clients").delete().eq("id", id);
    setClients((prev) => prev.filter((c) => c.id !== id));
  }

  async function addClient(e: React.FormEvent) {
    e.preventDefault();
    if (!newClient.name.trim()) return;
    setSaving(true);
    await supabase.from("clients").insert({
      name: newClient.name.trim(),
      logo_url:    newClient.logo_url.trim()    || null,
      website_url: newClient.website_url.trim() || null,
      display_order: parseInt(newClient.display_order) || 0,
      active: true,
    });
    setNewClient({ name: "", logo_url: "", website_url: "", display_order: "0" });
    setShowAdd(false);
    setSaving(false);
    load();
  }

  const inp = inputStyle();

  return (
    <div>
      <SectionHeader
        title={t("clientsSlider", lang)}
        count={clients.length}
        onRefresh={load}
        loading={loading}
      >
        <button
          onClick={() => setShowAdd((v) => !v)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
          style={{ background: C.action, color: "#fff" }}
        >
          <Plus size={14} /> {t("addClient", lang)}
        </button>
      </SectionHeader>

      {showAdd && (
        <form
          onSubmit={addClient}
          className="rounded-xl p-5 mb-5 space-y-3"
          style={{ background: C.card, border: `1px solid ${C.border}` }}
        >
          <p className="text-sm font-semibold mb-1" style={{ color: C.text }}>{t("newClient", lang)}</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <LabelEl>{t("name", lang)} *</LabelEl>
              <input required style={inp} placeholder={t("clientName", lang)}
                value={newClient.name} onChange={(e) => setNewClient((f) => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <LabelEl>{t("logoUrl", lang)}</LabelEl>
              <input style={inp} placeholder="https://..."
                value={newClient.logo_url} onChange={(e) => setNewClient((f) => ({ ...f, logo_url: e.target.value }))} />
            </div>
            <div>
              <LabelEl>{t("websiteUrl", lang)}</LabelEl>
              <input style={inp} placeholder="https://..."
                value={newClient.website_url} onChange={(e) => setNewClient((f) => ({ ...f, website_url: e.target.value }))} />
            </div>
            <div>
              <LabelEl>{t("displayOrder", lang)}</LabelEl>
              <input type="number" style={inp} placeholder="0"
                value={newClient.display_order} onChange={(e) => setNewClient((f) => ({ ...f, display_order: e.target.value }))} />
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button type="submit" disabled={saving}
              className="px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-60"
              style={{ background: C.action, color: "#fff" }}>
              {saving ? t("saving", lang) : t("saveClient", lang)}
            </button>
            <button type="button" onClick={() => setShowAdd(false)}
              className="px-4 py-2 rounded-lg text-sm font-medium"
              style={{ background: C.bg, color: C.text, border: `1px solid ${C.border}` }}>
              {t("cancel", lang)}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={28} style={{ color: C.action }} className="animate-spin" />
        </div>
      ) : clients.length === 0 ? (
        <p className="text-sm py-8 text-center" style={{ color: C.muted }}>{t("noClients", lang)}</p>
      ) : (
        <TableWrap>
          <thead>
            <tr>
              <Th lang={lang}>{t("name", lang)}</Th>
              <Th lang={lang}>{t("logo", lang)}</Th>
              <Th lang={lang}>{t("order", lang)}</Th>
              <Th lang={lang}>{t("status", lang)}</Th>
              <Th lang={lang}>{t("actions", lang)}</Th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr key={c.id} style={{ background: C.card }}>
                <Td><span className="font-medium">{c.name}</span></Td>
                <Td>
                  {c.logo_url ? (
                    <img src={c.logo_url} alt={c.name} className="h-7 object-contain rounded" style={{ opacity: 0.85 }} />
                  ) : (
                    <span style={{ color: C.muted }}>{lang === "ar" ? "لا يوجد شعار" : "No logo"}</span>
                  )}
                </Td>
                <Td><span style={{ color: C.muted }}>{c.display_order}</span></Td>
                <Td>
                  <Badge color={c.active ? "green" : "gray"}>{c.active ? t("active", lang) : t("hidden", lang)}</Badge>
                </Td>
                <Td>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleActive(c.id, c.active)}
                      className="px-3 py-1.5 rounded text-xs font-medium"
                      style={{
                        background: c.active ? "#DC262615" : "#16A34A15",
                        color:      c.active ? C.danger     : C.success,
                        border:     `1px solid ${c.active ? "#DC262630" : "#16A34A30"}`,
                      }}
                    >
                      {c.active ? t("hide", lang) : t("show", lang)}
                    </button>
                    <button
                      onClick={() => deleteClient(c.id)}
                      className="p-1.5 rounded text-xs"
                      style={{ color: C.danger, background: "#DC262615", border: `1px solid #DC262630` }}
                      title={t("delete", lang)}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      )}
    </div>
  );
}

// ── Messages Tab ─────────────────────────────────────────────────────
function MessagesTab({ lang }: { lang: Lang }) {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    setMessages(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function markRead(id: string) {
    await supabase.from("contact_messages").update({ status: "read" }).eq("id", id);
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, status: "read" } : m));
  }

  async function deleteMsg(id: string) {
    if (!confirm(lang === "ar" ? "حذف هذه الرسالة؟" : "Delete this message?")) return;
    await supabase.from("contact_messages").delete().eq("id", id);
    setMessages((prev) => prev.filter((m) => m.id !== id));
  }

  return (
    <div>
      <SectionHeader title={t("contactMsgs", lang)} count={messages.length} onRefresh={load} loading={loading} />

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={28} style={{ color: C.action }} className="animate-spin" />
        </div>
      ) : messages.length === 0 ? (
        <p className="text-sm py-8 text-center" style={{ color: C.muted }}>{t("noMessages", lang)}</p>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className="rounded-xl"
              style={{
                background: C.card,
                border: `1px solid ${m.status === "read" ? C.border : C.action + "44"}`,
              }}
            >
              <button
                className="w-full flex items-center justify-between gap-4 p-4 text-left"
                onClick={() => setExpanded(expanded === m.id ? null : m.id)}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold" style={{ color: C.text }}>{m.full_name}</p>
                    <p className="text-xs" style={{ color: C.muted }}>{m.email}{m.phone ? ` · ${m.phone}` : ""}</p>
                  </div>
                  {m.status !== "read" && <Badge color="blue">{t("newBadge", lang)}</Badge>}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs" style={{ color: C.muted }}>
                    {new Date(m.created_at).toLocaleDateString()}
                  </span>
                  <ChevronDown
                    size={16}
                    style={{
                      color: C.muted,
                      transform: expanded === m.id ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s",
                    }}
                  />
                </div>
              </button>

              {expanded === m.id && (
                <div className="px-4 pb-4 space-y-3" style={{ borderTop: `1px solid ${C.border}` }}>
                  <p className="text-sm pt-3 leading-relaxed" style={{ color: C.text }}>{m.message}</p>
                  <div className="flex gap-2">
                    {m.status !== "read" && (
                      <button
                        onClick={() => markRead(m.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium"
                        style={{ background: "#16A34A15", color: C.success, border: `1px solid #16A34A30` }}
                      >
                        <Check size={12} /> {t("markRead", lang)}
                      </button>
                    )}
                    <a
                      href={`mailto:${m.email}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium"
                      style={{ background: C.bg, color: C.muted, border: `1px solid ${C.border}` }}
                    >
                      {t("replyEmail", lang)}
                    </a>
                    <button
                      onClick={() => deleteMsg(m.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium"
                      style={{ background: "#DC262615", color: C.danger, border: `1px solid #DC262630` }}
                    >
                      <Trash2 size={12} /> {t("delete", lang)}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Requests Tab ─────────────────────────────────────────────────────
function RequestsTab({ lang }: { lang: Lang }) {
  const [requests, setRequests] = useState<ProductRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);

    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData.session;
    console.log("[RequestsTab] Session:", session ? "ACTIVE" : "NONE");
    if (session) {
      try {
        const payload = JSON.parse(atob(session.access_token.split(".")[1]));
        console.log("[RequestsTab] JWT role:", payload.role, "| email:", session.user.email);
      } catch { /* ignore */ }
    } else {
      console.warn("[RequestsTab] No session — SELECT will run as anon and return empty due to RLS");
    }

    const { data, error } = await supabase
      .from("product_requests")
      .select("*")
      .order("created_at", { ascending: false });

    console.log("[RequestsTab] Rows returned:", data?.length ?? 0, "| Error:", error?.message ?? "none");
    if (error) console.error("[RequestsTab] product_requests SELECT error:", error);

    setRequests(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function updateStatus(id: string, status: string) {
    await supabase.from("product_requests").update({ status }).eq("id", id);
    setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
  }

  return (
    <div>
      <SectionHeader title={t("quoteReqs", lang)} count={requests.length} onRefresh={load} loading={loading} />

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={28} style={{ color: C.action }} className="animate-spin" />
        </div>
      ) : requests.length === 0 ? (
        <p className="text-sm py-8 text-center" style={{ color: C.muted }}>{t("noRequests", lang)}</p>
      ) : (
        <div className="space-y-3">
          {requests.map((r) => (
            <div
              key={r.id}
              className="rounded-xl"
              style={{
                background: C.card,
                border: `1px solid ${!r.status || r.status === "new" ? C.action + "44" : C.border}`,
              }}
            >
              <button
                className="w-full flex items-center justify-between gap-4 p-4 text-left"
                onClick={() => setExpanded(expanded === r.id ? null : r.id)}
              >
                <div className="flex items-center gap-4 min-w-0 flex-wrap">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold" style={{ color: C.text }}>{r.customer_name}</p>
                    <p className="text-xs" style={{ color: C.muted }}>
                      {r.product_name ?? t("noProduct", lang)} · {t("qty", lang)}: {r.quantity ?? 1}
                    </p>
                  </div>
                  {statusBadge(r.status, lang)}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs" style={{ color: C.muted }}>
                    {new Date(r.created_at).toLocaleDateString()}
                  </span>
                  <ChevronDown
                    size={16}
                    style={{
                      color: C.muted,
                      transform: expanded === r.id ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s",
                    }}
                  />
                </div>
              </button>

              {expanded === r.id && (
                <div className="px-4 pb-4 space-y-3" style={{ borderTop: `1px solid ${C.border}` }}>
                  <div className="grid sm:grid-cols-2 gap-3 pt-3">
                    <div>
                      <p className="text-xs mb-1" style={{ color: C.muted }}>{t("email", lang)}</p>
                      <a href={`mailto:${r.email}`} className="text-sm" style={{ color: C.action }}>{r.email}</a>
                    </div>
                    {r.phone && (
                      <div>
                        <p className="text-xs mb-1" style={{ color: C.muted }}>{t("phone", lang)}</p>
                        <a href={`tel:${r.phone}`} className="text-sm" style={{ color: C.text }}>{r.phone}</a>
                      </div>
                    )}
                    {r.notes && (
                      <div className="sm:col-span-2">
                        <p className="text-xs mb-1" style={{ color: C.muted }}>{t("notes", lang)}</p>
                        <p className="text-sm leading-relaxed" style={{ color: C.text }}>{r.notes}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => updateStatus(r.id, "contacted")}
                      disabled={r.status === "contacted"}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium disabled:opacity-40"
                      style={{ background: "#2563EB15", color: C.action, border: `1px solid #2563EB30` }}
                    >
                      <Check size={12} /> {t("markContacted", lang)}
                    </button>
                    <button
                      onClick={() => updateStatus(r.id, "quoted")}
                      disabled={r.status === "quoted"}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium disabled:opacity-40"
                      style={{ background: "#F59E0B15", color: C.warning, border: `1px solid #F59E0B30` }}
                    >
                      <Check size={12} /> {t("markQuoted", lang)}
                    </button>
                    <button
                      onClick={() => updateStatus(r.id, "closed")}
                      disabled={r.status === "closed"}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium disabled:opacity-40"
                      style={{ background: "#16A34A15", color: C.success, border: `1px solid #16A34A30` }}
                    >
                      <Check size={12} /> {t("markClosed", lang)}
                    </button>
                    <button
                      onClick={() => updateStatus(r.id, "new")}
                      disabled={!r.status || r.status === "new"}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium disabled:opacity-40"
                      style={{ background: C.bg, color: C.muted, border: `1px solid ${C.border}` }}
                    >
                      {t("reopenReq", lang)}
                    </button>
                    <a
                      href={`mailto:${r.email}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium"
                      style={{ background: C.bg, color: C.muted, border: `1px solid ${C.border}` }}
                    >
                      {t("replyEmail", lang)}
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Nav items ────────────────────────────────────────────────────────
const NAV_IDS = ["overview", "products", "clients", "messages", "requests"] as const;
type TabId = typeof NAV_IDS[number];

const NAV_ICONS: Record<TabId, React.ElementType> = {
  overview: LayoutDashboard,
  products: Package,
  clients:  Users,
  messages: MessageSquare,
  requests: ClipboardList,
};

const NAV_LABEL_KEYS: Record<TabId, keyof typeof T> = {
  overview: "overview",
  products: "products",
  clients:  "clients",
  messages: "messages",
  requests: "requests",
};

// ── Main Dashboard ────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [lang, setLang] = useState<Lang>("ar");
  const [tab, setTab] = useState<TabId>("overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [stats, setStats] = useState({ products: 0, clients: 0, messages: 0, requests: 0 });
  const [recentMessages, setRecentMessages] = useState<ContactMessage[]>([]);
  const [recentRequests, setRecentRequests] = useState<ProductRequest[]>([]);

  const isRTL = lang === "ar";

  // Auth guard — verify active Supabase session
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) setLocation("/admin/login");
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) setLocation("/admin/login");
    });

    return () => listener.subscription.unsubscribe();
  }, [setLocation]);

  // Load overview data — waits for session, logs diagnostics
  useEffect(() => {
    async function load() {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session;

      console.log("[Dashboard] auth.getSession →", session ? "session ACTIVE" : "NO session");
      if (session) {
        console.log("[Dashboard] user.email:", session.user.email);
        console.log("[Dashboard] user.role:", session.user.role);
        try {
          const payload = JSON.parse(atob(session.access_token.split(".")[1]));
          console.log("[Dashboard] JWT role:", payload.role);
        } catch { /* ignore decode errors */ }
      } else {
        console.warn("[Dashboard] No session — queries will run as anon and may return empty due to RLS");
      }

      const [p, c, m, r, msgs, reqs] = await Promise.all([
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("clients").select("*", { count: "exact", head: true }),
        supabase.from("contact_messages").select("*", { count: "exact", head: true }),
        supabase.from("product_requests").select("*", { count: "exact", head: true }),
        supabase.from("contact_messages").select("*").order("created_at", { ascending: false }).limit(5),
        supabase.from("product_requests").select("*").order("created_at", { ascending: false }).limit(5),
      ]);

      console.log("[Dashboard] products → count:", p.count, "| error:", p.error?.message ?? "none");
      console.log("[Dashboard] product_requests count → count:", r.count, "| error:", r.error?.message ?? "none");
      console.log("[Dashboard] recent product_requests → rows:", reqs.data?.length ?? 0, "| error:", reqs.error?.message ?? "none");
      if (reqs.error) console.error("[Dashboard] product_requests SELECT failed:", reqs.error);

      setStats({
        products: p.count ?? 0,
        clients:  c.count ?? 0,
        messages: m.count ?? 0,
        requests: r.count ?? 0,
      });
      setRecentMessages((msgs.data ?? []) as ContactMessage[]);
      setRecentRequests((reqs.data ?? []) as ProductRequest[]);
    }
    load();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    setLocation("/admin/login");
  }

  const currentLabelKey = NAV_LABEL_KEYS[tab];

  return (
    <div
      className="min-h-screen flex"
      style={{ background: C.bg, color: C.text }}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* ── Sidebar (desktop) ── */}
      <aside
        className="hidden lg:flex flex-col w-60 shrink-0"
        style={{
          background: C.sidebar,
          borderRight: isRTL ? "none" : `1px solid #1F2937`,
          borderLeft:  isRTL ? `1px solid #1F2937` : "none",
          order: isRTL ? 1 : 0,
        }}
      >
        {/* Logo */}
        <div className="p-5" style={{ borderBottom: `1px solid #1F2937` }}>
          <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
            <div
              className="w-7 h-7 rounded flex items-center justify-center shrink-0"
              style={{ background: C.action }}
            >
              <span className="text-white font-black text-xs">CZ</span>
            </div>
            <span className="text-white font-black tracking-widest text-sm uppercase">CARZIX</span>
          </div>
          <p className="text-xs mt-1 tracking-wider" style={{ color: "#9CA3AF" }}>
            {t("adminPanel", lang)}
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5">
          {NAV_IDS.map((id) => {
            const Icon = NAV_ICONS[id];
            const label = t(NAV_LABEL_KEYS[id], lang);
            const active = tab === id;
            return (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isRTL ? "flex-row-reverse text-right" : "text-left"}`}
                style={
                  active
                    ? { background: C.action + "25", color: "#93C5FD", border: `1px solid ${C.action}50` }
                    : { color: "#9CA3AF", border: "1px solid transparent" }
                }
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "#1F2937"; }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
              >
                <Icon size={16} />
                {label}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3" style={{ borderTop: `1px solid #1F2937` }}>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isRTL ? "flex-row-reverse text-right" : "text-left"}`}
            style={{ color: "#9CA3AF" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#FCA5A5"; e.currentTarget.style.background = "#1F2937"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#9CA3AF"; e.currentTarget.style.background = "transparent"; }}
          >
            <LogOut size={16} /> {t("logout", lang)}
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header
          className="flex items-center justify-between px-5 py-3 shrink-0"
          style={{ background: C.card, borderBottom: `1px solid ${C.border}` }}
        >
          <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden p-1.5 rounded"
              style={{ color: C.muted }}
            >
              <Menu size={20} />
            </button>
            <h1 className="text-sm font-semibold" style={{ color: C.text }}>
              {t(currentLabelKey, lang)}
            </h1>
          </div>

          {/* Right side: lang toggle + date + logout mobile */}
          <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            {/* Language toggle */}
            <button
              onClick={() => setLang((l) => l === "ar" ? "en" : "ar")}
              className="px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider transition-colors"
              style={{
                background: C.sidebar,
                color: "#fff",
                border: `1px solid #374151`,
              }}
            >
              {lang === "ar" ? "EN" : "AR"}
            </button>

            <span className="text-xs hidden sm:block" style={{ color: C.muted }}>
              {new Date().toLocaleDateString(lang === "ar" ? "ar-SA" : "en-GB", {
                day: "numeric", month: "short", year: "numeric",
              })}
            </span>

            <button
              onClick={handleLogout}
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium"
              style={{ color: C.danger, background: "#DC262610", border: `1px solid #DC262630` }}
            >
              <LogOut size={13} /> {t("logout", lang)}
            </button>
          </div>
        </header>

        {/* Mobile nav drawer */}
        {mobileOpen && (
          <div
            className="lg:hidden p-3 space-y-0.5"
            style={{ background: C.sidebar, borderBottom: `1px solid #1F2937` }}
          >
            {NAV_IDS.map((id) => {
              const Icon = NAV_ICONS[id];
              const label = t(NAV_LABEL_KEYS[id], lang);
              return (
                <button
                  key={id}
                  onClick={() => { setTab(id); setMobileOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${isRTL ? "flex-row-reverse text-right" : "text-left"}`}
                  style={
                    tab === id
                      ? { background: C.action + "25", color: "#93C5FD" }
                      : { color: "#9CA3AF" }
                  }
                >
                  <Icon size={16} />
                  {label}
                </button>
              );
            })}
          </div>
        )}

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-5 lg:p-7">
          {tab === "overview" && (
            <OverviewTab
              lang={lang}
              stats={stats}
              recentMessages={recentMessages}
              recentRequests={recentRequests}
            />
          )}
          {tab === "products"  && <ProductsTab lang={lang} />}
          {tab === "clients"   && <ClientsTab lang={lang} />}
          {tab === "messages"  && <MessagesTab lang={lang} />}
          {tab === "requests"  && <RequestsTab lang={lang} />}
        </main>
      </div>
    </div>
  );
}
