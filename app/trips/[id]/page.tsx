"use client";

import CountryInput from "@/app/components/CountryInput";
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
import { Trip, Visa, VisaTrip } from "@prisma/client";
import { convertDateToString } from "@/app/utils";
import { COLOURS } from "@/app/constants";
import Link from "next/link";
import { toast } from "react-toastify";
import { VISA_TYPES_DISPLAY_MAP } from "@/app/visas/constants";
import PrivateText from "@/app/components/PrivateText";

export default function CreateTrip() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [initialValues, setInitialValues] = useState<
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
  const [selectedColour, setSelectedColour] = useState<string | undefined>();
  const [visas, setVisas] = useState<VisaWithValid[]>([]);

  useEffect(() => {
    getTrip(params.id)
      .then((trip) => {
        setInitialValues(trip);
        setSelectedColour(trip.colour);
      })
      .catch((e) => {
        toast.error(`Error fetching trip: ${e}`);
      });
    getPossibleVisasForTrip(params.id)
      .then((visas) => setVisas(visas))
      .catch((e) => toast.error(`Error fetching visas for trip: ${e}`));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    updateTrip(
      params.id,
      formData.get("startDate") as string,
      formData.get("endDate") as string,
      formData.get("country") as string,
      selectedColour || initialValues?.colour || "1",
      (formData.get("visaRequired") as string) === "on",
      formData.get("name") as string | null
    )
      .then((trip) => {
        router.push(
          `/?year=${trip.startDate.getFullYear()}&month=${
            trip.startDate.getMonth() + 1
          }`
        );
      })
      .catch((e) => {
        toast.error(`Error updating trip: ${e}`);
      });
  };

  const deleteTripHandler = () => {
    deleteTrip(params.id)
      .then(() => {
        toast.success("Trip deleted");
        if (initialValues?.startDate) {
          router.push(
            `/?year=${initialValues?.startDate.getFullYear()}&month=${
              initialValues?.startDate.getMonth() + 1
            }`
          );
        } else {
          router.push("/");
        }
      })
      .catch((e) => {
        toast.error(`Error deleting trip: ${e}`);
      });
  };

  if (!initialValues) {
    return <span className="loading loading-spinner loading-lg"></span>;
  }

  return (
    <>
      <form
        className="card bg-base-100 p-6 w-full flex flex-col gap-4"
        onSubmit={onSubmit}
      >
        <div className="flex items-center">
          <h1 className="text-lg flex-1">Update Trip</h1>
          <Link
            href={`/?year=${initialValues.startDate.getFullYear()}&month=${
              initialValues.startDate.getMonth() + 1
            }`}
            className="btn btn-square flex-0"
          >
            x
          </Link>
        </div>
        <hr />
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Name</span>
          </div>
          <input
            name="name"
            type="text"
            className="input input-bordered w-full max-w-xs"
            defaultValue={initialValues.name || ""}
          />
        </label>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Start date</span>
          </div>
          <input
            type="date"
            name="startDate"
            className="input input-bordered w-full max-w-xs"
            defaultValue={convertDateToString(initialValues.startDate)}
            required
          />
        </label>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">End date</span>
          </div>
          <input
            type="date"
            name="endDate"
            className="input input-bordered w-full max-w-xs"
            defaultValue={convertDateToString(initialValues.endDate)}
            required
          />
        </label>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Visa required?</span>
          </div>
          <input
            type="checkbox"
            name="visaRequired"
            className="checkbox input-bordered max-w-xs"
            defaultChecked={initialValues.visaRequired}
          />
        </label>
        <CountryInput defaultValue={initialValues.countryCode} />
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Colour</span>
          </div>
          <div className="flex flex-row gap-2">
            {Object.keys(COLOURS).map((colourId) => (
              <input
                key={colourId}
                type="radio"
                name={`colour-${colourId}`}
                className="radio"
                style={{ backgroundColor: COLOURS[colourId] }}
                checked={selectedColour === colourId}
                onClick={() => setSelectedColour(colourId)}
              />
            ))}
          </div>
        </label>
        <div className="flex flex-row gap-2">
          <button type="submit" className="btn btn-primary w-fit">
            Save
          </button>
          <button
            className="btn btn-error"
            onClick={(e) => {
              e.preventDefault();
              (
                document.getElementById(
                  "delete_trip_modal"
                ) as HTMLDialogElement | null
              )?.showModal();
            }}
          >
            Delete trip
          </button>
        </div>
      </form>
      {initialValues.visaRequired && (
        <div className="card bg-base-100 p-6 w-full flex flex-col gap-4 mt-4">
          <h1 className="text-lg flex-1">Visa</h1>
          <hr />
          <div className="flex flex-col gap-4">
            {visas.map((visa) => {
              const selected = visa.VisaTrip.length > 0;
              return (
                <div
                  key={visa.id}
                  className={`rounded shadow-md p-4 flex items-center ${
                    selected ? "outline" : "border cursor-pointer"
                  } ${
                    selected && visa.validForTrip
                      ? "outline-success"
                      : "outline-error"
                  }`}
                >
                  <p className="flex-1">
                    {visa.name} · {VISA_TYPES_DISPLAY_MAP[visa.type]} ·{" "}
                    <PrivateText>{visa.visaNumber}</PrivateText>
                  </p>
                  <>
                    <Link
                      className={`btn btn-sm btn-outline ${
                        visa.validForTrip ? "btn-success" : "btn-error"
                      }`}
                      href={`/visas/${visa.id}?date=${convertDateToString(
                        initialValues.endDate
                      )}`}
                    >
                      {visa.validForTrip
                        ? "✅ Valid for this trip"
                        : "❌ Not valid for this trip"}
                    </Link>
                    <input
                      type="radio"
                      checked={selected}
                      className="radio ml-2"
                      onClick={() =>
                        selectVisaForTrip(params.id, visa.id)
                          .then(setVisas)
                          .catch((e) =>
                            toast.error(`Error updating trip visa: ${e}`)
                          )
                      }
                    />
                  </>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <dialog id="delete_trip_modal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">
            Are you sure you want to delete this trip?
          </h3>
          <button className="btn btn-error" onClick={() => deleteTripHandler()}>
            Delete trip
          </button>
        </div>
      </dialog>
    </>
  );
}
