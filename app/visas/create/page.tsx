"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  SCHENGEN_COUNTRIES,
  VISA_TYPE,
} from "../constants";
import { createVisa } from "../server-actions";
import { COUNTRY_LABELS } from "@/app/constants";
import { Field, Input } from "@/app/components/ui/Field";
import { Btn } from "@/app/components/ui/Btn";
import { useTranslations } from "next-intl";
import { convertDateToString } from "@/app/utils";
import { WizardShell } from "@/app/components/ui/WizardShell";
import { SelectableRow } from "@/app/components/ui/SelectableRow";
import { SelectableGrid } from "@/app/components/ui/SelectableGrid";
import { CheckableRow } from "@/app/components/ui/CheckableRow";
import { splitCountryLabel } from "@/app/components/utils/countries";
import { Flex } from "@/app/components/ui/layout/Flex";
import { Grid } from "@/app/components/ui/layout/Grid";
import { Text } from "@/app/components/ui/typography/Text";
import { Box } from "@/app/components/ui/layout/Box";

type VisaTypeKey = keyof typeof VISA_TYPE;

const VISA_TYPE_META: Record<VisaTypeKey, { flag: string; descKey: string }> = {
  SCHENGEN: { flag: "🇪🇺", descKey: "SCHENGEN" },
  ESTA: { flag: "🇺🇸", descKey: "ESTA" },
  CA_ETA: { flag: "🇨🇦", descKey: "CA_ETA" },
  AU_EVISITOR: { flag: "🇦🇺", descKey: "AU_EVISITOR" },
  NZETA: { flag: "🇳🇿", descKey: "NZETA" },
  OTHER: { flag: "⚙️", descKey: "OTHER" },
};

const VISA_PRESETS: Record<VisaTypeKey, () => Partial<FormData2>> = {
  SCHENGEN: () => ({
    countries: SCHENGEN_COUNTRIES,
    totalMaxLen: 90,
    rollingPeriodLen: 180,
    mustExitBeforeExpiry: true,
    includeEntryAndExitDates: true,
  }),
  ESTA: () => ({
    countries: ["US"],
    tripMaxLen: 90,
    mustExitBeforeExpiry: true,
    includeEntryAndExitDates: true,
  }),
  CA_ETA: () => ({
    countries: ["CA"],
    tripMaxLen: 180,
    mustExitBeforeExpiry: true,
    includeEntryAndExitDates: true,
  }),
  AU_EVISITOR: () => ({
    countries: ["AU"],
    tripMaxLen: 30,
    mustExitBeforeExpiry: true,
    includeEntryAndExitDates: true,
  }),
  NZETA: () => ({
    countries: ["NZ"],
    tripMaxLen: 180,
    mustExitBeforeExpiry: true,
    includeEntryAndExitDates: true,
  }),
  OTHER: () => ({
    countries: [],
    mustExitBeforeExpiry: true,
    includeEntryAndExitDates: true,
  }),
};

type FormData2 = {
  type: VisaTypeKey;
  name: string;
  visaNumber: string;
  documentNumber: string;
  countries: string[];
  validFrom: string;
  expires: string;
  mustExitBeforeExpiry: boolean;
  includeEntryAndExitDates: boolean;
  totalMaxLen: number | "";
  rollingPeriodLen: number | "";
  maxNumTrips: number | "";
  tripMaxLen: number | "";
};

const INITIAL: FormData2 = {
  type: "OTHER",
  name: "",
  visaNumber: "",
  documentNumber: "",
  countries: [],
  validFrom: convertDateToString(new Date()),
  expires: "",
  mustExitBeforeExpiry: true,
  includeEntryAndExitDates: true,
  totalMaxLen: "",
  rollingPeriodLen: "",
  maxNumTrips: "",
  tripMaxLen: "",
};

function totalSteps(type: VisaTypeKey): number {
  return type === "SCHENGEN" ||
    type === "ESTA" ||
    type === "CA_ETA" ||
    type === "AU_EVISITOR" ||
    type === "NZETA"
    ? 4
    : 5;
}


