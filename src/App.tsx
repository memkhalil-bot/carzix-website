import { Suspense, lazy } from "react";
import { Switch, Route } from "wouter";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import TrustStrip from "@/components/TrustStrip";

const Home           = lazy(() => import("@/pages/Home"));
const Products       = lazy(() => import("@/pages/Products"));
const ProductDetail  = lazy(() => import("@/pages/ProductDetail"));
const About          = lazy(() => import("@/pages/About"));
const Partners       = lazy(() => import("@/pages/Partners"));
const Contact        = lazy(() => import("@/pages/Contact"));
const PrivacyPolicy  = lazy(() => import("@/pages/PrivacyPolicy"));
const Terms          = lazy(() => import("@/pages/Terms"));
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
                  <Route path="/"               component={Home} />
                  <Route path="/products"       component={Products} />
                  <Route path="/products/:slug" component={ProductDetail} />
                  <Route path="/about"          component={About} />
                  <Route path="/partners"       component={Partners} />
                  <Route path="/contact"        component={Contact} />
                  <Route path="/privacy-policy" component={PrivacyPolicy} />
                  <Route path="/terms"          component={Terms} />
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
