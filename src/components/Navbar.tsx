import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Instagram } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLang } from "@/contexts/LanguageContext";

export default function Navbar() {
  const { t, toggleLang, lang, isAr } = useLang();
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const links = [
    { href: "/", label: t("Home", "الرئيسية") },
    { href: "/products", label: t("Products", "المنتجات") },
    { href: "/about", label: t("About", "من نحن") },
    { href: "/partners", label: t("Partners", "الشراكات") },
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
        scrolled
          ? "bg-black/90 backdrop-blur-xl border-b border-white/8 shadow-[0_1px_24px_rgba(0,0,0,0.5)]"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <img
              src={isAr ? "/logo-ar.png" : "/logo-en.png"}
              alt="CARZIX"
              className="h-8 lg:h-9 w-auto"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "text-sm font-medium tracking-wide transition-colors",
                  location === href ? "text-[#A29475]" : "text-white/65 hover:text-white"
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            {/* Instagram social button */}
            <a
              href="https://www.instagram.com/carzix.qa/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="CARZIX on Instagram"
              className="group/social relative w-9 h-9 flex items-center justify-center rounded-full border border-white/12 text-white/50 hover:text-white hover:border-[#A29475]/50 hover:bg-[#A29475]/10 hover:scale-110 transition-all duration-300"
            >
              <Instagram size={16} />
              <span
                className="pointer-events-none absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black/95 border border-white/10 px-2.5 py-1 text-[11px] font-medium text-white/80 opacity-0 translate-y-1 group-hover/social:opacity-100 group-hover/social:translate-y-0 transition-all duration-200"
              >
                @carzix.qa
              </span>
            </a>
            {/* Language toggle */}
            <button
              onClick={toggleLang}
              className="px-3 py-1.5 border border-white/18 text-white/55 hover:text-white hover:border-white/35 text-xs font-semibold rounded tracking-widest transition-colors"
            >
              {lang === "en" ? "عربي" : "EN"}
            </button>
            <Link
              href="/contact"
              className="btn-cta px-5 py-2.5 text-[#111827] text-sm font-semibold rounded"
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
        <div className="lg:hidden bg-black/98 border-t border-white/8">
          <nav className="flex flex-col px-6 py-4 gap-1">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "py-3 text-sm font-medium border-b border-white/5 last:border-0 transition-colors",
                  location === href ? "text-[#A29475]" : "text-white/65"
                )}
              >
                {label}
              </Link>
            ))}
            <a
              href="https://www.instagram.com/carzix.qa/"
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 text-sm font-medium border-b border-white/5 text-white/65 flex items-center gap-2"
            >
              <Instagram size={15} /> <span dir="ltr" style={{ unicodeBidi: "isolate" }}>@carzix.qa</span>
            </a>
            <Link
              href="/contact"
              className="mt-3 px-5 py-3 btn-cta text-[#111827] text-sm font-semibold rounded text-center"
            >
              {t("Request Quote", "طلب عرض سعر")}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
