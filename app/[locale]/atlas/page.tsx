import { getAtlasTrips } from "./server-actions";
import { AtlasPageClient } from "./AtlasPageClient";

export default async function AtlasPage() {
  const trips = await getAtlasTrips();

  return <AtlasPageClient trips={trips} />;
}
