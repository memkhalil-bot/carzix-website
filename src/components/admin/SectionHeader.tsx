import type { ReactNode } from "react";
import { C } from "./theme";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  count?: number;
  icon?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function SectionHeader({ title, subtitle, count, icon, actions, className = "" }: SectionHeaderProps) {
  return (
    <div className={`flex items-center justify-between mb-5 flex-wrap gap-3 ${className}`}>
      <div className="min-w-0">
        <div className="flex items-center gap-2.5">
          {icon && (
            <div
              className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
              style={{ background: C.goldDim, color: C.brand }}
            >
              {icon}
            </div>
          )}
          <h2 className="text-lg font-bold" style={{ color: C.text }}>{title}</h2>
          {count != null && (
            <span
              className="px-2 py-0.5 rounded-full text-xs font-semibold"
              style={{ background: C.surface2, color: C.muted, border: `1px solid ${C.border}` }}
            >
              {count}
            </span>
          )}
        </div>
        {subtitle && <p className="text-xs mt-1" style={{ color: C.muted }}>{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
