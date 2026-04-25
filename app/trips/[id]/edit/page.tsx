import { getTrip } from "../../server-actions";
import { getTripCountrySuggestions } from "../../server-actions";
import CreateTripWizard from "../../create/CreateTripWizard";

export default async function EditTripPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const trip = await getTrip(id);
  const countrySuggestions = await getTripCountrySuggestions();

  return (
    <CreateTripWizard
      title="Edit trip"
      mode="edit"
      cancelHref={`/trips/${id}`}
      submitHref={`/trips/${id}`}
      countrySuggestions={countrySuggestions}
      initialTrip={{
        id: trip.id,
        country: trip.countryCode,
        name: trip.name ?? "",
        startDate: trip.startDate.toISOString().split("T")[0],
        endDate: trip.endDate.toISOString().split("T")[0],
        visaRequired: trip.visaRequired,
        colour: trip.colour,
      }}
    />
  );
}
