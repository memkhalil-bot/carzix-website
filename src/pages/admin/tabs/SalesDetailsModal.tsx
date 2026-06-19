import { useState } from "react";
import type React from "react";
import { X, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { ProductRequest } from "@/lib/types";
import { C } from "@/components/admin/theme";
import type { Lang } from "@/components/admin/theme";
import { t } from "@/components/admin/i18n";
import { inputStyle, LabelEl } from "@/components/admin/formControls";
import { normalizedRequestStatus } from "../requestStatus";
import { dateInputValue, dateInputToIso } from "../followUp";

interface SalesDetailsForm {
  internal_notes: string;
  next_follow_up_at: string;
  estimated_value: string;
  quoted_value: string;
  lost_reason: string;
}

function requestToForm(r: ProductRequest): SalesDetailsForm {
  return {
    internal_notes: r.internal_notes ?? "",
    next_follow_up_at: dateInputValue(r.next_follow_up_at),
    estimated_value: r.estimated_value != null ? String(r.estimated_value) : "",
    quoted_value: r.quoted_value != null ? String(r.quoted_value) : "",
    lost_reason: r.lost_reason ?? "",
  };
}

interface SalesDetailsModalProps {
  lang: Lang;
  request: ProductRequest;
  onClose: () => void;
  onSaved: (updated: ProductRequest) => void;
}

export function SalesDetailsModal({ lang, request, onClose, onSaved }: SalesDetailsModalProps) {
  const [form, setForm] = useState<SalesDetailsForm>(requestToForm(request));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isLost = normalizedRequestStatus(request.status) === "lost";
  const inp = inputStyle();

  function setField<K extends keyof SalesDetailsForm>(key: K, value: SalesDetailsForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      internal_notes: form.internal_notes.trim() || null,
      next_follow_up_at: dateInputToIso(form.next_follow_up_at),
      estimated_value: form.estimated_value ? parseFloat(form.estimated_value) : null,
      quoted_value: form.quoted_value ? parseFloat(form.quoted_value) : null,
      lost_reason: isLost ? (form.lost_reason.trim() || null) : request.lost_reason,
    };

    const { error: err } = await supabase.from("product_requests").update(payload).eq("id", request.id);

    setSaving(false);
    if (err) {
      setError(err.message ?? "Error saving sales details.");
      return;
    }
    onSaved({ ...request, ...payload });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-lg my-8 mx-4 rounded-2xl shadow-xl"
        style={{ background: C.surface, border: `1px solid ${C.border}` }}
      >
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid ${C.border}` }}>
          <h2 className="text-base font-bold" style={{ color: C.text }}>{t("salesDetails", lang)}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg" style={{ color: C.muted, background: C.surface2 }}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <LabelEl>{t("internalNotes", lang)} <span className="text-xs font-normal" style={{ color: C.muted }}>— {t("internalNotesHint", lang)}</span></LabelEl>
            <textarea rows={4} style={{ ...inp, resize: "vertical" }}
              value={form.internal_notes} onChange={(e) => setField("internal_notes", e.target.value)} />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <LabelEl>{t("nextFollowUp", lang)}</LabelEl>
              <input type="date" style={inp}
                value={form.next_follow_up_at} onChange={(e) => setField("next_follow_up_at", e.target.value)} />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <LabelEl>{t("estimatedValue", lang)}</LabelEl>
              <input type="number" min="0" step="0.01" style={inp} placeholder="0.00"
                value={form.estimated_value} onChange={(e) => setField("estimated_value", e.target.value)} />
            </div>
            <div>
              <LabelEl>{t("quotedValue", lang)}</LabelEl>
              <input type="number" min="0" step="0.01" style={inp} placeholder="0.00"
                value={form.quoted_value} onChange={(e) => setField("quoted_value", e.target.value)} />
            </div>
          </div>

          {isLost && (
            <div>
              <LabelEl>{t("lostReason", lang)}</LabelEl>
              <textarea rows={2} style={{ ...inp, resize: "vertical" }} placeholder={t("lostReasonPlaceholder", lang)}
                value={form.lost_reason} onChange={(e) => setField("lost_reason", e.target.value)} />
            </div>
          )}

          {error && (
            <p className="text-sm px-3 py-2 rounded-lg" style={{ color: C.danger, background: "#EF444410", border: "1px solid #EF444430" }}>
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold disabled:opacity-60"
              style={{ background: C.action, color: "#FFFFFF" }}>
              {saving ? <Loader2 size={14} className="animate-spin" /> : null}
              {saving ? t("saving", lang) : t("saveDetails", lang)}
            </button>
            <button type="button" onClick={onClose}
              className="px-5 py-2 rounded-lg text-sm font-medium"
              style={{ background: C.surface2, color: C.text, border: `1px solid ${C.border}` }}>
              {t("cancel", lang)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
