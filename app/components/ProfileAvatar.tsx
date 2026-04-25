"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Btn } from "@/app/design";

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
    <Btn
      as={Link}
      href="/settings"
      variant="primary"
      size="sm"
      className="h-10 w-10 justify-center rounded-full px-0"
      aria-label="Settings"
    >
      {initials}
    </Btn>
  );
}
