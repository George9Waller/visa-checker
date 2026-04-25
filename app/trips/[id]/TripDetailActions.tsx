"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deleteTrip } from "../server-actions";
import { Btn } from "@/app/design";

export default function TripDetailActions({
  tripId,
}: {
  tripId: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Btn as={Link} href={`/trips/${tripId}/edit`} variant="outline" size="sm">
        Edit trip
      </Btn>
      <Btn
        variant="danger"
        size="sm"
        disabled={isPending}
        onClick={() => {
          if (!confirm("Delete this trip?")) {
            return;
          }
          startTransition(() => {
            void deleteTrip(tripId).then(() => router.push("/"));
          });
        }}
      >
        {isPending ? "Deleting..." : "Delete trip"}
      </Btn>
    </div>
  );
}
