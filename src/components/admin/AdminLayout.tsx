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
  userEmail?: string | null;
  children: ReactNode;
}

export function AdminLayout({
  lang, setLang, tab, setTab, mobileOpen, setMobileOpen, onLogout, userEmail, children,
}: AdminLayoutProps) {
  const isRTL = lang === "ar";
  const sideKey = isRTL ? "right" : "left";

  return (
    <div className="min-h-screen flex" style={{ background: C.bg, color: C.text }} dir={isRTL ? "rtl" : "ltr"}>
      <AdminSidebar lang={lang} tab={tab} setTab={setTab} onLogout={onLogout} />

      {/* Mobile drawer + backdrop */}
      <div
        className="lg:hidden fixed inset-0 z-50 transition-opacity duration-200"
        style={{
          background: "rgba(0,0,0,0.6)",
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? "auto" : "none",
        }}
        onClick={() => setMobileOpen(false)}
      />
      <div
        className="lg:hidden fixed top-0 bottom-0 z-50 w-72 max-w-[85vw] transition-transform duration-300 ease-in-out"
        style={{
          [sideKey]: 0,
          transform: mobileOpen ? "translateX(0)" : isRTL ? "translateX(100%)" : "translateX(-100%)",
          borderInlineEnd: `1px solid ${C.border}`,
        }}
      >
        <AdminSidebar
          lang={lang}
          tab={tab}
          setTab={(id) => { setTab(id); setMobileOpen(false); }}
          onLogout={onLogout}
          variant="mobile"
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          lang={lang}
          setLang={setLang}
          title={t(tab, lang)}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          onLogout={onLogout}
          userEmail={userEmail}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-5 lg:p-7">
          <div className="max-w-screen-2xl mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
