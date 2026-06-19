import { motion } from "framer-motion";
import { fadeUp, staggerSlow as stagger } from "@/lib/motion";
import { useLang } from "@/contexts/LanguageContext";
import Seo from "@/components/Seo";

export default function Terms() {
  const { t, isAr } = useLang();

  const sections = [
    {
      titleEn: "General Information",
      titleAr: "معلومات عامة",
      bodyEn:
        "The content on this website is provided for general product and business information purposes for detailing centers, dealerships, car washes, and fleets in Qatar. It does not constitute a binding offer.",
      bodyAr:
        "المحتوى المتوفر على هذا الموقع مُقدَّم لأغراض المعلومات العامة عن المنتجات والأعمال الموجهة لمراكز التلميع والوكالات والمغاسل والأساطيل في دولة قطر، ولا يُعد عرضاً ملزماً.",
    },
    {
      titleEn: "Product Information",
      titleAr: "معلومات المنتجات",
      bodyEn:
        "Product availability, packaging, dilution ratios, and specifications may change without prior notice. Please confirm current details with our team before placing an order.",
      bodyAr:
        "قد تتغير إتاحة المنتجات وتعبئتها ونسب التخفيف والمواصفات دون إشعار مسبق. يرجى تأكيد التفاصيل الحالية مع فريقنا قبل تقديم أي طلب.",
    },
    {
      titleEn: "Quotations & Orders",
      titleAr: "عروض الأسعار والطلبات",
      bodyEn:
        "All quotations requested through this website are subject to confirmation by our team. Pricing, quantities, and lead times are finalized only after direct confirmation, in line with our B2B and commercial supply focus.",
      bodyAr:
        "جميع عروض الأسعار المطلوبة عبر هذا الموقع تخضع للتأكيد من فريقنا. يتم تحديد الأسعار والكميات ومواعيد التسليم بشكل نهائي فقط بعد التأكيد المباشر، بما يتوافق مع تركيزنا على التوريد للشركات (B2B) والإمداد التجاري.",
    },
    {
      titleEn: "Proper Use of Products",
      titleAr: "الاستخدام السليم للمنتجات",
      bodyEn:
        "CARZIX products are intended for professional use and should be applied according to the instructions provided and recognized professional handling standards for automotive detailing chemicals.",
      bodyAr:
        "منتجات CARZIX مُعدّة للاستخدام الاحترافي ويجب استخدامها وفقاً للتعليمات المرفقة ومعايير التعامل الاحترافي المعتمدة لكيماويات تلميع وعناية السيارات.",
    },
    {
      titleEn: "Distribution in Qatar",
      titleAr: "التوزيع في دولة قطر",
      bodyEn:
        "CARZIX is distributed in Qatar exclusively through Doha International Trading Company. All commercial supply arrangements in Qatar are handled through this exclusive distribution partnership.",
      bodyAr:
        "تُوزَّع منتجات CARZIX في دولة قطر بشكل حصري عبر شركة الدوحة العالمية للتجارة. تتم جميع ترتيبات الإمداد التجاري في دولة قطر عبر هذه الشراكة الحصرية للتوزيع.",
    },
  ];

  return (
    <>
      <Seo
        title={t("Terms & Conditions", "الشروط والأحكام")}
        description={t(
          "Terms and conditions for using the CARZIX website and requesting quotations, including product information, B2B supply, and distribution in Qatar through Doha International Trading Company.",
          "الشروط والأحكام الخاصة باستخدام موقع CARZIX وطلب عروض الأسعار، بما في ذلك معلومات المنتجات والإمداد للشركات (B2B) والتوزيع في دولة قطر عبر شركة الدوحة العالمية للتجارة."
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
            {t("Terms & Conditions", "الشروط والأحكام")}
          </motion.h1>
          <motion.p variants={fadeUp} className="text-white/50 max-w-xl mx-auto text-base">
            {t(
              "Please read these terms before requesting a quotation or using CARZIX products supplied in Qatar.",
              "يرجى قراءة هذه الشروط قبل طلب عرض سعر أو استخدام منتجات CARZIX المورَّدة في دولة قطر."
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

          <motion.p variants={fadeUp} className="text-white/30 text-xs pt-4 border-t border-white/8">
            {t("Last updated: 2026", "آخر تحديث: 2026")}
          </motion.p>
        </motion.div>
      </section>
    </>
  );
}
