import { useEffect, useState, useCallback } from "react";
import { useLocation } from "wouter";
import {
  LayoutDashboard, Package, Users, MessageSquare, ClipboardList,
  LogOut, Trash2, Plus, RefreshCw, Loader2, X, Check, Menu,
  ChevronDown,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Product, Client, ContactMessage, ProductRequest } from "@/lib/types";

// ── Admin color tokens (inline, isolated from public site) ──────────────
const C = {
  bg:      "#0A0A0A",
  panel:   "#141414",
  card:    "#1C1C1C",
  border:  "#2A2A2A",
  text:    "#FFFFFF",
  muted:   "#A1A1AA",
  action:  "#FF6B1A",
  success: "#22C55E",
  warning: "#F59E0B",
  danger:  "#EF4444",
  hover:   "#232323",
} as const;

// ── Helper components ──────────────────────────────────────────────────
function Badge({
  color,
  children,
}: {
  color: "orange" | "green" | "red" | "gray" | "yellow";
  children: React.ReactNode;
}) {
  const colors = {
    orange: { bg: "#FF6B1A22", color: "#FF6B1A", border: "#FF6B1A44" },
    green:  { bg: "#22C55E22", color: "#22C55E", border: "#22C55E44" },
    red:    { bg: "#EF444422", color: "#EF4444", border: "#EF444444" },
    yellow: { bg: "#F59E0B22", color: "#F59E0B", border: "#F59E0B44" },
    gray:   { bg: "#A1A1AA22", color: "#A1A1AA", border: "#A1A1AA44" },
  };
  const s = colors[color];
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold"
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
    >
      {children}
    </span>
  );
}

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: number | string;
  sub?: string;
  accent?: string;
}) {
  return (
    <div
      className="rounded-xl p-5"
      style={{ background: C.card, border: `1px solid ${C.border}` }}
    >
      <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: C.muted }}>
        {label}
      </p>
      <p className="text-3xl font-black" style={{ color: accent ?? C.text }}>
        {value}
      </p>
      {sub && (
        <p className="text-xs mt-1" style={{ color: C.muted }}>
          {sub}
        </p>
      )}
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th
      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
      style={{ color: C.muted, background: C.panel, borderBottom: `1px solid ${C.border}` }}
    >
      {children}
    </th>
  );
}

function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <td
      className={`px-4 py-3 text-sm ${className}`}
      style={{ color: C.text, borderBottom: `1px solid ${C.border}` }}
    >
      {children}
    </td>
  );
}

function TableWrap({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: `1px solid ${C.border}` }}
    >
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">{children}</table>
      </div>
    </div>
  );
}

