export function fmtDateRange(start: string, end: string): string {
  const s = new Date(start + "T00:00:00");
  const e = new Date(end + "T00:00:00");
  const sDay = String(s.getDate()).padStart(2, "0");
  const eDay = String(e.getDate()).padStart(2, "0");
  const sMon = s.toLocaleDateString("en-GB", { month: "short" }).toUpperCase();
  const eMon = e.toLocaleDateString("en-GB", { month: "short" }).toUpperCase();
  if (sMon === eMon) return `${sDay}–${eDay} ${sMon}`;
  return `${sDay} ${sMon} → ${eDay} ${eMon}`;
}

export function shiftDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}