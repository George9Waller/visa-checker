"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { createTrip } from "../server-actions";
import { COUNTRY_LABELS } from "@/app/constants";
import { Field, Input } from "@/app/components/ui/Field";
import { Btn } from "@/app/components/ui/Btn";
import { useTranslations } from "next-intl";
import { WizardShell } from "@/app/components/ui/WizardShell";
import { SelectableRow } from "@/app/components/ui/SelectableRow";
import { CheckableRow } from "@/app/components/ui/CheckableRow";
import { splitCountryLabel } from "@/app/components/utils/countries";
import { Flex } from "@/app/components/ui/layout/Flex";
import { Box } from "@/app/components/ui/layout/Box";
import { Grid } from "@/app/components/ui/layout/Grid";
import { Text } from "@/app/components/ui/typography/Text";

const TOTAL_STEPS = 3;

export default function CreateTripWizard() {
  const t = useTranslations("trip");
  const router = useRouter();

  const [step, setStep] = useState(1);
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
          (c) =>
            c.label.toLowerCase().includes(q) ||
            c.code.toLowerCase().includes(q)
        )
      : sortedCountries;
  }, [search, sortedCountries]);

  const durationDays = useMemo(() => {
    if (!startDate || !endDate) return null;
    const s = new Date(startDate + "T00:00:00");
    const e = new Date(endDate + "T00:00:00");
    const diff = Math.round((e.getTime() - s.getTime()) / 86400000) + 1;
    return diff > 0 ? diff : null;
  }, [startDate, endDate]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await createTrip(startDate, endDate, country, visaRequired, name || null);
      router.push("/");
    } catch (e) {
      toast.error(`Error creating trip: ${e}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => setStep((s) => s - 1);
  const handleCancel = () => router.push("/");

  /* ── Step 1: Destination ── */
  if (step === 1) {
    return (
      <WizardShell
        kicker={t("create")}
        step={1}
        totalSteps={TOTAL_STEPS}
        title={t("destination")}
        onNext={() => setStep(2)}
        nextLabel={t("continue")}
        nextDisabled={!country}
        onCancel={handleCancel}
      >
        <Box mb="md">
          <Input
            placeholder={t("searchCountry")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Box>
        <Flex variant="column" gap="xs">
          {filteredCountries.map(({ code, label }) => {
            const { flag, name: cName } = splitCountryLabel(label);
            return (
              <SelectableRow
                key={code}
                selected={country === code}
                indicator="check"
                icon={<span style={{ fontSize: 20 }}>{flag}</span>}
                title={cName}
                subtitle={code}
                onClick={() => setCountry(code)}
              />
            );
          })}
        </Flex>
      </WizardShell>
    );
  }

  /* ── Step 2: Dates & Name ── */
  if (step === 2) {
    const today = new Date().toISOString().split("T")[0];
    return (
      <WizardShell
        kicker={t("create")}
        step={2}
        totalSteps={TOTAL_STEPS}
        title={t("details")}
        onBack={handleBack}
        onNext={() => setStep(3)}
        nextLabel={t("continue")}
        nextDisabled={!startDate || !endDate}
        onCancel={handleCancel}
      >
        <Flex variant="column" gap="lg">
          <Field label={t("name")} hint={`${name.length} / 40`}>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 40))}
              placeholder={t("namePlaceholder")}
            />
          </Field>

          <Grid columns={2} gap="md">
            <Field label={t("startDate")} required>
              <Input
                type="date"
                value={startDate}
                min={today}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </Field>
            <Field label={t("endDate")} required>
              <Input
                type="date"
                value={endDate}
                min={startDate || today}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </Field>
          </Grid>

          {durationDays !== null && (
            <Flex
              variant="row-center"
              p="sm"
              style={{ 
                justifyContent: "center", 
                background: "var(--bg-sunken)", 
                border: "1px solid var(--border)", 
                borderRadius: "var(--r-s)" 
              }}
            >
              <Text variant="mono" color="muted" style={{ fontWeight: "bold", fontSize: "var(--text-xs)", letterSpacing: "0.1em" }}>
                {t("length")} · {durationDays} {t("days")}
              </Text>
            </Flex>
          )}
        </Flex>
      </WizardShell>
    );
  }

  /* ── Step 3: Visa ── */
  return (
    <WizardShell
      kicker={t("create")}
      step={3}
      totalSteps={TOTAL_STEPS}
      title={t("visa")}
      onBack={handleBack}
      onNext={handleSubmit}
      nextLabel={submitting ? "…" : t("create")}
      nextDisabled={submitting}
      onCancel={handleCancel}
    >
      <Flex variant="column" gap="md">
        <CheckableRow
          checked={visaRequired}
          onChange={() => setVisaRequired((v) => !v)}
          label={t("requiresVisa")}
          hint={t("requiresVisaHint")}
        />
        <Text as="p" variant="mono" color="muted" style={{ fontSize: "var(--text-xs)" }}>
          {visaRequired
            ? t("requiresVisaHint")
            : "You can link a visa later from the trip detail page."}
        </Text>
      </Flex>
    </WizardShell>
  );
}
