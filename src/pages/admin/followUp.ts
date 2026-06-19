import type { ProductRequest } from "@/lib/types";
import { normalizedRequestStatus } from "./requestStatus";

export type FollowUpFilter = "all" | "dueToday" | "overdue" | "noFollowUp";

function isClosed(status: string | null | undefined): boolean {
  const s = normalizedRequestStatus(status);
  return s === "won" || s === "lost";
}

function todayUtcDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export function isDueToday(nextFollowUpAt: string | null): boolean {
  if (!nextFollowUpAt) return false;
  return nextFollowUpAt.slice(0, 10) === todayUtcDate();
}

export function isOverdue(nextFollowUpAt: string | null, status: string | null): boolean {
  if (!nextFollowUpAt || isClosed(status)) return false;
  return nextFollowUpAt.slice(0, 10) < todayUtcDate();
}

export function hasNoFollowUp(nextFollowUpAt: string | null, status: string | null): boolean {
  return !nextFollowUpAt && !isClosed(status);
}

export function matchesFollowUpFilter(r: ProductRequest, filter: FollowUpFilter): boolean {
  if (filter === "dueToday") return isDueToday(r.next_follow_up_at);
  if (filter === "overdue") return isOverdue(r.next_follow_up_at, r.status);
  if (filter === "noFollowUp") return hasNoFollowUp(r.next_follow_up_at, r.status);
  return true;
}

// Stored as a UTC midnight timestamp so a plain <input type="date"> round-trips cleanly.
export function dateInputValue(iso: string | null): string {
  return iso ? iso.slice(0, 10) : "";
}

export function dateInputToIso(value: string): string | null {
  return value ? `${value}T00:00:00.000Z` : null;
}
