import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, CheckCircle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { fadeUp, stagger } from "@/lib/motion";

const contactInfo = [
  { icon: Phone, label: "Phone", value: "+974 72252572", href: "tel:+97472252572" },
  { icon: Mail, label: "Email", value: "hello@carzix.qa", href: "mailto:hello@carzix.qa" },
  { icon: MapPin, label: "Location", value: "Doha, Qatar", href: undefined },
  { icon: Clock, label: "Hours", value: "Sat–Thu: 8am – 8pm", href: undefined },
];

interface Form {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const emptyForm: Form = { name: "", email: "", phone: "", subject: "", message: "" };

export default function Contact() {
  const [form, setForm] = useState<Form>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function set(key: keyof Form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const { error: err } = await supabase.from("contact_messages").insert({
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      subject: form.subject || null,
      message: form.message,
    });

    setSubmitting(false);
    if (err) {
      setError("Something went wrong. Please try again or contact us directly.");
    } else {
      setSubmitted(true);
      setForm(emptyForm);
    }
  }

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
            Get in Touch
          </motion.p>
          <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl font-black text-white mb-5">
            Contact Us
          </motion.h1>
          <motion.p variants={fadeUp} className="text-white/50 max-w-xl mx-auto text-lg">
            Have a question, want a quote, or ready to book? We'd love to hear from you.
          </motion.p>
        </motion.div>
      </section>

      {/* Content */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Left: info */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={stagger}
              className="lg:col-span-2 flex flex-col gap-4"
            >
              <motion.h2 variants={fadeUp} className="text-2xl font-black text-white mb-2">
                Let's Talk
              </motion.h2>
              <motion.p variants={fadeUp} className="text-white/50 text-sm leading-relaxed mb-4">
                Whether you need a same-day wash or a full multi-day detailing package, our team is ready to help. Response time is usually within a few hours.
              </motion.p>

              {contactInfo.map(({ icon: Icon, label, value, href }) => (
                <motion.div
                  key={label}
                  variants={fadeUp}
                  className="flex items-start gap-4 p-4 rounded-xl border border-white/8 bg-white/3"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#8A1538]/15 flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-[#8A1538]" />
                  </div>
                  <div>
                    <p className="text-white/40 text-xs mb-0.5">{label}</p>
                    {href ? (
                      <a href={href} className="text-white text-sm font-medium hover:text-[#A29475] transition-colors">
                        {value}
                      </a>
                    ) : (
                      <p className="text-white text-sm font-medium">{value}</p>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Map placeholder */}
              <motion.div
                variants={fadeUp}
                className="mt-2 h-40 rounded-xl border border-white/8 bg-zinc-900 overflow-hidden flex items-center justify-center"
              >
                <div className="text-center">
                  <MapPin size={24} className="text-[#8A1538] mx-auto mb-2" />
                  <p className="text-white/30 text-xs">Doha, Qatar</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right: form */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
              className="lg:col-span-3"
            >
              <div className="p-8 rounded-2xl border border-white/10 bg-white/3">
                {submitted ? (
                  <div className="flex flex-col items-center py-12 text-center">
                    <CheckCircle size={44} className="text-[#8A1538] mb-4" />
                    <h3 className="text-white font-bold text-2xl mb-2">Message Sent!</h3>
                    <p className="text-white/50 max-w-sm">
                      Thank you for reaching out. Our team will respond to you within a few hours.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-8 px-6 py-2.5 border border-white/20 text-white text-sm rounded hover:border-white/40 transition-colors"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-white/60 text-xs font-medium mb-1.5">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={form.name}
                          onChange={set("name")}
                          placeholder="Your name"
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#8A1538] transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-white/60 text-xs font-medium mb-1.5">
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={form.email}
                          onChange={set("email")}
                          placeholder="hello@example.com"
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#8A1538] transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-white/60 text-xs font-medium mb-1.5">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={set("phone")}
                          placeholder="+974 …"
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#8A1538] transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-white/60 text-xs font-medium mb-1.5">
                          Subject
                        </label>
                        <select
                          value={form.subject}
                          onChange={set("subject")}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#8A1538] transition-colors appearance-none"
                        >
                          <option value="" className="bg-zinc-900">Select a subject</option>
                          <option value="General Inquiry" className="bg-zinc-900">General Inquiry</option>
                          <option value="Book a Service" className="bg-zinc-900">Book a Service</option>
                          <option value="Get a Quote" className="bg-zinc-900">Get a Quote</option>
                          <option value="Product Request" className="bg-zinc-900">Product Request</option>
                          <option value="Feedback" className="bg-zinc-900">Feedback</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-white/60 text-xs font-medium mb-1.5">
                        Message *
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={form.message}
                        onChange={set("message")}
                        placeholder="Tell us about your vehicle and what you need…"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#8A1538] transition-colors resize-none"
                      />
                    </div>

                    {error && (
                      <p className="text-red-400 text-sm">{error}</p>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-4 bg-[#8A1538] hover:bg-[#6b1029] disabled:opacity-60 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <><Loader2 size={16} className="animate-spin" /> Sending…</>
                      ) : (
                        "Send Message"
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick-action strip */}
      <section className="py-12 bg-zinc-950 border-t border-white/8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-center sm:text-left">
          <p className="text-white/50 text-sm">Prefer to call or WhatsApp?</p>
          <a
            href="tel:+97472252572"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#8A1538] hover:bg-[#6b1029] text-white font-semibold text-sm rounded transition-colors"
          >
            <Phone size={14} /> +974 72252572
          </a>
          <a
            href="mailto:hello@carzix.qa"
            className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 hover:border-white/40 text-white/70 hover:text-white text-sm font-medium rounded transition-colors"
          >
            <Mail size={14} /> hello@carzix.qa
          </a>
        </div>
      </section>
    </>
  );
}
