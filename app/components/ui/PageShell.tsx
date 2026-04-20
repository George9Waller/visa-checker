import React from "react";
import { Flex } from "./layout/Flex";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <Flex variant="column" pb="section">
      {children}
    </Flex>
  );
}
