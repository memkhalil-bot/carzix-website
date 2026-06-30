import { useEffect, useState, useCallback, useRef } from "react";
import type { ReactNode } from "react";
import { Check, X, ChevronDown, Download, Calendar, AlertCircle, ClipboardList, Copy, Mail, MessageCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { ProductRequest } from "@/lib/types";
import { C } from "@/components/admin/theme";
import type { Lang } from "@/components/admin/theme";
import { t } from "@/components/admin/i18n";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { MetricCard } from "@/components/admin/MetricCard";
import { BentoGrid } from "@/components/admin/BentoGrid";
import { EmptyState, LoadingState, ErrorState } from "@/components/admin/AdminTable";
import { SectionHeader } from "@/components/admin/SectionHeader";
import { Toolbar, ToolbarChip } from "@/components/admin/Toolbar";
import { inputStyle } from "@/components/admin/formControls";
import { normalizedRequestStatus, statusBadgeColor } from "../requestStatus";
import { isDueToday, isOverdue, hasNoFollowUp, matchesFollowUpFilter } from "../followUp";
import type { FollowUpFilter } from "../followUp";
import { SalesDetailsModal } from "./SalesDetailsModal";

function toWhatsAppLink(phone: string): string {
  return `https://wa.me/${phone.replace(/[^\d]/g, "")}`;
}

async function copyToClipboard(value: string): Promise<boolean> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch {
      // fall through to legacy fallback below
    }
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = value;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    return true;
  } catch {
    return false;
  }
}

function FieldActionButton({ onClick, label, color, children }: { onClick: () => void; label: string; color?: string; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      title={label}
      aria-label={label}
      className="inline-flex items-center justify-center w-6 h-6 rounded shrink-0 transition-colors"
      style={{ color: color ?? C.muted, background: C.surface2, border: `1px solid ${C.border}` }}
    >
      {children}
    </button>
  );
}

function CopyableField({
  label,
  value,
  copyLabel,
  onCopy,
  valueColor,
  extraActions,
}: {
  label: string;
  value: string;
  copyLabel: string;
  onCopy: () => void;
  valueColor?: string;
  extraActions?: ReactNode;
}) {
  return (
    <div>
      <p className="text-xs mb-1" style={{ color: C.muted }}>{label}</p>
      <div className="flex items-center gap-1.5 flex-wrap">
        <p className="text-sm break-all" style={{ color: valueColor ?? C.text, userSelect: "text" }}>{value}</p>
        <FieldActionButton onClick={onCopy} label={copyLabel}>
          <Copy size={12} />
        </FieldActionButton>
        {extraActions}
      </div>
    </div>
  );
}

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
  { key: "internal_notes",     header: "internal_notes" },
  { key: "next_follow_up_at",  header: "next_follow_up_at" },
  { key: "lost_reason",        header: "lost_reason" },
  { key: "estimated_value",    header: "estimated_value" },
  { key: "quoted_value",       header: "quoted_value" },
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

const FOLLOW_UP_FILTERS: { key: FollowUpFilter; labelKey: "followUpAll" | "followUpDueToday" | "followUpOverdue" | "followUpNone" }[] = [
  { key: "all",        labelKey: "followUpAll" },
  { key: "dueToday",   labelKey: "followUpDueToday" },
  { key: "overdue",    labelKey: "followUpOverdue" },
  { key: "noFollowUp", labelKey: "followUpNone" },
];

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

function formatMoney(value: number | null): string {
  return `QAR ${value!.toLocaleString()}`;
}

function FollowUpIndicator({ r, lang }: { r: ProductRequest; lang: Lang }) {
  if (!r.next_follow_up_at) {
    if (hasNoFollowUp(r.next_follow_up_at, r.status)) {
      return (
        <span className="inline-flex items-center gap-1 text-xs" style={{ color: C.muted }}>
          <Calendar size={11} /> {t("followUpNone", lang)}
        </span>
      );
    }
    return null;
  }
  const overdue = isOverdue(r.next_follow_up_at, r.status);
  const dueToday = isDueToday(r.next_follow_up_at);
  const color = overdue ? C.danger : dueToday ? C.warning : C.muted;
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium" style={{ color }}>
      {overdue ? <AlertCircle size={11} /> : <Calendar size={11} />}
      {new Date(r.next_follow_up_at).toLocaleDateString()}
    </span>
  );
}

