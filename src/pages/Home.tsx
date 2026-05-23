import { Link } from "wouter";
import { motion } from "framer-motion";
import { Sparkles, Shield, Clock, Star, ChevronRight, Phone } from "lucide-react";
import ClientsSlider from "@/components/ClientsSlider";
import { fadeUp, staggerSlow as stagger } from "@/lib/motion";

/* ── Inline SVG: abstract car-wash illustration ── */
function CarArt() {
  return (
    <svg
      viewBox="0 0 600 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden="true"
    >
      {/* Glow rings */}
      <circle cx="300" cy="220" r="200" stroke="#8A1538" strokeWidth="0.8" opacity="0.18" />
      <circle cx="300" cy="220" r="155" stroke="#A29475" strokeWidth="0.5" opacity="0.12" />

      {/* Car chassis */}
      <rect x="70" y="225" width="460" height="52" rx="18" fill="#111" />
      {/* Car body */}
      <path
        d="M 105 225 C 140 225 165 165 235 152 C 280 144 355 141 415 152 C 465 162 495 198 515 225 Z"
        fill="#1A1A1A"
      />
      {/* Window area */}
      <path
        d="M 170 220 C 188 220 208 172 238 162 C 268 153 353 150 390 160 C 418 168 440 196 450 220 Z"
        fill="#0D0D0D"
      />
      {/* Window divider */}
      <line x1="308" y1="153" x2="304" y2="220" stroke="#2a2a2a" strokeWidth="2" />
      {/* Roof shine */}
      <path d="M 195 158 C 265 144 360 141 415 152" stroke="#A29475" strokeWidth="1.5" opacity="0.35" strokeLinecap="round" />
      {/* Front grille accent */}
      <rect x="515" y="232" width="16" height="28" rx="4" fill="#8A1538" opacity="0.9" />
      {/* Rear light */}
      <rect x="69" y="232" width="12" height="22" rx="3" fill="#8A1538" opacity="0.45" />

      {/* Front wheel */}
      <circle cx="430" cy="277" r="42" fill="#0A0A0A" stroke="#252525" strokeWidth="3" />
      <circle cx="430" cy="277" r="28" fill="#111" stroke="#333" strokeWidth="2" />
      <circle cx="430" cy="277" r="9" fill="#A29475" opacity="0.4" />
      {/* Rear wheel */}
      <circle cx="170" cy="277" r="42" fill="#0A0A0A" stroke="#252525" strokeWidth="3" />
      <circle cx="170" cy="277" r="28" fill="#111" stroke="#333" strokeWidth="2" />
      <circle cx="170" cy="277" r="9" fill="#A29475" opacity="0.4" />

      {/* Ground reflection */}
      <ellipse cx="300" cy="319" rx="225" ry="12" fill="#8A1538" opacity="0.06" />
      <line x1="70" y1="320" x2="530" y2="320" stroke="#1a1a1a" strokeWidth="1" />

      {/* Water droplets */}
      <path d="M 185 22 Q 188 8 188 0 L 194 16 Q 188 30 185 22 Z" fill="#A29475" opacity="0.65" />
      <path d="M 265 38 Q 268 24 268 16 L 274 32 Q 268 46 265 38 Z" fill="#A29475" opacity="0.5" />
      <path d="M 355 12 Q 358 -2 358 -10 L 364 6 Q 358 20 355 12 Z" fill="#8A1538" opacity="0.55" />
      <path d="M 435 28 Q 438 14 438 6 L 444 22 Q 438 36 435 28 Z" fill="#A29475" opacity="0.6" />
      <path d="M 310 55 Q 313 41 313 33 L 319 49 Q 313 63 310 55 Z" fill="#A29475" opacity="0.4" />
      <path d="M 145 45 Q 148 31 148 23 L 154 39 Q 148 53 145 45 Z" fill="#A29475" opacity="0.5" />
      <path d="M 495 18 Q 498 4 498 -4 L 504 12 Q 498 26 495 18 Z" fill="#8A1538" opacity="0.35" />
      <path d="M 510 68 Q 513 54 513 46 L 519 62 Q 513 76 510 68 Z" fill="#A29475" opacity="0.4" />

      {/* Water ripples on roof */}
      <ellipse cx="295" cy="162" rx="28" ry="7" stroke="#A29475" strokeWidth="0.8" opacity="0.25" fill="none" />
      <ellipse cx="345" cy="155" rx="18" ry="4.5" stroke="#A29475" strokeWidth="0.5" opacity="0.18" fill="none" />

      {/* Sparkles */}
      <g transform="translate(110,92)" opacity="0.75">
        <line x1="0" y1="-7" x2="0" y2="7" stroke="#A29475" strokeWidth="1.5" />
        <line x1="-7" y1="0" x2="7" y2="0" stroke="#A29475" strokeWidth="1.5" />
        <line x1="-4" y1="-4" x2="4" y2="4" stroke="#A29475" strokeWidth="0.7" opacity="0.5" />
        <line x1="4" y1="-4" x2="-4" y2="4" stroke="#A29475" strokeWidth="0.7" opacity="0.5" />
      </g>
      <g transform="translate(478,108)" opacity="0.6">
        <line x1="0" y1="-5" x2="0" y2="5" stroke="#8A1538" strokeWidth="1.5" />
        <line x1="-5" y1="0" x2="5" y2="0" stroke="#8A1538" strokeWidth="1.5" />
      </g>
      <g transform="translate(345,48)" opacity="0.5">
        <line x1="0" y1="-4" x2="0" y2="4" stroke="#A29475" strokeWidth="1" />
        <line x1="-4" y1="0" x2="4" y2="0" stroke="#A29475" strokeWidth="1" />
      </g>
      <g transform="translate(550,180)" opacity="0.4">
        <line x1="0" y1="-6" x2="0" y2="6" stroke="#A29475" strokeWidth="1.2" />
        <line x1="-6" y1="0" x2="6" y2="0" stroke="#A29475" strokeWidth="1.2" />
      </g>
    </svg>
  );
}

