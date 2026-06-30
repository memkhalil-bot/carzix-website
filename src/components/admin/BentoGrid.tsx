import type { ReactNode } from "react";

export function BentoGrid({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-4 auto-rows-[minmax(0,1fr)] gap-4 ${className}`}>
      {children}
    </div>
  );
}
