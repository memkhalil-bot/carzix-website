import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  Droplets, Sparkles, Shield, Zap, Eye, Wind, ChevronRight, CheckCircle,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

const services = [
  {
    icon: Droplets,
    title: "Exterior Hand Wash",
    desc: "A thorough hand wash using pH-balanced shampoo, gentle microfiber mitts, and a streak-free rinse. Wheels, arches, and glass are cleaned individually.",
    features: ["pH-neutral shampoo", "Microfiber drying", "Wheel & arch clean", "Glass polish"],
  },
  {
    icon: Sparkles,
    title: "Full Interior Detailing",
    desc: "Deep cleaning of every interior surface — seats, carpets, dashboard, door panels, vents, and headliner — using steam and specialist cleaners.",
    features: ["Steam cleaning", "Leather conditioning", "Odor elimination", "Vent & trim detail"],
  },
  {
    icon: Shield,
    title: "Ceramic Coating",
    desc: "A professional-grade nano-ceramic layer that bonds to your paintwork for years of protection against UV, water spots, bird lime, and fine scratches.",
    features: ["9H hardness coating", "2–5 year protection", "Hydrophobic effect", "UV resistance"],
  },
  {
    icon: Zap,
    title: "Paint Correction",
    desc: "Multi-stage machine polishing to remove swirl marks, water spots, light scratches, and oxidation — restoring your paint to showroom clarity.",
    features: ["Swirl mark removal", "One-step polish", "Two-stage correction", "Paint depth check"],
  },
  {
    icon: Eye,
    title: "Headlight Restoration",
    desc: "Cloudy or yellowed headlights are wet-sanded, polished, and sealed to restore full clarity and improve road safety.",
    features: ["UV sealant applied", "Wet sanding", "Machine polish", "Before / after photos"],
  },
  {
    icon: Wind,
    title: "Engine Bay Detail",
    desc: "Careful degreasing, agitation, and rinse of the engine bay, followed by dressing of hoses and covers for a factory-fresh appearance.",
    features: ["Degreaser application", "Pressure rinse", "Trim dressing", "Safe for all engines"],
  },
];

const packages = [
  {
    name: "Essential",
    price: "From QAR 149",
    items: ["Exterior hand wash", "Wheel clean", "Interior vacuum", "Glass clean"],
    highlight: false,
  },
  {
    name: "Signature",
    price: "From QAR 399",
    items: [
      "Everything in Essential",
      "Full interior detail",
      "Engine bay clean",
      "Paint sealant",
      "Tyre dressing",
    ],
    highlight: true,
  },
  {
    name: "Elite",
    price: "From QAR 899",
    items: [
      "Everything in Signature",
      "Paint correction",
      "Ceramic coating",
      "Headlight restoration",
      "12-month protection plan",
    ],
    highlight: false,
  },
];

const steps = [
  { n: "01", title: "Book Online", desc: "Choose your service and preferred date via our contact form or call." },
  { n: "02", title: "We Arrive", desc: "Our team comes to your home, office, or preferred location in Doha." },
  { n: "03", title: "We Work", desc: "Every detail is handled with professional products and trained hands." },
  { n: "04", title: "You Drive", desc: "Inspect the result, and drive away in a perfectly detailed vehicle." },
];

export default function Services() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-36 pb-20 bg-black overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,_rgba(138,21,56,0.25)_0%,_transparent_60%)]" />
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center"
        >
          <motion.p variants={fadeUp} className="text-[#A29475] text-xs font-semibold tracking-widest uppercase mb-4">
            What We Offer
          </motion.p>
          <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl font-black text-white mb-5">
            Our Services
          </motion.h1>
          <motion.p variants={fadeUp} className="text-white/50 max-w-xl mx-auto text-lg">
            From a quick exterior wash to a full multi-day paint correction — every service is performed to the same uncompromising standard.
          </motion.p>
        </motion.div>
      </section>

      {/* Services grid */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {services.map(({ icon: Icon, title, desc, features }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                className="group flex flex-col p-8 rounded-xl border border-white/8 bg-white/3 hover:border-[#8A1538]/40 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-[#8A1538]/15 flex items-center justify-center mb-5 group-hover:bg-[#8A1538]/25 transition-colors">
                  <Icon size={22} className="text-[#8A1538]" />
                </div>
                <h3 className="text-white font-bold text-xl mb-3">{title}</h3>
                <p className="text-white/45 text-sm leading-relaxed mb-5 flex-1">{desc}</p>
                <ul className="space-y-1.5">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-white/50">
                      <CheckCircle size={12} className="text-[#8A1538] shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-zinc-950 border-y border-white/8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="text-center mb-14">
              <p className="text-[#A29475] text-xs font-semibold tracking-widest uppercase mb-3">Process</p>
              <h2 className="text-4xl font-black text-white">How It Works</h2>
            </motion.div>
            <div className="grid md:grid-cols-4 gap-6">
              {steps.map(({ n, title, desc }) => (
                <motion.div key={n} variants={fadeUp} className="text-center">
                  <div className="text-6xl font-black text-[#8A1538]/20 mb-3">{n}</div>
                  <h4 className="text-white font-bold mb-2">{title}</h4>
                  <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Packages */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="text-center mb-14">
              <p className="text-[#A29475] text-xs font-semibold tracking-widest uppercase mb-3">Packages</p>
              <h2 className="text-4xl font-black text-white">Choose Your Package</h2>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-6">
              {packages.map(({ name, price, items, highlight }) => (
                <motion.div
                  key={name}
                  variants={fadeUp}
                  className={`relative flex flex-col p-8 rounded-xl border transition-all ${
                    highlight
                      ? "border-[#8A1538] bg-[#8A1538]/8"
                      : "border-white/10 bg-white/3"
                  }`}
                >
                  {highlight && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#8A1538] text-white text-xs font-bold rounded-full uppercase tracking-wide">
                      Most Popular
                    </span>
                  )}
                  <h3 className={`text-xl font-black mb-1 ${highlight ? "text-[#8A1538]" : "text-white"}`}>
                    {name}
                  </h3>
                  <p className="text-white/60 text-sm mb-6">{price}</p>
                  <ul className="space-y-2.5 flex-1 mb-8">
                    {items.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-white/60">
                        <CheckCircle size={14} className="text-[#8A1538] shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/contact"
                    className={`text-center py-3 rounded font-semibold text-sm transition-colors ${
                      highlight
                        ? "bg-[#8A1538] hover:bg-[#6b1029] text-white"
                        : "border border-white/20 hover:border-white/40 text-white"
                    }`}
                  >
                    Book This Package
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-zinc-950 border-t border-white/8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black text-white mb-4">Have a Custom Request?</h2>
          <p className="text-white/50 mb-8">We tailor every service to your vehicle's needs.</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#8A1538] hover:bg-[#6b1029] text-white font-semibold rounded transition-colors"
          >
            Contact Us <ChevronRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
