export const dynamic = "force-dynamic";

import Link from "next/link";
import { getVisas } from "./server-actions";
import PrivateText from "../components/PrivateText";
import { StatusBadge } from "../components/ui/StatusBadge";
import { VISA_TYPES_DISPLAY_MAP } from "./constants";
import { getTranslations } from "next-intl/server";
import { PageShell } from "../components/ui/PageShell";
import { PageHeader, IconBtn } from "../components/ui/PageHeader";
import { ContentWell } from "../components/ui/ContentWell";
import { SelectableRow } from "../components/ui/SelectableRow";
import { EmptyState } from "../components/ui/EmptyState";
import { Btn } from "../components/ui/Btn";

export default async function VisasPage() {
  const t = await getTranslations("visa");
  const tStatus = await getTranslations("status");
  const visas = await getVisas();

  return (
    <PageShell>
      <PageHeader
        variant="detail"
        backHref="/"
        title="Visas"
        actions={
          <IconBtn href="/visas/create" icon="add" label={t("create")} />
        }
      />

      <ContentWell>
        {visas.length === 0 && (
          <EmptyState
            icon="passport"
            message="No visas created yet"
            action={
              <Link href="/visas/create" style={{ textDecoration: "none" }}>
                <Btn variant="primary">{t("create")}</Btn>
              </Link>
            }
          />
        )}

        {visas.map((visa) => {
          const isExpired = visa.expires && visa.expires < new Date();
          const tone = isExpired ? ("danger" as const) : ("ok" as const);

          const subtitle = [
            VISA_TYPES_DISPLAY_MAP[visa.type],
            visa.expires
              ? `${isExpired ? "Expired" : "Until"} ${visa.expires.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}`
              : null,
          ]
            .filter(Boolean)
            .join(" · ");

          return (
            <SelectableRow
              key={visa.id}
              href={`/visas/${visa.id}`}
              title={visa.name}
              subtitle={subtitle}
              trailing={
                <StatusBadge
                  tone={tone}
                  label={isExpired ? tStatus("expired") : tStatus("valid")}
                  size="xs"
                />
              }
            />
          );
        })}
      </ContentWell>
    </PageShell>
  );
}