export default function CreateVisaWizard() {
  const t = useTranslations("visa");
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData2>(INITIAL);
  const [countrySearch, setCountrySearch] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const maxSteps = totalSteps(form.type);

  const patch = (update: Partial<FormData2>) =>
    setForm((f) => ({ ...f, ...update }));

  const sortedCountries = useMemo(
    () =>
      Object.keys(COUNTRY_LABELS)
        .map((code) => ({ code, label: COUNTRY_LABELS[code] }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    []
  );

  const filteredCountries = useMemo(() => {
    const q = countrySearch.toLowerCase();
    return q
      ? sortedCountries.filter(
          (c) =>
            c.label.toLowerCase().includes(q) ||
            c.code.toLowerCase().includes(q)
        )
      : sortedCountries;
  }, [countrySearch, sortedCountries]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await createVisa(
        form.name,
        form.type,
        form.validFrom,
        form.countries,
        form.maxNumTrips === "" ? undefined : form.maxNumTrips,
        form.tripMaxLen === "" ? undefined : form.tripMaxLen,
        form.totalMaxLen === "" ? undefined : form.totalMaxLen,
        form.rollingPeriodLen === "" ? undefined : form.rollingPeriodLen,
        form.expires || undefined,
        form.mustExitBeforeExpiry,
        form.includeEntryAndExitDates,
        form.visaNumber || undefined,
        form.documentNumber || undefined
      );
      router.push("/visas");
    } catch (e) {
      toast.error(`Error creating visa: ${e}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => setStep((s) => s - 1);
  const handleCancel = () => router.push("/visas");

  /* ── Step 1: Visa type ── */
  if (step === 1) {
    return (
      <WizardShell
        step={1}
        totalSteps={maxSteps}
        title={t("typeQuestion")}
        onNext={() => setStep(2)}
        nextLabel={t("continue")}
        nextDisabled={!form.type}
        onCancel={handleCancel}
      >
        <Flex direction="column" gap={8}>
          {(Object.keys(VISA_TYPE) as VisaTypeKey[]).map((key) => {
            const meta = VISA_TYPE_META[key];
            return (
              <SelectableRow
                key={key}
                selected={form.type === key}
                indicator="check"
                icon={<span style={{ fontSize: 22 }}>{meta.flag}</span>}
                title={t(`types.${key}`)}
                subtitle={t(`typeDescs.${key}`)}
                onClick={() => {
                  const preset = VISA_PRESETS[key]();
                  patch({ type: key, ...preset });
                }}
              />
            );
          })}
        </Flex>
      </WizardShell>
    );
  }

  /* ── Step 2: Identity ── */
  if (step === 2) {
    return (
      <WizardShell
        step={2}
        totalSteps={maxSteps}
        title={t("nameStep")}
        onBack={handleBack}
        onNext={() => setStep(3)}
        nextLabel={t("continue")}
        nextDisabled={!form.name.trim()}
        onCancel={handleCancel}
      >
        <Flex direction="column" gap={20}>
          <Field label={t("name")} required>
            <Input
              value={form.name}
              onChange={(e) => patch({ name: e.target.value })}
              placeholder={t("namePlaceholder")}
            />
          </Field>
          <Field label={t("number")}>
            <Input
              value={form.visaNumber}
              onChange={(e) => patch({ visaNumber: e.target.value })}
              placeholder="Optional"
            />
          </Field>
          <Field label={t("documentNumber")}>
            <Input
              value={form.documentNumber}
              onChange={(e) => patch({ documentNumber: e.target.value })}
              placeholder="Optional"
            />
          </Field>
        </Flex>
      </WizardShell>
    );
  }

  /* ── Step 3: Countries ── */
  if (step === 3) {
    const toggleCountry = (code: string) => {
      patch({
        countries: form.countries.includes(code)
          ? form.countries.filter((c) => c !== code)
          : [...form.countries, code],
      });
    };

    return (
      <WizardShell
        step={3}
        totalSteps={maxSteps}
        title={t("countriesStep")}
        onBack={handleBack}
        onNext={() => setStep(4)}
        nextLabel={t("continue")}
        onCancel={handleCancel}
      >
        <Flex direction="column" gap={12}>
          <Flex align="center" gap={8}>
            <Btn
              variant="outline"
              size="sm"
              onClick={() => patch({ countries: SCHENGEN_COUNTRIES })}
            >
              {t("selectSchengen")}
            </Btn>
            <Btn
              variant="ghost"
              size="sm"
              onClick={() => patch({ countries: [] })}
            >
              {t("clear")}
            </Btn>
            <Text variant="mono" size="var(--text-xs)" weight={700} ml="auto" color="var(--fg-muted)">
              {form.countries.length} selected
            </Text>
          </Flex>

          <Input
            placeholder={t("searchCountry")}
            value={countrySearch}
            onChange={(e) => setCountrySearch(e.target.value)}
          />

          <Box maxH={360} overflow="auto">
            <SelectableGrid>
              {filteredCountries.map(({ code, label }) => {
                const { flag, name: cName } = splitCountryLabel(label);
                return (
                  <SelectableGrid.Item
                    key={code}
                    selected={form.countries.includes(code)}
                    onClick={() => toggleCountry(code)}
                    leading={<span style={{ fontSize: 16 }}>{flag}</span>}
                    label={cName}
                  />
                );
              })}
            </SelectableGrid>
          </Box>
        </Flex>
      </WizardShell>
    );
  }

  /* ── Step 4: Validity ── */
  if (step === 4) {
    const isLastStep = step === maxSteps;
    return (
      <WizardShell
        step={4}
        totalSteps={maxSteps}
        title={t("validityStep")}
        onBack={handleBack}
        onNext={() => (isLastStep ? handleSubmit() : setStep(5))}
        nextLabel={submitting ? "…" : isLastStep ? t("create") : t("continue")}
        nextDisabled={!form.validFrom || submitting}
        onCancel={handleCancel}
      >
        <Flex direction="column" gap={20}>
          <Field label={t("validFrom")} required>
            <Input
              type="date"
              value={form.validFrom}
              onChange={(e) => patch({ validFrom: e.target.value })}
            />
          </Field>
          <Field label={t("expiresOn")} hint={t("expiresHint")}>
            <Input
              type="date"
              value={form.expires}
              min={form.validFrom}
              onChange={(e) => patch({ expires: e.target.value })}
            />
          </Field>
          <CheckableRow
            checked={form.mustExitBeforeExpiry}
            onChange={() => patch({ mustExitBeforeExpiry: !form.mustExitBeforeExpiry })}
            label={t("mustLeave")}
          />
        </Flex>
      </WizardShell>
    );
  }

  /* ── Step 5: Rules ── */
  const showRolling = form.type === "SCHENGEN" || form.type === "OTHER";
  const showFixed =
    form.type === "ESTA" ||
    form.type === "CA_ETA" ||
    form.type === "AU_EVISITOR" ||
    form.type === "NZETA" ||
    form.type === "OTHER";

  return (
    <WizardShell
      step={5}
      totalSteps={maxSteps}
      title={t("rulesStep")}
      onBack={handleBack}
      onNext={handleSubmit}
      nextLabel={submitting ? "…" : t("create")}
      nextDisabled={submitting}
      onCancel={handleCancel}
    >
      <Flex direction="column" gap={20}>
        {showRolling && (
          <Grid templateColumns="1fr 1fr" gap={12}>
            <Field label={t("rollingLimit")}>
              <Input
                type="number"
                value={form.totalMaxLen}
                onChange={(e) =>
                  patch({ totalMaxLen: e.target.value ? parseInt(e.target.value) : "" })
                }
                placeholder="e.g. 90"
              />
            </Field>
            <Field label={t("rollingWindow")}>
              <Input
                type="number"
                value={form.rollingPeriodLen}
                onChange={(e) =>
                  patch({ rollingPeriodLen: e.target.value ? parseInt(e.target.value) : "" })
                }
                placeholder="e.g. 180"
              />
            </Field>
          </Grid>
        )}
        {showFixed && !showRolling && (
          <Field label={t("totalMax")}>
            <Input
              type="number"
              value={form.totalMaxLen}
              onChange={(e) =>
                patch({ totalMaxLen: e.target.value ? parseInt(e.target.value) : "" })
              }
              placeholder="e.g. 90"
            />
          </Field>
        )}
        <Grid templateColumns="1fr 1fr" gap={12}>
          <Field label={t("maxTrips")}>
            <Input
              type="number"
              value={form.maxNumTrips}
              onChange={(e) =>
                patch({ maxNumTrips: e.target.value ? parseInt(e.target.value) : "" })
              }
              placeholder="Optional"
            />
          </Field>
          <Field label={t("maxDaysPerTrip")}>
            <Input
              type="number"
              value={form.tripMaxLen}
              onChange={(e) =>
                patch({ tripMaxLen: e.target.value ? parseInt(e.target.value) : "" })
              }
              placeholder="Optional"
            />
          </Field>
        </Grid>
        <CheckableRow
          checked={form.includeEntryAndExitDates}
          onChange={() => patch({ includeEntryAndExitDates: !form.includeEntryAndExitDates })}
          label={t("countBothDays")}
        />
      </Flex>
    </WizardShell>
  );
}
