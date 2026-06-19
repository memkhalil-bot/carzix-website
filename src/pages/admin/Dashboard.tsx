import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import type { ProductRequest } from "@/lib/types";
import type { Lang } from "@/components/admin/theme";
import { AdminLayout } from "@/components/admin/AdminLayout";
import type { TabId } from "@/components/admin/AdminSidebar";
import { OverviewTab } from "./tabs/OverviewTab";
import { ProductsTab } from "./tabs/ProductsTab";
import { ClientsTab } from "./tabs/ClientsTab";
import { MessagesTab } from "./tabs/MessagesTab";
import { RequestsTab } from "./tabs/RequestsTab";
import { SystemTab } from "./tabs/SystemTab";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [lang, setLang] = useState<Lang>("ar");
  const [tab, setTab] = useState<TabId>("overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [overviewRequests, setOverviewRequests] = useState<ProductRequest[]>([]);
  const [overviewLoading, setOverviewLoading] = useState(true);

  // Auth guard — verify active Supabase session
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) setLocation("/admin/login");
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) setLocation("/admin/login");
    });

    return () => listener.subscription.unsubscribe();
  }, [setLocation]);

  // Overview data load
  useEffect(() => {
    async function load() {
      setOverviewLoading(true);
      const { data, error } = await supabase
        .from("product_requests")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) console.error("[Dashboard] product_requests SELECT failed:", error);
      setOverviewRequests((data ?? []) as ProductRequest[]);
      setOverviewLoading(false);
    }
    load();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    setLocation("/admin/login");
  }

  return (
    <AdminLayout
      lang={lang}
      setLang={setLang}
      tab={tab}
      setTab={setTab}
      mobileOpen={mobileOpen}
      setMobileOpen={setMobileOpen}
      onLogout={handleLogout}
    >
      {tab === "overview" && <OverviewTab lang={lang} requests={overviewRequests} loading={overviewLoading} />}
      {tab === "requests" && <RequestsTab lang={lang} />}
      {tab === "products"  && <ProductsTab lang={lang} />}
      {tab === "clients"   && <ClientsTab lang={lang} />}
      {tab === "messages"  && <MessagesTab lang={lang} />}
      {tab === "system"    && <SystemTab lang={lang} />}
    </AdminLayout>
  );
}
