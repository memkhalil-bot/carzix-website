import { useEffect, useMemo, useState } from "react";
import { BarChart3, Eye, MousePointerClick, Send, MessageCircle, TrendingUp } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { C } from "@/components/admin/theme";
import type { Lang } from "@/components/admin/theme";
import { t } from "@/components/admin/i18n";
import { MetricCard } from "@/components/admin/MetricCard";
import { SectionHeader } from "@/components/admin/SectionHeader";
import { Toolbar, ToolbarChip } from "@/components/admin/Toolbar";
import { TableWrap, Th, Td, EmptyState, LoadingState, ErrorState } from "@/components/admin/AdminTable";

type RangeFilter = "7d" | "30d" | "all";

interface EventRow {
  event_name: string;
  product_name: string | null;
  created_at: string;
}

const RANGE_DAYS: Record<RangeFilter, number | null> = { "7d": 7, "30d": 30, all: null };

function rangeStartIso(range: RangeFilter): string | null {
  const days = RANGE_DAYS[range];
  if (days == null) return null;
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

function topByProduct(rows: EventRow[], eventName: string, limit = 5): { name: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const r of rows) {
    if (r.event_name !== eventName || !r.product_name) continue;
    counts.set(r.product_name, (counts.get(r.product_name) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export function AnalyticsTab({ lang }: { lang: Lang }) {
  const [range, setRange] = useState<RangeFilter>("7d");
  const [rows, setRows] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const since = rangeStartIso(range);
      let query = supabase
        .from("analytics_events")
        .select("event_name, product_name, created_at")
        .order("created_at", { ascending: false })
        .limit(5000);
      if (since) query = query.gte("created_at", since);
      const { data, error: err } = await query;
      if (cancelled) return;
      if (err) {
        console.error("[AnalyticsTab] analytics_events SELECT failed:", err);
        setError(true);
        setRows([]);
      } else {
        setError(false);
        setRows((data ?? []) as EventRow[]);
      }
      setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [range]);

  const counts = useMemo(() => {
    const byEvent: Record<string, number> = {};
    for (const r of rows) byEvent[r.event_name] = (byEvent[r.event_name] ?? 0) + 1;
    return byEvent;
  }, [rows]);

  const productViews = counts["product_view"] ?? 0;
  const quoteClicks = counts["quote_click"] ?? 0;
  const quoteSubmits = counts["quote_submit"] ?? 0;
  const whatsappClicks = counts["whatsapp_click"] ?? 0;
  const conversionRate = productViews > 0 ? (quoteSubmits / productViews) * 100 : 0;

  const topViewed = useMemo(() => topByProduct(rows, "product_view"), [rows]);
  const topRequested = useMemo(() => topByProduct(rows, "quote_submit"), [rows]);

  return (
    <div className="space-y-7">
      <SectionHeader
        title={t("analyticsTab", lang)}
        subtitle={t("analyticsSubtitle", lang)}
        icon={<BarChart3 size={15} />}
      />

      <Toolbar>
        <ToolbarChip active={range === "7d"} accent={C.action} onClick={() => setRange("7d")}>
          {t("last7Days", lang)}
        </ToolbarChip>
        <ToolbarChip active={range === "30d"} accent={C.action} onClick={() => setRange("30d")}>
          {t("last30Days", lang)}
        </ToolbarChip>
        <ToolbarChip active={range === "all"} accent={C.action} onClick={() => setRange("all")}>
          {t("allTime", lang)}
        </ToolbarChip>
      </Toolbar>

      {error && <ErrorState message={t("loadError", lang)} />}

      {loading ? (
        <LoadingState />
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <MetricCard label={t("totalEvents", lang)} value={rows.length} accent={C.action} icon={<BarChart3 size={16} />} />
            <MetricCard label={t("productViewsLabel", lang)} value={productViews} accent={C.info} icon={<Eye size={16} />} />
            <MetricCard label={t("quoteClicksLabel", lang)} value={quoteClicks} accent={C.warning} icon={<MousePointerClick size={16} />} />
            <MetricCard label={t("quoteSubmitsLabel", lang)} value={quoteSubmits} accent={C.success} icon={<Send size={16} />} />
            <MetricCard label={t("whatsappClicksLabel", lang)} value={whatsappClicks} accent={C.success} icon={<MessageCircle size={16} />} />
            <MetricCard label={t("conversionRate", lang)} value={`${conversionRate.toFixed(1)}%`} accent={C.success} icon={<TrendingUp size={16} />} />
          </div>

          <div className="grid lg:grid-cols-2 gap-5">
            <div>
              <SectionHeader title={t("topViewedProducts", lang)} className="mb-3" />
              {topViewed.length === 0 ? (
                <EmptyState message={t("noDataYet", lang)} />
              ) : (
                <TableWrap>
                  <thead>
                    <tr>
                      <Th lang={lang}>{t("name", lang)}</Th>
                      <Th lang={lang}>{t("productViewsLabel", lang)}</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {topViewed.map((p) => (
                      <tr key={p.name}>
                        <Td>{p.name}</Td>
                        <Td>{p.count}</Td>
                      </tr>
                    ))}
                  </tbody>
                </TableWrap>
              )}
            </div>

            <div>
              <SectionHeader title={t("topRequestedProducts", lang)} className="mb-3" />
              {topRequested.length === 0 ? (
                <EmptyState message={t("noDataYet", lang)} />
              ) : (
                <TableWrap>
                  <thead>
                    <tr>
                      <Th lang={lang}>{t("name", lang)}</Th>
                      <Th lang={lang}>{t("quoteSubmitsLabel", lang)}</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {topRequested.map((p) => (
                      <tr key={p.name}>
                        <Td>{p.name}</Td>
                        <Td>{p.count}</Td>
                      </tr>
                    ))}
                  </tbody>
                </TableWrap>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
