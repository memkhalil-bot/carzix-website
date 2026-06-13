import { useState } from "react";
import { useLocation } from "wouter";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const adminPwd = import.meta.env.VITE_ADMIN_PASSWORD;

    if (!adminPwd) {
      setError("VITE_ADMIN_PASSWORD is not configured in environment variables.");
      setLoading(false);
      return;
    }

    if (password === adminPwd) {
      sessionStorage.setItem("carzix-admin-auth", "1");
      setLocation("/admin/dashboard");
    } else {
      setError("Incorrect password. Please try again.");
      setPassword("");
    }
    setLoading(false);
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
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              autoFocus
              required
              className="w-full rounded-lg px-4 py-3 text-white text-sm focus:outline-none transition-colors"
              style={{
                background: "#1C1C1C",
                border: "1px solid #2A2A2A",
              }}
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
            disabled={loading || !password}
            className="w-full py-3.5 font-bold text-sm tracking-widest uppercase rounded-lg transition-colors disabled:opacity-50"
            style={{ background: "#FF6B1A", color: "#fff" }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "#e55f15"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#FF6B1A"; }}
          >
            {loading ? "Verifying…" : "Enter Dashboard"}
          </button>
        </form>

        <p className="text-center text-xs mt-6" style={{ color: "#3f3f3f" }}>
          CARZIX Admin · Restricted Access
        </p>
      </div>
    </div>
  );
}
