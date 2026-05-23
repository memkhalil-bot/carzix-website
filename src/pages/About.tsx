import { motion } from "framer-motion";
import { Link } from "wouter";
import { Heart, Award, Users, Leaf, ChevronRight } from "lucide-react";
import { fadeUp, staggerSlow as stagger } from "@/lib/motion";

const values = [
  {
    icon: Heart,
    title: "Passion for Perfection",
    desc: "Every vehicle we touch receives the same obsessive attention to detail, regardless of make, model, or budget.",
  },
  {
    icon: Award,
    title: "Uncompromising Quality",
    desc: "We use only professional-grade, internationally sourced products that we trust on our own cars.",
  },
  {
    icon: Users,
    title: "Customer First",
    desc: "We're not done until you're delighted. Our team is reachable, responsive, and genuinely cares about your experience.",
  },
  {
    icon: Leaf,
    title: "Responsible Practice",
    desc: "Water-saving techniques, eco-friendly products, and responsible disposal are built into everything we do.",
  },
];

const milestones = [
  { year: "2021", event: "Carzix founded in Doha by a team of automotive enthusiasts." },
  { year: "2022", event: "Launched ceramic coating and paint correction services." },
  { year: "2023", event: "Served over 1,000 vehicles and expanded the team." },
  { year: "2024", event: "Partnered with leading businesses across Qatar." },
  { year: "2025", event: "Continuing to grow — same standards, bigger reach." },
];

export default function About() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-36 pb-24 bg-black overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,_rgba(138,21,56,0.25)_0%,_transparent_60%)]" />
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          className="relative max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center"
        >
          <div>
            <motion.p variants={fadeUp} className="text-[#A29475] text-xs font-semibold tracking-widest uppercase mb-4">
              About Us
            </motion.p>
            <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl font-black text-white leading-tight mb-6">
              Built on a Love<br />for Cars
            </motion.h1>
            <motion.p variants={fadeUp} className="text-white/55 text-lg leading-relaxed">
              Carzix was born from a simple belief: every car deserves to look its absolute best.
              We started as a small team of car enthusiasts in Doha and have grown into Qatar's
              most trusted detailing specialists — without ever losing that hands-on, personal approach.
            </motion.p>
          </div>

          {/* Abstract visual */}
          <motion.div
            variants={fadeUp}
            className="hidden lg:flex items-center justify-center"
          >
            <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-sm">
              <circle cx="200" cy="150" r="130" stroke="#8A1538" strokeWidth="1" opacity="0.2" />
              <circle cx="200" cy="150" r="100" stroke="#A29475" strokeWidth="0.5" opacity="0.15" />
              <circle cx="200" cy="150" r="70" stroke="#8A1538" strokeWidth="0.5" opacity="0.1" />
              <circle cx="200" cy="150" r="50" fill="#8A1538" opacity="0.08" />
              {/* C shape */}
              <path
                d="M 230 100 A 60 60 0 1 0 230 200"
                stroke="#8A1538"
                strokeWidth="8"
                strokeLinecap="round"
                fill="none"
              />
              {/* Z shape */}
              <path d="M 238 108 L 275 108 L 238 162 L 275 162" stroke="#A29475" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              {/* Sparkles */}
              <g transform="translate(80,60)" opacity="0.6">
                <line x1="0" y1="-6" x2="0" y2="6" stroke="#A29475" strokeWidth="1.5" />
                <line x1="-6" y1="0" x2="6" y2="0" stroke="#A29475" strokeWidth="1.5" />
              </g>
              <g transform="translate(330,90)" opacity="0.5">
                <line x1="0" y1="-5" x2="0" y2="5" stroke="#8A1538" strokeWidth="1.5" />
                <line x1="-5" y1="0" x2="5" y2="0" stroke="#8A1538" strokeWidth="1.5" />
              </g>
              <g transform="translate(310,230)" opacity="0.4">
                <line x1="0" y1="-4" x2="0" y2="4" stroke="#A29475" strokeWidth="1" />
                <line x1="-4" y1="0" x2="4" y2="0" stroke="#A29475" strokeWidth="1" />
              </g>
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* Our story */}
      <section className="py-24 bg-zinc-950 border-y border-white/8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="max-w-3xl mx-auto"
          >
            <motion.p variants={fadeUp} className="text-[#A29475] text-xs font-semibold tracking-widest uppercase mb-3 text-center">
              Our Story
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl font-black text-white text-center mb-10">
              From Passion to Profession
            </motion.h2>

            <div className="relative pl-8 border-l border-[#8A1538]/30 space-y-8">
              {milestones.map(({ year, event }) => (
                <motion.div key={year} variants={fadeUp} className="relative">
                  <div className="absolute -left-[1.65rem] w-3 h-3 rounded-full bg-[#8A1538] ring-4 ring-zinc-950" />
                  <p className="text-[#8A1538] text-xs font-bold tracking-widest uppercase mb-1">{year}</p>
                  <p className="text-white/65 text-sm leading-relaxed">{event}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="text-center mb-14">
              <p className="text-[#A29475] text-xs font-semibold tracking-widest uppercase mb-3">
                What We Stand For
              </p>
              <h2 className="text-4xl font-black text-white">Our Values</h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map(({ icon: Icon, title, desc }) => (
                <motion.div
                  key={title}
                  variants={fadeUp}
                  className="p-7 rounded-xl border border-white/8 bg-white/3 hover:border-[#8A1538]/30 transition-colors"
                >
                  <div className="w-11 h-11 rounded-lg bg-[#8A1538]/15 flex items-center justify-center mb-4">
                    <Icon size={20} className="text-[#8A1538]" />
                  </div>
                  <h3 className="text-white font-bold text-base mb-2">{title}</h3>
                  <p className="text-white/45 text-sm leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats row */}
      <section className="py-16 bg-[#8A1538]/10 border-y border-[#8A1538]/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center"
          >
            {[
              { n: "2,000+", l: "Cars Detailed" },
              { n: "4", l: "Years of Service" },
              { n: "10+", l: "Expert Technicians" },
              { n: "100%", l: "Satisfaction Focus" },
            ].map(({ n, l }) => (
              <motion.div key={l} variants={fadeUp}>
                <div className="text-4xl font-black text-[#8A1538] mb-1">{n}</div>
                <div className="text-white/50 text-sm">{l}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black text-white mb-4">Experience the Carzix Difference</h2>
          <p className="text-white/50 mb-8">Book your first service today.</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#8A1538] hover:bg-[#6b1029] text-white font-semibold rounded transition-colors"
          >
            Get in Touch <ChevronRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
