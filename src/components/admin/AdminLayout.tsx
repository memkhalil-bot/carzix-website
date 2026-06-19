import type { ReactNode } from "react";
import { C } from "./theme";
import type { Lang } from "./theme";
import { t } from "./i18n";
import { AdminSidebar, type TabId } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";

interface AdminLayoutProps {
  lang: Lang;
  setLang: (l: Lang) => void;
  tab: TabId;
  setTab: (id: TabId) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
  onLogout: () => void;
  children: ReactNode;
}

export function AdminLayout({
  lang, setLang, tab, setTab, mobileOpen, setMobileOpen, onLogout, children,
}: AdminLayoutProps) {
  const isRTL = lang === "ar";

  return (
    <div className="min-h-screen flex" style={{ background: C.bg, color: C.text }} dir={isRTL ? "rtl" : "ltr"}>
      <AdminSidebar lang={lang} tab={tab} setTab={setTab} onLogout={onLogout} />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          lang={lang}
          setLang={setLang}
          title={t(tab, lang)}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          onLogout={onLogout}
        />

        {mobileOpen && (
          <AdminSidebar
            lang={lang}
            tab={tab}
            setTab={(id) => { setTab(id); setMobileOpen(false); }}
            onLogout={onLogout}
            variant="mobile"
          />
        )}

        <main className="flex-1 overflow-y-auto p-5 lg:p-7">{children}</main>
      </div>
    </div>
  );
}
