import {
  LayoutDashboard, Package, Users, MessageSquare, ClipboardList, Settings, LogOut,
} from "lucide-react";
import { C } from "./theme";
import type { Lang } from "./theme";
import { t, T } from "./i18n";

export const NAV_IDS = ["overview", "requests", "products", "clients", "messages", "system"] as const;
export type TabId = typeof NAV_IDS[number];

const NAV_ICONS: Record<TabId, React.ElementType> = {
  overview: LayoutDashboard,
  requests: ClipboardList,
  products: Package,
  clients:  Users,
  messages: MessageSquare,
  system:   Settings,
};

const NAV_LABEL_KEYS: Record<TabId, keyof typeof T> = {
  overview: "overview",
  requests: "requests",
  products: "products",
  clients:  "clients",
  messages: "messages",
  system:   "system",
};

const NAV_GROUPS: { titleKey: keyof typeof T; ids: TabId[] }[] = [
  { titleKey: "navWorkspace", ids: ["overview", "requests", "products"] },
  { titleKey: "navMore",      ids: ["clients", "messages", "system"] },
];

function NavButton({
  id, lang, active, onClick,
}: { id: TabId; lang: Lang; active: boolean; onClick: () => void }) {
  const Icon = NAV_ICONS[id];
  const isRTL = lang === "ar";
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isRTL ? "flex-row-reverse text-right" : "text-left"}`}
      style={
        active
          ? { background: C.actionDim, color: C.action, border: `1px solid #0F4C7540` }
          : { color: C.muted, border: "1px solid transparent" }
      }
      onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = C.surface2; }}
      onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
    >
      <Icon size={16} />
      {t(NAV_LABEL_KEYS[id], lang)}
    </button>
  );
}

interface AdminSidebarProps {
  lang: Lang;
  tab: TabId;
  setTab: (id: TabId) => void;
  onLogout: () => void;
  variant?: "desktop" | "mobile";
}

export function AdminSidebar({ lang, tab, setTab, onLogout, variant = "desktop" }: AdminSidebarProps) {
  const isRTL = lang === "ar";

  const nav = (
    <nav className="flex-1 p-3 space-y-5 overflow-y-auto">
      {NAV_GROUPS.map((group) => (
        <div key={group.titleKey}>
          <p
            className={`text-[10px] font-bold uppercase tracking-widest mb-2 px-3 ${isRTL ? "text-right" : "text-left"}`}
            style={{ color: C.mutedDim }}
          >
            {t(group.titleKey, lang)}
          </p>
          <div className="space-y-0.5">
            {group.ids.map((id) => (
              <NavButton key={id} id={id} lang={lang} active={tab === id} onClick={() => setTab(id)} />
            ))}
          </div>
        </div>
      ))}
    </nav>
  );

  if (variant === "mobile") {
    return (
      <div className="lg:hidden p-3" style={{ background: C.sidebar, borderBottom: `1px solid ${C.border}` }}>
        {nav}
      </div>
    );
  }

  return (
    <aside
      className="hidden lg:flex flex-col w-60 shrink-0"
      style={{
        background: C.sidebar,
        borderRight: isRTL ? "none" : `1px solid ${C.border}`,
        borderLeft:  isRTL ? `1px solid ${C.border}` : "none",
        order: isRTL ? 1 : 0,
      }}
    >
      {/* Logo */}
      <div className="p-5" style={{ borderBottom: `1px solid ${C.border}` }}>
        <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
          <div className="w-7 h-7 rounded flex items-center justify-center shrink-0" style={{ background: C.brand }}>
            <span className="text-white font-black text-xs">CZ</span>
          </div>
          <span className="font-black tracking-widest text-sm uppercase" style={{ color: C.text }}>CARZIX</span>
        </div>
        <p className="text-xs mt-1 tracking-wider" style={{ color: C.muted }}>
          {t("adminPanel", lang)}
        </p>
      </div>

      {nav}

      {/* Logout */}
      <div className="p-3" style={{ borderTop: `1px solid ${C.border}` }}>
        <button
          onClick={onLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isRTL ? "flex-row-reverse text-right" : "text-left"}`}
          style={{ color: C.muted }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "#FCA5A5"; e.currentTarget.style.background = C.surface2; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = C.muted; e.currentTarget.style.background = "transparent"; }}
        >
          <LogOut size={16} /> {t("logout", lang)}
        </button>
      </div>
    </aside>
  );
}