const services = [
  {
    icon: Sparkles,
    title: "Full Detailing",
    desc: "Interior and exterior deep clean with premium products for a showroom finish.",
  },
  {
    icon: Shield,
    title: "Ceramic Coating",
    desc: "Long-lasting nano-ceramic protection that repels water, dirt, and UV damage.",
  },
  {
    icon: Star,
    title: "Paint Correction",
    desc: "Multi-stage polishing to eliminate swirl marks, scratches, and oxidation.",
  },
];

const stats = [
  { value: "2,000+", label: "Vehicles Detailed" },
  { value: "5★", label: "Average Rating" },
  { value: "3+", label: "Years in Qatar" },
  { value: "100%", label: "Satisfaction Rate" },
];

export default function Home() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-black">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_50%,_rgba(138,21,56,0.18)_0%,_transparent_65%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_80%,_rgba(162,148,117,0.07)_0%,_transparent_55%)]" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-20 grid lg:grid-cols-2 gap-14 items-center">
          {/* Text */}
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.p
              variants={fadeUp}
              className="inline-flex items-center gap-2 text-[#A29475] text-xs font-semibold tracking-widest uppercase mb-5"
            >
              <span className="w-5 h-px bg-[#A29475]" />
              Qatar's Premium Car Care
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[0.95] tracking-tight mb-6"
            >
              YOUR CAR.
              <br />
              <span className="text-[#8A1538]">PERFECTED.</span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="text-white/55 text-lg max-w-md mb-10 leading-relaxed"
            >
              Professional detailing, ceramic coating, and paint correction services
              in Doha. We treat every vehicle as a work of art.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="px-7 py-4 bg-[#8A1538] hover:bg-[#6b1029] text-white font-semibold rounded transition-colors flex items-center gap-2"
              >
                Book a Service <ChevronRight size={16} />
              </Link>
              <Link
                href="/services"
                className="px-7 py-4 border border-white/20 hover:border-white/40 text-white/80 hover:text-white font-semibold rounded transition-colors"
              >
                Explore Services
              </Link>
            </motion.div>

            <motion.a
              variants={fadeUp}
              href="tel:+97472252572"
              className="inline-flex items-center gap-2 mt-8 text-white/40 hover:text-[#A29475] text-sm transition-colors"
            >
              <Phone size={14} />
              +974 72252572
            </motion.a>
          </motion.div>

          {/* SVG illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
            className="hidden lg:block"
          >
            <CarArt />
          </motion.div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent" />
      </section>

      {/* ── Services preview ── */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="text-center mb-14"
          >
            <motion.p variants={fadeUp} className="text-[#A29475] text-xs font-semibold tracking-widest uppercase mb-3">
              What We Do
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl font-black text-white">
              Premium Services
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="grid md:grid-cols-3 gap-6"
          >
            {services.map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                className="group p-8 rounded-xl border border-white/8 bg-white/3 hover:border-[#8A1538]/40 hover:bg-white/5 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-[#8A1538]/15 flex items-center justify-center mb-5 group-hover:bg-[#8A1538]/25 transition-colors">
                  <Icon size={22} className="text-[#8A1538]" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
                <p className="text-white/45 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center mt-10">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-[#A29475] hover:text-white text-sm font-medium transition-colors"
            >
              View all services <ChevronRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-20 bg-zinc-950 border-y border-white/8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map(({ value, label }) => (
              <motion.div key={label} variants={fadeUp} className="text-center">
                <div className="text-4xl font-black text-[#8A1538] mb-1">{value}</div>
                <div className="text-white/45 text-sm">{label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Why choose us ── */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="grid lg:grid-cols-2 gap-16 items-center"
          >
            <motion.div variants={fadeUp}>
              <p className="text-[#A29475] text-xs font-semibold tracking-widest uppercase mb-3">
                Why Carzix
              </p>
              <h2 className="text-4xl font-black text-white mb-6">
                The Standard of<br />Car Care in Qatar
              </h2>
              <p className="text-white/50 leading-relaxed mb-10">
                We combine professional-grade products, skilled technicians, and meticulous attention
                to detail to deliver results that exceed expectations — every single time.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-[#A29475] hover:text-white text-sm font-medium transition-colors"
              >
                Our story <ChevronRight size={15} />
              </Link>
            </motion.div>

            <motion.div variants={stagger} className="grid grid-cols-2 gap-4">
              {[
                { icon: Clock, title: "Flexible Scheduling", desc: "Book at a time that works for you. We come to your location." },
                { icon: Shield, title: "Guaranteed Results", desc: "Not satisfied? We'll make it right at no extra cost." },
                { icon: Sparkles, title: "Premium Products", desc: "We use only industry-leading brands and certified compounds." },
                { icon: Star, title: "Trained Specialists", desc: "Every technician is professionally trained and vetted." },
              ].map(({ icon: Icon, title, desc }) => (
                <motion.div
                  key={title}
                  variants={fadeUp}
                  className="p-5 rounded-xl border border-white/8 bg-white/3"
                >
                  <Icon size={18} className="text-[#8A1538] mb-3" />
                  <h4 className="text-white font-semibold text-sm mb-1.5">{title}</h4>
                  <p className="text-white/40 text-xs leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Clients slider ── */}
      <ClientsSlider />

      {/* ── CTA banner ── */}
      <section className="py-24 bg-[#8A1538] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,_rgba(0,0,0,0.35)_0%,_transparent_70%)]" />
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
          className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center"
        >
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-black text-white mb-4">
            Ready for a Flawless Finish?
          </motion.h2>
          <motion.p variants={fadeUp} className="text-white/70 mb-10 max-w-md mx-auto">
            Contact us today and let our specialists transform your vehicle.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/contact"
              className="px-8 py-4 bg-white text-[#8A1538] font-bold rounded hover:bg-white/90 transition-colors"
            >
              Get a Free Quote
            </Link>
            <a
              href="tel:+97472252572"
              className="px-8 py-4 border border-white/40 text-white font-semibold rounded hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              <Phone size={16} /> Call Now
            </a>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}
