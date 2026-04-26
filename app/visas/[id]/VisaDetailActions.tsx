"use client";

import { Link, useRouter } from "@/i18n/navigation";
import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { deleteVisa } from "../server-actions";
import { Icon, IconBtn } from "@/app/design";

export default function VisaDetailActions({
  visaId,
  renewHref,
}: {
  visaId: string;
  renewHref?: string | null;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("visa");

  return (
    <div className="flex items-center gap-1">
      {renewHref && (
        <Link href={renewHref} title={t("renew")}>
          <IconBtn>
            <Icon name="arrow-right" size="md" />
          </IconBtn>
        </Link>
      )}
      <Link href={`/visas/${visaId}/edit`} title={t("edit")}>
        <IconBtn>
          <Icon name="edit" size="md" />
        </IconBtn>
      </Link>
      <IconBtn
        title={t("delete")}
        disabled={isPending}
        onClick={() => {
          if (!confirm(t("deleteConfirm"))) {
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
