"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useState } from "react";
import {
  SCHENGEN_COUNTRIES,
  VISA_TYPE,
  VISA_TYPES_DISPLAY_MAP,
} from "../constants";
import { convertDateToString } from "@/app/utils";
import { COUNTRY_LABELS } from "@/app/constants";
import CountryModel from "@/app/components/CountryModel";
import { createVisa } from "../server-actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function Home() {
  const router = useRouter();
  const [countries, setCountries] = useState<string[]>([]);
  const [maxNumTrips, setMaxNumTrips] = useState<number | "">("");
  const [tripMaxLen, setTripMaxLen] = useState<number | "">("");
  const [totalMaxLen, setTotalMaxLen] = useState<number | "">("");
  const [rollingPeriodLen, setRollingPeriodLen] = useState<number | "">("");
  const [mustExitBeforeExpiry, setMustExitBeforeExpiry] = useState(false);
  const [includeEntryAndExitDates, setIncludeEntryAndExitDates] =
    useState(false);

  const getIntOrUndefined = (value: number | "") =>
    value === "" ? undefined : value;

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    createVisa(
      formData.get("name") as string,
      formData.get("type") as string,
      formData.get("validFrom") as string,
      countries,
      getIntOrUndefined(maxNumTrips),
      getIntOrUndefined(tripMaxLen),
      getIntOrUndefined(totalMaxLen),
      getIntOrUndefined(rollingPeriodLen),
      (formData.get("expires") as string) || undefined,
      mustExitBeforeExpiry,
      includeEntryAndExitDates,
      (formData.get("visaNumber") as string) || undefined,
      (formData.get("documentNumber") as string) || undefined
    )
      .then(() => router.push("/visas"))
      .catch((error) => toast.error(`Error creating visa: ${error}`));
  };

  const typeOnChange = (event: ChangeEvent<HTMLSelectElement>) => {
    switch (event.currentTarget.value) {
      case VISA_TYPE.SCHENGEN:
        setCountries(SCHENGEN_COUNTRIES);
        setMaxNumTrips("");
        setTripMaxLen("");
        setTotalMaxLen(90);
        setRollingPeriodLen(180);
        setMustExitBeforeExpiry(true);
        setIncludeEntryAndExitDates(true);
        break;
      case VISA_TYPE.ESTA:
        setCountries(["US"]);
        setMaxNumTrips("");
        setTripMaxLen(90);
        setTotalMaxLen("");
        setRollingPeriodLen("");
        setMustExitBeforeExpiry(true);
        setIncludeEntryAndExitDates(true);
        break;
      case VISA_TYPE.CA_ETA:
        setCountries(["CA"]);
        setMaxNumTrips("");
        setTripMaxLen(180);
        setTotalMaxLen("");
        setRollingPeriodLen("");
        setMustExitBeforeExpiry(true);
        setIncludeEntryAndExitDates(true);
        break;
      case VISA_TYPE.AU_EVISITOR:
        setCountries(["AU"]);
        setMaxNumTrips("");
        setTripMaxLen(30);
        setTotalMaxLen("");
        setRollingPeriodLen("");
        setMustExitBeforeExpiry(true);
        setIncludeEntryAndExitDates(true);
        break;
      case VISA_TYPE.NZETA:
        setCountries(["NZ"]);
        setMaxNumTrips("");
        setTripMaxLen(180);
        setTotalMaxLen("");
        setRollingPeriodLen("");
        setMustExitBeforeExpiry(true);
        setIncludeEntryAndExitDates(true);
        break;
      default:
        setCountries([]);
        setMaxNumTrips("");
        setTripMaxLen("");
        setTotalMaxLen("");
        setRollingPeriodLen("");
        setMustExitBeforeExpiry(true);
        setIncludeEntryAndExitDates(true);
        break;
    }
  };

  return (
    <>
      <form
        className="card bg-base-100 p-6 w-full flex flex-col gap-4"
        onSubmit={onSubmit}
      >
        <div className="flex items-center">
          <h1 className="text-lg flex-1">Create visa</h1>
          <div className="flex-0 flex flex-row gap-2">
            <Link href={"/visas"} className="btn btn-square flex-0">
              x
            </Link>
          </div>
        </div>
        <hr />
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Name</span>
          </div>
          <input
            name="name"
            type="text"
            required
            className="input input-bordered w-full max-w-xs"
          />
        </label>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Visa number (optional)</span>
          </div>
          <input
            name="visaNumber"
            type="text"
            className="input input-bordered w-full max-w-xs"
          />
        </label>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Document number (optional)</span>
          </div>
          <input
            name="documentNumber"
            type="text"
            className="input input-bordered w-full max-w-xs"
          />
        </label>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Type</span>
          </div>
          <select
            name="type"
            className="input input-bordered w-full max-w-xs"
            onChange={typeOnChange}
            required
          >
            <option value={undefined}>Select Type</option>
            {Object.keys(VISA_TYPES_DISPLAY_MAP).map((key) => (
              <option key={key} value={key}>
                {VISA_TYPES_DISPLAY_MAP[key]}
              </option>
            ))}
          </select>
        </label>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Countries</span>
            <button
              className="btn btn-xs"
              onClick={(e) => {
                e.preventDefault();
                (
                  document.getElementById(
                    "countries_modal"
                  ) as HTMLDialogElement | null
                )?.showModal();
              }}
            >
              Select
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {countries
              .sort((a, b) => (a > b ? 1 : -1))
              .map((countryCode) => (
                <p key={countryCode}>{COUNTRY_LABELS[countryCode]}</p>
              ))}
          </div>
        </label>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Valid from</span>
          </div>
          <input
            name="validFrom"
            type="date"
            className="input input-bordered w-full max-w-xs"
            required
            defaultValue={convertDateToString(new Date())}
          />
        </label>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">
              Does this visa have an expiry, if so when is it?
            </span>
          </div>
          <input
            name="expires"
            type="date"
            className="input input-bordered w-full max-w-xs"
          />
        </label>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">
              Does this visa have a maximum number of trips you can take, if so
              how many?
            </span>
          </div>
          <input
            name="maxNumTrips"
            type="number"
            value={maxNumTrips}
            onChange={(e) =>
              setMaxNumTrips(
                e.target.value ? parseInt(e.currentTarget.value) : ""
              )
            }
            className="input input-bordered w-full max-w-xs"
          />
        </label>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">
              Does this visa have a maximum number of days any single trip can
              be, if so how many?
            </span>
          </div>
          <input
            name="tripMaxLen"
            type="number"
            value={tripMaxLen}
            onChange={(e) =>
              setTripMaxLen(
                e.target.value ? parseInt(e.currentTarget.value) : ""
              )
            }
            className="input input-bordered w-full max-w-xs"
          />
        </label>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">
              Does this visa have a total maximum number of days (e.g. 90), if
              so how many?
            </span>
          </div>
          <input
            name="totalMaxLen"
            type="number"
            value={totalMaxLen}
            onChange={(e) =>
              setTotalMaxLen(
                e.target.value ? parseInt(e.currentTarget.value) : ""
              )
            }
            className="input input-bordered w-full max-w-xs"
          />
        </label>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">
              Does this visa have a rolling period (e.g. in the last 180 days),
              if so what is it?
            </span>
          </div>
          <input
            name="rollingPeriodLen"
            type="number"
            value={rollingPeriodLen}
            onChange={(e) =>
              setRollingPeriodLen(
                e.target.value ? parseInt(e.currentTarget.value) : ""
              )
            }
            className="input input-bordered w-full max-w-xs"
          />
        </label>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">
              Does this visa require you to exit the country before it expires?
            </span>
          </div>
          <input
            name="mustExitBeforeExpiry"
            type="checkbox"
            checked={mustExitBeforeExpiry}
            onChange={(e) => setMustExitBeforeExpiry(e.target.checked)}
            className="checkbox input-bordered max-w-xs"
          />
        </label>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">
              Does this visa include both the entry and exit date when counting
              the number of days?
            </span>
          </div>
          <input
            name="includeEntryAndExitDates"
            type="checkbox"
            checked={includeEntryAndExitDates}
            onChange={(e) => setIncludeEntryAndExitDates(e.target.checked)}
            className="checkbox input-bordered max-w-xs"
          />
        </label>
        <button type="submit" className="btn btn-primary w-fit">
          Create
        </button>
      </form>
      <CountryModel countries={countries} setCountries={setCountries} />
    </>
  );
}