function SectionHeader({
  title,
  count,
  onRefresh,
  loading,
  children,
}: {
  title: string;
  count?: number;
  onRefresh: () => void;
  loading: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-bold" style={{ color: C.text }}>
          {title}
        </h2>
        {count !== undefined && (
          <span
            className="px-2 py-0.5 rounded text-xs font-semibold"
            style={{ background: C.card, color: C.muted, border: `1px solid ${C.border}` }}
          >
            {count}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        {children}
        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{ background: C.card, color: C.muted, border: `1px solid ${C.border}` }}
          title="Refresh"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
        </button>
      </div>
    </div>
  );
}

// ── Status badge helper ──────────────────────────────────────────────
function statusBadge(status: string | null | undefined, options?: {
  active?: string; inactive?: string; pending?: string;
  fulfilled?: string; cancelled?: string;
}) {
  const s = (status ?? "").toLowerCase();
  if (s === "active")    return <Badge color="green">{options?.active   ?? "Active"}</Badge>;
  if (s === "inactive")  return <Badge color="red">{options?.inactive ?? "Inactive"}</Badge>;
  if (s === "fulfilled") return <Badge color="green">Fulfilled</Badge>;
  if (s === "cancelled") return <Badge color="red">Cancelled</Badge>;
  return <Badge color="yellow">{status ?? "Pending"}</Badge>;
}

// ── Overview Tab ─────────────────────────────────────────────────────
function OverviewTab({
  stats,
  recentMessages,
  recentRequests,
}: {
  stats: { products: number; clients: number; messages: number; requests: number };
  recentMessages: ContactMessage[];
  recentRequests: ProductRequest[];
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Products"         value={stats.products}  sub="In catalogue" />
        <StatCard label="Clients"          value={stats.clients}   sub="Logo slider" />
        <StatCard label="Messages"         value={stats.messages}  sub="Contact form" accent={C.warning} />
        <StatCard label="Quote Requests"   value={stats.requests}  sub="Product requests" accent={C.action} />
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Recent messages */}
        <div className="rounded-xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
          <p className="text-sm font-semibold mb-4" style={{ color: C.text }}>Recent Messages</p>
          {recentMessages.length === 0 ? (
            <p className="text-sm" style={{ color: C.muted }}>No messages yet.</p>
          ) : (
            <div className="space-y-3">
              {recentMessages.map((m) => (
                <div key={m.id} className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: C.text }}>{m.full_name}</p>
                    <p className="text-xs truncate" style={{ color: C.muted }}>{m.email}</p>
                  </div>
                  <p className="text-xs shrink-0" style={{ color: C.muted }}>
                    {new Date(m.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent requests */}
        <div className="rounded-xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
          <p className="text-sm font-semibold mb-4" style={{ color: C.text }}>Recent Quote Requests</p>
          {recentRequests.length === 0 ? (
            <p className="text-sm" style={{ color: C.muted }}>No requests yet.</p>
          ) : (
            <div className="space-y-3">
              {recentRequests.map((r) => (
                <div key={r.id} className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: C.text }}>{r.customer_name}</p>
                    <p className="text-xs truncate" style={{ color: C.muted }}>{r.product_name ?? "—"}</p>
                  </div>
                  {statusBadge(r.status)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Products Tab ─────────────────────────────────────────────────────
function ProductsTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setProducts(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function toggleStatus(id: string, current: string | null) {
    const next = current === "active" ? "inactive" : "active";
    await supabase.from("products").update({ status: next }).eq("id", id);
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, status: next } : p));
  }

  return (
    <div>
      <SectionHeader title="Products" count={products.length} onRefresh={load} loading={loading} />

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 size={28} style={{ color: C.action }} className="animate-spin" /></div>
      ) : products.length === 0 ? (
        <p className="text-sm py-8 text-center" style={{ color: C.muted }}>No products found.</p>
      ) : (
        <TableWrap>
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>Category</Th>
              <Th>Price</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} style={{ background: C.card }}>
                <Td>
                  <div>
                    <p className="font-medium">{p.name}</p>
                    {p.description && (
                      <p className="text-xs mt-0.5 line-clamp-1" style={{ color: C.muted }}>{p.description}</p>
                    )}
                  </div>
                </Td>
                <Td><span style={{ color: C.muted }}>{p.category}</span></Td>
                <Td>
                  {p.price != null ? (
                    <span style={{ color: C.warning }}>QAR {p.price.toLocaleString()}</span>
                  ) : (
                    <span style={{ color: C.muted }}>—</span>
                  )}
                </Td>
                <Td>{statusBadge(p.status)}</Td>
                <Td>
                  <button
                    onClick={() => toggleStatus(p.id, p.status)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors"
                    style={{
                      background: p.status === "active" ? "#EF444420" : "#22C55E20",
                      color:      p.status === "active" ? C.danger    : C.success,
                      border:     `1px solid ${p.status === "active" ? "#EF444440" : "#22C55E40"}`,
                    }}
                  >
                    {p.status === "active" ? <><X size={12} /> Deactivate</> : <><Check size={12} /> Activate</>}
                  </button>
                </Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      )}
    </div>
  );
}

// ── Clients Tab ──────────────────────────────────────────────────────
function ClientsTab() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newClient, setNewClient] = useState({ name: "", logo_url: "", website_url: "", display_order: "0" });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("clients").select("*").order("display_order");
    setClients(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function toggleActive(id: string, current: boolean) {
    await supabase.from("clients").update({ active: !current }).eq("id", id);
    setClients((prev) => prev.map((c) => c.id === id ? { ...c, active: !current } : c));
  }

  async function deleteClient(id: string) {
    if (!confirm("Delete this client?")) return;
    await supabase.from("clients").delete().eq("id", id);
    setClients((prev) => prev.filter((c) => c.id !== id));
  }

  async function addClient(e: React.FormEvent) {
    e.preventDefault();
    if (!newClient.name.trim()) return;
    setSaving(true);
    await supabase.from("clients").insert({
      name: newClient.name.trim(),
      logo_url:    newClient.logo_url.trim()    || null,
      website_url: newClient.website_url.trim() || null,
      display_order: parseInt(newClient.display_order) || 0,
      active: true,
    });
    setNewClient({ name: "", logo_url: "", website_url: "", display_order: "0" });
    setShowAdd(false);
    setSaving(false);
    load();
  }

  const inputSt: React.CSSProperties = {
    background: C.card, border: `1px solid ${C.border}`,
    borderRadius: 8, padding: "8px 12px", color: C.text,
    fontSize: 13, width: "100%", outline: "none",
  };

  return (
    <div>
      <SectionHeader
        title="Clients (Logo Slider)"
        count={clients.length}
        onRefresh={load}
        loading={loading}
      >
        <button
          onClick={() => setShowAdd((v) => !v)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
          style={{ background: C.action, color: "#fff" }}
        >
          <Plus size={14} /> Add Client
        </button>
      </SectionHeader>

      {/* Add form */}
      {showAdd && (
        <form
          onSubmit={addClient}
          className="rounded-xl p-5 mb-5 space-y-3"
          style={{ background: C.card, border: `1px solid ${C.border}` }}
        >
          <p className="text-sm font-semibold mb-1" style={{ color: C.text }}>New Client</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs mb-1" style={{ color: C.muted }}>Name *</label>
              <input required style={inputSt} placeholder="Client / Brand name"
                value={newClient.name} onChange={(e) => setNewClient((f) => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs mb-1" style={{ color: C.muted }}>Logo URL</label>
              <input style={inputSt} placeholder="https://..."
                value={newClient.logo_url} onChange={(e) => setNewClient((f) => ({ ...f, logo_url: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs mb-1" style={{ color: C.muted }}>Website URL</label>
              <input style={inputSt} placeholder="https://..."
                value={newClient.website_url} onChange={(e) => setNewClient((f) => ({ ...f, website_url: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs mb-1" style={{ color: C.muted }}>Display Order</label>
              <input type="number" style={inputSt} placeholder="0"
                value={newClient.display_order} onChange={(e) => setNewClient((f) => ({ ...f, display_order: e.target.value }))} />
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button type="submit" disabled={saving}
              className="px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-60"
              style={{ background: C.action, color: "#fff" }}>
              {saving ? "Saving…" : "Save Client"}
            </button>
            <button type="button" onClick={() => setShowAdd(false)}
              className="px-4 py-2 rounded-lg text-sm font-medium"
              style={{ background: C.card, color: C.muted, border: `1px solid ${C.border}` }}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 size={28} style={{ color: C.action }} className="animate-spin" /></div>
      ) : clients.length === 0 ? (
        <p className="text-sm py-8 text-center" style={{ color: C.muted }}>No clients yet. Add one above.</p>
      ) : (
        <TableWrap>
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>Logo</Th>
              <Th>Order</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr key={c.id} style={{ background: C.card }}>
                <Td><span className="font-medium">{c.name}</span></Td>
                <Td>
                  {c.logo_url ? (
                    <img src={c.logo_url} alt={c.name} className="h-7 object-contain opacity-80 rounded" />
                  ) : (
                    <span style={{ color: C.muted }}>No logo</span>
                  )}
                </Td>
                <Td><span style={{ color: C.muted }}>{c.display_order}</span></Td>
                <Td>
                  <Badge color={c.active ? "green" : "gray"}>{c.active ? "Active" : "Hidden"}</Badge>
                </Td>
                <Td>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleActive(c.id, c.active)}
                      className="px-3 py-1.5 rounded text-xs font-medium"
                      style={{
                        background: c.active ? "#EF444420" : "#22C55E20",
                        color:      c.active ? C.danger    : C.success,
                        border:     `1px solid ${c.active ? "#EF444440" : "#22C55E40"}`,
                      }}
                    >
                      {c.active ? "Hide" : "Show"}
                    </button>
                    <button
                      onClick={() => deleteClient(c.id)}
                      className="p-1.5 rounded text-xs"
                      style={{ color: C.danger, background: "#EF444420", border: `1px solid #EF444440` }}
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      )}
    </div>
  );
}

// ── Messages Tab ─────────────────────────────────────────────────────
function MessagesTab() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    setMessages(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function markRead(id: string) {
    await supabase.from("contact_messages").update({ status: "read" }).eq("id", id);
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, status: "read" } : m));
  }

  async function deleteMsg(id: string) {
    if (!confirm("Delete this message?")) return;
    await supabase.from("contact_messages").delete().eq("id", id);
    setMessages((prev) => prev.filter((m) => m.id !== id));
  }

  return (
    <div>
      <SectionHeader title="Contact Messages" count={messages.length} onRefresh={load} loading={loading} />

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 size={28} style={{ color: C.action }} className="animate-spin" /></div>
      ) : messages.length === 0 ? (
        <p className="text-sm py-8 text-center" style={{ color: C.muted }}>No messages yet.</p>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className="rounded-xl"
              style={{
                background: C.card,
                border: `1px solid ${m.status === "read" ? C.border : C.action + "44"}`,
              }}
            >
              <button
                className="w-full flex items-center justify-between gap-4 p-4 text-left"
                onClick={() => setExpanded(expanded === m.id ? null : m.id)}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold" style={{ color: C.text }}>{m.full_name}</p>
                    <p className="text-xs" style={{ color: C.muted }}>{m.email}{m.phone ? ` · ${m.phone}` : ""}</p>
                  </div>
                  {m.status !== "read" && <Badge color="orange">New</Badge>}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs" style={{ color: C.muted }}>
                    {new Date(m.created_at).toLocaleDateString()}
                  </span>
                  <ChevronDown
                    size={16}
                    style={{
                      color: C.muted,
                      transform: expanded === m.id ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s",
                    }}
                  />
                </div>
              </button>

              {expanded === m.id && (
                <div className="px-4 pb-4 space-y-3" style={{ borderTop: `1px solid ${C.border}` }}>
                  <p className="text-sm pt-3 leading-relaxed" style={{ color: C.text }}>{m.message}</p>
                  <div className="flex gap-2">
                    {m.status !== "read" && (
                      <button
                        onClick={() => markRead(m.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium"
                        style={{ background: "#22C55E20", color: C.success, border: `1px solid #22C55E40` }}
                      >
                        <Check size={12} /> Mark as Read
                      </button>
                    )}
                    <a
                      href={`mailto:${m.email}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium"
                      style={{ background: C.card, color: C.muted, border: `1px solid ${C.border}` }}
                    >
                      Reply by Email
                    </a>
                    <button
                      onClick={() => deleteMsg(m.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium"
                      style={{ background: "#EF444420", color: C.danger, border: `1px solid #EF444440` }}
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Requests Tab ─────────────────────────────────────────────────────
function RequestsTab() {
  const [requests, setRequests] = useState<ProductRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("product_requests")
      .select("*")
      .order("created_at", { ascending: false });
    setRequests(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function updateStatus(id: string, status: string) {
    await supabase.from("product_requests").update({ status }).eq("id", id);
    setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
  }

  return (
    <div>
      <SectionHeader title="Quote Requests" count={requests.length} onRefresh={load} loading={loading} />

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 size={28} style={{ color: C.action }} className="animate-spin" /></div>
      ) : requests.length === 0 ? (
        <p className="text-sm py-8 text-center" style={{ color: C.muted }}>No quote requests yet.</p>
      ) : (
        <div className="space-y-3">
          {requests.map((r) => (
            <div
              key={r.id}
              className="rounded-xl"
              style={{
                background: C.card,
                border: `1px solid ${!r.status || r.status === "pending" ? C.action + "44" : C.border}`,
              }}
            >
              <button
                className="w-full flex items-center justify-between gap-4 p-4 text-left"
                onClick={() => setExpanded(expanded === r.id ? null : r.id)}
              >
                <div className="flex items-center gap-4 min-w-0 flex-wrap">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold" style={{ color: C.text }}>{r.customer_name}</p>
                    <p className="text-xs" style={{ color: C.muted }}>
                      {r.product_name ?? "No product"} · Qty: {r.quantity ?? 1}
                    </p>
                  </div>
                  {statusBadge(r.status)}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs" style={{ color: C.muted }}>
                    {new Date(r.created_at).toLocaleDateString()}
                  </span>
                  <ChevronDown
                    size={16}
                    style={{
                      color: C.muted,
                      transform: expanded === r.id ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s",
                    }}
                  />
                </div>
              </button>

              {expanded === r.id && (
                <div className="px-4 pb-4 space-y-3" style={{ borderTop: `1px solid ${C.border}` }}>
                  <div className="grid sm:grid-cols-2 gap-3 pt-3">
                    <div>
                      <p className="text-xs mb-1" style={{ color: C.muted }}>Email</p>
                      <a href={`mailto:${r.email}`} className="text-sm" style={{ color: C.action }}>{r.email}</a>
                    </div>
                    {r.phone && (
                      <div>
                        <p className="text-xs mb-1" style={{ color: C.muted }}>Phone</p>
                        <a href={`tel:${r.phone}`} className="text-sm" style={{ color: C.text }}>{r.phone}</a>
                      </div>
                    )}
                    {r.notes && (
                      <div className="sm:col-span-2">
                        <p className="text-xs mb-1" style={{ color: C.muted }}>Notes</p>
                        <p className="text-sm leading-relaxed" style={{ color: C.text }}>{r.notes}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => updateStatus(r.id, "fulfilled")}
                      disabled={r.status === "fulfilled"}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium disabled:opacity-40"
                      style={{ background: "#22C55E20", color: C.success, border: `1px solid #22C55E40` }}
                    >
                      <Check size={12} /> Mark Fulfilled
                    </button>
                    <button
                      onClick={() => updateStatus(r.id, "cancelled")}
                      disabled={r.status === "cancelled"}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium disabled:opacity-40"
                      style={{ background: "#EF444420", color: C.danger, border: `1px solid #EF444440` }}
                    >
                      <X size={12} /> Cancel
                    </button>
                    <button
                      onClick={() => updateStatus(r.id, "pending")}
                      disabled={r.status === "pending" || !r.status}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium disabled:opacity-40"
                      style={{ background: "#F59E0B20", color: C.warning, border: `1px solid #F59E0B40` }}
                    >
                      Reset to Pending
                    </button>
                    <a
                      href={`mailto:${r.email}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium"
                      style={{ background: C.card, color: C.muted, border: `1px solid ${C.border}` }}
                    >
                      Reply by Email
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Nav items ────────────────────────────────────────────────────────
const NAV = [
  { id: "overview",  label: "Overview",        Icon: LayoutDashboard },
  { id: "products",  label: "Products",         Icon: Package },
  { id: "clients",   label: "Clients",          Icon: Users },
  { id: "messages",  label: "Messages",         Icon: MessageSquare },
  { id: "requests",  label: "Quote Requests",   Icon: ClipboardList },
] as const;

type TabId = typeof NAV[number]["id"];

// ── Main Dashboard ────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [tab, setTab] = useState<TabId>("overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [stats, setStats] = useState({ products: 0, clients: 0, messages: 0, requests: 0 });
  const [recentMessages, setRecentMessages] = useState<ContactMessage[]>([]);
  const [recentRequests, setRecentRequests] = useState<ProductRequest[]>([]);

  // Auth guard
  useEffect(() => {
    if (!sessionStorage.getItem("carzix-admin-auth")) {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  // Load overview data
  useEffect(() => {
    Promise.all([
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase.from("clients").select("*", { count: "exact", head: true }),
      supabase.from("contact_messages").select("*", { count: "exact", head: true }),
      supabase.from("product_requests").select("*", { count: "exact", head: true }),
      supabase.from("contact_messages").select("*").order("created_at", { ascending: false }).limit(5),
      supabase.from("product_requests").select("*").order("created_at", { ascending: false }).limit(5),
    ]).then(([p, c, m, r, msgs, reqs]) => {
      setStats({
        products: p.count ?? 0,
        clients:  c.count ?? 0,
        messages: m.count ?? 0,
        requests: r.count ?? 0,
      });
      setRecentMessages((msgs.data ?? []) as ContactMessage[]);
      setRecentRequests((reqs.data ?? []) as ProductRequest[]);
    });
  }, []);

  function handleLogout() {
    sessionStorage.removeItem("carzix-admin-auth");
    setLocation("/admin/login");
  }

  const currentLabel = NAV.find((n) => n.id === tab)?.label ?? "";

  return (
    <div className="min-h-screen flex" style={{ background: C.bg, color: C.text }}>
      {/* ── Sidebar (desktop) ── */}
      <aside
        className="hidden lg:flex flex-col w-56 shrink-0"
        style={{ background: C.panel, borderRight: `1px solid ${C.border}` }}
      >
        {/* Logo */}
        <div className="p-5" style={{ borderBottom: `1px solid ${C.border}` }}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded flex items-center justify-center" style={{ background: C.action }}>
              <span className="text-white font-black text-xs">CZ</span>
            </div>
            <span className="text-white font-black tracking-widest text-sm uppercase">CARZIX</span>
          </div>
          <p className="text-xs mt-1 tracking-wider" style={{ color: C.muted }}>Admin Panel</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5">
          {NAV.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left"
              style={
                tab === id
                  ? { background: C.action + "18", color: C.action, border: `1px solid ${C.action}30` }
                  : { color: C.muted, border: "1px solid transparent" }
              }
              onMouseEnter={(e) => { if (tab !== id) e.currentTarget.style.background = C.hover; }}
              onMouseLeave={(e) => { if (tab !== id) e.currentTarget.style.background = "transparent"; }}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3" style={{ borderTop: `1px solid ${C.border}` }}>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
            style={{ color: C.muted }}
            onMouseEnter={(e) => { e.currentTarget.style.color = C.danger; e.currentTarget.style.background = C.hover; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = C.muted; e.currentTarget.style.background = "transparent"; }}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header
          className="flex items-center justify-between px-5 py-4 shrink-0"
          style={{ background: C.panel, borderBottom: `1px solid ${C.border}` }}
        >
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden p-1.5 rounded"
              style={{ color: C.muted }}
            >
              <Menu size={20} />
            </button>
            <h1 className="text-sm font-semibold" style={{ color: C.text }}>{currentLabel}</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs hidden sm:block" style={{ color: C.muted }}>
              {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
            </span>
            <button
              onClick={handleLogout}
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium"
              style={{ color: C.danger, background: "#EF444415", border: `1px solid #EF444430` }}
            >
              <LogOut size={13} /> Logout
            </button>
          </div>
        </header>

        {/* Mobile nav drawer */}
        {mobileOpen && (
          <div
            className="lg:hidden p-3 space-y-0.5"
            style={{ background: C.panel, borderBottom: `1px solid ${C.border}` }}
          >
            {NAV.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => { setTab(id); setMobileOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-left"
                style={
                  tab === id
                    ? { background: C.action + "18", color: C.action }
                    : { color: C.muted }
                }
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-5 lg:p-7">
          {tab === "overview" && (
            <OverviewTab
              stats={stats}
              recentMessages={recentMessages}
              recentRequests={recentRequests}
            />
          )}
          {tab === "products"  && <ProductsTab />}
          {tab === "clients"   && <ClientsTab />}
          {tab === "messages"  && <MessagesTab />}
          {tab === "requests"  && <RequestsTab />}
        </main>
      </div>
    </div>
  );
}
