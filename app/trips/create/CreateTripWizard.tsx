"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import {
  createTrip,
  getPossibleVisasForDraftTrip,
  updateTrip,
} from "../server-actions";
import {
  COUNTRY_EMOJIS,
  getCountryLabel,
  getCountryLabels,
  getCountryName,
} from "@/app/constants";
import {
  AlertBox,
  Checkbox,
  DatePicker,
  Field,
  Fact,
  FactGrid,
  Input,
  OptionGrid,
  OptionList,
  OptionRow,
  Stack,
  StatusBadge,
  Text,
  WizardShell,
} from "@/app/design";
import {
  detailForTripIssue,
  titleForTripIssue,
  toneFromSeverity,
} from "@/app/structured-copy";
import type { TripVisaCandidate } from "../server-actions";

const TOTAL_STEPS = 3;

const asIso = (value: Date) => value.toISOString().split("T")[0];

type CountrySuggestion = {
  code: string;
  lastVisited?: string;
  tripCount?: number;
};

type CountrySuggestionGroups = {
  recent: CountrySuggestion[];
  popular: CountrySuggestion[];
};

type TripDraft = {
  id: string;
  country: string;
  name: string;
  startDate: string;
  endDate: string;
  visaRequired: boolean;
  colour: string;
};

interface CreateTripWizardProps {
  title?: string;
  countrySuggestions: CountrySuggestionGroups;
  initialTrip?: TripDraft;
  initialVisaId?: string | null;
  mode?: "create" | "edit";
  cancelHref?: string;
  submitHref?: string;
}

const formatLastVisited = (
  t: (key: string, values?: any) => string,
  value: string
) => {
  const now = new Date();
  const then = new Date(`${value}T00:00:00`);
  const diffDays = Math.max(
    0,
    Math.round((now.getTime() - then.getTime()) / 86400000)
  );

  if (diffDays === 0) {
    return t("visitedToday");
  }
  if (diffDays === 1) {
    return t("visitedYesterday");
  }
  return t("visitedDaysAgo", { days: diffDays });
};

const formatVisitCount = (
  t: (key: string, values?: any) => string,
  count?: number
) => {
  if (!count) {
    return t("frequentlyVisited");
  }
  return t("visitedTimes", { count });
};

