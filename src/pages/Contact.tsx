import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, CheckCircle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { fadeUp, stagger } from "@/lib/motion";
import { useLang } from "@/contexts/LanguageContext";

interface Form {
  full_name: string;
  email: string;
  phone: string;
  message: string;
}

const emptyForm: Form = { full_name: "", email: "", phone: "", message: "" };

export default function Contact() {
  const { t, isAr } = useLang();
  const [form, setForm] = useState<Form>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const contactInfo = [
    { icon: Phone, labelEn: "Phone", labelAr: "الهاتف", value: "+974 72252572", href: "tel:+97472252572" },
    { icon: Mail, labelEn: "Email", labelAr: "البريد الإلكتروني", value: "hello@carzix.qa", href: "mailto:hello@carzix.qa" },
    { icon: MapPin, labelEn: "Location", labelAr: "الموقع", value: t("Doha, Qatar", "الدوحة، قطر"), href: undefined },
    { icon: Clock, labelEn: "Hours", labelAr: "ساعات العمل", value: t("Sat–Thu: 8am – 8pm", "السبت-الخميس: 8ص – 8م"), href: undefined },
  ];

  function set(key: keyof Form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const { error: err } = await supabase.from("contact_messages").insert({
      full_name: form.full_name,
      email: form.email,
      phone: form.phone || null,
      message: form.message,
    });

    setSubmitting(false);
    if (err) {
      setError(t(
        "Something went wrong. Please try again or contact us directly.",
        "حدث خطأ ما. يرجى المحاولة مرة أخرى أو التواصل معنا مباشرةً."
      ));
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
            {t("Get in Touch", "تواصل معنا")}
          </motion.p>
          <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl font-black text-white mb-5">
            {t("Contact Us", "اتصل بنا")}
          </motion.h1>
          <motion.p variants={fadeUp} className="text-white/50 max-w-xl mx-auto text-lg">
            {t(
              "Have a question or want to request a product? We'd love to hear from you.",
              "هل لديك سؤال أو تريد طلب منتج؟ نحن هنا للمساعدة."
            )}
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
                {t("Let's Talk", "لنتحدث")}
              </motion.h2>
              <motion.p variants={fadeUp} className="text-white/50 text-sm leading-relaxed mb-4">
                {t(
                  "Whether you need product information, a bulk quote, or a custom order — our team is ready to help. Typical response time is within 24 hours.",
                  "سواء كنت بحاجة إلى معلومات عن المنتج أو عرض سعر بالجملة أو طلب مخصص — فريقنا جاهز للمساعدة. وقت الاستجابة المعتاد خلال 24 ساعة."
                )}
              </motion.p>

              {contactInfo.map(({ icon: Icon, labelEn, labelAr, value, href }) => (
                <motion.div
                  key={labelEn}
                  variants={fadeUp}
                  className="glass flex items-start gap-4 p-4 rounded-xl"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#8A1538]/15 flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-[#8A1538]" />
                  </div>
                  <div>
                    <p className="text-white/40 text-xs mb-0.5">{isAr ? labelAr : labelEn}</p>
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
                className="glass mt-2 h-40 rounded-xl overflow-hidden flex items-center justify-center"
              >
                <div className="text-center">
                  <MapPin size={24} className="text-[#8A1538] mx-auto mb-2" />
                  <p className="text-white/30 text-xs">{t("Doha, Qatar", "الدوحة، قطر")}</p>
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
              <div className="glass-dark p-8 rounded-2xl">
                {submitted ? (
                  <div className="flex flex-col items-center py-12 text-center">
                    <CheckCircle size={44} className="text-[#8A1538] mb-4" />
                    <h3 className="text-white font-bold text-2xl mb-2">
                      {t("Message Sent!", "تم إرسال الرسالة!")}
                    </h3>
                    <p className="text-white/50 max-w-sm">
                      {t(
                        "Thank you for reaching out. Our team will respond within 24 hours.",
                        "شكراً لتواصلك. سيرد فريقنا خلال 24 ساعة."
                      )}
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-8 px-6 py-2.5 border border-white/20 text-white text-sm rounded hover:border-white/40 transition-colors"
                    >
                      {t("Send Another Message", "إرسال رسالة أخرى")}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-white/60 text-xs font-medium mb-1.5">
                          {t("Full Name *", "الاسم الكامل *")}
                        </label>
                        <input
                          type="text"
                          required
                          value={form.full_name}
                          onChange={set("full_name")}
                          placeholder={t("Your name", "اسمك")}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#8A1538] transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-white/60 text-xs font-medium mb-1.5">
                          {t("Email *", "البريد الإلكتروني *")}
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

                    <div>
                      <label className="block text-white/60 text-xs font-medium mb-1.5">
                        {t("Phone", "رقم الهاتف")}
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={set("phone")}
                        placeholder="+974 XXXX XXXX"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#8A1538] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-white/60 text-xs font-medium mb-1.5">
                        {t("Message *", "الرسالة *")}
                      </label>
                      <textarea
                        required
                        rows={6}
                        value={form.message}
                        onChange={set("message")}
                        placeholder={t(
                          "Tell us about your inquiry or product request…",
                          "أخبرنا عن استفسارك أو طلب المنتج…"
                        )}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#8A1538] transition-colors resize-none"
                      />
                    </div>

                    {error && <p className="text-red-400 text-sm">{error}</p>}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-4 bg-[#8A1538] hover:bg-[#6b1029] disabled:opacity-60 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <><Loader2 size={16} className="animate-spin" /> {t("Sending…", "جارٍ الإرسال…")}</>
                      ) : (
                        t("Send Message", "إرسال الرسالة")
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
          <p className="text-white/50 text-sm">{t("Prefer to call or WhatsApp?", "تفضل الاتصال أو واتساب؟")}</p>
          <a
            href="tel:+97472252572"
            className="btn-brand inline-flex items-center gap-2 px-6 py-3 text-white font-semibold text-sm rounded"
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
