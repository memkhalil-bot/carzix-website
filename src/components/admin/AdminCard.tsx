import type { ReactNode, CSSProperties } from "react";
import { C } from "./theme";

interface AdminCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  padding?: "none" | "sm" | "md";
}

const PADDING: Record<NonNullable<AdminCardProps["padding"]>, string> = {
  none: "",
  sm: "p-4",
  md: "p-5",
};

export function AdminCard({ children, className = "", style, padding = "md" }: AdminCardProps) {
  return (
    <div
      className={`rounded-2xl ${PADDING[padding]} ${className}`}
      style={{ background: C.surface, border: `1px solid ${C.border}`, ...style }}
    >
      {children}
    </div>
  );
}
