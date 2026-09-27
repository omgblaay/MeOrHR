import { countries } from "country-flag-icons";

const displayNames = new Intl.DisplayNames(["en"], { type: "region" });

export const countryOptions = countries
  .filter(
    (code) =>
      /^[A-Z]{2}$/.test(code) && code !== "EU" && !code.startsWith("X"),
  )
  .map((code) => ({
    code,
    name: displayNames.of(code) ?? code,
  }))
  .sort((first, second) => first.name.localeCompare(second.name));

export function countryName(code: string) {
  return displayNames.of(code.toUpperCase()) ?? code;
}

export const hiringRegions = [
  { value: "worldwide", label: "Worldwide" },
  { value: "europe", label: "Europe" },
  { value: "eu", label: "European Union" },
  { value: "emea", label: "EMEA" },
  { value: "north_america", label: "North America" },
  { value: "united_states", label: "United States" },
  { value: "latam", label: "Latin America" },
  { value: "apac", label: "APAC" },
  { value: "asia", label: "Asia" },
  { value: "africa", label: "Africa" },
  { value: "middle_east", label: "Middle East" },
] as const;

export type HiringRegion = (typeof hiringRegions)[number]["value"];

export function hiringRegionLabel(region: string) {
  return hiringRegions.find((option) => option.value === region)?.label ?? region;
}
