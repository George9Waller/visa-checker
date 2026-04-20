"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Box } from "./ui/layout/Box";

export function ProfileAvatar() {
  const { data: session } = useSession();

  const initials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((w: string) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  return (
    <Box
      as={Link}
      href="/settings"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 99,
        fontWeight: 600,
        width: 36,
        height: 36,
        fontSize: 11,
        fontFamily: "var(--font-body)",
        backgroundColor: "var(--fg)",
        color: "var(--bg)",
        textDecoration: "none",
        flexShrink: 0,
      }}
      aria-label="Settings"
    >
      {initials}
    </Box>
  );
}
