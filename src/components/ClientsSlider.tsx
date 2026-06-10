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
      .then(({ data }) => {
        if (data && data.length > 0) setClients(data);
      });
  }, []);

  if (clients.length === 0) return null;

  const doubled = [...clients, ...clients];

  return (
    <section className="py-16 border-y border-white/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-8">
        <p className="text-center text-white/40 text-sm font-medium tracking-widest uppercase">
          {t("Trusted by leading businesses in Qatar", "موثوق من قِبل كبرى الشركات في قطر")}
        </p>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

        <div className="flex overflow-hidden">
          <div className="clients-track flex items-center gap-10 whitespace-nowrap">
            {doubled.map((client, i) => (
              <div
                key={`${client.id}-${i}`}
                className="inline-flex items-center justify-center h-14 px-6 rounded border border-white/10 bg-white/5 hover:border-[#A29475]/40 hover:bg-white/8 transition-colors shrink-0"
              >
                {client.logo_url ? (
                  <img
                    src={client.logo_url}
                    alt={client.name}
                    className="h-8 object-contain filter brightness-75 hover:brightness-100 transition-all"
                  />
                ) : (
                  <span className="text-white/50 font-semibold text-sm tracking-wide">
                    {client.name}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
