import { Link } from "wouter";
import { Phone, Mail, MapPin, Instagram } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { trackEvent } from "@/lib/analytics";

export default function Footer() {
  const { t, isAr } = useLang();

  const categories = [
    { label: t("Shampoos & Washing", "الشامبوهات والغسيل") },
    { label: t("Polishing & Waxing", "التلميع والشمع") },
    { label: t("Glass Care", "عناية الزجاج") },
    { label: t("Interior Care", "العناية الداخلية") },
    { label: t("Multi-Purpose Cleaners", "منظفات متعددة الأغراض") },
    { label: t("Tire Care", "عناية الكفرات") },
  ];

  return (
    <footer className="bg-zinc-950 border-t border-white/8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-4 inline-block bg-white rounded-lg px-4 py-2.5">
              <img
                src={isAr ? "/logo-ar.png" : "/logo-en.png"}
                alt="CARZIX"
                className="h-11 w-auto block"
              />
            </div>
            <p className="text-white/45 text-sm leading-relaxed mb-5">
              {t(
                "Professional-grade automotive detailing and car care products for Qatar's detailing centers, dealerships, and automotive fleets.",
                "منتجات عناية وتلميع سيارات احترافية لكبرى مراكز التلميع والوكالات المعتمدة وأساطيل السيارات في دولة قطر."
              )}
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/carzix.qa/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="CARZIX on Instagram"
                className="w-9 h-9 rounded border border-white/10 flex items-center justify-center text-white/40 hover:text-[#A29475] hover:border-[#A29475]/40 hover:-translate-y-0.5 transition-all"
              >
                <Instagram size={16} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">
              {t("Navigation", "التنقل")}
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: "/", label: t("Home", "الرئيسية") },
                { href: "/products", label: t("Products", "المنتجات") },
                { href: "/about", label: t("About Us", "من نحن") },
                { href: "/partners", label: t("Become a Partner", "كن شريكاً") },
                { href: "/contact", label: t("Contact", "اتصل بنا") },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-white/45 hover:text-[#A29475] text-sm transition-colors">
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
            <ul className="space-y-2.5">
              {categories.map(({ label }) => (
                <li key={label}>
                  <Link href="/products" className="text-white/45 hover:text-[#A29475] text-sm transition-colors">
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
                <Phone size={13} className="text-[#A29475] shrink-0" />
                <a
                  href="tel:+97472252572"
                  dir="ltr"
                  style={{ unicodeBidi: "isolate" }}
                  onClick={() => trackEvent("click_contact_phone", { source_page: "footer" })}
                  className="text-white/45 hover:text-white text-sm transition-colors"
                >
                  +974 72252572
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={13} className="text-[#A29475] shrink-0" />
                <a
                  href="mailto:hello@carzix.qa"
                  dir="ltr"
                  style={{ unicodeBidi: "isolate" }}
                  onClick={() => trackEvent("click_contact_email", { source_page: "footer" })}
                  className="text-white/45 hover:text-white text-sm transition-colors"
                >
                  hello@carzix.qa
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={13} className="text-[#129B82] shrink-0 mt-0.5" />
                <span className="text-white/45 text-sm">{t("Doha, Qatar", "الدوحة، دولة قطر")}</span>
              </li>
              {isAr && (
                <li className="pt-1">
                  <p className="text-white/35 text-xs leading-relaxed">
                    المقر الرسمي للتوزيع والإمداد المباشر عبر الشريك الحصري: شركة الدوحة العالمية للتجارة.
                  </p>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/25 text-xs">
            © {new Date().getFullYear()} CARZIX. {t("All rights reserved.", "جميع الحقوق محفوظة.")}
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="text-white/25 hover:text-[#A29475] text-xs transition-colors">
              {t("Privacy Policy", "سياسة الخصوصية")}
            </Link>
            <Link href="/terms" className="text-white/25 hover:text-[#A29475] text-xs transition-colors">
              {t("Terms & Conditions", "الشروط والأحكام")}
            </Link>
            <p className="text-white/25 text-xs">{t("Doha, Qatar", "الدوحة، دولة قطر")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
