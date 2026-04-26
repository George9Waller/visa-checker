"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deleteVisa } from "../server-actions";
import { Icon, IconBtn } from "@/app/design";

export default function VisaDetailActions({ visaId }: { visaId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-1">
      <Link href={`/visas/${visaId}/edit`} title="Edit visa">
        <IconBtn>
          <Icon name="edit" size="md" />
        </IconBtn>
      </Link>
      <IconBtn
        title="Delete visa"
        disabled={isPending}
        onClick={() => {
          if (
            !confirm(
              "Delete this visa? Linked trips will remain but become unlinked."
            )
          ) {
            return;
          }
          startTransition(() => {
            void deleteVisa(visaId).then(() => router.push("/visas"));
          });
        }}
      >
        <Icon name="trash" size="md" />
      </IconBtn>
    </div>
  );
}
