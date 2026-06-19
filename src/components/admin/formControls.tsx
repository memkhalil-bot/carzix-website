import type { ReactNode, CSSProperties } from "react";
import { C } from "./theme";

export function inputStyle(): CSSProperties {
  return {
    background: C.surface2,
    border: `1px solid ${C.border}`,
    borderRadius: 8,
    padding: "8px 12px",
    color: C.text,
    fontSize: 13,
    width: "100%",
    outline: "none",
  };
}

export function LabelEl({ children }: { children: ReactNode }) {
  return (
    <label className="block text-xs font-medium mb-1" style={{ color: C.muted }}>
      {children}
    </label>
  );
}
