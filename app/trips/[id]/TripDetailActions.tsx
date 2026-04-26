"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { deleteTrip } from "../server-actions";
import { Icon } from "@/app/design";

export default function TripDetailActions({
  tripId,
}: {
  tripId: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("trip");

  return (
    <div className="flex items-center gap-1">
      <Link
        href={`/trips/${tripId}/edit`}
        className="inline-flex items-center justify-center w-8 h-8 border border-border rounded-[var(--radius)] bg-transparent hover:bg-bg-sunken transition-all"
        title={t("edit")}
      >
        <Icon name="edit" size="md" />
      </Link>
      <button
        title={t("delete")}
        disabled={isPending}
        onClick={() => {
          if (!confirm(t("deleteConfirm"))) {
            return;
          }
          startTransition(() => {
            void deleteTrip(tripId).then(() => router.push("/"));
          });
        }}
        className="inline-flex items-center justify-center w-8 h-8 border border-border rounded-[var(--radius)] bg-transparent hover:bg-bg-sunken transition-all disabled:opacity-50"
      >
        <Icon name="trash" size="md" />
      </button>
    </div>
  );
}
