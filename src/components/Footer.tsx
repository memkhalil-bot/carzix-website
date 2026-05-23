import { Link } from "wouter";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded bg-[#8A1538] flex items-center justify-center">
                <span className="text-white font-black text-xs">CZ</span>
              </div>
              <span className="text-white font-black text-lg tracking-widest uppercase">CARZIX</span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              Qatar's premier car care specialists. Professional detailing and washing services for discerning vehicle owners.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Pages</h3>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Home" },
                { href: "/services", label: "Services" },
                { href: "/products", label: "Products" },
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-white/50 hover:text-[#A29475] text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Contact</h3>
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
                <span className="text-white/50 text-sm">Doha, Qatar</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} Carzix. All rights reserved.
          </p>
          <p className="text-white/30 text-xs">Doha, Qatar</p>
        </div>
      </div>
    </footer>
  );
}
