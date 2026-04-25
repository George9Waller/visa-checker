"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Btn, DatePicker, Stack, Text } from "@/app/design";

const asIso = (value: Date) => value.toISOString().split("T")[0];

export default function VisaSimulationControl({
  id,
  initialDate,
  showAllTrips,
}: {
  id: string;
  initialDate: string;
  showAllTrips: boolean;
}) {
  const router = useRouter();
  const [date, setDate] = useState(initialDate);
  const [hasChanged, setHasChanged] = useState(false);

  const apply = () => {
    router.push(
      `/visas/${id}?date=${date}&show_outside_rolling_range=${showAllTrips ? "true" : ""}`
    );
  };

  const reset = () => {
    const today = asIso(new Date());
    setDate(today);
    setHasChanged(true);
    router.push(
      `/visas/${id}${showAllTrips ? "?show_outside_rolling_range=true" : ""}`
    );
  };

  return (
    <Stack gap="sm">
      <Text variant="small" tone="muted">
        Change the date to see how your visa usage looks at a different point in
        time.
      </Text>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1">
          <DatePicker value={date} onChange={setDate} />
        </div>
        <Btn
          variant="primary"
          onClick={apply}
          className="w-full justify-center sm:w-auto"
        >
          Apply
        </Btn>
        {(hasChanged || date !== initialDate) && (
          <Btn
            variant="outline"
            onClick={reset}
            className="w-full justify-center sm:w-auto"
          >
            Reset
          </Btn>
        )}
      </div>
    </Stack>
  );
}
