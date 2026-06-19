import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Client } from "@/lib/types";
import { useLang } from "@/contexts/LanguageContext";

export default function ClientsSlider() {
  const { t } = useLang();
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    supabase
      .from("clients")
      .select("*")
      .eq("active", true)
      .order("display_order")
      .then(
        ({ data }) => {
          if (data && data.length > 0) setClients(data);
        },
        () => {}
      );
  }, []);

  if (clients.length === 0) return null;

  const doubled = [...clients, ...clients];

  return (
    <section className="py-16 border-y border-white/5 overflow-hidden bg-[#060606]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-10">
        <p className="text-center text-white/25 text-[11px] font-semibold tracking-[0.22em] uppercase">
          {t("Trusted by Qatar's leading businesses", "موثوق من قِبل كبرى الشركات في قطر")}
        </p>
      </div>
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#060606] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#060606] to-transparent z-10 pointer-events-none" />
        <div className="flex overflow-hidden">
          <div className="clients-track flex items-center gap-6 whitespace-nowrap">
            {doubled.map((client, i) => (
              <div
                key={`${client.id}-${i}`}
                className="inline-flex items-center justify-center h-12 px-6 rounded-lg border border-white/7 bg-white/3 hover:border-[#A29475]/25 transition-colors shrink-0"
              >
                {client.logo_url ? (
                  <img
                    src={client.logo_url}
                    alt={client.name}
                    className="h-7 object-contain opacity-50 hover:opacity-80 transition-opacity"
                  />
                ) : (
                  <span className="text-white/35 font-semibold text-sm tracking-wide">{client.name}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
