"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";
import { SCHENGEN_COUNTRIES, VISA_TYPE } from "../constants";
import { createVisa } from "../server-actions";
import { COUNTRY_EMOJIS, COUNTRY_LABELS, COUNTRY_NAMES } from "@/app/constants";
import {
  AlertBox,
  Btn,
  Checkbox,
  DatePicker,
  Field,
  Grid,
  Input,
  OptionList,
  OptionRow,
  Stack,
  Text,
  WizardShell,
  Fact,
  FactGrid,
} from "@/app/design";

type VisaTypeKey = keyof typeof VISA_TYPE;

const VISA_TYPE_META: Record<VisaTypeKey, { flag: string; desc: string }> = {
  SCHENGEN: { flag: "🇪🇺", desc: "Rolling window (90 in 180)" },
  ESTA: { flag: "🇺🇸", desc: "Fixed duration, single entry" },
  CA_ETA: { flag: "🇨🇦", desc: "Fixed duration" },
  AU_EVISITOR: { flag: "🇦🇺", desc: "Multiple entry" },
  NZETA: { flag: "🇳🇿", desc: "Fixed duration" },
  OTHER: { flag: "⚙️", desc: "Configure every rule" },
};

type FormData = {
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

const INITIAL: FormData = {
  type: "OTHER",
  name: "",
  visaNumber: "",
  documentNumber: "",
  countries: [],
  validFrom: "",
  expires: "",
  mustExitBeforeExpiry: true,
  includeEntryAndExitDates: true,
  totalMaxLen: "",
  rollingPeriodLen: "",
  maxNumTrips: "",
  tripMaxLen: "",
};

const totalSteps = (type: VisaTypeKey) => (type === "OTHER" ? 5 : 4);

const asIso = (date: Date) => date.toISOString().split("T")[0];

export default function CreateVisaWizard() {
  const t = useTranslations("visa");
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [countrySearch, setCountrySearch] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const maxSteps = totalSteps(form.type);

  const patch = (update: Partial<FormData>) =>
    setForm((current) => ({ ...current, ...update }));

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
          (item) =>
            item.label.toLowerCase().includes(q) ||
            item.code.toLowerCase().includes(q)
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
    } catch (error) {
      toast.error(`Error creating visa: ${error}`);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedCountries = form.countries
    .map((code) => COUNTRY_NAMES[code] ?? code)
    .join(" · ");

  if (step === 0) {
    return (
      <WizardShell
        title={t("create")}
        step={0}
        totalSteps={maxSteps}
        stepTitle={t("typeQuestion")}
        onClose={() => router.push("/visas")}
        primary={{
          label: t("continue"),
          onClick: () => setStep(1),
          enabled: Boolean(form.type),
          variant: "primary",
        }}
      >
        <Stack gap="lg">
          <AlertBox tone="warn" title="Choose a visa template">
            <Text variant="small" tone="muted">
              Templates prefill the rules for the common cases. You can still
              change every limit later.
            </Text>
          </AlertBox>
          <OptionList maxHeight="46vh" className="overscroll-contain">
            {(Object.keys(VISA_TYPE) as VisaTypeKey[]).map((key) => {
              const meta = VISA_TYPE_META[key];
              return (
                <OptionRow
                  key={key}
                  variant="type"
                  flag={<span>{meta.flag}</span>}
                  title={t(`types.${key}`)}
                  subtitle={meta.desc}
                  selected={form.type === key}
                  onClick={() => {
                    const preset =
                      key === "SCHENGEN"
                        ? {
                            countries: SCHENGEN_COUNTRIES,
                            totalMaxLen: 90,
                            rollingPeriodLen: 180,
                            mustExitBeforeExpiry: true,
                            includeEntryAndExitDates: true,
                          }
                        : key === "ESTA"
                          ? {
                              countries: ["US"],
                              tripMaxLen: 90,
                              mustExitBeforeExpiry: true,
                              includeEntryAndExitDates: true,
                            }
                          : key === "CA_ETA"
                            ? {
                                countries: ["CA"],
                                tripMaxLen: 180,
                                mustExitBeforeExpiry: true,
                                includeEntryAndExitDates: true,
                              }
                            : key === "AU_EVISITOR"
                              ? {
                                  countries: ["AU"],
                                  tripMaxLen: 30,
                                  mustExitBeforeExpiry: true,
                                  includeEntryAndExitDates: true,
                                }
                              : key === "NZETA"
                                ? {
                                    countries: ["NZ"],
                                    tripMaxLen: 180,
                                    mustExitBeforeExpiry: true,
                                    includeEntryAndExitDates: true,
                                  }
                                : {
                                    countries: [],
                                    mustExitBeforeExpiry: true,
                                    includeEntryAndExitDates: true,
                                  };
                    patch({ type: key, ...preset });
                  }}
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
        totalSteps={maxSteps}
        stepTitle={t("nameStep")}
        onClose={() => router.push("/visas")}
        onBack={() => setStep(0)}
        primary={{
          label: t("continue"),
          onClick: () => setStep(2),
          enabled: Boolean(form.name.trim()),
          variant: "primary",
        }}
      >
        <Stack gap="lg">
          <Field label={t("name")}>
            <Input
              value={form.name}
              onChange={(e) => patch({ name: e.target.value })}
              placeholder={t("namePlaceholder")}
            />
          </Field>
          <Field label={t("number")} optional>
            <Input
              value={form.visaNumber}
              onChange={(e) => patch({ visaNumber: e.target.value })}
              placeholder="Optional"
            />
          </Field>
          <Field label={t("documentNumber")} optional>
            <Input
              value={form.documentNumber}
              onChange={(e) => patch({ documentNumber: e.target.value })}
              placeholder="Optional"
            />
          </Field>
          <FactGrid cols={2}>
            <Fact label={t("typeQuestion")} value={t(`types.${form.type}`)} />
            <Fact
              label={t("countriesStep")}
              value={form.countries.length || "—"}
            />
          </FactGrid>
        </Stack>
      </WizardShell>
    );
  }

  if (step === 2) {
    return (
      <WizardShell
        title={t("create")}
        step={2}
        totalSteps={maxSteps}
        stepTitle={t("countriesStep")}
        onClose={() => router.push("/visas")}
        onBack={() => setStep(1)}
        primary={{
          label: t("continue"),
          onClick: () => setStep(3),
          enabled: form.countries.length > 0,
          variant: "primary",
        }}
      >
        <Stack gap="lg">
          <Stack gap="sm" className="flex-row flex-wrap items-center">
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
            <Text variant="meta" tone="muted" className="ml-auto">
              {form.countries.length} selected
            </Text>
          </Stack>

          <Input
            placeholder={t("searchCountry")}
            value={countrySearch}
            onChange={(e) => setCountrySearch(e.target.value)}
          />

          <OptionList maxHeight="56vh" className="overscroll-contain">
            {filteredCountries.map(({ code, label }) => {
              const name = COUNTRY_NAMES[code] ?? label;
              const emoji = COUNTRY_EMOJIS[code] ?? "•";
              return (
                <OptionRow
                  key={code}
                  flag={<span className="text-lg">{emoji}</span>}
                  title={name}
                  subtitle={code}
                  selected={form.countries.includes(code)}
                  onClick={() =>
                    patch({
                      countries: form.countries.includes(code)
                        ? form.countries.filter((selected) => selected !== code)
                        : [...form.countries, code],
                    })
                  }
                />
              );
            })}
          </OptionList>
        </Stack>
      </WizardShell>
    );
  }

  if (step === 3) {
    const isFinalStep = maxSteps === 4;
    return (
      <WizardShell
        title={t("create")}
        step={3}
        totalSteps={maxSteps}
        stepTitle={t("validityStep")}
        onClose={() => router.push("/visas")}
        onBack={() => setStep(2)}
        primary={{
          label: submitting ? "…" : isFinalStep ? t("create") : t("continue"),
          onClick: isFinalStep ? handleSubmit : () => setStep(4),
          enabled: Boolean(form.validFrom) && !submitting,
          variant: isFinalStep ? "accent" : "primary",
        }}
      >
        <Stack gap="lg">
          <AlertBox tone="ok" title={form.name || t(`types.${form.type}`)}>
            <Text variant="small" tone="muted">
              This step controls when the visa can be used and whether departure
              must happen before expiry.
            </Text>
          </AlertBox>
          <Field label={t("validFrom")}>
            <DatePicker
              value={form.validFrom}
              minDate={asIso(new Date())}
              onChange={(value) => patch({ validFrom: value })}
            />
          </Field>
          <Field label={t("expiresOn")} hint={t("expiresHint")} optional>
            <DatePicker
              value={form.expires}
              minDate={form.validFrom || asIso(new Date())}
              onChange={(value) => patch({ expires: value })}
            />
          </Field>
          <Checkbox
            checked={form.mustExitBeforeExpiry}
            onChange={(checked) => patch({ mustExitBeforeExpiry: checked })}
          >
            <div className="space-y-1">
              <div className="font-semibold text-fg">{t("mustLeave")}</div>
              <Text variant="small" tone="muted">
                Leave selected when the visa expires.
              </Text>
            </div>
          </Checkbox>
          <Checkbox
            checked={form.includeEntryAndExitDates}
            onChange={(checked) => patch({ includeEntryAndExitDates: checked })}
          >
            <div className="space-y-1">
              <div className="font-semibold text-fg">{t("countBothDays")}</div>
              <Text variant="small" tone="muted">
                Entry and exit days count toward the limit.
              </Text>
            </div>
          </Checkbox>
        </Stack>
      </WizardShell>
    );
  }

  return (
    <WizardShell
      title={t("create")}
      step={4}
      totalSteps={maxSteps}
      stepTitle={t("rulesStep")}
      onClose={() => router.push("/visas")}
      onBack={() => setStep(3)}
      primary={{
        label: submitting ? "…" : t("create"),
        onClick: handleSubmit,
        enabled: !submitting,
        variant: "accent",
      }}
    >
      <Stack gap="lg">
        <AlertBox
          tone="warn"
          title={selectedCountries || t(`types.${form.type}`)}
        >
          <Text variant="small" tone="muted">
            Configure the remaining limits for this visa.
          </Text>
        </AlertBox>

        <Grid cols={2} gap="md">
          <Field label={t("rollingLimit")}>
            <Input
              type="number"
              value={form.totalMaxLen}
              onChange={(e) =>
                patch({
                  totalMaxLen: e.target.value
                    ? parseInt(e.target.value, 10)
                    : "",
                })
              }
              placeholder="e.g. 90"
            />
          </Field>
          <Field label={t("rollingWindow")}>
            <Input
              type="number"
              value={form.rollingPeriodLen}
              onChange={(e) =>
                patch({
                  rollingPeriodLen: e.target.value
                    ? parseInt(e.target.value, 10)
                    : "",
                })
              }
              placeholder="e.g. 180"
            />
          </Field>
        </Grid>

        <Grid cols={2} gap="md">
          <Field label={t("maxTrips")} optional>
            <Input
              type="number"
              value={form.maxNumTrips}
              onChange={(e) =>
                patch({
                  maxNumTrips: e.target.value
                    ? parseInt(e.target.value, 10)
                    : "",
                })
              }
              placeholder="Optional"
            />
          </Field>
          <Field label={t("maxDaysPerTrip")} optional>
            <Input
              type="number"
              value={form.tripMaxLen}
              onChange={(e) =>
                patch({
                  tripMaxLen: e.target.value
                    ? parseInt(e.target.value, 10)
                    : "",
                })
              }
              placeholder="Optional"
            />
          </Field>
        </Grid>
      </Stack>
    </WizardShell>
  );
}
