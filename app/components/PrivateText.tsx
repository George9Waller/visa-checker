"use client";

import { useState } from "react";

export default function PrivateText({
  children,
}: {
  children: React.ReactNode;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="inline-flex justify-center items-center cursor-pointer"
      onClick={() => setVisible(!visible)}
    >
      <div
        className="relative"
        style={{ borderRadius: "var(--r-s)", backgroundColor: "var(--bg-raised)" }}
      >
        <div>{children}</div>
        {!visible && (
          <div
            className="absolute inset-0 flex justify-center items-center"
            style={{
              backdropFilter: "blur(6px)",
              backgroundColor: "rgba(255,255,255,0.1)",
              borderRadius: "var(--r-s)",
            }}
          />
        )}
      </div>
    </div>
  );
}
