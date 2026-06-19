import { useState } from "react";
import { Menu, LogOut, ChevronDown, User } from "lucide-react";
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
  userEmail?: string | null;
}

function initialsFromEmail(email?: string | null): string {
  if (!email) return "A";
  const name = email.split("@")[0];
  return name.slice(0, 2).toUpperCase();
}

export function AdminHeader({ lang, setLang, title, mobileOpen, setMobileOpen, onLogout, userEmail }: AdminHeaderProps) {
  const isRTL = lang === "ar";
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-5 py-3 shrink-0"
      style={{ background: C.surface, borderBottom: `1px solid ${C.border}` }}
    >
      <div className={`flex items-center gap-3 min-w-0 ${isRTL ? "flex-row-reverse" : ""}`}>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-1.5 rounded shrink-0"
          style={{ color: C.muted }}
          aria-label="Toggle navigation"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-sm sm:text-base font-semibold truncate" style={{ color: C.text }}>{title}</h1>
      </div>

      <div className={`flex items-center gap-2 sm:gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
        <button
          onClick={() => setLang(lang === "ar" ? "en" : "ar")}
          className="px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider transition-colors"
          style={{ background: C.sidebar, color: C.text, border: `1px solid ${C.borderHi}` }}
        >
          {lang === "ar" ? "EN" : "AR"}
        </button>

        <span className="text-xs hidden md:block" style={{ color: C.muted }}>
          {new Date().toLocaleDateString(lang === "ar" ? "ar-SA" : "en-GB", {
            day: "numeric", month: "short", year: "numeric",
          })}
        </span>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className={`flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors ${isRTL ? "flex-row-reverse" : ""}`}
            style={{ background: menuOpen ? C.surface2 : "transparent", border: `1px solid ${menuOpen ? C.border : "transparent"}` }}
          >
            <span
              className="flex items-center justify-center w-7 h-7 rounded-full text-[10px] font-bold shrink-0"
              style={{ background: C.brand, color: "#000" }}
            >
              {initialsFromEmail(userEmail)}
            </span>
            <ChevronDown size={14} style={{ color: C.muted, transform: menuOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.15s" }} className="hidden sm:block" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
              <div
                className={`absolute z-50 mt-2 w-60 rounded-xl shadow-xl py-2 ${isRTL ? "left-0" : "right-0"}`}
                style={{ background: C.surface, border: `1px solid ${C.border}` }}
              >
                <div className="px-4 py-2.5" style={{ borderBottom: `1px solid ${C.border}` }}>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-1 flex items-center gap-1.5" style={{ color: C.mutedDim }}>
                    <User size={11} /> {t("myAccount", lang)}
                  </p>
                  <p className="text-xs truncate" style={{ color: C.text }}>
                    {userEmail ?? t("signedInAs", lang)}
                  </p>
                </div>
                <button
                  onClick={() => { setMenuOpen(false); onLogout(); }}
                  className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium transition-colors ${isRTL ? "flex-row-reverse text-right" : "text-left"}`}
                  style={{ color: C.danger }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#EF444412"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  <LogOut size={14} /> {t("logout", lang)}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
