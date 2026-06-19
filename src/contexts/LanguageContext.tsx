import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { trackEvent } from "@/lib/analytics";

type Lang = "en" | "ar";

interface LanguageContextType {
  lang: Lang;
  isAr: boolean;
  toggleLang: () => void;
  t: (en: string, ar: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    return (localStorage.getItem("carzix-lang") as Lang) ?? "en";
  });

  useEffect(() => {
    localStorage.setItem("carzix-lang", lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLang = () =>
    setLang((l) => {
      const next = l === "en" ? "ar" : "en";
      trackEvent("switch_language", { from: l, to: next });
      return next;
    });
  const t = (en: string, ar: string) => (lang === "ar" ? ar : en);

  return (
    <LanguageContext.Provider value={{ lang, isAr: lang === "ar", toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}
