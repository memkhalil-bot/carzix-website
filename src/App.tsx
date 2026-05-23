import { Suspense, lazy } from "react";
import { Switch, Route } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Home = lazy(() => import("@/pages/Home"));
const Services = lazy(() => import("@/pages/Services"));
const Products = lazy(() => import("@/pages/Products"));
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<div className="min-h-screen bg-black" />}>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/services" component={Services} />
            <Route path="/products" component={Products} />
            <Route path="/about" component={About} />
            <Route path="/contact" component={Contact} />
          </Switch>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
