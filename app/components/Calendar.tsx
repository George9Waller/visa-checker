"use client";

import React, { useEffect } from "react";
import { useState } from "react";
import { CalendarDay, getCalendarDates } from "../server-actions";
import { useRouter, useSearchParams } from "next/navigation";
import { COLOURS, COUNTRY_LABELS } from "../constants";
import { toast } from "react-toastify";

const getDatesAscending = (date1: string, date2: string): [string, string] => {
  if (new Date(date1) > new Date(date2)) {
    return [date2, date1];
  }
  return [date1, date2];
};

const dateInRange = (date: string, start: string, end: string) => {
  const dateToCheck = new Date(date);
  return dateToCheck >= new Date(start) && dateToCheck <= new Date(end);
};

const Calendar: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const today = new Date();
  const [days, setDays] = useState<CalendarDay[]>([]);
  const [year, setYear] = useState(
    parseInt(searchParams.get("year") || today.getFullYear().toString())
  );
  const [month, setMonth] = useState(
    parseInt(searchParams.get("month") || (today.getMonth() + 1).toString())
  );
  const [dayHover, setDayHover] = useState<string | undefined>();
  const [tripHover, setTripHover] = useState<string | undefined>();
  const [createStart, setCreateStart] = useState<string | undefined>();

  useEffect(() => {
    getCalendarDates(year, month)
      .then((days) => setDays(days))
      .catch((e) => toast.error(`Error fetching calendar: ${e}`));
  }, [year, month]);

  const resetDate = () => {
    setYear(today.getFullYear());
    setMonth(today.getMonth() + 1);
  };

  const advanceMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const reverseMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const create = () => {
    if (createStart && dayHover) {
      const [start, end] = getDatesAscending(createStart, dayHover);
      router.push(`/trips/create?start=${start}&end=${end}`);
    }
  };

  return (
    <div className="card bg-base-100 p-6 w-full">
      <div className="flex my-1">
        <span className="flex-1 text-xl pb-2">Calendar</span>
        <div className="flex-0 flex items-center justify-center gap-2">
          <button
            className="btn btn-sm btn-square"
            onClick={() => reverseMonth()}
          >
            &lt;
          </button>
          <button className="btn btn-ghost btn-sm" onClick={() => resetDate()}>
            {new Date(year, month - 1).toLocaleString(undefined, {
              month: "short",
              year: "numeric",
            })}
          </button>
          <button
            className="btn btn-sm btn-square"
            onClick={() => advanceMonth()}
          >
            &gt;
          </button>
        </div>
      </div>
      <hr />
      <div
        className="grid grid-cols-1 sm:grid-cols-7 my-4 gap-1 border-collapse"
        onMouseUp={() => create()}
        onMouseLeave={() => setCreateStart(undefined)}
      >
        {[
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ].map((day) => (
          <div key={day} className="mb-2 hidden sm:block">
            <span className="block w-full text-sm text-center">{day}</span>
          </div>
        ))}
        {days.map((day) => (
          <div
            key={day.date}
            className="w-full aspect-square shadow-md border-b flex flex-col justify-between"
            onMouseEnter={() => setDayHover(day.date)}
            onMouseLeave={() => setDayHover(undefined)}
          >
            <div className="flex flex-col gap-1">
              {day.trips.map((trip) => (
                <div
                  className={`w-full rounded h-5 px-1 flex justify-center flex-col transition-colors cursor-pointer ${
                    trip.visaRequired &&
                    (!trip.hasVisa || !trip.visaValid) &&
                    "outline outline-error"
                  }`}
                  style={{
                    backgroundColor: `${COLOURS[trip.colour]}${
                      tripHover === trip.id ? "FF" : "AA"
                    }`,
                  }}
                  key={trip.id}
                  onMouseEnter={() => setTripHover(trip.id)}
                  onMouseLeave={() => setTripHover(undefined)}
                  onClick={() => router.push(`/trips/${trip.id}`)}
                >
                  {trip.first && (
                    <span className="text-xs text-left text-black font-semibold overflow-hidden">
                      {COUNTRY_LABELS[trip.countryCode]}
                    </span>
                  )}
                  {trip.visaRequired && trip.last && !trip.first && (
                    <span className="material-symbols-outlined text-xs font-medium text-right">
                      {trip.hasVisa
                        ? trip.visaValid
                          ? "task"
                          : "rule"
                        : "error"}
                    </span>
                  )}
                </div>
              ))}
              {createStart &&
                dayHover &&
                dateInRange(
                  day.date,
                  ...getDatesAscending(createStart, dayHover)
                ) && <div className="w-full bg-secondary h-4 rounded"></div>}
            </div>
            <div className="flex justify-between items-end">
              <span className="btn btn-ghost btn-xs text-sm">
                {new Date(day.date).getDate()}
              </span>
              {dayHover === day.date && (
                <button
                  className="btn btn-xs btn-square btn-secondary m-1"
                  onMouseDownCapture={() => setCreateStart(day.date)}
                >
                  +
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
