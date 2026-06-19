import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { fadeUp, staggerSlow as stagger } from "@/lib/motion";
import { useLang } from "@/contexts/LanguageContext";
import Seo from "@/components/Seo";

export default function PrivacyPolicy() {
  const { t, isAr } = useLang();

  const sections = [
    {
      titleEn: "Who We Are",
      titleAr: "من نحن",
      bodyEn:
        "This Privacy Policy explains how CARZIX, distributed in Qatar exclusively through Doha International Trading Company, collects, uses, and protects information submitted through our website — primarily via quote requests and contact forms.",
      bodyAr:
        "توضح سياسة الخصوصية هذه كيفية جمع CARZIX، الموزَّعة في دولة قطر بشكل حصري عبر شركة الدوحة العالمية للتجارة، للمعلومات واستخدامها وحمايتها عند تقديمها من خلال موقعنا الإلكتروني — وذلك بشكل أساسي عبر طلبات عروض الأسعار ونماذج التواصل.",
    },
    {
      titleEn: "Information We Collect",
      titleAr: "المعلومات التي نجمعها",
      bodyEn:
        "When you submit a quote request or contact form, we may collect your name, email address, phone number, company name, business type, city, product interest, and any details included in your request or message.",
      bodyAr:
        "عند تقديمك لطلب عرض سعر أو نموذج تواصل، قد نقوم بجمع اسمك وعنوان بريدك الإلكتروني ورقم هاتفك واسم شركتك ونوع نشاطك التجاري ومدينتك والمنتجات التي تهمك وأي تفاصيل واردة في طلبك أو رسالتك.",
    },
    {
      titleEn: "How We Use Your Information",
      titleAr: "كيف نستخدم معلوماتك",
      bodyEn:
        "We use the information you provide to respond to your inquiries, prepare and follow up on quotations, manage B2B sales requests, and improve the quality of our products and service to detailing centers, dealerships, and fleets across Qatar.",
      bodyAr:
        "نستخدم المعلومات التي تقدمها للرد على استفساراتك، وإعداد عروض الأسعار ومتابعتها، وإدارة طلبات المبيعات للشركات (B2B)، وتحسين جودة منتجاتنا وخدماتنا المقدمة لمراكز التلميع والوكالات والأساطيل في دولة قطر.",
    },
    {
      titleEn: "How We Share Your Information",
      titleAr: "كيف نشارك معلوماتك",
      bodyEn:
        "We do not sell your data. Information may be shared internally only with authorized CARZIX or Doha International Trading Company team members, or with trusted service providers, where necessary to process your request.",
      bodyAr:
        "نحن لا نبيع بياناتك. قد تتم مشاركة المعلومات داخلياً فقط مع أعضاء الفريق المعتمدين في CARZIX أو شركة الدوحة العالمية للتجارة، أو مع مزودي خدمات موثوقين، عند الحاجة لمعالجة طلبك.",
    },
    {
      titleEn: "Your Rights",
      titleAr: "حقوقك",
      bodyEn:
        "You may request correction or deletion of your information at any time by contacting us at hello@carzix.qa.",
      bodyAr:
        "يمكنك طلب تصحيح أو حذف معلوماتك في أي وقت عبر التواصل معنا على hello@carzix.qa.",
    },
    {
      titleEn: "Contact",
      titleAr: "التواصل",
      bodyEn:
        "If you have questions about this Privacy Policy or how your information is handled, please reach out to our team in Doha, Qatar at hello@carzix.qa.",
      bodyAr:
        "إذا كانت لديك أي استفسارات حول سياسة الخصوصية هذه أو كيفية التعامل مع معلوماتك، يرجى التواصل مع فريقنا في الدوحة، دولة قطر على hello@carzix.qa.",
    },
  ];

  return (
    <>
      <Seo
        title={t("Privacy Policy", "سياسة الخصوصية")}
        description={t(
          "Learn how CARZIX and Doha International Trading Company collect, use, and protect information submitted through quote and contact forms in Qatar.",
          "تعرّف على كيفية جمع CARZIX وشركة الدوحة العالمية للتجارة للمعلومات واستخدامها وحمايتها عند تقديمها عبر نماذج عروض الأسعار والتواصل في دولة قطر."
        )}
      />
      {/* Hero */}
      <section className="relative pt-36 pb-16 bg-black overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,_rgba(13,66,97,0.25)_0%,_transparent_60%)]" />
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center"
        >
          <motion.p variants={fadeUp} className="text-[#A29475] text-xs font-semibold tracking-widest uppercase mb-4">
            {t("Legal", "قانوني")}
          </motion.p>
          <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl font-black text-white mb-5">
            {t("Privacy Policy", "سياسة الخصوصية")}
          </motion.h1>
          <motion.p variants={fadeUp} className="text-white/50 max-w-xl mx-auto text-base">
            {t(
              "How CARZIX and Doha International Trading Company handle the information you share with us in Qatar.",
              "كيفية تعامل CARZIX وشركة الدوحة العالمية للتجارة مع المعلومات التي تشاركها معنا في دولة قطر."
            )}
          </motion.p>
        </motion.div>
      </section>

      {/* Content */}
      <section className="py-16 bg-black">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
          className="max-w-3xl mx-auto px-6 lg:px-8 space-y-10"
        >
          {sections.map(({ titleEn, titleAr, bodyEn, bodyAr }) => (
            <motion.div key={titleEn} variants={fadeUp}>
              <h2 className="text-white font-bold text-xl mb-3">{isAr ? titleAr : titleEn}</h2>
              <p className="text-[#9CA3AF] text-sm leading-relaxed">{isAr ? bodyAr : bodyEn}</p>
            </motion.div>
          ))}

          <motion.div variants={fadeUp} className="glass flex items-center gap-4 p-5 rounded-xl">
            <div className="w-9 h-9 rounded-lg bg-[#0D4261]/14 border border-[#0D4261]/30 flex items-center justify-center shrink-0">
              <Mail size={15} className="text-[#A29475]" />
            </div>
            <div>
              <p className="text-white/35 text-xs mb-0.5">{t("Privacy requests", "طلبات الخصوصية")}</p>
              <a
                href="mailto:hello@carzix.qa"
                dir="ltr"
                style={{ unicodeBidi: "isolate" }}
                className="text-white text-sm font-medium hover:text-[#A29475] transition-colors"
              >
                hello@carzix.qa
              </a>
            </div>
          </motion.div>

          <motion.p variants={fadeUp} className="text-white/30 text-xs pt-4 border-t border-white/8">
            {t("Last updated: 2026", "آخر تحديث: 2026")}
          </motion.p>
        </motion.div>
      </section>
    </>
  );
}
