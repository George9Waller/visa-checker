import React from "react";
import { Icon } from "./typography/Icon";
import { Flex } from "./layout/Flex";
import { Text } from "./typography/Text";

export function EmptyState({
  icon,
  message,
  action,
}: {
  icon: string;
  message: string;
  action?: React.ReactNode;
}) {
  return (
    <Flex
      variant="column-center"
      p="section"
      gap="md"
      textAlign="center"
      style={{
        border: "1px dashed var(--border)",
        borderRadius: "var(--r)",
      }}
    >
      <Icon name={icon} size="xl" color="faint" />
      <Text
        variant="body"
        color="muted"
        style={{ fontWeight: 500 }}
      >
        {message}
      </Text>
      {action}
    </Flex>
  );
}
