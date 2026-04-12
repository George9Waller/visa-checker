"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getTripsBefore,
  getTripsFrom,
  TimelineTrip,
} from "@/app/server-actions";
import { TripCard } from "./TripCard";
import { TodayMarker } from "./TodayMarker";

const PAGE_SIZE = 10;

function shiftDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

type Item =
  | { type: "year"; year: number; key: string }
  | { type: "trip"; trip: TimelineTrip; isPast: boolean; key: string }
  | { type: "today"; key: string };

function buildItems(trips: TimelineTrip[], todayStr: string): Item[] {
  const items: Item[] = [];
  let lastYear: number | null = null;
  let todayInserted = false;

  if (trips.length > 0 && trips[0].startDate >= todayStr) {
    items.push({ type: "today", key: "today" });
    todayInserted = true;
  }

  for (const trip of trips) {
    const year = new Date(trip.startDate + "T00:00:00").getFullYear();

    if (!todayInserted && trip.startDate >= todayStr) {
      items.push({ type: "today", key: "today" });
      todayInserted = true;
    }

    if (year !== lastYear) {
      items.push({ type: "year", year, key: `year-${year}` });
      lastYear = year;
    }

    items.push({
      type: "trip",
      trip,
      isPast: trip.endDate < todayStr,
      key: `trip-${trip.id}`,
    });
  }

  if (!todayInserted) {
    items.push({ type: "today", key: "today" });
  }

  return items;
}

