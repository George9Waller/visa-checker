import React from "react";
import { Flex } from "./layout/Flex";
import { Text } from "./typography/Text";
import { Heading } from "./typography/Heading";

export function SectionHeading({
  number,
  title,
  count,
  style,
  className = "",
}: {
  number: string;
  title: string;
  count?: number;
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <Flex
      variant="row"
      mt="lg"
      mb="sm"
      gap="xs"
      style={{ alignItems: "baseline", flexWrap: "nowrap", minWidth: 0, ...style }}
    >
      <Text variant="mono" color="faint" style={{ fontSize: 14, letterSpacing: "0.15em", flexShrink: 0 }}>
        {number}
      </Text>
      <Heading variant="h4" style={{ fontSize: 20, minWidth: 0 }}>
        {title}
      </Heading>
      {count !== undefined && (
        <Text as="span" variant="mono" color="faint" style={{ fontSize: 11, letterSpacing: "0.03em", flexShrink: 0, whiteSpace: "nowrap" }}>
          · {String(count).padStart(2, "0")}
        </Text>
      )}
    </Flex>
  );
}
