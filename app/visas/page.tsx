export const dynamic = "force-dynamic";

import Link from "next/link";
import { getVisas } from "./server-actions";
import { VISA_TYPES_DISPLAY_MAP } from "./constants";
import {
  Btn,
  DashboardHeader,
  EmptyState,
  FAB,
  Icon,
  PageContainer,
  PageHeader,
  Stack,
  Text,
  VisaListRow,
} from "@/app/design";
import { COUNTRY_EMOJIS } from "@/app/constants";

const formatDate = (value: Date) =>
  value.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default async function VisasPage() {
  const visas = await getVisas();
  const today = new Date();
  const weekday = today.toLocaleDateString("en-GB", { weekday: "long" });

  return (
    <>
      <PageHeader title="All visas" backHref="/" />
      <PageContainer>
        <Stack className="gap-4">
          {visas.length === 0 ? (
            <EmptyState
              icon="passport"
              title="No visas yet"
              message="Add your first visa to start tracking coverage."
              action={{
                label: "Create visa",
                href: "/visas/create",
              }}
            />
          ) : (
            visas.map((visa) => {
              const isExpired = Boolean(visa.expires && visa.expires < today);
              const isExpiringSoon =
                Boolean(visa.expires) &&
                !isExpired &&
                (visa.expires!.getTime() - today.getTime()) / 86400000 <= 30;
              const statusTone = isExpired
                ? "danger"
                : isExpiringSoon
                  ? "warn"
                  : "ok";

              return (
                <VisaListRow
                  key={visa.id}
                  href={`/visas/${visa.id}`}
                  flag={COUNTRY_EMOJIS[visa.countries[0] ?? ""] ?? "🛂"}
                  title={visa.name}
                  kicker={[
                    VISA_TYPES_DISPLAY_MAP[visa.type],
                    visa.expires
                      ? `Expires ${formatDate(visa.expires)}`
                      : "Open-ended",
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                  countryCount={visa.countries.length}
                  statusTone={statusTone}
                  statusLabel={
                    isExpired
                      ? "expired"
                      : isExpiringSoon
                        ? "expiring"
                        : "valid"
                  }
                />
              );
            })
          )}
        </Stack>

        {visas.length > 0 && (
          <Text className="mt-4 text-sm text-fg-muted">
            Tap a visa to review its trips, coverage, and remaining validity.
          </Text>
        )}

        <div className="fixed bottom-4 right-4 z-50 md:bottom-6 md:right-6">
          <FAB
            actions={[
              {
                href: "/trips/create",
                icon: <Icon name="calendar" size="sm" />,
                title: "Plan trip",
                description: "Create an upcoming journey",
              },
              {
                href: "/visas/create",
                icon: <Icon name="visa-card" size="sm" />,
                title: "Add visa",
                description: "Save a visa or permit",
              },
            ]}
          />
        </div>
      </PageContainer>
    </>
  );
}
