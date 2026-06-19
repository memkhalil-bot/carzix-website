import { Menu, LogOut } from "lucide-react";
import { C } from "./theme";
import type { Lang } from "./theme";
import { t } from "./i18n";

interface AdminHeaderProps {
  lang: Lang;
  setLang: (l: Lang) => void;
  title: string;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
  onLogout: () => void;
}

export function AdminHeader({ lang, setLang, title, mobileOpen, setMobileOpen, onLogout }: AdminHeaderProps) {
  const isRTL = lang === "ar";
  return (
    <header
      className="flex items-center justify-between px-5 py-3 shrink-0"
      style={{ background: C.surface, borderBottom: `1px solid ${C.border}` }}
    >
      <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-1.5 rounded"
          style={{ color: C.muted }}
        >
          <Menu size={20} />
        </button>
        <h1 className="text-sm font-semibold" style={{ color: C.text }}>{title}</h1>
      </div>

      <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
        <button
          onClick={() => setLang(lang === "ar" ? "en" : "ar")}
          className="px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider transition-colors"
          style={{ background: C.sidebar, color: C.text, border: `1px solid ${C.borderHi}` }}
        >
          {lang === "ar" ? "EN" : "AR"}
        </button>

        <span className="text-xs hidden sm:block" style={{ color: C.muted }}>
          {new Date().toLocaleDateString(lang === "ar" ? "ar-SA" : "en-GB", {
            day: "numeric", month: "short", year: "numeric",
          })}
        </span>

        <button
          onClick={onLogout}
          className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium"
          style={{ color: C.danger, background: "#EF444415", border: `1px solid #EF444430` }}
        >
          <LogOut size={13} /> {t("logout", lang)}
        </button>
      </div>
    </header>
  );
}
