import type { ReactNode } from "react";
import { C } from "./theme";

export function MetricCard({
  label,
  value,
  sub,
  accent,
  icon,
  size = "sm",
}: {
  label: string;
  value: number | string;
  sub?: string;
  accent?: string;
  icon?: ReactNode;
  size?: "sm" | "hero";
}) {
  const isHero = size === "hero";
  return (
    <div
      className={`rounded-2xl ${isHero ? "p-6 sm:col-span-2 flex items-center justify-between gap-4" : "p-5"}`}
      style={{
        background: C.surface,
        border: `1px solid ${isHero ? C.goldBorder : C.border}`,
        boxShadow: isHero ? `inset 0 1px 0 0 ${C.goldDim}` : undefined,
      }}
    >
      {isHero ? (
        <>
          <div className="min-w-0">
            <p className="font-semibold uppercase tracking-widest text-xs mb-2" style={{ color: C.goldHi }}>
              {label}
            </p>
            <p className="font-black truncate text-4xl sm:text-5xl" style={{ color: accent ?? C.text }}>
              {value}
            </p>
            {sub && (
              <p className="mt-1 truncate text-sm" style={{ color: C.muted }}>
                {sub}
              </p>
            )}
          </div>
          {icon && (
            <div
              className="flex items-center justify-center rounded-lg shrink-0 w-12 h-12"
              style={{ background: C.goldDim, color: accent ?? C.brand }}
            >
              {icon}
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="font-semibold uppercase tracking-widest text-xs" style={{ color: C.muted }}>
              {label}
            </p>
            {icon && (
              <div
                className="flex items-center justify-center rounded-lg shrink-0 w-8 h-8"
                style={{ background: C.surface2, color: accent ?? C.action }}
              >
                {icon}
              </div>
            )}
          </div>
          <p className="font-black truncate text-2xl" style={{ color: accent ?? C.text }}>
            {value}
          </p>
          {sub && (
            <p className="mt-1 truncate text-xs" style={{ color: C.muted }}>
              {sub}
            </p>
          )}
        </>
      )}
    </div>
  );
}
