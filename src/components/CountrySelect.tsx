import type { SelectHTMLAttributes } from "react";
import { countryOptions } from "../lib/countries";
import Select from "./Select";

type CountrySelectProps = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "children"
> & {
  placeholder?: string;
};

export default function CountrySelect({
  placeholder = "Select a country",
  ...props
}: CountrySelectProps) {
  return (
    <Select {...props}>
      <option value="">{placeholder}</option>
      {countryOptions.map((country) => (
        <option key={country.code} value={country.code}>
          {country.name}
        </option>
      ))}
    </Select>
  );
}
