import React from "react";

export function ContentWell({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}
    >
      {children}
    </div>
  );
}
