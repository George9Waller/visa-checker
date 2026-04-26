import { COUNTRY_EMOJIS } from "../constants";
import { VISA_TYPE_META, VisaTypeKey } from "./constants";

export const getVisaFlag = (visaType: VisaTypeKey, countries: string[]) => {
  if (visaType === "OTHER") {
    return COUNTRY_EMOJIS[countries[0] ?? ""] ?? "🛂";
  }
  return VISA_TYPE_META[visaType].flag;
};
