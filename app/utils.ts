export const convertDateToString = (date: Date) =>
  date.toISOString().split("T")[0];