export function RequestsTab({ lang }: { lang: Lang }) {
  const [requests, setRequests] = useState<ProductRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [businessTypeFilter, setBusinessTypeFilter] = useState<string>("all");
  const [followUpFilter, setFollowUpFilter] = useState<FollowUpFilter>("all");
  const [salesDetailsRequest, setSalesDetailsRequest] = useState<ProductRequest | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("product_requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("[RequestsTab] product_requests SELECT error:", error);
      setLoadError(true);
    } else {
      setLoadError(false);
    }
    setRequests(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  function showFeedback(type: "success" | "error", message: string) {
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    setFeedback({ type, message });
    feedbackTimer.current = setTimeout(() => setFeedback(null), 3500);
  }

  async function handleCopy(value: string) {
    const ok = await copyToClipboard(value);
    showFeedback(ok ? "success" : "error", t(ok ? "copied" : "copyError", lang));
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

  function handleSalesDetailsSaved(updated: ProductRequest) {
    setRequests((prev) => prev.map((r) => r.id === updated.id ? updated : r));
    setSalesDetailsRequest(null);
    showFeedback("success", t("saveDetailsSuccess", lang));
  }

  const businessTypeOptions = Array.from(
    new Set(requests.map((r) => r.business_type).filter((v): v is string => !!v))
  ).sort();

  const filtered = requests.filter((r) =>
    matchesSearch(r, search) &&
    (statusFilter === "all" || normalizedRequestStatus(r.status) === statusFilter) &&
    (businessTypeFilter === "all" || r.business_type === businessTypeFilter) &&
    matchesFollowUpFilter(r, followUpFilter)
  );

  const statusCounts = { new: 0, contacted: 0, quoted: 0, won: 0, lost: 0 };
  for (const r of requests) statusCounts[normalizedRequestStatus(r.status)]++;

  const followUpCounts: Record<FollowUpFilter, number> = {
    all: requests.length,
    dueToday: requests.filter((r) => isDueToday(r.next_follow_up_at)).length,
    overdue: requests.filter((r) => isOverdue(r.next_follow_up_at, r.status)).length,
    noFollowUp: requests.filter((r) => hasNoFollowUp(r.next_follow_up_at, r.status)).length,
  };

  const filtersActive = search !== "" || statusFilter !== "all" || businessTypeFilter !== "all" || followUpFilter !== "all";

  function clearFilters() {
    setSearch("");
    setStatusFilter("all");
    setBusinessTypeFilter("all");
    setFollowUpFilter("all");
  }

  const inp = inputStyle();

  return (
    <div>
      <SectionHeader
        title={t("quoteReqs", lang)}
        count={filtered.length}
        icon={<ClipboardList size={15} />}
        actions={
          <button onClick={() => exportRequestsCsv(filtered)} disabled={filtered.length === 0}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-40"
            style={{ background: C.action, color: "#FFFFFF" }}>
            <Download size={14} /> {t("exportCsv", lang)}
          </button>
        }
      />

      {!loading && requests.length > 0 && (
        <div className="mb-5">
          <BentoGrid>
            <MetricCard label={t("totalRequests", lang)} value={requests.length} accent={C.brand} icon={<ClipboardList size={16} />} size="hero" />
            <MetricCard label={t("newBadge", lang)} value={statusCounts.new} accent={C.warning} icon={<ClipboardList size={16} />} />
            <MetricCard label={t("contacted", lang)} value={statusCounts.contacted} accent={C.info} icon={<ClipboardList size={16} />} />
            <MetricCard label={t("quoted", lang)} value={statusCounts.quoted} accent={C.warning} icon={<ClipboardList size={16} />} />
            <MetricCard label={t("won", lang)} value={statusCounts.won} accent={C.success} icon={<ClipboardList size={16} />} />
            <MetricCard label={t("lost", lang)} value={statusCounts.lost} accent={C.danger} icon={<ClipboardList size={16} />} />
          </BentoGrid>
        </div>
      )}

      {loadError && <div className="mb-5"><ErrorState message={t("loadError", lang)} /></div>}

      {feedback && (
        <div className="mb-4 px-3 py-2 rounded-lg text-sm" style={
          feedback.type === "success"
            ? { background: "#22C55E15", color: C.success, border: "1px solid #22C55E30" }
            : { background: "#EF444415", color: C.danger, border: "1px solid #EF444430" }
        }>
          {feedback.message}
        </div>
      )}

      <Toolbar className="!mb-3">
        {FOLLOW_UP_FILTERS.map((f) => {
          const accent = f.key === "overdue" ? C.danger : f.key === "dueToday" ? C.warning : C.action;
          return (
            <ToolbarChip key={f.key} active={followUpFilter === f.key} accent={accent} onClick={() => setFollowUpFilter(f.key)}>
              {t(f.labelKey, lang)} · {followUpCounts[f.key]}
            </ToolbarChip>
          );
        })}
      </Toolbar>

      <Toolbar>
        <div className="grid sm:grid-cols-4 gap-3 flex-1 w-full">
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
          <button onClick={clearFilters} className="px-3 py-1.5 rounded-lg text-xs font-medium shrink-0"
            style={{ background: C.surface2, color: C.muted, border: `1px solid ${C.border}` }}>
            {t("clearFilters", lang)}
          </button>
        )}
      </Toolbar>

      {loading ? (
        <LoadingState />
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
                  <FollowUpIndicator r={r} lang={lang} />
                  {r.estimated_value != null && (
                    <span className="text-xs" style={{ color: C.muted }}>{t("estimatedValue", lang)}: {formatMoney(r.estimated_value)}</span>
                  )}
                  {r.quoted_value != null && (
                    <span className="text-xs font-medium" style={{ color: C.warning }}>{t("quotedValue", lang)}: {formatMoney(r.quoted_value)}</span>
                  )}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs" style={{ color: C.muted }}>{new Date(r.created_at).toLocaleDateString()}</span>
                  <ChevronDown size={16} style={{ color: C.muted, transform: expanded === r.id ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
                </div>
              </button>

              {expanded === r.id && (
                <div className="px-4 pb-4 space-y-3" style={{ borderTop: `1px solid ${C.border}` }}>
                  <div className="grid sm:grid-cols-2 gap-3 pt-3">
                    <CopyableField
                      label={t("fullName", lang)}
                      value={r.customer_name}
                      copyLabel={t("copyName", lang)}
                      onCopy={() => handleCopy(r.customer_name)}
                    />
                    <CopyableField
                      label={t("email", lang)}
                      value={r.email}
                      copyLabel={t("copyEmail", lang)}
                      valueColor={C.action}
                      onCopy={() => handleCopy(r.email)}
                      extraActions={
                        <a href={`mailto:${r.email}`} onClick={(e) => e.stopPropagation()}
                          title={t("sendEmail", lang)} aria-label={t("sendEmail", lang)}
                          className="inline-flex items-center justify-center w-6 h-6 rounded shrink-0 transition-colors"
                          style={{ color: C.muted, background: C.surface2, border: `1px solid ${C.border}` }}>
                          <Mail size={12} />
                        </a>
                      }
                    />
                    {r.phone && (
                      <CopyableField
                        label={t("phone", lang)}
                        value={r.phone}
                        copyLabel={t("copyPhone", lang)}
                        onCopy={() => handleCopy(r.phone!)}
                        extraActions={
                          <a href={toWhatsAppLink(r.phone)} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                            title={t("openWhatsapp", lang)} aria-label={t("openWhatsapp", lang)}
                            className="inline-flex items-center justify-center w-6 h-6 rounded shrink-0 transition-colors"
                            style={{ color: C.success, background: C.surface2, border: `1px solid ${C.border}` }}>
                            <MessageCircle size={12} />
                          </a>
                        }
                      />
                    )}
                    {r.company_name && (
                      <CopyableField
                        label={t("companyName", lang)}
                        value={r.company_name}
                        copyLabel={t("copyCompany", lang)}
                        onCopy={() => handleCopy(r.company_name!)}
                      />
                    )}
                    {r.city && (
                      <CopyableField
                        label={t("city", lang)}
                        value={r.city}
                        copyLabel={t("copyCity", lang)}
                        onCopy={() => handleCopy(r.city!)}
                      />
                    )}
                    {r.business_type && (
                      <div>
                        <p className="text-xs mb-1" style={{ color: C.muted }}>{t("businessType", lang)}</p>
                        <p className="text-sm" style={{ color: C.text, userSelect: "text" }}>{r.business_type}</p>
                      </div>
                    )}
                    {r.notes && (
                      <div className="sm:col-span-2">
                        <p className="text-xs mb-1" style={{ color: C.muted }}>{t("notes", lang)}</p>
                        <p className="text-sm leading-relaxed" style={{ color: C.text, userSelect: "text" }}>{r.notes}</p>
                      </div>
                    )}
                    {normalizedRequestStatus(r.status) === "lost" && r.lost_reason && (
                      <div className="sm:col-span-2">
                        <p className="text-xs mb-1" style={{ color: C.danger }}>{t("lostReason", lang)}</p>
                        <p className="text-sm leading-relaxed" style={{ color: C.text, userSelect: "text" }}>{r.lost_reason}</p>
                      </div>
                    )}
                    {r.internal_notes && (
                      <div className="sm:col-span-2">
                        <p className="text-xs mb-1" style={{ color: C.muted }}>{t("internalNotes", lang)}</p>
                        <p className="text-sm leading-relaxed" style={{ color: C.text, userSelect: "text" }}>{r.internal_notes}</p>
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
                            style={{ background: "#1565A015", color: C.info, border: "1px solid #1565A030" }}>
                            <Check size={12} /> {t("markContacted", lang)}
                          </button>
                          <button onClick={() => updateStatus(r.id, "quoted")} disabled={current === "quoted"}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium disabled:opacity-40"
                            style={{ background: "#D4AF3715", color: C.warning, border: "1px solid #D4AF3730" }}>
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
                    <button onClick={() => setSalesDetailsRequest(r)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium"
                      style={{ background: C.actionDim, color: C.actionHi, border: `1px solid ${C.action}55` }}>
                      <ClipboardList size={12} /> {t("salesDetails", lang)}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {salesDetailsRequest && (
        <SalesDetailsModal
          lang={lang}
          request={salesDetailsRequest}
          onClose={() => setSalesDetailsRequest(null)}
          onSaved={handleSalesDetailsSaved}
        />
      )}
    </div>
  );
}