export default function CreateTripWizard({
  title,
  countrySuggestions,
  initialTrip,
  initialVisaId = null,
  mode = "create",
  cancelHref = "/",
  submitHref = "/",
}: CreateTripWizardProps) {
  const t = useTranslations("trip");
  const copyT = useTranslations("copy");
  const locale = useLocale();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [country, setCountry] = useState(initialTrip?.country ?? "");
  const [search, setSearch] = useState("");
  const [name, setName] = useState(initialTrip?.name ?? "");
  const [startDate, setStartDate] = useState(initialTrip?.startDate ?? "");
  const [endDate, setEndDate] = useState(initialTrip?.endDate ?? "");
  const [visaRequired, setVisaRequired] = useState(
    initialTrip?.visaRequired ?? true
  );
  const [selectedVisaId, setSelectedVisaId] = useState<string | null>(
    initialVisaId
  );
  const [visaCandidates, setVisaCandidates] = useState<TripVisaCandidate[]>([]);
  const [loadingVisas, setLoadingVisas] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const sortedCountries = useMemo(
    () =>
      Object.keys(getCountryLabels(locale))
        .map((code) => ({ code, label: getCountryLabel(code, locale) }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [locale]
  );

  const filteredCountries = useMemo(() => {
    const q = search.toLowerCase();
    return sortedCountries.filter((item) =>
      q
        ? item.label.toLowerCase().includes(q) ||
          item.code.toLowerCase().includes(q)
        : true
    );
  }, [search, sortedCountries]);

  const durationDays = useMemo(() => {
    if (!startDate || !endDate) return null;
    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T00:00:00`);
    const diff = Math.round((end.getTime() - start.getTime()) / 86400000) + 1;
    return diff > 0 ? diff : null;
  }, [startDate, endDate]);

  useEffect(() => {
    let cancelled = false;
    const shouldLoad = Boolean(visaRequired && country && startDate && endDate);

    if (!shouldLoad) {
      setVisaCandidates([]);
      setSelectedVisaId(null);
      setLoadingVisas(false);
      return () => {
        cancelled = true;
      };
    }

    setLoadingVisas(true);
    void getPossibleVisasForDraftTrip({
      countryCode: country,
      startDate,
      endDate,
      name: null,
      colour: initialTrip?.colour ?? "1",
      visaRequired,
      id: "__draft__",
      selectedVisaId,
    })
      .then((candidates) => {
        if (cancelled) {
          return;
        }
        setVisaCandidates(candidates);
        setSelectedVisaId((current) =>
          current && candidates.some((candidate) => candidate.id === current)
            ? current
            : null
        );
      })
      .catch((error) => {
        if (!cancelled) {
          toast.error(t("errorLoadingVisaOptions", { error: String(error) }));
          setVisaCandidates([]);
          setSelectedVisaId(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingVisas(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [
    country,
    endDate,
    initialTrip?.colour,
    mode,
    startDate,
    selectedVisaId,
    t,
    visaRequired,
  ]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      if (mode === "edit" && initialTrip) {
        await updateTrip(
          initialTrip.id,
          startDate,
          endDate,
          country,
          initialTrip.colour,
          visaRequired,
          name || null,
          selectedVisaId
        );
      } else {
        await createTrip(
          startDate,
          endDate,
          country,
          visaRequired,
          name || null,
          selectedVisaId
        );
      }
      router.push(submitHref);
    } catch (error) {
      toast.error(t("errorSavingTrip", { error: String(error) }));
    } finally {
      setSubmitting(false);
    }
  };

  const selectedCountryName = getCountryName(country, locale);
  const shellTitle = title ?? (mode === "edit" ? t("edit") : t("create"));
  const submitLabel = mode === "edit" ? t("save") : t("create");

  if (step === 0) {
    return (
      <WizardShell
        title={shellTitle}
        step={0}
        totalSteps={TOTAL_STEPS}
        stepTitle={t("destination")}
        onClose={() => router.push(cancelHref)}
        primary={{
          label: t("continue"),
          onClick: () => setStep(1),
          enabled: Boolean(country),
          variant: "primary",
        }}
      >
        <Stack gap="lg">
          <AlertBox
            tone={country ? "ok" : "warn"}
            title={country ? selectedCountryName : t("chooseDestination")}
          >
            <Text variant="small" tone="muted">
              {country
                ? t("destinationHintSelected")
                : t("destinationHintUnselected")}
            </Text>
          </AlertBox>

          {countrySuggestions.recent.length > 0 && (
            <Stack gap="md">
              <div>
                <Text className="font-semibold text-base">
                  {t("recentlyVisited")}
                </Text>
                <Text variant="small" tone="muted">
                  {t("recentTripsHint")}
                </Text>
              </div>
              <OptionGrid cols={2}>
                {countrySuggestions.recent.map(({ code, lastVisited }) => {
                  const name = getCountryName(code, locale);
                  const emoji = COUNTRY_EMOJIS[code] ?? "✈";
                  return (
                    <OptionRow
                      key={code}
                      variant="grid"
                      flag={<span className="text-2xl">{emoji}</span>}
                      title={name}
                      subtitle={formatLastVisited(t, lastVisited ?? "")}
                      selected={country === code}
                      onClick={() => setCountry(code)}
                    />
                  );
                })}
              </OptionGrid>
            </Stack>
          )}

          {countrySuggestions.popular.length > 0 && (
            <Stack gap="md">
              <div>
                <Text className="font-semibold text-base">
                  {t("mostVisited")}
                </Text>
                <Text variant="small" tone="muted">
                  {t("mostVisitedHint")}
                </Text>
              </div>
              <OptionGrid cols={2}>
                {countrySuggestions.popular.map(({ code, tripCount }) => {
                  const name = getCountryName(code, locale);
                  const emoji = COUNTRY_EMOJIS[code] ?? "✈";
                  return (
                    <OptionRow
                      key={code}
                      variant="grid"
                      flag={<span className="text-2xl">{emoji}</span>}
                      title={name}
                      subtitle={formatVisitCount(t, tripCount)}
                      selected={country === code}
                      onClick={() => setCountry(code)}
                    />
                  );
                })}
              </OptionGrid>
            </Stack>
          )}

          <Stack gap="md">
            <Input
              placeholder={t("searchCountry")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <OptionList maxHeight="40vh" className="overscroll-contain">
              {filteredCountries.map(({ code, label }) => {
                const name = getCountryName(code, locale) ?? label;
                const emoji = COUNTRY_EMOJIS[code] ?? "✈";
                return (
                  <OptionRow
                    key={code}
                    flag={<span className="text-lg">{emoji}</span>}
                    title={name}
                    subtitle={code}
                    selected={country === code}
                    onClick={() => setCountry(code)}
                  />
                );
              })}
            </OptionList>
          </Stack>
        </Stack>
      </WizardShell>
    );
  }

  if (step === 1) {
    return (
      <WizardShell
        title={shellTitle}
        step={1}
        totalSteps={TOTAL_STEPS}
        stepTitle={t("details")}
        onClose={() => router.push(cancelHref)}
        onBack={() => setStep(0)}
        primary={{
          label: t("continue"),
          onClick: () => setStep(2),
          enabled: Boolean(startDate && endDate && name.trim()),
          variant: "primary",
        }}
      >
        <Stack gap="xl">
          <Field label={t("name")} hint={`${name.length} / 40`}>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 40))}
              placeholder={t("namePlaceholder")}
            />
          </Field>

          <FactGrid cols={2}>
            <Fact label={t("country")} value={selectedCountryName} />
            <Fact
              label={t("length")}
              value={durationDays ? `${durationDays} ${t("days")}` : "—"}
            />
          </FactGrid>

          <Stack gap="md">
            <Field label={t("startDate")}>
              <DatePicker
                value={startDate}
                onChange={(value) => {
                  setStartDate(value);
                  if (
                    endDate &&
                    value &&
                    new Date(`${endDate}T00:00:00`) <
                      new Date(`${value}T00:00:00`)
                  ) {
                    setEndDate("");
                  }
                }}
              />
            </Field>
            <Field label={t("endDate")}>
              <DatePicker
                value={endDate}
                minDate={startDate || asIso(new Date())}
                onChange={setEndDate}
              />
            </Field>
          </Stack>
        </Stack>
      </WizardShell>
    );
  }

  return (
    <WizardShell
      title={shellTitle}
      step={2}
      totalSteps={TOTAL_STEPS}
      stepTitle={t("visa")}
      onClose={() => router.push(cancelHref)}
      onBack={() => setStep(1)}
      primary={{
        label: submitting ? "…" : submitLabel,
        onClick: handleSubmit,
        enabled: !submitting,
        variant: "accent",
      }}
    >
      <Stack gap="lg">
        <AlertBox
          tone={visaRequired ? "warn" : "ok"}
          title={name || selectedCountryName}
        >
          <Text variant="small" tone="muted">
            {visaRequired ? t("requiresVisaHint") : t("visaFreeNotice")}
          </Text>
        </AlertBox>

        <Checkbox checked={visaRequired} onChange={setVisaRequired}>
          <div className="space-y-1">
            <div className="font-semibold text-fg">{t("requiresVisa")}</div>
            <Text variant="small" tone="muted">
              {t("requiresVisaHint")}
            </Text>
          </div>
        </Checkbox>

        {visaRequired && (
          <Stack gap="md">
            <Field label={t("selectedVisa")}>
              <Text variant="small" tone="muted">
                {loadingVisas
                  ? t("loadingMatchingVisas")
                  : visaCandidates.length > 0
                    ? t("pickVisaCoversTrip")
                    : t("noVisasCoverDestination")}
              </Text>
            </Field>

            {visaCandidates.length > 0 && (
              <OptionList maxHeight="40vh" className="overscroll-contain">
                {visaCandidates.map((candidate) => {
                  const issueKinds = [...new Set(candidate.issueKinds)];
                  const firstIssue = candidate.issues[0];
                  const badgeTone =
                    candidate.status === "valid"
                      ? "ok"
                      : toneFromSeverity(firstIssue?.severity ?? "danger");
                  const issueSummary =
                    candidate.status === "valid"
                      ? t("validForTrip")
                      : firstIssue
                        ? detailForTripIssue(
                            copyT,
                            firstIssue.kind,
                            firstIssue.params
                          )
                        : issueKinds[0]
                          ? titleForTripIssue(copyT, issueKinds[0])
                          : t("needsReview");
                  const subtitle =
                    candidate.status === "valid"
                      ? issueSummary
                      : issueKinds.length > 1
                        ? `${issueSummary} · ${copyT("moreIssues", {
                            count: issueKinds.length - 1,
                          })}`
                        : issueSummary;

                  return (
                    <OptionRow
                      key={candidate.id}
                      title={candidate.name}
                      subtitle={subtitle}
                      selected={candidate.id === selectedVisaId}
                      trailing={
                        <StatusBadge tone={badgeTone} size="xs">
                          {candidate.status}
                        </StatusBadge>
                      }
                      onClick={() => setSelectedVisaId(candidate.id)}
                    />
                  );
                })}
              </OptionList>
            )}
          </Stack>
        )}
      </Stack>
    </WizardShell>
  );
}
