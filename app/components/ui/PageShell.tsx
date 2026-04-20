import React from "react";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", paddingBottom: 128 }}>
      {children}
    </div>
  );
}
