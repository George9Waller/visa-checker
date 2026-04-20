"use client";

import React from "react";
import { Box } from "./layout/Box";
import { Flex } from "./layout/Flex";
import { Text } from "./typography/Text";

function ModalTitle({ children }: { children: React.ReactNode }) {
  return (
    <Text style={{ fontSize: 16, fontWeight: 600, display: "block" }}>
      {children}
    </Text>
  );
}

function ModalBase({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <Box
      position="fixed"
      style={{
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        backgroundColor: "rgba(0,0,0,0.4)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <Flex
        variant="column"
        gap="md"
        p="xl"
        width="full"
        style={{
          backgroundColor: "var(--bg-raised)",
          border: "1px solid var(--border)",
          borderRadius: "var(--r)",
          maxWidth: 360,
        }}
      >
        {children}
      </Flex>
    </Box>
  );
}

export const Modal = Object.assign(ModalBase, { Title: ModalTitle });
