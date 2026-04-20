"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

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
    <Link
      href="/settings"
      className="flex items-center justify-center rounded-full font-bold transition-opacity hover:opacity-75"
      style={{
        width: 36,
        height: 36,
        fontSize: 13,
        fontFamily: "var(--font-body)",
        backgroundColor: "var(--fg)",
        color: "var(--bg)",
        textDecoration: "none",
        flexShrink: 0,
      }}
      aria-label="Settings"
    >
      {initials}
    </Link>
  );
}
