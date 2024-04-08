export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import { getVisa, visaInfoForDate } from "../server-actions";
import { VISA_TYPES_DISPLAY_MAP } from "../constants";
import { COLOURS, COUNTRY_LABELS } from "@/app/constants";
import { convertDateToString } from "@/app/utils";
import { getDateWithOffset } from "@/app/server-actions";
import DeleteVisaButton from "@/app/components/DeleteVisaButton";
import PrivateText from "@/app/components/PrivateText";

export default async function Home({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: {
    show_outside_rolling_range?: string | string[];
    date?: string | string[];
  };
}) {
  const date = searchParams.date
    ? new Date(searchParams.date.toString())
    : new Date();
  const visa = await getVisa(params.id);
  const visaTripInfo = await visaInfoForDate(
    params.id,
    getDateWithOffset(date)
  );

  if (!visa) {
    redirect("/visas");
  }

  const visaDetails = [
    {
      title: "Visa Number",
      content: visa.visaNumber,
      private: true,
    },
    {
      title: "Document Number",
      content: visa.documentNumber,
      private: true,
    },
    {
      title: "Type",
      content: VISA_TYPES_DISPLAY_MAP[visa.type],
    },
    {
      title: "Valid From",
      content: visa.validFrom.toLocaleDateString(),
    },
    {
      title: "Expiry",
      content: visa.expires ? visa.expires.toLocaleDateString() : "Never",
    },
  ].filter((detail) => detail.content);

  const hasManyCountries = visa.countries.length > 1;

  const tripLabels = visaTripInfo.trips
    ? Object.fromEntries(
        visaTripInfo.trips.map((trip, index) => [
          trip.trip.id,
          { index: index + 1, colour: trip.trip.colour },
        ])
      )
    : {};

  const tripIdInRollingPeriod: string[] =
    visaTripInfo.aggregateValidation
      ?.find((aggregate) => aggregate.name === "Rolling Period")
      ?.data.map((trip) => trip.tripId) || [];

  const yearMarkers: number[] = [];

  const yearMarker = (year: number) => {
    if (!yearMarkers.includes(year)) {
      yearMarkers.push(year);
      return <p className="font-medium mt-4">{year}</p>;
    }
    return <></>;
  };

  return (
    <div className="card bg-base-100 p-6 w-full flex flex-col gap-4">
      <div className="flex items-center">
        <h1 className="text-lg flex-1">{visa.name}</h1>
        <div className="flex-0 flex flex-row gap-2">
          <DeleteVisaButton visaId={params.id} />
          <Link href={"/visas"} className="btn btn-square flex-0">
            x
          </Link>
        </div>
      </div>
      <hr />
      <div className="flex flex-col w-full gap-2">
        <div className="p-4 grid grid-cols-2 gap-4">
          {visaDetails.map((detail) => (
            <div key={detail.title} className="rounded py-2 px-4 border">
              <h2 className="font-semibold">{detail.title}</h2>
              {detail.private ? (
                <PrivateText>
                  <span className="font-mono">{detail.content}</span>
                </PrivateText>
              ) : (
                <p className="text-sm">{detail.content}</p>
              )}
            </div>
          ))}
          <div
            className={`collapse rounded border ${
              hasManyCountries ? "collapse-arrow col-span-2" : "collapse-open"
            }`}
          >
            <input type="checkbox" />
            <div className="collapse-title">
              <h2 className="font-semibold">
                {hasManyCountries ? "Countries" : "Country"}
              </h2>
            </div>
            <div className="collapse-content grid grid-cols-2 gap-1">
              {visa.countries.map((countryCode) => (
                <p key={countryCode} className="text-sm">
                  {COUNTRY_LABELS[countryCode]}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="p-4">
        <h2 className="font-semibold text-xl ">Calculation Date</h2>
        <form action={`/visas/${params.id}`} method="GET">
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">
                The calculations and trips will be shown as if this is the
                current date
              </span>
            </div>
            <div className="flex gap-2">
              <input
                type="hidden"
                name="show_outside_rolling_range"
                value={searchParams.show_outside_rolling_range}
              />
              <input
                name="date"
                type="date"
                className="input input-bordered w-full max-w-xs"
                defaultValue={convertDateToString(date)}
              />
              <button type="submit" className="btn">
                Go
              </button>
            </div>
          </label>
        </form>
        {date.toLocaleDateString() !== new Date().toLocaleDateString() && (
          <div className="outline outline-error my-2 p-4 rounded">
            <p>
              The calculations are not based off today, they are as if it was{" "}
              {date.toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
      {visaTripInfo.summary && (
        <div className="p-4">
          <h2 className="font-semibold text-xl mb-2">Summary</h2>
          {visaTripInfo.summary.items.map((item, index) => (
            <div
              key={index}
              className={`rounded py-2 px-4 border ${
                visaTripInfo.summary.valid ? "border-success" : "border-error"
              }`}
            >
              <h2 className="font-semibold">{item.title}</h2>
              <p className="text-sm">{item.content}</p>
            </div>
          ))}
        </div>
      )}
      {visaTripInfo.aggregateValidation &&
        visaTripInfo.aggregateValidation.length > 0 && (
          <div className="p-4">
            <h2 className="font-semibold text-xl mb-2">Aggregates</h2>
            <div className="">
              {visaTripInfo.aggregateValidation.map((aggregate) => (
                <div
                  key={aggregate.name}
                  className={`rounded my-2 border p-4 flex items-start gap-4 ${
                    aggregate.valid ? "border-success" : "border-error"
                  }`}
                >
                  <div className="flex-1 flex flex-col justify-between gap-2">
                    <div>
                      <h3 className="font-medium">{aggregate.name}</h3>
                      <p className="text-xs">{aggregate.description}</p>
                    </div>
                    {(aggregate.remaining || aggregate.remaining === 0) && (
                      <h3
                        className={`text-xs ${
                          aggregate.remaining > 0
                            ? "text-success"
                            : "text-error"
                        }`}
                      >
                        <span className="font-medium">Remaining:</span>{" "}
                        {aggregate.remaining}
                      </h3>
                    )}
                  </div>
                  {aggregate.data && (
                    <div className="flex-0 flex flex-wrap justify-end w-1/2">
                      {aggregate.data.map((dataPoint) => (
                        <div className="px-4 py-2 flex items-center">
                          <Link
                            href={`#trip-${tripLabels[dataPoint.tripId].index}`}
                            className="font-bold text-sm mr-1 w-6 leading-6 flex items-center justify-center rounded-full border-2 cursor-pointer"
                            style={{
                              borderColor:
                                COLOURS[tripLabels[dataPoint.tripId].colour],
                            }}
                          >
                            {tripLabels[dataPoint.tripId].index}
                          </Link>
                          <span className="text-xs">
                            {dataPoint.count} {dataPoint.descriptor}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      {visaTripInfo.trips && visaTripInfo.trips.length > 0 && (
        <div className="p-4">
          <h2 className="font-semibold text-xl mb-2">
            Trips
            {tripIdInRollingPeriod.length > 0 && (
              <form className="inline" action={`/visas/${params.id}`}>
                <input
                  type="hidden"
                  name="date"
                  value={convertDateToString(date)}
                />
                <input
                  type="hidden"
                  name="show_outside_rolling_range"
                  value={searchParams.show_outside_rolling_range ? "" : "true"}
                />
                <button
                  type="submit"
                  className="text-xs hover:underline text-base-500 font-normal ml-2"
                >
                  {searchParams.show_outside_rolling_range
                    ? "hide trips before the rolling range"
                    : "show trips before the rolling range?"}
                </button>
              </form>
            )}
          </h2>
          <div className="">
            {visaTripInfo.trips
              .filter((trip) => {
                if (searchParams.show_outside_rolling_range) {
                  return true;
                } else if (tripIdInRollingPeriod.length > 0) {
                  return tripIdInRollingPeriod.includes(trip.trip.id);
                }
                return true;
              })
              .map((trip) => (
                <>
                  {yearMarker(trip.trip.startDate.getFullYear())}
                  <div
                    key={trip.trip.id}
                    className={`rounded my-2 border p-4 flex items-stretch gap-4 ${
                      trip.valid ? "border-success" : "border-error"
                    }`}
                  >
                    <div className="flex-1 flex flex-col justify-between gap-2">
                      <div>
                        <h3
                          id={`trip-${tripLabels[trip.trip.id].index}`}
                          className="font-medium"
                        >
                          {trip.trip.name}
                        </h3>
                        <p className="text-xs">
                          <span className="material-symbols-outlined text-xs">
                            location_on
                          </span>{" "}
                          {COUNTRY_LABELS[trip.trip.country]}
                        </p>
                        <p className="text-xs">
                          <span className="material-symbols-outlined text-xs">
                            calendar_month
                          </span>{" "}
                          {trip.trip.startDate.toLocaleDateString()} -{" "}
                          {trip.trip.endDate.toLocaleDateString()}
                        </p>
                        <p className="text-xs">
                          <span className="material-symbols-outlined text-xs">
                            hourglass_bottom
                          </span>{" "}
                          {trip.trip.tripLen} day{trip.trip.tripLen > 1 && "s"}
                        </p>
                      </div>
                      <div className="flex justify-between flex-col">
                        <h4 className="font-medium text-sm mb-0.5">Validity</h4>
                        <div className="flex gap-1">
                          {trip.results.map((result) => (
                            <div
                              className={`tooltip w-fit border p-1 rounded ${
                                result.valid ? "border-success" : "border-error"
                              }`}
                              data-tip={result.description}
                            >
                              <p
                                className={`text-xs ${
                                  result.valid ? "text-success" : "text-error"
                                }`}
                              >
                                {result.name}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-between items-end">
                      <div
                        className="font-bold text-sm mr-1 w-6 leading-6 flex items-center justify-center rounded-full border-2"
                        style={{ borderColor: COLOURS[trip.trip.colour] }}
                      >
                        {tripLabels[trip.trip.id].index}
                      </div>
                      <Link
                        href={`/trips/${trip.trip.id}`}
                        className="btn btn-sm"
                      >
                        View trip
                      </Link>
                    </div>
                  </div>
                </>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
