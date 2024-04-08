import { COUNTRY_LABELS } from "../constants";

const CountryInput = ({
  defaultValue,
}: {
  defaultValue?: string;
}) => (
  <label className="form-control w-full max-w-xs">
    <div className="label">
      <span className="label-text">Country</span>
    </div>
    <select
      className="input input-bordered w-full max-w-xs"
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
