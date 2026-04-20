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
      className={className}
      align="baseline"
      gap={4}
      m="28px 0 10px"
      wrap="nowrap"
      minW={0}
      style={style}
    >
      <Text variant="mono" size={14} color="var(--fg-faint)" letterSpacing="0.15em" shrink={0}>
        {number}
      </Text>
      <Heading size={20} color="var(--fg)" minW={0} className="font-display">
        {title}
      </Heading>
      {count !== undefined && (
        <Text as="span" variant="mono" size={11} color="var(--fg-faint)" letterSpacing="0.03em" shrink={0} style={{ whiteSpace: "nowrap" }}>
          · {String(count).padStart(2, "0")}
        </Text>
      )}
    </Flex>
  );
}
