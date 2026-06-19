import { useEffect, useState, useCallback } from "react";
import type React from "react";
import { Plus, RefreshCw, Trash2, Building2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Client } from "@/lib/types";
import { C } from "@/components/admin/theme";
import type { Lang } from "@/components/admin/theme";
import { t } from "@/components/admin/i18n";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Th, Td, TableWrap, EmptyState, LoadingState } from "@/components/admin/AdminTable";
import { SectionHeader } from "@/components/admin/SectionHeader";
import { AdminCard } from "@/components/admin/AdminCard";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { inputStyle, LabelEl } from "@/components/admin/formControls";

export function ClientsTab({ lang }: { lang: Lang }) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newClient, setNewClient] = useState({ name: "", logo_url: "", website_url: "", display_order: "0" });
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

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

  async function confirmDelete() {
    if (!deleteTarget) return;
    await supabase.from("clients").delete().eq("id", deleteTarget);
    setClients((prev) => prev.filter((c) => c.id !== deleteTarget));
    setDeleteTarget(null);
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
        icon={<Building2 size={15} />}
        actions={
          <>
            <button onClick={() => setShowAdd((v) => !v)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
              style={{ background: C.action, color: "#FFFFFF" }}>
              <Plus size={14} /> {t("addClient", lang)}
            </button>
            <button onClick={load} disabled={loading}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ background: C.surface2, color: C.muted, border: `1px solid ${C.border}` }}>
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </button>
          </>
        }
      />

      {showAdd && (
        <AdminCard className="mb-5">
        <form onSubmit={addClient} className="space-y-3">
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
              style={{ background: C.action, color: "#FFFFFF" }}>
              {saving ? t("saving", lang) : t("saveClient", lang)}
            </button>
            <button type="button" onClick={() => setShowAdd(false)}
              className="px-4 py-2 rounded-lg text-sm font-medium"
              style={{ background: C.surface2, color: C.text, border: `1px solid ${C.border}` }}>
              {t("cancel", lang)}
            </button>
          </div>
        </form>
        </AdminCard>
      )}

      {loading ? (
        <LoadingState />
      ) : clients.length === 0 ? (
        <EmptyState message={t("noClients", lang)} />
      ) : (
        <>
        <div className="md:hidden space-y-3">
          {clients.map((c) => (
            <AdminCard key={c.id} padding="sm">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {c.logo_url ? (
                    <img src={c.logo_url} alt={c.name} className="h-8 object-contain rounded shrink-0" style={{ opacity: 0.85 }} />
                  ) : (
                    <div className="h-8 w-8 rounded flex items-center justify-center text-xs shrink-0"
                      style={{ background: C.surface2, color: C.muted, border: `1px solid ${C.border}` }}>—</div>
                  )}
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate" style={{ color: C.text }}>{c.name}</p>
                    <p className="text-xs" style={{ color: C.muted }}>{t("order", lang)}: {c.display_order}</p>
                  </div>
                </div>
                <StatusBadge color={c.active ? "green" : "gray"}>
                  {c.active ? t("active", lang) : t("hidden", lang)}
                </StatusBadge>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <button onClick={() => toggleActive(c.id, c.active)}
                  className="px-3 py-1.5 rounded text-xs font-medium"
                  style={{
                    background: c.active ? "#EF444415" : "#22C55E15",
                    color:      c.active ? C.danger     : C.success,
                    border:     `1px solid ${c.active ? "#EF444430" : "#22C55E30"}`,
                  }}>
                  {c.active ? t("hide", lang) : t("show", lang)}
                </button>
                <button onClick={() => setDeleteTarget(c.id)}
                  className="p-1.5 rounded text-xs ml-auto"
                  style={{ color: C.danger, background: "#EF444415", border: "1px solid #EF444430" }}>
                  <Trash2 size={13} />
                </button>
              </div>
            </AdminCard>
          ))}
        </div>
        <div className="hidden md:block">
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
              <tr key={c.id} style={{ background: C.surface }}>
                <Td><span className="font-medium">{c.name}</span></Td>
                <Td>
                  {c.logo_url
                    ? <img src={c.logo_url} alt={c.name} className="h-7 object-contain rounded" style={{ opacity: 0.85 }} />
                    : <span style={{ color: C.muted }}>{lang === "ar" ? "لا يوجد شعار" : "No logo"}</span>}
                </Td>
                <Td><span style={{ color: C.muted }}>{c.display_order}</span></Td>
                <Td>
                  <StatusBadge color={c.active ? "green" : "gray"}>
                    {c.active ? t("active", lang) : t("hidden", lang)}
                  </StatusBadge>
                </Td>
                <Td>
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleActive(c.id, c.active)}
                      className="px-3 py-1.5 rounded text-xs font-medium"
                      style={{
                        background: c.active ? "#EF444415" : "#22C55E15",
                        color:      c.active ? C.danger     : C.success,
                        border:     `1px solid ${c.active ? "#EF444430" : "#22C55E30"}`,
                      }}>
                      {c.active ? t("hide", lang) : t("show", lang)}
                    </button>
                    <button onClick={() => setDeleteTarget(c.id)}
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
        </div>
        </>
      )}

      {deleteTarget && (
        <ConfirmModal
          lang={lang}
          message={t("confirmDeleteClient", lang)}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
