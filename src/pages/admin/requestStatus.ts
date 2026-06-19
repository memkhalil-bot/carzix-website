import type { BadgeColor } from "@/components/admin/StatusBadge";

export type NormalizedStatus = "new" | "contacted" | "quoted" | "won" | "lost";

// "won"/"lost" are the current workflow; "closed"/"fulfilled"/"cancelled" are
// legacy values from the prior workflow, mapped here so old rows still read sensibly.
export function normalizedRequestStatus(status: string | null | undefined): NormalizedStatus {
  const s = (status ?? "").toLowerCase();
  if (s === "contacted") return "contacted";
  if (s === "quoted") return "quoted";
  if (s === "won" || s === "closed" || s === "fulfilled") return "won";
  if (s === "lost" || s === "cancelled") return "lost";
  return "new";
}

export function statusBadgeColor(status: string | null | undefined): BadgeColor {
  const colors: Record<NormalizedStatus, BadgeColor> = {
    new: "yellow", contacted: "blue", quoted: "yellow", won: "green", lost: "red",
  };
  return colors[normalizedRequestStatus(status)];
}

export function productStatusBadgeColor(status: string | null | undefined): BadgeColor {
  return (status ?? "").toLowerCase() === "active" ? "green" : "red";
}
