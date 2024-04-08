import { COUNTRY_LABELS } from "../constants";

export default function CountryModel({
  countries,
  setCountries,
}: {
  countries: string[];
  setCountries: (countries: string[]) => void;
}) {
  return (
    <dialog id="countries_modal" className="modal">
      <div className="modal-box">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">Countries</h3>
        <div className="flex flex-row flex-wrap gap-2">
          {Object.keys(COUNTRY_LABELS).map((countryCode) => (
            <button
              key={countryCode}
              className={`grow btn btn-sm btn-outline ${
                countries.includes(countryCode) ? "btn-success" : "btn-error"
              }`}
              onClick={() =>
                countries.includes(countryCode)
                  ? setCountries(
                      countries.filter((country) => country !== countryCode)
                    )
                  : setCountries([...countries, countryCode])
              }
            >
              {COUNTRY_LABELS[countryCode]}
            </button>
          ))}
        </div>
      </div>
    </dialog>
  );
}
