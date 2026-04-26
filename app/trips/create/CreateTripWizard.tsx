"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";
import {
  createTrip,
  getPossibleVisasForDraftTrip,
  updateTrip,
} from "../server-actions";
import { COUNTRY_EMOJIS, COUNTRY_LABELS, COUNTRY_NAMES } from "@/app/constants";
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
  mode?: "create" | "edit";
  cancelHref?: string;
  submitHref?: string;
}

const formatLastVisited = (value: string) => {
  const now = new Date();
  const then = new Date(`${value}T00:00:00`);
  const diffDays = Math.max(
    0,
    Math.round((now.getTime() - then.getTime()) / 86400000)
  );

  if (diffDays === 0) {
    return "Visited today";
  }
  if (diffDays === 1) {
    return "Visited yesterday";
  }
  return `Visited ${diffDays} days ago`;
};

const formatVisitCount = (count?: number) => {
  if (!count) {
    return "Frequently visited";
  }
  return count === 1 ? "Visited once" : `Visited ${count} times`;
};

export default function CreateTripWizard({
  title,
  countrySuggestions,
  initialTrip,
  mode = "create",
  cancelHref = "/",
  submitHref = "/",
}: CreateTripWizardProps) {
  const t = useTranslations("trip");
  const router = useRouter();

  const [step, setStep] = useState(initialTrip ? 1 : 0);
  const [country, setCountry] = useState(initialTrip?.country ?? "");
  const [search, setSearch] = useState("");
  const [name, setName] = useState(initialTrip?.name ?? "");
  const [startDate, setStartDate] = useState(initialTrip?.startDate ?? "");
  const [endDate, setEndDate] = useState(initialTrip?.endDate ?? "");
  const [visaRequired, setVisaRequired] = useState(
    initialTrip?.visaRequired ?? true
  );
  const [selectedVisaId, setSelectedVisaId] = useState<string | null>(null);
  const [visaCandidates, setVisaCandidates] = useState<TripVisaCandidate[]>(
    []
  );
  const [loadingVisas, setLoadingVisas] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const sortedCountries = useMemo(
    () =>
      Object.keys(COUNTRY_LABELS)
        .map((code) => ({ code, label: COUNTRY_LABELS[code] }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    []
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
    const shouldLoad = Boolean(
      mode === "create" && visaRequired && country && startDate && endDate
    );

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
          toast.error(`Error loading visa options: ${error}`);
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
          name || null
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
      toast.error(`Error saving trip: ${error}`);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedCountryName = COUNTRY_NAMES[country] ?? country;
  const shellTitle = title ?? (mode === "edit" ? "Edit trip" : t("create"));
  const submitLabel = mode === "edit" ? "Save changes" : t("create");

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
            title={country ? selectedCountryName : "Choose a destination"}
          >
            <Text variant="small" tone="muted">
              {country
                ? "You can refine the trip details once the destination is selected."
                : "Pick from a suggested country or search the full list below."}
            </Text>
          </AlertBox>

          {countrySuggestions.recent.length > 0 && (
            <Stack gap="md">
              <div>
                <Text className="font-semibold text-base">
                  Recently visited
                </Text>
                <Text variant="small" tone="muted">
                  Countries from your latest completed trips.
                </Text>
              </div>
              <OptionGrid cols={2}>
                {countrySuggestions.recent.map(({ code, lastVisited }) => {
                  const name =
                    COUNTRY_NAMES[code] ?? COUNTRY_LABELS[code] ?? code;
                  const emoji = COUNTRY_EMOJIS[code] ?? "✈";
                  return (
                    <OptionRow
                      key={code}
                      variant="grid"
                      flag={<span className="text-2xl">{emoji}</span>}
                      title={name}
                      subtitle={formatLastVisited(lastVisited ?? "")}
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
                <Text className="font-semibold text-base">Most visited</Text>
                <Text variant="small" tone="muted">
                  Countries you travel to most often.
                </Text>
              </div>
              <OptionGrid cols={2}>
                {countrySuggestions.popular.map(({ code, tripCount }) => {
                  const name =
                    COUNTRY_NAMES[code] ?? COUNTRY_LABELS[code] ?? code;
                  const emoji = COUNTRY_EMOJIS[code] ?? "✈";
                  return (
                    <OptionRow
                      key={code}
                      variant="grid"
                      flag={<span className="text-2xl">{emoji}</span>}
                      title={name}
                      subtitle={formatVisitCount(tripCount)}
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
                const name = COUNTRY_NAMES[code] ?? label;
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
                minDate={asIso(new Date())}
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
            {visaRequired
              ? t("requiresVisaHint")
              : "This trip will be marked as visa-free and can be linked later if needed."}
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

        {mode === "create" && visaRequired && (
          <Stack gap="md">
            <Field label={t("selectedVisa")}>
              <Text variant="small" tone="muted">
                {loadingVisas
                  ? "Loading matching visas..."
                  : visaCandidates.length > 0
                    ? "Pick a visa that covers this trip."
                    : "No visas cover this destination yet."}
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
                      ? "Valid for this trip"
                      : firstIssue
                        ? detailForTripIssue(firstIssue.kind, firstIssue.params)
                        : issueKinds[0]
                          ? titleForTripIssue(issueKinds[0])
                          : "Needs review";
                  const subtitle =
                    candidate.status === "valid"
                      ? issueSummary
                      : issueKinds.length > 1
                        ? `${issueSummary} · +${issueKinds.length - 1} more issue${
                            issueKinds.length - 1 === 1 ? "" : "s"
                          }`
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
