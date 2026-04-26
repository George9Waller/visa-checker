import { getTripCountrySuggestions } from "../../server-actions";
import { getTripDetailSummary } from "../../server-actions";
import CreateTripWizard from "../../create/CreateTripWizard";

export default async function EditTripPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const summary = await getTripDetailSummary(id);
  const countrySuggestions = await getTripCountrySuggestions();

  return (
    <CreateTripWizard
      title="Edit trip"
      mode="edit"
      cancelHref={`/trips/${id}`}
      submitHref={`/trips/${id}`}
      countrySuggestions={countrySuggestions}
      initialVisaId={summary.selectedVisaId}
      initialTrip={{
        id: summary.trip.id,
        country: summary.trip.countryCode,
        name: summary.trip.name ?? "",
        startDate: summary.trip.startDate.toISOString().split("T")[0],
        endDate: summary.trip.endDate.toISOString().split("T")[0],
        visaRequired: summary.trip.visaRequired,
        colour: summary.trip.colour,
      }}
    />
  );
}
