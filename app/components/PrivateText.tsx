"use client";

import { useState } from "react";
import { Box } from "./ui/layout/Box";
import { Flex } from "./ui/layout/Flex";

export default function PrivateText({
  children,
}: {
  children: React.ReactNode;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <Box
      as="span"
      onClick={() => setVisible(!visible)}
      style={{
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
      }}
    >
      <Box
        position="relative"
        style={{ borderRadius: "var(--r-s)", backgroundColor: "var(--bg-raised)" }}
      >
        <Box>{children}</Box>
        {!visible && (
          <Flex
            position="absolute"
            variant="row-center"
            style={{
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: "center",
              backdropFilter: "blur(6px)",
              backgroundColor: "rgba(255,255,255,0.1)",
              borderRadius: "var(--r-s)",
            }}
          />
        )}
      </Box>
    </Box>
  );
}
