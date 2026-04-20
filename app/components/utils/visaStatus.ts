import {
  TimelineTrip
} from "@/app/server-actions";

export type VisaStatus = "covered" | "no-visa" | "invalid" | "not-required";

export function getVisaStatus(trip: TimelineTrip): VisaStatus {
  if (!trip.visaRequired) return "not-required";
  if (!trip.visa) return "no-visa";
  if (!trip.visaValid) return "invalid";
  return "covered";
}

export type Tone = "ok" | "warn" | "danger" | "muted";

export function statusTone(status: VisaStatus): Tone {
  if (status === "covered") return "ok";
  if (status === "no-visa") return "warn";
  if (status === "invalid") return "danger";
  return "muted";
}