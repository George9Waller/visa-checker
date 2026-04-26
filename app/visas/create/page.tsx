"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useLocale, useTranslations } from "next-intl";
import { SCHENGEN_COUNTRIES, VISA_TYPE, VISA_TYPE_META, VisaTypeKey } from "../constants";
import { createVisa, updateVisa } from "../server-actions";
import { COUNTRY_EMOJIS, getCountryLabel, getCountryLabels, getCountryName } from "@/app/constants";
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

type VisaDraft = {
  id: string;
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

const formFromDraft = (draft?: VisaDraft | null): FormData =>
  draft
    ? {
        type: draft.type,
        name: draft.name,
        visaNumber: draft.visaNumber,
        documentNumber: draft.documentNumber,
        countries: draft.countries,
        validFrom: draft.validFrom,
        expires: draft.expires,
        mustExitBeforeExpiry: draft.mustExitBeforeExpiry,
        includeEntryAndExitDates: draft.includeEntryAndExitDates,
        totalMaxLen: draft.totalMaxLen,
        rollingPeriodLen: draft.rollingPeriodLen,
        maxNumTrips: draft.maxNumTrips,
        tripMaxLen: draft.tripMaxLen,
      }
    : INITIAL;

interface CreateVisaWizardProps {
  title?: string;
  mode?: "create" | "edit";
  cancelHref?: string;
  submitHref?: string;
  initialVisa?: VisaDraft | null;
  lockedType?: VisaTypeKey | null;
  renewedFromId?: string | null;
  redirectToCreatedVisa?: boolean;
}

export default function CreateVisaWizard({
  title,
  mode = "create",
  cancelHref = "/visas",
  submitHref = "/visas",
  initialVisa = null,
  lockedType = null,
  renewedFromId = null,
  redirectToCreatedVisa = false,
}: CreateVisaWizardProps = {}) {
  const t = useTranslations("visa");
  const locale = useLocale();
  const router = useRouter();
  const [step, setStep] = useState(lockedType ? 1 : 0);
  const [form, setForm] = useState<FormData>(() => formFromDraft(initialVisa));
  const [countrySearch, setCountrySearch] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const maxSteps = totalSteps(form.type);
  const displayedStep = lockedType ? Math.max(step - 1, 0) : step;
  const displayedTotalSteps = lockedType ? maxSteps - 1 : maxSteps;
  const shellTitle = title ?? (mode === "edit" ? t("edit") : t("create"));

  const patch = (update: Partial<FormData>) =>
    setForm((current) => ({ ...current, ...update }));

  const sortedCountries = useMemo(
    () =>
      Object.keys(getCountryLabels(locale))
        .map((code) => ({ code, label: getCountryLabel(code, locale) }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [locale]
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
      const payload = [
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
        form.documentNumber || undefined,
      ] as const;

      if (mode === "edit" && initialVisa) {
        await updateVisa(initialVisa.id, ...payload);
      } else {
        const visa = await createVisa(...payload, renewedFromId || undefined);
        if (redirectToCreatedVisa && visa?.id) {
          router.push(`/visas/${visa.id}`);
          return;
        }
      }
      router.push(submitHref);
    } catch (error) {
      toast.error(t("errorSavingVisa", { error: String(error) }));
    } finally {
      setSubmitting(false);
    }
  };

  const selectedCountries = form.countries
    .map((code) => getCountryName(code, locale))
    .join(" · ");

  if (step === 0) {
    return (
      <WizardShell
        title={shellTitle}
        step={displayedStep}
        totalSteps={displayedTotalSteps}
        stepTitle={t("typeQuestion")}
        onClose={() => router.push(cancelHref)}
        primary={{
          label: t("continue"),
          onClick: () => setStep(1),
          enabled: Boolean(form.type),
          variant: "primary",
        }}
      >
        <Stack gap="lg">
          <AlertBox tone="warn" title={t("chooseVisaTemplate")}>
            <Text variant="small" tone="muted">
              {t("chooseVisaTemplateHint")}
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
                  subtitle={t(`typeDescs.${key}`)}
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
                              mustExitBeforeExpiry: false,
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
        title={shellTitle}
        step={displayedStep}
        totalSteps={displayedTotalSteps}
        stepTitle={t("nameStep")}
        onClose={() => router.push(cancelHref)}
        onBack={lockedType ? null : () => setStep(0)}
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
              placeholder={t("optional")}
            />
          </Field>
          <Field label={t("documentNumber")} optional>
            <Input
              value={form.documentNumber}
              onChange={(e) => patch({ documentNumber: e.target.value })}
              placeholder={t("optional")}
            />
          </Field>
          <FactGrid cols={2}>
            <Fact label={t("typeQuestion")} value={t(`types.${form.type}`)} />
            <Fact label={t("countriesStep")} value={form.countries.length || "—"} />
          </FactGrid>
        </Stack>
      </WizardShell>
    );
  }

  if (step === 2) {
    return (
      <WizardShell
        title={shellTitle}
        step={displayedStep}
        totalSteps={displayedTotalSteps}
        stepTitle={t("countriesStep")}
        onClose={() => router.push(cancelHref)}
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
              {t("selectedCount", { count: form.countries.length })}
            </Text>
          </Stack>

          <Input
            placeholder={t("searchCountry")}
            value={countrySearch}
            onChange={(e) => setCountrySearch(e.target.value)}
          />

          <OptionList maxHeight="56vh" className="overscroll-contain">
            {filteredCountries.map(({ code, label }) => {
              const name = getCountryName(code, locale) ?? label;
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
        title={shellTitle}
        step={displayedStep}
        totalSteps={displayedTotalSteps}
        stepTitle={t("validityStep")}
        onClose={() => router.push(cancelHref)}
        onBack={() => setStep(2)}
        primary={{
          label: submitting
            ? "…"
            : isFinalStep
              ? mode === "edit"
                ? t("save")
                : t("create")
              : t("continue"),
          onClick: isFinalStep ? handleSubmit : () => setStep(4),
          enabled: Boolean(form.validFrom) && !submitting,
          variant: isFinalStep ? "accent" : "primary",
        }}
      >
        <Stack gap="lg">
          <AlertBox tone="ok" title={form.name || t(`types.${form.type}`)}>
            <Text variant="small" tone="muted">
              {t("validityHint")}
            </Text>
          </AlertBox>
          <Field label={t("validFrom")}>
            <DatePicker
              value={form.validFrom}
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
                {t("mustLeaveHint")}
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
                {t("countBothDaysHint")}
              </Text>
            </div>
          </Checkbox>
        </Stack>
      </WizardShell>
    );
  }

  return (
    <WizardShell
      title={shellTitle}
      step={displayedStep}
      totalSteps={displayedTotalSteps}
      stepTitle={t("rulesStep")}
      onClose={() => router.push(cancelHref)}
      onBack={() => setStep(3)}
      primary={{
        label: submitting ? "…" : mode === "edit" ? t("save") : t("create"),
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
            {t("limitsHint")}
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
              placeholder={t("exampleDays", { count: 90 })}
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
              placeholder={t("exampleDays", { count: 180 })}
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
              placeholder={t("optional")}
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
              placeholder={t("optional")}
            />
          </Field>
        </Grid>
      </Stack>
    </WizardShell>
  );
}