export default function TripTimeline() {
  const router = useRouter();
  const todayStr = new Date().toISOString().split("T")[0];

  const [trips, setTrips] = useState<TimelineTrip[]>([]);
  // afterCursor tracks where the next "from" fetch should start
  const [afterCursor, setAfterCursor] = useState(todayStr);
  const [hasMoreBefore, setHasMoreBefore] = useState(true);
  const [hasMoreAfter, setHasMoreAfter] = useState(true);
  const [loadingBefore, setLoadingBefore] = useState(false);
  const [loadingAfter, setLoadingAfter] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const todayRef = useRef<HTMLDivElement>(null);
  const topSentinelRef = useRef<HTMLDivElement>(null);
  const bottomSentinelRef = useRef<HTMLDivElement>(null);
  const loadingBeforeRef = useRef(false);
  const loadingAfterRef = useRef(false);

  // Initial load: 10 trips before today + 10 from today onward, in parallel
  useEffect(() => {
    Promise.all([
      getTripsBefore(todayStr, PAGE_SIZE),
      getTripsFrom(todayStr, PAGE_SIZE),
    ])
      .then(([before, after]) => {
        setTrips([...before.trips, ...after.trips]);
        setHasMoreBefore(before.hasMore);
        setHasMoreAfter(after.hasMore);
        if (after.trips.length > 0) {
          setAfterCursor(
            shiftDays(after.trips[after.trips.length - 1].startDate, 1)
          );
        }
        setInitialLoading(false);
      })
      .catch((e) => {
        setError(String(e));
        setInitialLoading(false);
      });
  }, []);

  // Scroll to today after initial load
  useEffect(() => {
    if (!initialLoading && todayRef.current) {
      todayRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [initialLoading]);

  const loadMoreBefore = async () => {
    if (loadingBeforeRef.current || !hasMoreBefore) return;
    loadingBeforeRef.current = true;
    setLoadingBefore(true);

    try {
      const cursor = trips[0]?.startDate ?? todayStr;
      const { trips: newTrips, hasMore } = await getTripsBefore(
        cursor,
        PAGE_SIZE
      );

      if (newTrips.length === 0) {
        setHasMoreBefore(false);
      } else {
        const prevScrollY = window.scrollY;
        const prevHeight = document.documentElement.scrollHeight;

        flushSync(() => {
          setTrips((prev) => {
            const existingIds = new Set(prev.map((t) => t.id));
            return [...newTrips.filter((t) => !existingIds.has(t.id)), ...prev];
          });
          setHasMoreBefore(hasMore);
        });

        window.scrollTo({
          top:
            prevScrollY + (document.documentElement.scrollHeight - prevHeight),
          behavior: "instant",
        });
      }
    } catch (e) {
      setError(String(e));
    }

    setLoadingBefore(false);
    loadingBeforeRef.current = false;
  };

  const loadMoreAfter = async () => {
    if (loadingAfterRef.current || !hasMoreAfter) return;
    loadingAfterRef.current = true;
    setLoadingAfter(true);

    try {
      const { trips: newTrips, hasMore } = await getTripsFrom(
        afterCursor,
        PAGE_SIZE
      );

      if (newTrips.length === 0) {
        setHasMoreAfter(false);
      } else {
        setTrips((prev) => {
          const existingIds = new Set(prev.map((t) => t.id));
          return [...prev, ...newTrips.filter((t) => !existingIds.has(t.id))];
        });
        setAfterCursor(shiftDays(newTrips[newTrips.length - 1].startDate, 1));
        setHasMoreAfter(hasMore);
      }
    } catch (e) {
      setError(String(e));
    }

    setLoadingAfter(false);
    loadingAfterRef.current = false;
  };

  // IntersectionObserver for sentinels
  useEffect(() => {
    if (initialLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          if (entry.target === topSentinelRef.current) loadMoreBefore();
          if (entry.target === bottomSentinelRef.current) loadMoreAfter();
        }
      },
      { rootMargin: "300px" }
    );

    if (topSentinelRef.current && hasMoreBefore)
      observer.observe(topSentinelRef.current);
    if (bottomSentinelRef.current && hasMoreAfter)
      observer.observe(bottomSentinelRef.current);

    return () => observer.disconnect();
  }, [initialLoading, hasMoreBefore, hasMoreAfter, afterCursor, trips]);

  const items = buildItems(trips, todayStr);

  return (
    <div className="w-full pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 px-4">
        <h1 className="text-xl font-extrabold tracking-tight text-slate-800">
          My Trips
        </h1>
      </div>

      {/* Top sentinel */}
      <div ref={topSentinelRef} />

      {/* Load-before spinner */}
      {loadingBefore && (
        <div className="flex justify-center py-3">
          <span className="loading loading-spinner loading-sm text-slate-400" />
        </div>
      )}

      {/* Reached beginning */}
      {!hasMoreBefore && !initialLoading && (
        <div className="flex items-center gap-3 mb-4 px-4">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-xs text-slate-400 shrink-0">
            Beginning of trips
          </span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col gap-3 px-4">
        {initialLoading && (
          <>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex gap-0 rounded-[13px] bg-white border border-slate-200 overflow-hidden"
              >
                <div className="w-1.5 bg-slate-200 shrink-0" />
                <div className="flex-1 p-4 flex flex-col gap-2">
                  <div className="skeleton h-4 w-32 rounded" />
                  <div className="skeleton h-3 w-48 rounded" />
                  <div className="skeleton h-5 w-24 rounded-full" />
                </div>
              </div>
            ))}
          </>
        )}

        {error && (
          <div className="alert alert-error">
            <span>Failed to load trips: {error}</span>
          </div>
        )}

        {!initialLoading &&
          !error &&
          trips.length === 0 &&
          !hasMoreBefore &&
          !hasMoreAfter && (
            <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
              <span className="material-symbols-outlined text-5xl text-slate-300">
                flight_takeoff
              </span>
              <p className="text-slate-400 text-sm font-medium">No trips yet</p>
              <Link href="/trips/create" className="btn btn-sm btn-primary">
                Add your first trip
              </Link>
            </div>
          )}

        {!initialLoading &&
          !error &&
          items.map((item) => {
            if (item.type === "today") {
              return <TodayMarker key={item.key} ref={todayRef} />;
            }
            if (item.type === "year") {
              return (
                <div
                  key={item.key}
                  className="sticky top-0 z-10 bg-[#f0f4f8] py-2 flex justify-center"
                >
                  <span className="text-md font-extrabold uppercase text-center tracking-widest text-slate-400">
                    {item.year}
                  </span>
                </div>
              );
            }
            return (
              <TripCard
                key={item.key}
                trip={item.trip}
                isPast={item.isPast}
                onClick={() => router.push(`/trips/${item.trip.id}`)}
              />
            );
          })}
      </div>

      {/* Load-after spinner */}
      {loadingAfter && (
        <div className="flex justify-center py-3">
          <span className="loading loading-spinner loading-sm text-slate-400" />
        </div>
      )}

      {/* Reached end */}
      {!hasMoreAfter && !initialLoading && trips.length > 0 && (
        <div className="flex items-center gap-3 mt-4 px-4">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-xs text-slate-400 shrink-0">No more trips</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>
      )}

      {/* Bottom sentinel */}
      <div ref={bottomSentinelRef} />

      {/* Mobile FAB */}
      <Link
        href="/trips/create"
        className="fixed bottom-20 md:bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-sky-600 hover:bg-sky-500 active:scale-95 text-white shadow-lg shadow-sky-600/40 flex items-center justify-center transition-all duration-150"
        aria-label="Add trip"
      >
        <span className="material-symbols-outlined text-2xl">add</span>
      </Link>
    </div>
  );
}
