import React from "react";
import { Flex } from "./layout/Flex";

export function ContentWell({ children }: { children: React.ReactNode }) {
  return (
    <Flex variant="column" gap="lg" p="lg">
      {children}
    </Flex>
  );
}
