import { AlertTriangle } from "lucide-react";
import { C } from "./theme";
import type { Lang } from "./theme";
import { t } from "./i18n";

export function ConfirmModal({
  lang,
  message,
  onConfirm,
  onCancel,
}: {
  lang: Lang;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6"
        style={{ background: C.surface, border: `1px solid ${C.border}` }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-full shrink-0"
            style={{ background: "#EF444418", color: C.danger }}
          >
            <AlertTriangle size={18} />
          </div>
          <p className="text-sm leading-relaxed" style={{ color: C.text }}>{message}</p>
        </div>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{ background: C.surface2, color: C.text, border: `1px solid ${C.border}` }}
          >
            {t("cancel", lang)}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg text-sm font-semibold"
            style={{ background: C.danger, color: "#fff" }}
          >
            {t("confirm", lang)} · {t("delete", lang)}
          </button>
        </div>
      </div>
    </div>
  );
}
