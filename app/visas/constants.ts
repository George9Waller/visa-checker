export enum VISA_TYPE {
  SCHENGEN = "SCHENGEN",
  ESTA = "ESTA",
  CA_ETA = "CA_ETA",
  AU_EVISITOR = "AU_EVISITOR",
  NZETA = "NZETA",
  OTHER = "OTHER",
}

export const VISA_TYPES_DISPLAY_MAP: Record<string, string> = {
  [VISA_TYPE.SCHENGEN]: "🇪🇺 Schengen",
  [VISA_TYPE.ESTA]: "🇺🇸 US ESTA Visa waiver",
  [VISA_TYPE.CA_ETA]: "🇨🇦 CA eTA",
  [VISA_TYPE.AU_EVISITOR]: "🇦🇺 AU e-visitor",
  [VISA_TYPE.NZETA]: "🇳🇿 NZeTA",
  [VISA_TYPE.OTHER]: "Other",
};

export const SCHENGEN_COUNTRIES = [
  "AT", // Austria
  "BE", // Belgium
  "CZ", // Czech Republic
  "HR", // Croatia
  "DK", // Denmark
  "EE", // Estonia
  "FI", // Finland
  "FR", // France
  "DE", // Germany
  "GR", // Greece
  "HU", // Hungary
  "IS", // Iceland
  "IT", // Italy
  "LV", // Latvia
  "LI", // Liechtenstein
  "LT", // Lithuania
  "LU", // Luxembourg
  "MT", // Malta
  "NL", // Netherlands
  "NO", // Norway
  "PL", // Poland
  "PT", // Portugal
  "SK", // Slovakia
  "SI", // Slovenia
  "ES", // Spain
  "SE", // Sweden
  "CH", // Switzerland
]
