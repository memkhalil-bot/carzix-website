import { useEffect, useState, useCallback, useRef } from "react";
import { Loader2, Check, X, ChevronDown, Download } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { ProductRequest } from "@/lib/types";
import { C } from "@/components/admin/theme";
import type { Lang } from "@/components/admin/theme";
import { t } from "@/components/admin/i18n";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { EmptyState } from "@/components/admin/AdminTable";
import { inputStyle } from "@/components/admin/formControls";
import { normalizedRequestStatus, statusBadgeColor } from "../requestStatus";

function csvEscape(value: unknown): string {
  const s = value == null ? "" : String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

const CSV_COLUMNS: { key: keyof ProductRequest; header: string }[] = [
  { key: "created_at",   header: "created_at" },
  { key: "status",       header: "status" },
  { key: "customer_name", header: "customer_name" },
  { key: "company_name", header: "company_name" },
  { key: "business_type", header: "business_type" },
  { key: "city",          header: "city" },
  { key: "email",         header: "email" },
  { key: "phone",         header: "phone" },
  { key: "product_name",  header: "product_name" },
  { key: "quantity",      header: "quantity" },
  { key: "notes",         header: "notes" },
];

function exportRequestsCsv(requests: ProductRequest[]) {
  const headerRow = CSV_COLUMNS.map((c) => c.header).join(",");
  const rows = requests.map((r) => CSV_COLUMNS.map((c) => csvEscape(r[c.key])).join(","));
  const csv = [headerRow, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `carzix-requests-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const STATUS_FILTERS = ["all", "new", "contacted", "quoted", "won", "lost"] as const;
type StatusFilter = typeof STATUS_FILTERS[number];

function matchesSearch(r: ProductRequest, query: string): boolean {
  if (!query) return true;
  const needle = query.toLowerCase();
  return [r.customer_name, r.company_name, r.email, r.phone, r.product_name, r.city].some((field) =>
    (field ?? "").toLowerCase().includes(needle)
  );
}

function statusLabel(status: string | null | undefined, lang: Lang): string {
  const keyMap = { new: "newBadge", contacted: "contacted", quoted: "quoted", won: "won", lost: "lost" } as const;
  return t(keyMap[normalizedRequestStatus(status)], lang);
}

export function RequestsTab({ lang }: { lang: Lang }) {
  const [requests, setRequests] = useState<ProductRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [businessTypeFilter, setBusinessTypeFilter] = useState<string>("all");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("product_requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) console.error("[RequestsTab] product_requests SELECT error:", error);
    setRequests(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  function showFeedback(type: "success" | "error", message: string) {
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    setFeedback({ type, message });
    feedbackTimer.current = setTimeout(() => setFeedback(null), 3500);
  }

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase.from("product_requests").update({ status }).eq("id", id);
    if (error) {
      console.error("[RequestsTab] status update failed:", error);
      showFeedback("error", t("updateError", lang));
      return;
    }
    setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
    showFeedback("success", t("updateSuccess", lang));
  }

  const businessTypeOptions = Array.from(
    new Set(requests.map((r) => r.business_type).filter((v): v is string => !!v))
  ).sort();

  const filtered = requests.filter((r) =>
    matchesSearch(r, search) &&
    (statusFilter === "all" || normalizedRequestStatus(r.status) === statusFilter) &&
    (businessTypeFilter === "all" || r.business_type === businessTypeFilter)
  );

  const filtersActive = search !== "" || statusFilter !== "all" || businessTypeFilter !== "all";

  function clearFilters() {
    setSearch("");
    setStatusFilter("all");
    setBusinessTypeFilter("all");
  }

  const inp = inputStyle();

  return (
    <div>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold" style={{ color: C.text }}>{t("quoteReqs", lang)}</h2>
          <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{ background: C.surface2, color: C.muted, border: `1px solid ${C.border}` }}>
            {filtered.length}
          </span>
        </div>
        <button onClick={() => exportRequestsCsv(filtered)} disabled={filtered.length === 0}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-40"
          style={{ background: C.action, color: "#0A0B0A" }}>
          <Download size={14} /> {t("exportCsv", lang)}
        </button>
      </div>

      {feedback && (
        <div className="mb-4 px-3 py-2 rounded-lg text-sm" style={
          feedback.type === "success"
            ? { background: "#22C55E15", color: C.success, border: "1px solid #22C55E30" }
            : { background: "#EF444415", color: C.danger, border: "1px solid #EF444430" }
        }>
          {feedback.message}
        </div>
      )}

      <div className="grid sm:grid-cols-4 gap-3 mb-5">
        <div className="sm:col-span-2">
          <input style={inp} placeholder={t("searchPlaceholder", lang)} value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select style={inp} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}>
          <option value="all">{t("allStatuses", lang)}</option>
          <option value="new">{t("newBadge", lang)}</option>
          <option value="contacted">{t("contacted", lang)}</option>
          <option value="quoted">{t("quoted", lang)}</option>
          <option value="won">{t("won", lang)}</option>
          <option value="lost">{t("lost", lang)}</option>
        </select>
        <select style={inp} value={businessTypeFilter} onChange={(e) => setBusinessTypeFilter(e.target.value)}>
          <option value="all">{t("allBusinessTypes", lang)}</option>
          {businessTypeOptions.map((bt) => <option key={bt} value={bt}>{bt}</option>)}
        </select>
      </div>

      {filtersActive && (
        <div className="mb-5">
          <button onClick={clearFilters} className="px-3 py-1.5 rounded-lg text-xs font-medium"
            style={{ background: C.surface2, color: C.muted, border: `1px solid ${C.border}` }}>
            {t("clearFilters", lang)}
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={28} style={{ color: C.action }} className="animate-spin" />
        </div>
      ) : requests.length === 0 ? (
        <EmptyState message={t("noRequests", lang)} />
      ) : filtered.length === 0 ? (
        <EmptyState message={t("noResultsFound", lang)} />
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <div key={r.id} className="rounded-xl"
              style={{ background: C.surface, border: `1px solid ${normalizedRequestStatus(r.status) === "new" ? C.action + "44" : C.border}` }}>
              <button className="w-full flex items-center justify-between gap-4 p-4 text-left" onClick={() => setExpanded(expanded === r.id ? null : r.id)}>
                <div className="flex items-center gap-4 min-w-0 flex-wrap">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold" style={{ color: C.text }}>{r.customer_name}</p>
                    <p className="text-xs" style={{ color: C.muted }}>
                      {r.product_name ?? t("noProduct", lang)} · {t("qty", lang)}: {r.quantity ?? 1}
                    </p>
                  </div>
                  <StatusBadge color={statusBadgeColor(r.status)}>{statusLabel(r.status, lang)}</StatusBadge>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs" style={{ color: C.muted }}>{new Date(r.created_at).toLocaleDateString()}</span>
                  <ChevronDown size={16} style={{ color: C.muted, transform: expanded === r.id ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
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
                    {r.company_name && (
                      <div>
                        <p className="text-xs mb-1" style={{ color: C.muted }}>{t("companyName", lang)}</p>
                        <p className="text-sm" style={{ color: C.text }}>{r.company_name}</p>
                      </div>
                    )}
                    {r.city && (
                      <div>
                        <p className="text-xs mb-1" style={{ color: C.muted }}>{t("city", lang)}</p>
                        <p className="text-sm" style={{ color: C.text }}>{r.city}</p>
                      </div>
                    )}
                    {r.business_type && (
                      <div>
                        <p className="text-xs mb-1" style={{ color: C.muted }}>{t("businessType", lang)}</p>
                        <p className="text-sm" style={{ color: C.text }}>{r.business_type}</p>
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
                    {(() => {
                      const current = normalizedRequestStatus(r.status);
                      return (
                        <>
                          <button onClick={() => updateStatus(r.id, "contacted")} disabled={current === "contacted"}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium disabled:opacity-40"
                            style={{ background: "#3B82F615", color: C.info, border: "1px solid #3B82F630" }}>
                            <Check size={12} /> {t("markContacted", lang)}
                          </button>
                          <button onClick={() => updateStatus(r.id, "quoted")} disabled={current === "quoted"}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium disabled:opacity-40"
                            style={{ background: "#F59E0B15", color: C.warning, border: "1px solid #F59E0B30" }}>
                            <Check size={12} /> {t("markQuoted", lang)}
                          </button>
                          <button onClick={() => updateStatus(r.id, "won")} disabled={current === "won"}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium disabled:opacity-40"
                            style={{ background: "#22C55E15", color: C.success, border: "1px solid #22C55E30" }}>
                            <Check size={12} /> {t("markWon", lang)}
                          </button>
                          <button onClick={() => updateStatus(r.id, "lost")} disabled={current === "lost"}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium disabled:opacity-40"
                            style={{ background: "#EF444415", color: C.danger, border: "1px solid #EF444430" }}>
                            <X size={12} /> {t("markLost", lang)}
                          </button>
                          <button onClick={() => updateStatus(r.id, "new")} disabled={current === "new"}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium disabled:opacity-40"
                            style={{ background: C.surface2, color: C.muted, border: `1px solid ${C.border}` }}>
                            {t("reopenReq", lang)}
                          </button>
                        </>
                      );
                    })()}
                    <a href={`mailto:${r.email}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium"
                      style={{ background: C.surface2, color: C.muted, border: `1px solid ${C.border}` }}>
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
