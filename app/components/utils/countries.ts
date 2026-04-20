export function splitCountryLabel(label = "") {
  const lastSpace = label.lastIndexOf(" ");
  if (lastSpace === -1) return { flag: "", name: label };
  return { flag: label.slice(lastSpace + 1), name: label.slice(0, lastSpace) };
}
