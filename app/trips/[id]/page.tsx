"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  getTrip,
  updateTrip,
  deleteTrip,
  getPossibleVisasForTrip,
  selectVisaForTrip,
  VisaWithValid,
} from "../server-actions";
import { useParams, useRouter } from "next/navigation";
import { Trip } from "../../../generated/prisma/client";
import { convertDateToString } from "@/app/utils";
import { COLOURS, COUNTRY_LABELS } from "@/app/constants";
import Link from "next/link";
import { toast } from "react-toastify";
import { VISA_TYPES_DISPLAY_MAP } from "@/app/visas/constants";
import PrivateText from "@/app/components/PrivateText";
import { StatusBadge } from "@/app/components/ui/StatusBadge";
import { Field, Input } from "@/app/components/ui/Field";
import { Btn } from "@/app/components/ui/Btn";
import { useTranslations } from "next-intl";
import { PageShell } from "@/app/components/ui/PageShell";
import { PageHeader, IconBtn } from "@/app/components/ui/PageHeader";
import { ContentWell } from "@/app/components/ui/ContentWell";
import { FactsCard } from "@/app/components/ui/FactsCard";
import { AlertStrip } from "@/app/components/ui/AlertStrip";
import { SelectableRow } from "@/app/components/ui/SelectableRow";
import { ColorSwatch } from "@/app/components/ui/ColorSwatch";
import { EmptyState } from "@/app/components/ui/EmptyState";
import { Modal } from "@/app/components/ui/Modal";
import { CheckableRow } from "@/app/components/ui/CheckableRow";
import { splitCountryLabel } from "@/app/components/utils/countries";
import { Flex } from "@/app/components/ui/layout/Flex";
import { Grid } from "@/app/components/ui/layout/Grid";
import { Text } from "@/app/components/ui/typography/Text";

