import { useEffect, useState, useCallback } from "react";
import { Loader2, Plus, RefreshCw, Pencil, Check, X, Trash2, Star } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { C } from "@/components/admin/theme";
import type { Lang } from "@/components/admin/theme";
import { t } from "@/components/admin/i18n";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Th, Td, TableWrap, EmptyState } from "@/components/admin/AdminTable";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { productStatusBadgeColor } from "../requestStatus";
import { ProductModal, type Product } from "./ProductModal";

export function ProductsTab({ lang }: { lang: Lang }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });
    setProducts((data ?? []) as Product[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function toggleStatus(id: string, current: string | null) {
    const next = current === "active" ? "inactive" : "active";
    await supabase.from("products").update({ status: next }).eq("id", id);
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, status: next } : p));
  }

  async function toggleFeatured(id: string, current: boolean | null | undefined) {
    const next = !current;
    await supabase.from("products").update({ is_featured: next }).eq("id", id);
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, is_featured: next } : p));
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    await supabase.from("products").delete().eq("id", deleteTarget);
    setProducts((prev) => prev.filter((p) => p.id !== deleteTarget));
    setDeleteTarget(null);
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
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold" style={{ color: C.text }}>{t("products", lang)}</h2>
          <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{ background: C.surface2, color: C.muted, border: `1px solid ${C.border}` }}>
            {products.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={openAdd}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
            style={{ background: C.action, color: "#FFFFFF" }}>
            <Plus size={14} /> {t("addProduct", lang)}
          </button>
          <button onClick={load} disabled={loading}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{ background: C.surface2, color: C.muted, border: `1px solid ${C.border}` }}>
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={28} style={{ color: C.action }} className="animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <EmptyState message={t("noProducts", lang)} />
      ) : (
        <TableWrap>
          <thead>
            <tr>
              <Th lang={lang}>{t("thumbnail", lang)}</Th>
              <Th lang={lang}>{t("name", lang)}</Th>
              <Th lang={lang}>{t("category", lang)}</Th>
              <Th lang={lang}>{t("price", lang)}</Th>
              <Th lang={lang}>{t("displayOrder", lang)}</Th>
              <Th lang={lang}>{t("featured", lang)}</Th>
              <Th lang={lang}>{t("status", lang)}</Th>
              <Th lang={lang}>{t("actions", lang)}</Th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} style={{ background: C.surface }}>
                <Td>
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="h-10 w-10 object-cover rounded-lg"
                      style={{ border: `1px solid ${C.border}` }}
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  ) : (
                    <div className="h-10 w-10 rounded-lg flex items-center justify-center text-xs"
                      style={{ background: C.surface2, color: C.muted, border: `1px solid ${C.border}` }}>
                      —
                    </div>
                  )}
                </Td>
                <Td>
                  <div>
                    <p className="font-medium">{p.name}</p>
                    {p.name_ar && <p className="text-xs mt-0.5" style={{ color: C.muted, direction: "rtl" }}>{p.name_ar}</p>}
                  </div>
                </Td>
                <Td><span style={{ color: C.muted }}>{p.category}</span></Td>
                <Td>
                  {p.price != null
                    ? <span style={{ color: C.warning }}>QAR {p.price.toLocaleString()}</span>
                    : <span style={{ color: C.muted }}>—</span>}
                </Td>
                <Td><span style={{ color: C.muted }}>{p.display_order ?? 999}</span></Td>
                <Td>
                  <button onClick={() => toggleFeatured(p.id, p.is_featured)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium"
                    style={{
                      background: p.is_featured ? "#F59E0B15" : C.surface2,
                      color:      p.is_featured ? C.warning   : C.muted,
                      border:     `1px solid ${p.is_featured ? "#F59E0B30" : C.border}`,
                    }}>
                    <Star size={12} fill={p.is_featured ? C.warning : "none"} />
                    {p.is_featured ? t("featured", lang) : "—"}
                  </button>
                </Td>
                <Td>
                  <StatusBadge color={productStatusBadgeColor(p.status)}>
                    {p.status === "active" ? t("active", lang) : t("inactive", lang)}
                  </StatusBadge>
                </Td>
                <Td>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button onClick={() => openEdit(p)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium"
                      style={{ background: "#1565A015", color: C.info, border: "1px solid #1565A030" }}
                      title={t("edit", lang)}>
                      <Pencil size={12} /> {t("edit", lang)}
                    </button>
                    <button onClick={() => toggleStatus(p.id, p.status ?? null)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium"
                      style={{
                        background: p.status === "active" ? "#EF444415" : "#22C55E15",
                        color:      p.status === "active" ? C.danger     : C.success,
                        border:     `1px solid ${p.status === "active" ? "#EF444430" : "#22C55E30"}`,
                      }}>
                      {p.status === "active"
                        ? <><X size={12} /> {t("deactivate", lang)}</>
                        : <><Check size={12} /> {t("activate", lang)}</>}
                    </button>
                    <button onClick={() => setDeleteTarget(p.id)}
                      className="p-1.5 rounded text-xs"
                      style={{ color: C.danger, background: "#EF444415", border: "1px solid #EF444430" }}
                      title={t("delete", lang)}>
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

      {deleteTarget && (
        <ConfirmModal
          lang={lang}
          message={t("confirmDeleteProduct", lang)}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
