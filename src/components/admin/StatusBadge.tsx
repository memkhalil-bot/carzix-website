import { C } from "./theme";

export type BadgeColor = "green" | "blue" | "red" | "gray" | "yellow";

const COLORS: Record<BadgeColor, { bg: string; color: string; border: string }> = {
  green:  { bg: "#22C55E18", color: C.success, border: "#22C55E30" },
  blue:   { bg: "#1565A018", color: C.info,    border: "#1565A030" },
  red:    { bg: "#EF444418", color: C.danger,  border: "#EF444430" },
  yellow: { bg: "#D4AF3718", color: C.warning, border: "#D4AF3730" },
  gray:   { bg: "#8E958A18", color: C.muted,   border: "#8E958A30" },
};

export function StatusBadge({ color, children }: { color: BadgeColor; children: React.ReactNode }) {
  const s = COLORS[color];
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold"
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
    >
      {children}
    </span>
  );
}
