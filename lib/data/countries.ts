import {
  getCountries,
  getCountryCallingCode,
  type CountryCode,
} from "libphonenumber-js";

export interface CountryOption {
  code: CountryCode;
  name: string;
  callingCode: string;
  flag: string;
}

const displayNames = new Intl.DisplayNames(["en"], { type: "region" });

function countryFlag(code: string): string {
  return [...code.toUpperCase()].map((character) =>
    String.fromCodePoint(127397 + character.charCodeAt(0)),
  ).join("");
}

/** Country names and calling codes are sourced from libphonenumber-js metadata. */
export const COUNTRIES: CountryOption[] = getCountries()
  .map((code) => ({
    code,
    name: displayNames.of(code) ?? code,
    callingCode: `+${getCountryCallingCode(code)}`,
    flag: countryFlag(code),
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

export const DEFAULT_COUNTRY_CODE: CountryCode = "SL";

export function getCountry(code: string | undefined): CountryOption {
  return COUNTRIES.find((country) => country.code === code) ??
    COUNTRIES.find((country) => country.code === DEFAULT_COUNTRY_CODE)!;
}