export default function TripDetail() {
  const t = useTranslations("trip");
  const tStatus = useTranslations("status");
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [trip, setTrip] = useState<
    | Pick<
        Trip,
        | "startDate"
        | "endDate"
        | "name"
        | "colour"
        | "countryCode"
        | "visaRequired"
      >
    | undefined
  >();
  const [visas, setVisas] = useState<VisaWithValid[]>([]);
  const [selectedColour, setSelectedColour] = useState<string | undefined>();
  const [editing, setEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    getTrip(params.id)
      .then((t) => {
        setTrip(t);
        setSelectedColour(t.colour);
      })
      .catch((e) => toast.error(`Error fetching trip: ${e}`));
    getPossibleVisasForTrip(params.id)
      .then(setVisas)
      .catch((e) => toast.error(`Error fetching visas: ${e}`));
  }, []);

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    updateTrip(
      params.id,
      formData.get("startDate") as string,
      formData.get("endDate") as string,
      formData.get("country") as string,
      selectedColour || trip?.colour || "1",
      (formData.get("visaRequired") as string) === "on",
      (formData.get("name") as string) || null
    )
      .then(() => router.push("/"))
      .catch((e) => toast.error(`Error updating trip: ${e}`));
  };

  const handleDelete = () => {
    deleteTrip(params.id)
      .then(() => {
        toast.success("Trip deleted");
        router.push("/");
      })
      .catch((e) => toast.error(`Error deleting trip: ${e}`));
  };

  if (!trip) {
    return (
      <Flex align="center" justify="center" py="96px">
        <div
          className="animate-spin rounded-full border-2"
          style={{
            width: 20,
            height: 20,
            borderColor: "var(--fg-faint)",
            borderTopColor: "var(--fg-muted)",
          }}
        />
      </Flex>
    );
  }

  const { flag, name: countryName } = splitCountryLabel(COUNTRY_LABELS[trip.countryCode]);
  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);
  const durationDays =
    Math.round((endDate.getTime() - startDate.getTime()) / 86400000) + 1;

  const selectedVisa = visas.find((v) => v.VisaTrip.length > 0);
  const visaTone = selectedVisa?.validForTrip
    ? ("ok" as const)
    : selectedVisa
    ? ("danger" as const)
    : trip.visaRequired
    ? ("warn" as const)
    : ("muted" as const);

  const visaStatusLabel = selectedVisa?.validForTrip
    ? tStatus("validated")
    : selectedVisa
    ? tStatus("visaInvalid")
    : trip.visaRequired
    ? tStatus("noVisaAssigned")
    : tStatus("noVisaNeeded");

  if (editing) {
    const sortedCountries = Object.keys(COUNTRY_LABELS)
      .map((code) => ({ code, label: COUNTRY_LABELS[code] }))
      .sort((a, b) => a.label.localeCompare(b.label));

    return (
      <PageShell>
        <PageHeader
          variant="detail"
          kicker="Editing"
          title={trip.name || countryName}
          actions={
            <IconBtn icon="close" label="Cancel editing" onClick={() => setEditing(false)} />
          }
        />

        <form style={{ padding: "24px 20px", display: "flex", flexDirection: "column", gap: 20 }} onSubmit={handleSave}>
          <Field label={t("name")}>
            <Input
              name="name"
              defaultValue={trip.name || ""}
              placeholder={t("namePlaceholder")}
            />
          </Field>

          <Grid templateColumns="1fr 1fr" gap={12}>
            <Field label={t("startDate")} required>
              <Input
                type="date"
                name="startDate"
                defaultValue={convertDateToString(trip.startDate)}
                required
              />
            </Field>
            <Field label={t("endDate")} required>
              <Input
                type="date"
                name="endDate"
                defaultValue={convertDateToString(trip.endDate)}
                required
              />
            </Field>
          </Grid>

          <Field label={t("country")} required>
            <select
              name="country"
              defaultValue={trip.countryCode}
              style={{
                width: "100%",
                padding: "10px 12px",
                fontSize: "var(--text-md)",
                fontFamily: "var(--font-body)",
                backgroundColor: "var(--bg-raised)",
                color: "var(--fg)",
                border: "1px solid var(--border)",
                borderRadius: "var(--r-s)",
                outline: "none",
              }}
            >
              {sortedCountries.map(({ code, label }) => (
                <option key={code} value={code}>
                  {label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Colour">
            <Flex gap={8}>
              {Object.keys(COLOURS).map((colourId) => (
                <ColorSwatch
                  key={colourId}
                  color={COLOURS[colourId]}
                  selected={selectedColour === colourId}
                  onClick={() => setSelectedColour(colourId)}
                />
              ))}
            </Flex>
          </Field>

          <input type="checkbox" name="visaRequired" checked={trip.visaRequired} className="sr-only" readOnly />
          <CheckableRow
            checked={trip.visaRequired}
            onChange={() => {
              const curr = trip.visaRequired;
              setTrip((t) => t && { ...t, visaRequired: !curr });
            }}
            label={t("requiresVisa")}
          />

          <Flex gap={8} pt={8}>
            <Btn type="submit" variant="primary">{t("save")}</Btn>
            <Btn type="button" variant="danger" onClick={() => setShowDeleteConfirm(true)}>
              {t("delete")}
            </Btn>
          </Flex>
        </form>

        <Modal open={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)}>
          <Modal.Title>{t("deleteConfirm")}</Modal.Title>
          <Flex gap={8}>
            <Btn variant="ghost" onClick={() => setShowDeleteConfirm(false)}>Cancel</Btn>
            <Btn variant="danger" onClick={handleDelete}>{t("delete")}</Btn>
          </Flex>
        </Modal>
      </PageShell>
    );
  }

  /* ── Detail view ── */
  return (
    <PageShell>
      <PageHeader
        variant="detail"
        backHref="/"
        kicker={`${flag} ${countryName}`}
        title={trip.name || countryName}
        actions={
          <IconBtn
            icon="edit"
            label="Edit trip"
            onClick={() => setEditing(true)}
          />
        }
      />

      <ContentWell>
        <FactsCard cols={2}>
          <FactsCard.Fact
            label={t("from")}
            value={startDate.toLocaleDateString(undefined, {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          />
          <FactsCard.Fact
            label={t("to")}
            value={endDate.toLocaleDateString(undefined, {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          />
          <FactsCard.Fact label={t("length")} value={`${durationDays} ${t("days")}`} />
          <FactsCard.Fact label={t("country")} value={`${flag} ${countryName}`} />
        </FactsCard>

        <AlertStrip tone={visaTone}>
          <AlertStrip.Title>{visaStatusLabel}</AlertStrip.Title>
          {selectedVisa ? (
            <Link href={`/visas/${selectedVisa.id}`} style={{ textDecoration: "none" }}>
              <AlertStrip.Body>
                {selectedVisa.name} · {VISA_TYPES_DISPLAY_MAP[selectedVisa.type]}
              </AlertStrip.Body>
            </Link>
          ) : !trip.visaRequired ? (
            <AlertStrip.Body>{t("visaFree")}</AlertStrip.Body>
          ) : null}
        </AlertStrip>

        {trip.visaRequired && visas.length > 0 && (
          <Flex direction="column" gap={8}>
            <Text as="p" variant="mono" size="var(--text-label)" weight={700} transform="uppercase" color="var(--fg-muted)" letterSpacing="0.12em" mb={8}>
              {t("visa")}
            </Text>
            <Flex direction="column" gap={8}>
              {visas.map((visa) => {
                const isSelected = visa.VisaTrip.length > 0;
                const vTone = visa.validForTrip ? ("ok" as const) : ("danger" as const);
                return (
                  <SelectableRow
                    key={visa.id}
                    selected={isSelected}
                    indicator="radio"
                    title={visa.name}
                    subtitle={
                      visa.visaNumber
                        ? `${VISA_TYPES_DISPLAY_MAP[visa.type]} · ${visa.visaNumber}`
                        : VISA_TYPES_DISPLAY_MAP[visa.type]
                    }
                    trailing={
                      <StatusBadge
                        tone={vTone}
                        label={visa.validForTrip ? tStatus("valid") : tStatus("visaInvalid")}
                        size="xs"
                      />
                    }
                    onClick={() =>
                      selectVisaForTrip(params.id, visa.id)
                        .then(setVisas)
                        .catch((e) => toast.error(`Error updating trip visa: ${e}`))
                    }
                  />
                );
              })}
            </Flex>
          </Flex>
        )}

        {trip.visaRequired && visas.length === 0 && (
          <EmptyState
            icon="credit_card"
            message={t("noVisas")}
            action={
              <Link href="/visas/create" style={{ textDecoration: "none" }}>
                <Btn variant="accent">Create a visa</Btn>
              </Link>
            }
          />
        )}
      </ContentWell>
    </PageShell>
  );
}
