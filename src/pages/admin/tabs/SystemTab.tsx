import type { ReactNode } from "react";
import { Globe, Tag, Database, ShieldCheck, ClipboardList } from "lucide-react";
import { C } from "@/components/admin/theme";
import type { Lang } from "@/components/admin/theme";
import { t } from "@/components/admin/i18n";
import { StatusBadge } from "@/components/admin/StatusBadge";

function InfoRow({ icon, label, value, valueAccent }: { icon: ReactNode; label: string; value: ReactNode; valueAccent?: boolean }) {
  return (
    <div className="flex items-start gap-4 py-4" style={{ borderBottom: `1px solid ${C.border}` }}>
      <div className="flex items-center justify-center w-9 h-9 rounded-lg shrink-0" style={{ background: C.surface2, color: C.action }}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: C.muted }}>{label}</p>
        <p className="text-sm" style={{ color: valueAccent ? C.action : C.text }}>{value}</p>
      </div>
    </div>
  );
}

export function SystemTab({ lang }: { lang: Lang }) {
  return (
    <div className="rounded-2xl p-6" style={{ background: C.surface, border: `1px solid ${C.border}`, maxWidth: 640 }}>
      <h2 className="text-lg font-bold mb-1" style={{ color: C.text }}>{t("systemTitle", lang)}</h2>
      <p className="text-sm mb-2" style={{ color: C.muted }}>{t("systemSubtitle", lang)}</p>

      <div>
        <InfoRow
          icon={<Globe size={16} />}
          label={t("publicSiteStatus", lang)}
          value={<StatusBadge color="green">{t("live", lang)}</StatusBadge>}
        />
        <InfoRow
          icon={<Tag size={16} />}
          label={t("dashboardVersion", lang)}
          value="V2 Lite"
        />
        <InfoRow
          icon={<Database size={16} />}
          label={t("dataSource", lang)}
          value="Supabase"
        />
        <InfoRow
          icon={<ShieldCheck size={16} />}
          label={t("productRlsLabel", lang)}
          value={t("productRlsValue", lang)}
        />
        <InfoRow
          icon={<ClipboardList size={16} />}
          label={t("quoteRlsLabel", lang)}
          value={t("quoteRlsValue", lang)}
        />
      </div>
    </div>
  );
}
