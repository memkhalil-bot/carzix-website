import type { ReactNode } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import { C } from "./theme";
import type { Lang } from "./theme";

export function Th({ children, lang }: { children: ReactNode; lang: Lang }) {
  return (
    <th
      className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider ${lang === "ar" ? "text-right" : "text-left"}`}
      style={{ color: C.muted, background: C.surface2, borderBottom: `1px solid ${C.border}` }}
    >
      {children}
    </th>
  );
}

export function Td({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <td
      className={`px-4 py-3 text-sm ${className}`}
      style={{ color: C.text, borderBottom: `1px solid ${C.border}` }}
    >
      {children}
    </td>
  );
}

export function TableWrap({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">{children}</table>
      </div>
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div
      className="flex items-center justify-center py-16 px-6 rounded-xl text-sm text-center"
      style={{ background: C.surface, border: `1px dashed ${C.border}`, color: C.muted }}
    >
      {message}
    </div>
  );
}

export function LoadingState() {
  return (
    <div className="flex justify-center py-16">
      <Loader2 size={28} style={{ color: C.action }} className="animate-spin" />
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div
      className="flex items-center gap-3 py-5 px-6 rounded-xl text-sm"
      style={{ background: "#EF444412", border: `1px solid #EF444440`, color: C.danger }}
    >
      <AlertTriangle size={18} className="shrink-0" />
      <span>{message}</span>
    </div>
  );
}
