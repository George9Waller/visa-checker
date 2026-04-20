"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { TimelineTrip } from "../server-actions";
import { SectionHeading } from "./ui/SectionHeading";
import { Error } from "./ui/Error";
import { SkeletonRow, TimelineRow } from "./TripRow";
import { useTranslations } from "next-intl";
import { shiftDays } from "./utils/dates";
import { SmallLabel } from "./ui/SmallLabel";
import { useRouter } from "next/dist/client/components/navigation";

const PAGE_SIZE = 10;

export function TripsList({
  title,
  fetcher,
  initialCursor,
  skeletonCount,
  children,
}: {
  title: string;
  fetcher: (
    cursor: string,
    limit: number
  ) => Promise<{ trips: TimelineTrip[]; hasMore: boolean; count: number }>;
  initialCursor: string;
  skeletonCount: number;
  children?: React.ReactNode;
}) {
  const [count, setCount] = useState(0);
  const [trips, setTrips] = useState<TimelineTrip[]>([]);
  const [cursor, setCursor] = useState(initialCursor);
  const [error, setError] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const bottomSentinelRef = useRef<HTMLDivElement>(null);
  const loadingAfterRef = useRef(false);
  const router = useRouter();
  const t = useTranslations();

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    fetcher(cursor, PAGE_SIZE)
      .then((result) => {
        setTrips(result.trips);
        setHasMore(result.hasMore);
        setCount(result.count);
        setInitialLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setInitialLoading(false);
      });
  }, []);

  const loadMore = async () => {
    if (loadingAfterRef.current || !hasMore) return;
    loadingAfterRef.current = true;

    try {
      const { trips: newTrips, hasMore } = await fetcher(cursor, PAGE_SIZE);
      if (newTrips.length === 0) {
        setHasMore(false);
      } else {
        setTrips((prev) => {
          const existingIds = new Set(prev.map((t) => t.id));
          return [...prev, ...newTrips.filter((t) => !existingIds.has(t.id))];
        });
        setCursor(shiftDays(newTrips[newTrips.length - 1].startDate, -1));
        setHasMore(hasMore);
      }
    } catch (e) {
      setError(String(e));
    }
    loadingAfterRef.current = false;
  };

  useEffect(() => {
    if (initialLoading) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          if (entry.target === bottomSentinelRef.current) loadMore();
        }
      },
      { rootMargin: "300px" }
    );
    if (bottomSentinelRef.current && hasMore)
      observer.observe(bottomSentinelRef.current);
    return () => observer.disconnect();
  }, [initialLoading, hasMore, cursor, trips]);

  const tripsGroupedByYear = useMemo(() => {
    return trips.reduce((groups, trip) => {
      const year = new Date(trip.startDate).getFullYear();
      const currentGroup = groups.get(year) ?? [];

      groups.set(year, [...currentGroup, trip]);
      return groups;
    }, new Map<number, TimelineTrip[]>());
  }, [trips]);

  return (
    <>
      <div>
        <SectionHeading number={count.toString()} title={title} />
      </div>

      {initialLoading &&
        Array.from({ length: skeletonCount }).map((_, i) => (
          <SkeletonRow key={i} bottomBorder={i !== skeletonCount - 1} />
        ))}

      {!initialLoading &&
        Array.from(tripsGroupedByYear).map(([year, yearTrips]) => (
          <div key={year}>
            {year !== currentYear && (
              <SmallLabel text={year.toString()} muted={false} />
            )}
            {yearTrips.map((trip) => (
              <TimelineRow
                key={trip.id}
                trip={trip}
                isPast={false}
                isLast
                onClick={() => router.push(`/trips/${trip.id}`)}
                t={t}
              />
            ))}
          </div>
        ))}

      {!initialLoading && !hasMore && trips.length === 0 && children}

      {error && <Error error={error} />}

      <div ref={bottomSentinelRef} />

      {hasMore && !error && <SkeletonRow bottomBorder={false} />}
    </>
  );
}
