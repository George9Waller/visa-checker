export const dynamic = "force-dynamic";

import { getVisas } from "./server-actions";
import { VISA_TYPES_DISPLAY_MAP, VisaTypeKey } from "./constants";
import {
  EmptyState,
  FAB,
  Icon,
  PageContainer,
  PageHeader,
  Stack,
  Text,
  VisaListRow,
} from "@/app/design";
import { getVisaFlag } from "./utils";

const formatDate = (value: Date) =>
  value.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default async function VisasPage() {
  const visaGroups = await getVisas();
  const today = new Date();

  const renderVisaRow = (
    visa: (typeof visaGroups)[number]["primary"],
    muted = false,
    kicker?: string
  ) => {
    const isExpired = Boolean(visa.expires && visa.expires < today);
    const isExpiringSoon =
      Boolean(visa.expires) &&
      !isExpired &&
      (visa.expires!.getTime() - today.getTime()) / 86400000 <= 30;
    const statusTone = muted
      ? "muted"
      : isExpired
        ? "danger"
        : isExpiringSoon
          ? "warn"
          : "ok";

    return (
      <VisaListRow
        key={visa.id}
        href={`/visas/${visa.id}`}
        flag={getVisaFlag(visa.type as VisaTypeKey, visa.countries)}
        title={visa.name}
        kicker={
          kicker ??
          [
            VISA_TYPES_DISPLAY_MAP[visa.type],
            visa.expires ? `Expires ${formatDate(visa.expires)}` : "Open-ended",
          ]
            .filter(Boolean)
            .join(" · ")
        }
        countryCount={visa.countries.length}
        statusTone={statusTone}
        statusLabel={
          muted
            ? "renewed"
            : isExpired
              ? "expired"
              : isExpiringSoon
                ? "expiring"
                : "valid"
        }
        muted={muted}
      />
    );
  };

  return (
    <>
      <PageHeader title="All visas" backHref="/" />
      <PageContainer>
        <Stack className="gap-4">
          {visaGroups.length === 0 ? (
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
            visaGroups.map((group) => (
              <div key={group.primary.id} className="space-y-2">
                {renderVisaRow(group.primary)}
                {group.history.length > 0 && (
                  <div className="ml-4 border-l border-border/70 pl-4">
                    {group.history.map((visa, index) =>
                      renderVisaRow(
                        visa,
                        true,
                        index === 0
                          ? "Renewed from this chain"
                          : "Earlier visa"
                      )
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </Stack>

        {visaGroups.length > 0 && (
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
