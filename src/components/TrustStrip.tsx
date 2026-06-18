import { CheckCircle } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";

export default function TrustStrip() {
  const { t } = useLang();

  const items = [
    t("German Technology", "تقنية ألمانية"),
    t("Professional Grade Formula", "تركيبة بدرجة احترافية"),
    t("Qatar Climate Tested", "مختبر لمناخ قطر"),
    t("Commercial Car Care Solutions", "حلول عناية تجارية للسيارات"),
    t("Bulk Supply Available", "توريد بالجملة متوفر"),
  ];

  return (
    <section className="bg-zinc-950 border-t border-white/8 py-6">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {items.map((label) => (
            <div key={label} className="flex items-center gap-2">
              <CheckCircle size={14} className="text-[#129B82] shrink-0" />
              <span className="text-white/55 text-sm font-medium whitespace-nowrap">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
