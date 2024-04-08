"use client";

import CountryInput from "@/app/components/CountryInput";
import { FormEvent } from "react";
import { createTrip } from "../server-actions";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";

export default function CreateTrip() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const today = new Date();
  const initialStartDate = new Date(
    searchParams.get("start") || today.toDateString()
  );

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    createTrip(
      formData.get("startDate") as string,
      formData.get("endDate") as string,
      formData.get("country") as string,
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
        toast.error(`Error creating trip: ${e}`);
      });
  };

  return (
    <form
      className="card bg-base-100 p-6 w-full flex flex-col gap-4"
      onSubmit={onSubmit}
    >
      <div className="flex items-center">
        <h1 className="text-lg flex-1">Create Trip</h1>
        <Link
          href={`/?year=${initialStartDate.getFullYear()}&month=${
            initialStartDate.getMonth() + 1
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
          defaultValue={searchParams.get("start") || today.toDateString()}
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
          defaultValue={searchParams.get("end") || undefined}
          required
        />
      </label>
      <CountryInput />
      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text">Visa required?</span>
        </div>
        <input
          type="checkbox"
          name="visaRequired"
          className="checkbox"
          defaultChecked={true}
        />
      </label>
      <button type="submit" className="btn btn-primary w-fit">
        Create
      </button>
    </form>
  );
}
