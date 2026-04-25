import { getTripCountrySuggestions } from "../server-actions";
import CreateTripWizard from "./CreateTripWizard";

export default async function CreateTripPage() {
  const suggestions = await getTripCountrySuggestions();
  return <CreateTripWizard countrySuggestions={suggestions} />;
}
