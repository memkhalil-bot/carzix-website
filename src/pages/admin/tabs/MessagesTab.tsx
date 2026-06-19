import { useEffect, useState, useCallback } from "react";
import { Loader2, Check, ChevronDown, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { ContactMessage } from "@/lib/types";
import { C } from "@/components/admin/theme";
import type { Lang } from "@/components/admin/theme";
import { t } from "@/components/admin/i18n";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { EmptyState } from "@/components/admin/AdminTable";
import { ConfirmModal } from "@/components/admin/ConfirmModal";

export function MessagesTab({ lang }: { lang: Lang }) {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
    setMessages(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function markRead(id: string) {
    await supabase.from("contact_messages").update({ status: "read" }).eq("id", id);
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, status: "read" } : m));
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    await supabase.from("contact_messages").delete().eq("id", deleteTarget);
    setMessages((prev) => prev.filter((m) => m.id !== deleteTarget));
    setDeleteTarget(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold" style={{ color: C.text }}>{t("contactMsgs", lang)}</h2>
          <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{ background: C.surface2, color: C.muted, border: `1px solid ${C.border}` }}>
            {messages.length}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={28} style={{ color: C.action }} className="animate-spin" />
        </div>
      ) : messages.length === 0 ? (
        <EmptyState message={t("noMessages", lang)} />
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div key={m.id} className="rounded-xl" style={{ background: C.surface, border: `1px solid ${m.status === "read" ? C.border : C.action + "44"}` }}>
              <button className="w-full flex items-center justify-between gap-4 p-4 text-left" onClick={() => setExpanded(expanded === m.id ? null : m.id)}>
                <div className="flex items-center gap-4 min-w-0">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold" style={{ color: C.text }}>{m.full_name}</p>
                    <p className="text-xs" style={{ color: C.muted }}>{m.email}{m.phone ? ` · ${m.phone}` : ""}</p>
                  </div>
                  {m.status !== "read" && <StatusBadge color="blue">{t("newBadge", lang)}</StatusBadge>}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs" style={{ color: C.muted }}>{new Date(m.created_at).toLocaleDateString()}</span>
                  <ChevronDown size={16} style={{ color: C.muted, transform: expanded === m.id ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
                </div>
              </button>

              {expanded === m.id && (
                <div className="px-4 pb-4 space-y-3" style={{ borderTop: `1px solid ${C.border}` }}>
                  <p className="text-sm pt-3 leading-relaxed" style={{ color: C.text }}>{m.message}</p>
                  <div className="flex gap-2">
                    {m.status !== "read" && (
                      <button onClick={() => markRead(m.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium"
                        style={{ background: "#22C55E15", color: C.success, border: "1px solid #22C55E30" }}>
                        <Check size={12} /> {t("markRead", lang)}
                      </button>
                    )}
                    <a href={`mailto:${m.email}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium"
                      style={{ background: C.surface2, color: C.muted, border: `1px solid ${C.border}` }}>
                      {t("replyEmail", lang)}
                    </a>
                    <button onClick={() => setDeleteTarget(m.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium"
                      style={{ background: "#EF444415", color: C.danger, border: "1px solid #EF444430" }}>
                      <Trash2 size={12} /> {t("delete", lang)}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {deleteTarget && (
        <ConfirmModal
          lang={lang}
          message={t("confirmDeleteMessage", lang)}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
