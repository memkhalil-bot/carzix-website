import { useState, useRef } from "react";
import type React from "react";
import { X, Loader2, Upload, Package } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { C } from "@/components/admin/theme";
import type { Lang } from "@/components/admin/theme";
import { t } from "@/components/admin/i18n";
import { inputStyle, LabelEl } from "@/components/admin/formControls";

export interface Product {
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
  display_order?: number | null;
  is_featured?: boolean | null;
  created_at: string;
}

export const CATEGORIES = [
  "Shampoos",
  "Polishing",
  "Glass Care",
  "Interior Care",
  "Multi-Purpose",
  "Tire Care",
];

function parseArr(s: string): string[] {
  return s.split(",").map((x) => x.trim()).filter(Boolean);
}

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
  display_order: string;
  is_featured: boolean;
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
  display_order: "999",
  is_featured: false,
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
    display_order: p.display_order != null ? String(p.display_order) : "999",
    is_featured: p.is_featured ?? false,
  };
}

interface ProductModalProps {
  lang: Lang;
  editProduct: Product | null;
  onClose: () => void;
  onSaved: () => void;
}

export function ProductModal({ lang, editProduct, onClose, onSaved }: ProductModalProps) {
  const [form, setForm] = useState<ProductFormState>(
    editProduct ? productToForm(editProduct) : EMPTY_FORM
  );
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEdit = editProduct !== null;

  function setField<K extends keyof ProductFormState>(key: K, value: ProductFormState[K]) {
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
      display_order: form.display_order ? parseInt(form.display_order, 10) : 999,
      is_featured: form.is_featured,
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
      style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-2xl my-8 mx-4 rounded-2xl shadow-2xl"
        style={{ background: C.surface, border: `1px solid ${C.border}` }}
      >
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid ${C.border}` }}>
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ background: C.actionDim, color: C.action }}>
              <Package size={15} />
            </div>
            <h2 className="text-base font-bold" style={{ color: C.text }}>
              {isEdit ? t("editProduct", lang) : t("addProduct", lang)}
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg" style={{ color: C.muted, background: C.surface2 }}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <LabelEl>{t("nameEn", lang)} <span style={{ color: C.danger }}>*</span></LabelEl>
              <input required style={inp} placeholder="Product name in English"
                value={form.name} onChange={(e) => setField("name", e.target.value)} />
            </div>
            <div>
              <LabelEl>{t("nameAr", lang)}</LabelEl>
              <input style={inp} placeholder="اسم المنتج بالعربية" dir="rtl"
                value={form.name_ar} onChange={(e) => setField("name_ar", e.target.value)} />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <LabelEl>{t("category", lang)}</LabelEl>
              <select style={inp} value={form.category} onChange={(e) => setField("category", e.target.value)}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <LabelEl>{t("price", lang)}</LabelEl>
              <input type="number" min="0" step="0.01" style={inp} placeholder="0.00"
                value={form.price} onChange={(e) => setField("price", e.target.value)} />
            </div>
          </div>

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
                <div className="absolute top-2 end-2 flex gap-1.5">
                  <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold"
                    style={{ background: "rgba(0,0,0,0.72)", color: "#fff" }}>
                    <Upload size={11} /> {t("replaceImg", lang)}
                  </button>
                  <button type="button" onClick={removeImage} disabled={uploading}
                    className="p-1.5 rounded-lg" style={{ background: "rgba(239,68,68,0.82)", color: "#fff" }}
                    title={t("removeImg", lang)}>
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
                  background: C.surface2,
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
            {uploading && (
              <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ background: C.border }}>
                <div className="h-full rounded-full transition-all duration-500" style={{ background: C.action, width: `${uploadProgress}%` }} />
              </div>
            )}
          </div>

          <div>
            <LabelEl>{t("status", lang)}</LabelEl>
            <div className="flex items-center gap-4">
              {(["active", "inactive"] as const).map((val) => (
                <label key={val} className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: C.text }}>
                  <input type="radio" name="product-status" value={val} checked={form.status === val}
                    onChange={() => setField("status", val)} style={{ accentColor: C.action }} />
                  {val === "active" ? t("active", lang) : t("inactive", lang)}
                </label>
              ))}
            </div>
          </div>

          <div>
            <LabelEl>{t("descEn", lang)}</LabelEl>
            <textarea rows={3} style={{ ...inp, resize: "vertical" }} placeholder="Product description (English)"
              value={form.description} onChange={(e) => setField("description", e.target.value)} />
          </div>

          <div>
            <LabelEl>{t("descAr", lang)}</LabelEl>
            <textarea rows={3} style={{ ...inp, resize: "vertical" }} placeholder="وصف المنتج بالعربية" dir="rtl"
              value={form.description_ar} onChange={(e) => setField("description_ar", e.target.value)} />
          </div>

          <div>
            <LabelEl>{t("featuresEn", lang)} <span className="text-xs font-normal" style={{ color: C.muted }}>— {t("commaHintEn", lang)}</span></LabelEl>
            <input style={inp} placeholder="Fast drying, Streak-free, UV protection"
              value={form.features} onChange={(e) => setField("features", e.target.value)} />
          </div>

          <div>
            <LabelEl>{t("featuresAr", lang)} <span className="text-xs font-normal" style={{ color: C.muted }}>— {t("commaHintAr", lang)}</span></LabelEl>
            <input style={inp} placeholder="جفاف سريع، خالي من الخطوط" dir="rtl"
              value={form.features_ar} onChange={(e) => setField("features_ar", e.target.value)} />
          </div>

          <div>
            <LabelEl>{t("sizes", lang)} <span className="text-xs font-normal" style={{ color: C.muted }}>— {t("commaSizes", lang)}</span></LabelEl>
            <input style={inp} placeholder="500ml, 1L, 5L"
              value={form.sizes} onChange={(e) => setField("sizes", e.target.value)} />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <LabelEl>{t("suitableFor", lang)}</LabelEl>
              <input style={inp} placeholder="All car surfaces"
                value={form.suitable_for} onChange={(e) => setField("suitable_for", e.target.value)} />
            </div>
            <div>
              <LabelEl>{t("dilutionRatio", lang)}</LabelEl>
              <input style={inp} placeholder="1:10"
                value={form.dilution_ratio} onChange={(e) => setField("dilution_ratio", e.target.value)} />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <LabelEl>{t("displayOrder", lang)}</LabelEl>
              <input type="number" step="1" style={inp} placeholder="999"
                value={form.display_order} onChange={(e) => setField("display_order", e.target.value)} />
            </div>
            <div className="flex items-end pb-1.5">
              <label className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: C.text }}>
                <input type="checkbox" checked={form.is_featured}
                  onChange={(e) => setField("is_featured", e.target.checked)}
                  style={{ accentColor: C.action }} />
                {t("featuredProduct", lang)}
              </label>
            </div>
          </div>

          {error && (
            <p className="text-sm px-3 py-2 rounded-lg" style={{ color: C.danger, background: "#EF444410", border: "1px solid #EF444430" }}>
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold disabled:opacity-60"
              style={{ background: C.action, color: "#FFFFFF" }}>
              {saving ? <Loader2 size={14} className="animate-spin" /> : null}
              {saving ? t("saving", lang) : t("save", lang)}
            </button>
            <button type="button" onClick={onClose}
              className="px-5 py-2 rounded-lg text-sm font-medium"
              style={{ background: C.surface2, color: C.text, border: `1px solid ${C.border}` }}>
              {t("cancel", lang)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
