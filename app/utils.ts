export const convertDateToString = (date: Date) =>
  date.toISOString().split("T")[0];

export const formatDateRange = (
  startDate: string,
  endDate: string,
  locale = "en-GB"
) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return `${start.toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
  })} - ${end.toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  })}`;
};
