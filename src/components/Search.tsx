import SearchLineIcon from "@iconify-react/majesticons/search-line";
import Input from "./Input";
import Label from "./Label";

type SearchInputProps = {
  query: string;
  setQuery: (query: string) => void;
};

export default function SearchInput({ query, setQuery }: SearchInputProps) {
  return (
    <div className="relative">
      <Label htmlFor="job-search" className="sr-only">
        Search job offers
      </Label>
      <SearchLineIcon
        aria-hidden="true"
        className="pointer-events-none absolute left-3.5 top-1/2 w-5 -translate-y-1/2 text-brandgray-600"
      />
      <Input
        id="job-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search by role, company, country or skill"
        variant="search"
        className="pl-9 focus:ring-0"
      />
    </div>
  );
}
