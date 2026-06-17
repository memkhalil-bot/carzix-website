import { Suspense, lazy } from "react";
import { Switch, Route } from "wouter";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import TrustStrip from "@/components/TrustStrip";

const Home           = lazy(() => import("@/pages/Home"));
const Products       = lazy(() => import("@/pages/Products"));
const About          = lazy(() => import("@/pages/About"));
const Contact        = lazy(() => import("@/pages/Contact"));
const AdminLogin     = lazy(() => import("@/pages/admin/Login"));
const AdminDashboard = lazy(() => import("@/pages/admin/Dashboard"));

export default function App() {
  return (
    <Switch>
      <Route path="/admin/login">
        <Suspense fallback={<div className="min-h-screen" style={{ background: "#0A0A0A" }} />}>
          <AdminLogin />
        </Suspense>
      </Route>
      <Route path="/admin/dashboard">
        <Suspense fallback={<div className="min-h-screen" style={{ background: "#0A0A0A" }} />}>
          <AdminDashboard />
        </Suspense>
      </Route>
      <Route>
        <LanguageProvider>
          <div className="min-h-screen flex flex-col bg-black">
            <Navbar />
            <main className="flex-1">
              <Suspense fallback={<div className="min-h-screen bg-black" />}>
                <Switch>
                  <Route path="/"         component={Home} />
                  <Route path="/products" component={Products} />
                  <Route path="/about"    component={About} />
                  <Route path="/contact"  component={Contact} />
                </Switch>
              </Suspense>
            </main>
            <TrustStrip />
            <Footer />
            <WhatsAppButton />
          </div>
        </LanguageProvider>
      </Route>
    </Switch>
  );
}
