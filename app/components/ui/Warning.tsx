import Link from "next/link";
import { Flex } from "./layout/Flex";
import { Text } from "./typography/Text";
import { Box } from "./layout/Box";
import { Icon } from "./typography/Icon";

export function Warning({
  title,
  description,
  action,
  link,
}: {
  title: string;
  description: string;
  action: string;
  link: string;
}) {
  return (
    <Link href={link} style={{ textDecoration: "none", width: "100%", display: "block" }}>
      <Flex
        variant="row-between"
        width="full"
        py="sm"
        px="md"
        style={{ 
          background: "var(--bg-warn)", 
          border: "1px solid var(--warn)", 
          borderRadius: "var(--r)" 
        }}
      >
        <Flex variant="row-center" gap="md">
          <Box style={{ width: 8, height: 8, borderRadius: "99px", background: "var(--warn)", flexShrink: 0 }} />
          <Flex variant="column" minW={0}>
            <Text variant="body" style={{ fontSize: 13, fontWeight: 600, minWidth: 0 }} truncate>
              {title}
            </Text>
            <Text variant="body" color="muted" mt="xs" style={{ fontSize: 12, fontWeight: 400, minWidth: 0 }} truncate>
              {description}
            </Text>
          </Flex>
        </Flex>

        <Text variant="mono" color="muted" style={{ fontSize: 11, letterSpacing: "0.04em", flexShrink: 0 }}>
          {action}{" "}
          <Icon name="arrow_forward" size="sm" color="muted" style={{ verticalAlign: "middle", marginLeft: 4 }} />
        </Text>
      </Flex>
    </Link>
  );
}
