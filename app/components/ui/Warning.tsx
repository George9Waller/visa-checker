import Link from "next/link";
import { Flex } from "./layout/Flex";
import { Text } from "./typography/Text";
import { Box } from "./layout/Box";

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
        w="100%"
        align="center"
        justify="space-between"
        bg="var(--bg-warn)"
        border="1px solid var(--warn)"
        p="10px 14px"
        borderRadius="var(--r)"
      >
        <Flex align="center" gap={16}>
          <Box w={8} h={8} borderRadius="99px" bg="var(--warn)" shrink={0} />
          <Flex direction="column" minW={0}>
            <Text size={13} weight={600} color="var(--fg)" truncate minW={0}>
              {title}
            </Text>
            <Text size={12} weight={400} mt={2} color="var(--fg-muted)" truncate minW={0}>
              {description}
            </Text>
          </Flex>
        </Flex>

        <Text variant="mono" size={11} color="var(--fg-muted)" letterSpacing="0.04em" shrink={0}>
          {action}{" "}
          <Text as="span" className="material-symbols-outlined" size={16} style={{ verticalAlign: "middle" }}>
            arrow_forward
          </Text>
        </Text>
      </Flex>
    </Link>
  );
}
