import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLang } from "@/contexts/LanguageContext";

export default function Navbar() {
  const { t, toggleLang, lang } = useLang();
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const links = [
    { href: "/", label: t("Home", "الرئيسية") },
    { href: "/products", label: t("Products", "المنتجات") },
    { href: "/about", label: t("About", "من نحن") },
    { href: "/contact", label: t("Contact", "اتصل بنا") },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-black/95 backdrop-blur-md border-b border-white/10" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded bg-[#8A1538] flex items-center justify-center">
              <span className="text-white font-black text-xs tracking-tight">CZ</span>
            </div>
            <span className="text-white font-black text-xl tracking-widest uppercase">
              CARZIX
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "text-sm font-medium tracking-wide transition-colors",
                  location === href ? "text-[#A29475]" : "text-white/70 hover:text-white"
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            {/* Language toggle */}
            <button
              onClick={toggleLang}
              className="px-3 py-1.5 border border-white/20 text-white/60 hover:text-white hover:border-white/40 text-xs font-semibold rounded tracking-widest transition-colors"
            >
              {lang === "en" ? "عربي" : "EN"}
            </button>
            <Link
              href="/contact"
              className="px-5 py-2.5 bg-[#8A1538] hover:bg-[#6b1029] text-white text-sm font-semibold rounded transition-colors"
            >
              {t("Request Quote", "طلب عرض سعر")}
            </Link>
          </div>

          {/* Mobile toggle */}
          <div className="lg:hidden flex items-center gap-3">
            <button
              onClick={toggleLang}
              className="px-2.5 py-1 border border-white/20 text-white/60 text-xs font-semibold rounded tracking-widest"
            >
              {lang === "en" ? "عربي" : "EN"}
            </button>
            <button
              className="text-white p-1"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-black/98 border-t border-white/10">
          <nav className="flex flex-col px-6 py-4 gap-1">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "py-3 text-sm font-medium border-b border-white/5 last:border-0 transition-colors",
                  location === href ? "text-[#A29475]" : "text-white/70"
                )}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="mt-3 px-5 py-3 bg-[#8A1538] text-white text-sm font-semibold rounded text-center"
            >
              {t("Request Quote", "طلب عرض سعر")}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
