import { useState } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";

const ALLOWED_EMAILS = ["carzix.qa@gmail.com", "memkhalil@gmail.com"];

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error: authErr } = await supabase.auth.signInWithPassword({ email, password });

    if (authErr || !data.session) {
      setError("Incorrect email or password. Please try again.");
      setPassword("");
      setLoading(false);
      return;
    }

    if (!ALLOWED_EMAILS.includes(data.user.email ?? "")) {
      await supabase.auth.signOut();
      setError("Access denied. This account is not authorized.");
      setPassword("");
      setLoading(false);
      return;
    }

    setLocation("/admin/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "#0A0A0A" }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div
              className="w-8 h-8 rounded flex items-center justify-center"
              style={{ background: "#FF6B1A" }}
            >
              <span className="text-white font-black text-xs">CZ</span>
            </div>
            <span className="text-white font-black text-xl tracking-widest uppercase">CARZIX</span>
          </div>
          <p className="text-xs tracking-[0.2em] uppercase" style={{ color: "#A1A1AA" }}>
            Admin Dashboard
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl p-6 space-y-4"
          style={{ background: "#141414", border: "1px solid #2A2A2A" }}
        >
          <div>
            <label
              className="block text-xs font-semibold uppercase tracking-widest mb-2"
              style={{ color: "#A1A1AA" }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              autoFocus
              required
              className="w-full rounded-lg px-4 py-3 text-white text-sm focus:outline-none transition-colors"
              style={{ background: "#1C1C1C", border: "1px solid #2A2A2A" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#FF6B1A")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#2A2A2A")}
            />
          </div>

          <div>
            <label
              className="block text-xs font-semibold uppercase tracking-widest mb-2"
              style={{ color: "#A1A1AA" }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full rounded-lg px-4 py-3 text-white text-sm focus:outline-none transition-colors"
              style={{ background: "#1C1C1C", border: "1px solid #2A2A2A" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#FF6B1A")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#2A2A2A")}
            />
          </div>

          {error && (
            <p className="text-sm" style={{ color: "#EF4444" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full py-3.5 font-bold text-sm tracking-widest uppercase rounded-lg transition-colors disabled:opacity-50"
            style={{ background: "#FF6B1A", color: "#fff" }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "#e55f15"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#FF6B1A"; }}
          >
            {loading ? "Signing in…" : "Enter Dashboard"}
          </button>
        </form>

        <p className="text-center text-xs mt-6" style={{ color: "#3f3f3f" }}>
          CARZIX Admin · Restricted Access
        </p>
      </div>
    </div>
  );
}
