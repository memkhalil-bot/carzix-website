import { Link } from "wouter";
import { Phone, Mail, MapPin } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";

export default function Footer() {
  const { t } = useLang();

  const categories = [
    { label: t("Shampoos & Washing", "الشامبوهات والغسيل") },
    { label: t("Polishing & Waxing", "التلميع والشمع") },
    { label: t("Glass Care", "عناية الزجاج") },
    { label: t("Interior Care", "العناية الداخلية") },
    { label: t("Multi-Purpose Cleaners", "منظفات متعددة الأغراض") },
    { label: t("Tire Care", "عناية الكفرات") },
  ];

  return (
    <footer className="bg-zinc-950 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded bg-[#8A1538] flex items-center justify-center">
                <span className="text-white font-black text-xs">CZ</span>
              </div>
              <span className="text-white font-black text-lg tracking-widest uppercase">CARZIX</span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-5">
              {t(
                "Qatar's premier car care products store. Professional-grade solutions for automotive perfection.",
                "المتجر الرائد لمنتجات العناية بالسيارات في قطر. حلول احترافية لكمال السيارات."
              )}
            </p>
            <div className="flex gap-3">
              {["I", "T", "L"].map((s, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 rounded border border-white/10 flex items-center justify-center text-white/40 hover:text-[#A29475] hover:border-[#A29475]/40 transition-colors text-xs font-bold"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">
              {t("Navigation", "التنقل")}
            </h3>
            <ul className="space-y-2">
              {[
                { href: "/", label: t("Home", "الرئيسية") },
                { href: "/products", label: t("Products", "المنتجات") },
                { href: "/about", label: t("About Us", "من نحن") },
                { href: "/contact", label: t("Contact", "اتصل بنا") },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-white/50 hover:text-[#A29475] text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">
              {t("Categories", "الفئات")}
            </h3>
            <ul className="space-y-2">
              {categories.map(({ label }) => (
                <li key={label}>
                  <Link href="/products" className="text-white/50 hover:text-[#A29475] text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">
              {t("Contact", "تواصل معنا")}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Phone size={14} className="text-[#8A1538] shrink-0" />
                <a href="tel:+97472252572" className="text-white/50 hover:text-white text-sm transition-colors">
                  +974 72252572
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={14} className="text-[#8A1538] shrink-0" />
                <a href="mailto:hello@carzix.qa" className="text-white/50 hover:text-white text-sm transition-colors">
                  hello@carzix.qa
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={14} className="text-[#8A1538] shrink-0 mt-0.5" />
                <span className="text-white/50 text-sm">{t("Doha, Qatar", "الدوحة، قطر")}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} CARZIX. {t("All rights reserved.", "جميع الحقوق محفوظة.")}
          </p>
          <p className="text-white/30 text-xs">{t("Doha, Qatar", "الدوحة، قطر")}</p>
        </div>
      </div>
    </footer>
  );
}
