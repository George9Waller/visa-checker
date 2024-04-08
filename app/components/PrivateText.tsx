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
      className="inline-flex justify-center items-center cursor-pointer transition-all"
      onClick={() => setVisible(!visible)}
    >
      <div className="relative z-0 bg-base-200 rounded">
        <div>{children}</div>
        {!visible && (
          <div className="absolute inset-0 flex justify-center items-center z-10 bg-white/30 backdrop-blur-sm rounded"></div>
        )}
      </div>
    </div>
  );
}
