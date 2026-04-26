import { redirect } from "next/navigation";
import CreateVisaWizard from "@/app/visas/create/page";
import { getVisaDetailSummary } from "../../server-actions";
import { VisaTypeKey } from "../../constants";

export default async function EditVisaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const summary = await getVisaDetailSummary(id);

  if (!summary) {
    redirect("/visas");
  }

  return (
    <CreateVisaWizard
      title="Edit visa"
      mode="edit"
      cancelHref={`/visas/${id}`}
      submitHref={`/visas/${id}`}
      initialVisa={{
        id: summary.visa.id,
        type: summary.visa.type as VisaTypeKey,
        name: summary.visa.name,
        visaNumber: summary.visa.visaNumber ?? "",
        documentNumber: summary.visa.documentNumber ?? "",
        countries: summary.visa.countries,
        validFrom: summary.visa.validFrom.toISOString().split("T")[0],
        expires: summary.visa.expires
          ? summary.visa.expires.toISOString().split("T")[0]
          : "",
        mustExitBeforeExpiry: summary.visa.mustExitBeforeExpiry,
        includeEntryAndExitDates: summary.visa.includeEntryAndExitDates,
        totalMaxLen: summary.visa.totalMaxLen ?? "",
        rollingPeriodLen: summary.visa.rollingPeriodLen ?? "",
        maxNumTrips: summary.visa.maxNumTrips ?? "",
        tripMaxLen: summary.visa.tripMaxLen ?? "",
      }}
    />
  );
}
