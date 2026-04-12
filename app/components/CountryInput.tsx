import { COUNTRY_LABELS } from "../constants";

const CountryInput = ({
  defaultValue,
}: {
  defaultValue?: string;
}) => (
  <label className="w-full max-w-xs">
    <div className="label">
      <span className="">Country</span>
    </div>
    <select
      className="input w-full max-w-xs"
      required
      name="country"
      defaultValue={defaultValue}
    >
      {Object.keys(COUNTRY_LABELS)
        .sort((a, b) => (COUNTRY_LABELS[a] > COUNTRY_LABELS[b] ? 1 : -1))
        .map((key) => (
          <option key={key} value={key}>
            {COUNTRY_LABELS[key]}
          </option>
        ))}
    </select>
  </label>
);

export default CountryInput;
