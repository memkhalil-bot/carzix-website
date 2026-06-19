import type { ReactNode } from "react";
import { C } from "./theme";

export function Toolbar({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`flex flex-wrap items-center gap-3 rounded-xl p-3 mb-4 ${className}`}
      style={{ background: C.surface2, border: `1px solid ${C.border}` }}
    >
      {children}
    </div>
  );
}

export function ToolbarChip({
  active,
  accent,
  onClick,
  children,
}: {
  active: boolean;
  accent: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
      style={
        active
          ? { background: `${accent}1F`, color: accent, border: `1px solid ${accent}55` }
          : { background: C.surface, color: C.muted, border: `1px solid ${C.border}` }
      }
    >
      {children}
    </button>
  );
}
