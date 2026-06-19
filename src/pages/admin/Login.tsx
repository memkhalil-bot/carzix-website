import { useState } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { C } from "@/components/admin/theme";

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
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: C.bg }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div
              className="w-8 h-8 rounded flex items-center justify-center"
              style={{ background: C.brand }}
            >
              <span className="text-white font-black text-xs">CZ</span>
            </div>
            <span className="text-white font-black text-xl tracking-widest uppercase">CARZIX</span>
          </div>
          <p className="text-xs tracking-[0.2em] uppercase" style={{ color: C.muted }}>
            Admin Dashboard
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl p-6 space-y-4"
          style={{ background: C.surface, border: `1px solid ${C.border}` }}
        >
          <div>
            <label
              className="block text-xs font-semibold uppercase tracking-widest mb-2"
              style={{ color: C.muted }}
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
              style={{ background: C.surface2, border: `1px solid ${C.border}` }}
              onFocus={(e) => (e.currentTarget.style.borderColor = C.action)}
              onBlur={(e) => (e.currentTarget.style.borderColor = C.border)}
            />
          </div>

          <div>
            <label
              className="block text-xs font-semibold uppercase tracking-widest mb-2"
              style={{ color: C.muted }}
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
              style={{ background: C.surface2, border: `1px solid ${C.border}` }}
              onFocus={(e) => (e.currentTarget.style.borderColor = C.action)}
              onBlur={(e) => (e.currentTarget.style.borderColor = C.border)}
            />
          </div>

          {error && (
            <p className="text-sm" style={{ color: C.danger }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full py-3.5 font-bold text-sm tracking-widest uppercase rounded-lg transition-colors disabled:opacity-50"
            style={{ background: C.action, color: "#FFFFFF" }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = C.actionHi; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = C.action; }}
          >
            {loading ? "Signing in…" : "Enter Dashboard"}
          </button>
        </form>

        <p className="text-center text-xs mt-6" style={{ color: C.mutedDim }}>
          CARZIX Admin · Restricted Access
        </p>
      </div>
    </div>
  );
}
