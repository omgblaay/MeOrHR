import ChevronLeftLineIcon from "@iconify-react/majesticons/chevron-left-line";
import ChevronRightLineIcon from "@iconify-react/majesticons/chevron-right-line";
import Button from "./Button";
import Label from "./Label";
import Select from "./Select";

export type PageSize = 5 | 10 | 25;

export default function Pagination({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: {
  currentPage: number;
  totalPages: number;
  pageSize: PageSize;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: PageSize) => void;
}) {
  function changePage(nextPage: number) {
    onPageChange(Math.min(totalPages, Math.max(1, nextPage)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <nav
      aria-label="Job offers pagination"
      className="flex items-center justify-between gap-4 px-4 py-6 sm:px-6 lg:px-8"
    >
      <Button
        variant="secondary"
        size="sm"
        disabled={currentPage === 1}
        onClick={() => changePage(currentPage - 1)}
      >
        <ChevronLeftLineIcon aria-hidden="true" width="17" height="17" />
        Previous
      </Button>
      <div className="flex items-center gap-1" aria-label="Pages">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (page) => (
            <button
              key={page}
              type="button"
              onClick={() => changePage(page)}
              aria-current={page === currentPage ? "page" : undefined}
              aria-label={`Page ${page}`}
              className={`grid size-9 place-items-center rounded-md text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-900 ${
                page === currentPage
                  ? "bg-brand-900 text-white"
                  : "text-brandgray-600 hover:bg-brandgray-100 hover:text-brandgray-900"
              }`}
            >
              {page}
            </button>
          ),
        )}
      </div>
      <div className="w-28">
        <Label htmlFor="offers-per-page" className="mb-1 text-xs">
          Per page
        </Label>
        <Select
          id="offers-per-page"
          variant="compact"
          value={pageSize}
          onChange={(event) =>
            onPageSizeChange(Number(event.target.value) as PageSize)
          }
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
        </Select>
      </div>
      <Button
        variant="secondary"
        size="sm"
        disabled={currentPage === totalPages}
        onClick={() => changePage(currentPage + 1)}
      >
        Next
        <ChevronRightLineIcon aria-hidden="true" width="17" height="17" />
      </Button>
    </nav>
  );
}
