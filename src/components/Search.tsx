import SearchLineIcon from "@iconify-react/majesticons/search-line";

type SearchInputProps = {
  query: string;
  setQuery: (query: string) => void;
};

export default function SearchInput({ query, setQuery }: SearchInputProps) {
  return (
    <div className="relative mb-4">
      <SearchLineIcon
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 -translate-y-1/2 text-[#6a756e] w-6"
      />
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search by role, company, location or skill"
        className="pl-9 h-13 w-full rounded-xl outline-none transition placeholder:text-slate-500] focus:border-[#2b6558] focus:ring-0 focus:ring-[#2b6558]/10"
      />
    </div>
  );
}
