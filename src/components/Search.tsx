import SearchLineIcon from "@iconify-react/majesticons/search-line";
import Input from "./Input";
import Label from "./Label";

type SearchInputProps = {
  query: string;
  setQuery: (query: string) => void;
};

export default function SearchInput({ query, setQuery }: SearchInputProps) {
  return (
    <div className="relative mb-4">
      <Label htmlFor="job-search" className="sr-only">
        Search job offers
      </Label>
      <SearchLineIcon
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 -translate-y-1/2 text-brandgray-600 w-6"
      />
      <Input
        id="job-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search by role, company, location or skill"
        variant="search"
        className="pl-9 focus:ring-0"
      />
    </div>
  );
}
