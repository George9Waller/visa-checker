"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";
import { createTrip } from "../server-actions";
import { COUNTRY_EMOJIS, COUNTRY_LABELS, COUNTRY_NAMES } from "@/app/constants";
import {
  Checkbox,
  DatePicker,
  Field,
  Input,
  OptionList,
  OptionRow,
  Stack,
  Text,
  WizardShell,
  FactGrid,
  Fact,
  AlertBox,
} from "@/app/design";

const TOTAL_STEPS = 3;

const asIso = (value: Date) => value.toISOString().split("T")[0];

export default function CreateTripWizard() {
  const t = useTranslations("trip");
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [country, setCountry] = useState("");
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [visaRequired, setVisaRequired] = useState(true);
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
    return q
      ? sortedCountries.filter(
          (item) =>
            item.label.toLowerCase().includes(q) ||
            item.code.toLowerCase().includes(q)
        )
      : sortedCountries;
  }, [search, sortedCountries]);

  const durationDays = useMemo(() => {
    if (!startDate || !endDate) return null;
    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T00:00:00`);
    const diff = Math.round((end.getTime() - start.getTime()) / 86400000) + 1;
    return diff > 0 ? diff : null;
  }, [startDate, endDate]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await createTrip(startDate, endDate, country, visaRequired, name || null);
      router.push("/");
    } catch (error) {
      toast.error(`Error creating trip: ${error}`);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedCountryName = COUNTRY_NAMES[country] ?? country;

  if (step === 0) {
    return (
      <WizardShell
        title={t("create")}
        step={0}
        totalSteps={TOTAL_STEPS}
        stepTitle={t("destination")}
        onClose={() => router.push("/")}
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
                : "Search or scroll to pick the country first. The list is sorted alphabetically and stays compact on mobile."}
            </Text>
          </AlertBox>
          <Input
            placeholder={t("searchCountry")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <OptionList maxHeight="56vh" className="overscroll-contain">
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
      </WizardShell>
    );
  }

  if (step === 1) {
    return (
      <WizardShell
        title={t("create")}
        step={1}
        totalSteps={TOTAL_STEPS}
        stepTitle={t("details")}
        onClose={() => router.push("/")}
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
      title={t("create")}
      step={2}
      totalSteps={TOTAL_STEPS}
      stepTitle={t("visa")}
      onClose={() => router.push("/")}
      onBack={() => setStep(1)}
      primary={{
        label: submitting ? "…" : t("create"),
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
      </Stack>
    </WizardShell>
  );
}
