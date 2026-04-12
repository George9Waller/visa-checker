"use client";

import React from "react";

export const TodayMarker = React.forwardRef<HTMLDivElement>((_, ref) => {
  const label = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return (
    <div ref={ref} className="flex items-center gap-3 my-2">
      <div className="h-px flex-1 bg-sky-500/40" />
      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-500 text-white shadow-sm shadow-sky-500/30 shrink-0">
        <span
          className="material-symbols-outlined"
          style={{ fontSize: 14, lineHeight: 1 }}
        >
          today
        </span>
        Today &middot; {label}
      </span>
      <div className="h-px flex-1 bg-sky-500/40" />
    </div>
  );
});
TodayMarker.displayName = "TodayMarker";
