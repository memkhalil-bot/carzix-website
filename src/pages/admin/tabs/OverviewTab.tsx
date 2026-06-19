import { useEffect, useState } from "react";
import { Loader2, ClipboardList, Inbox, PhoneCall, FileText, Trophy, XCircle, Package, Star } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { ProductRequest } from "@/lib/types";
import { C } from "@/components/admin/theme";
import type { Lang } from "@/components/admin/theme";
import { t } from "@/components/admin/i18n";
import { MetricCard } from "@/components/admin/MetricCard";
import { StatusBadge, type BadgeColor } from "@/components/admin/StatusBadge";
import { normalizedRequestStatus, statusBadgeColor } from "../requestStatus";

function mostRequestedProduct(requests: ProductRequest[]): { name: string; count: number } | null {
  const counts = new Map<string, number>();
  for (const r of requests) {
    if (!r.product_name) continue;
    counts.set(r.product_name, (counts.get(r.product_name) ?? 0) + 1);
  }
  let best: { name: string; count: number } | null = null;
  for (const [name, count] of counts) {
    if (!best || count > best.count) best = { name, count };
  }
  return best;
}

const PIPELINE_STAGES: { key: "new" | "contacted" | "quoted" | "won" | "lost"; labelKey: "newBadge" | "contacted" | "quoted" | "won" | "lost"; color: BadgeColor }[] = [
  { key: "new",       labelKey: "newBadge",  color: "yellow" },
  { key: "contacted", labelKey: "contacted", color: "blue" },
  { key: "quoted",    labelKey: "quoted",    color: "yellow" },
  { key: "won",       labelKey: "won",       color: "green" },
  { key: "lost",      labelKey: "lost",      color: "red" },
];

const PIPELINE_BAR_COLOR: Record<string, string> = {
  new: C.warning, contacted: C.info, quoted: C.warning, won: C.success, lost: C.danger,
};

export function OverviewTab({ lang, requests, loading }: { lang: Lang; requests: ProductRequest[]; loading: boolean }) {
  const [activeProducts, setActiveProducts] = useState<number | null>(null);

  useEffect(() => {
    supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("status", "active")
      .then(({ count }) => setActiveProducts(count ?? 0));
  }, []);

  const total = requests.length;
  const byStatus = { new: 0, contacted: 0, quoted: 0, won: 0, lost: 0 };
  for (const r of requests) byStatus[normalizedRequestStatus(r.status)]++;
  const latest5 = requests.slice(0, 5);
  const topProduct = mostRequestedProduct(requests);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 size={28} style={{ color: C.action }} className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label={t("totalRequests", lang)}     value={total}              accent={C.action}  icon={<ClipboardList size={16} />} />
        <MetricCard label={t("newRequests", lang)}       value={byStatus.new}       accent={C.warning} icon={<Inbox size={16} />} />
        <MetricCard label={t("contactedRequests", lang)} value={byStatus.contacted} accent={C.info}    icon={<PhoneCall size={16} />} />
        <MetricCard label={t("quotedRequests", lang)}    value={byStatus.quoted}    accent={C.warning} icon={<FileText size={16} />} />
        <MetricCard label={t("wonRequests", lang)}       value={byStatus.won}       accent={C.success} icon={<Trophy size={16} />} />
        <MetricCard label={t("lostRequests", lang)}      value={byStatus.lost}      accent={C.danger}  icon={<XCircle size={16} />} />
        <MetricCard
          label={t("activeProducts", lang)}
          value={activeProducts ?? "…"}
          accent={C.action}
          icon={<Package size={16} />}
        />
        <MetricCard
          label={t("mostRequestedProduct", lang)}
          value={topProduct ? topProduct.name : "—"}
          sub={topProduct ? `${topProduct.count} ${t("productReqs", lang)}` : undefined}
          accent={C.action}
          icon={<Star size={16} />}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="rounded-2xl p-5" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          <p className="text-sm font-semibold mb-4" style={{ color: C.text }}>{t("latest5Requests", lang)}</p>
          {latest5.length === 0 ? (
            <p className="text-sm" style={{ color: C.muted }}>{t("noDataYet", lang)}</p>
          ) : (
            <div className="space-y-3">
              {latest5.map((r) => (
                <div key={r.id} className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: C.text }}>{r.customer_name}</p>
                    <p className="text-xs truncate" style={{ color: C.muted }}>{r.product_name ?? "—"}</p>
                  </div>
                  <StatusBadge color={statusBadgeColor(r.status)}>
                    {t(PIPELINE_STAGES.find((s) => s.key === normalizedRequestStatus(r.status))!.labelKey, lang)}
                  </StatusBadge>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl p-5" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          <p className="text-sm font-semibold mb-4" style={{ color: C.text }}>{t("pipelineSummary", lang)}</p>
          {total === 0 ? (
            <p className="text-sm" style={{ color: C.muted }}>{t("noDataYet", lang)}</p>
          ) : (
            <div className="space-y-3">
              <div className="flex h-2.5 rounded-full overflow-hidden" style={{ background: C.surface2 }}>
                {PIPELINE_STAGES.map((s) => {
                  const count = byStatus[s.key];
                  if (count === 0) return null;
                  return (
                    <div
                      key={s.key}
                      style={{ width: `${(count / total) * 100}%`, background: PIPELINE_BAR_COLOR[s.key] }}
                      title={`${t(s.labelKey, lang)}: ${count}`}
                    />
                  );
                })}
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {PIPELINE_STAGES.map((s) => (
                  <div key={s.key} className="flex items-center gap-1.5 text-xs" style={{ color: C.muted }}>
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: PIPELINE_BAR_COLOR[s.key] }} />
                    {t(s.labelKey, lang)} · {byStatus[s.key]}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
