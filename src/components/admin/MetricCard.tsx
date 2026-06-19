import type { ReactNode } from "react";
import { C } from "./theme";

export function MetricCard({
  label,
  value,
  sub,
  accent,
  icon,
}: {
  label: string;
  value: number | string;
  sub?: string;
  accent?: string;
  icon?: ReactNode;
}) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: C.surface, border: `1px solid ${C.border}` }}
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: C.muted }}>
          {label}
        </p>
        {icon && (
          <div
            className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
            style={{ background: C.surface2, color: accent ?? C.action }}
          >
            {icon}
          </div>
        )}
      </div>
      <p className="text-2xl font-black truncate" style={{ color: accent ?? C.text }}>
        {value}
      </p>
      {sub && (
        <p className="text-xs mt-1 truncate" style={{ color: C.muted }}>
          {sub}
        </p>
      )}
    </div>
  );
}
