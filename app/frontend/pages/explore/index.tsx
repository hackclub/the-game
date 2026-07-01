import Layout from "@/layouts/layout";
import PageHeading from "@/components/layout/PageHeading";
import TestProjectCard from "@/components/projects/TestProjectCard";
import type { Project } from "@/interfaces/project";
import type { Pagination } from "@/interfaces/pagination";
import { router } from "@inertiajs/react";

function SubwayPagination({
  pagination,
  goToPage,
}: {
  pagination: Pagination;
  goToPage: (page: number) => void;
}) {
  const { current_page, total_pages } = pagination;

  // Build the page numbers to display: always show first and last,
  // plus a window of pages around the current page, with ellipsis for gaps.
  function getPageNumbers(): (number | "ellipsis")[] {
    if (total_pages <= 7) {
      return Array.from({ length: total_pages }, (_, i) => i + 1);
    }

    const pages: (number | "ellipsis")[] = [];
    const windowSize = 2; // pages on each side of current

    // Always include page 1
    pages.push(1);

    const windowStart = Math.max(2, current_page - windowSize);
    const windowEnd = Math.min(total_pages - 1, current_page + windowSize);

    if (windowStart > 2) {
      pages.push("ellipsis");
    }

    for (let i = windowStart; i <= windowEnd; i++) {
      pages.push(i);
    }

    if (windowEnd < total_pages - 1) {
      pages.push("ellipsis");
    }

    // Always include last page
    if (total_pages > 1) {
      pages.push(total_pages);
    }

    return pages;
  }

  const pageNumbers = getPageNumbers();

  return (
    <div className="mt-10 flex items-center justify-center px-8">
      <div className="flex items-center gap-0">
        {/* Prev arrow button */}
        <button
          onClick={() => pagination.prev_page && goToPage(pagination.prev_page)}
          disabled={!pagination.prev_page}
          className="z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 border-[#0f0f0f] bg-white text-sm font-bold transition-colors hover:bg-[#fecb0d] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
          aria-label="Previous page"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Subway line with station dots */}
        <div className="relative flex items-center">
          {/* The continuous line behind the dots */}
          <div className="absolute top-1/2 right-0 left-0 h-[1.5px] -translate-y-1/2 bg-[#0f0f0f]" />

          <div className="relative flex items-center">
            {pageNumbers.map((item, index) => {
              if (item === "ellipsis") {
                return (
                  <div
                    key={`ellipsis-${index}`}
                    className="flex items-center justify-center px-1"
                  >
                    <span className="relative z-10 px-1 text-sm font-bold tracking-wider text-[#0f0f0f]">
                      ...
                    </span>
                  </div>
                );
              }

              const isActive = item === current_page;
              return (
                <button
                  key={item}
                  onClick={() => goToPage(item)}
                  className="group relative z-10 flex cursor-pointer flex-col items-center px-1 outline-none"
                  aria-label={`Page ${item}`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <div
                    className={`relative rounded-full border-2 border-[#0f0f0f] transition-all ${
                      isActive
                        ? "h-10 w-10 bg-[#fecb0d]"
                        : "h-7 w-7 bg-white group-hover:bg-[#fecb0d]"
                    }`}
                  >
                    <span
                      className={`absolute inset-0 flex items-center justify-center font-bold ${
                        isActive
                          ? "text-sm text-[#0f0f0f]"
                          : "text-[11px] text-[#0f0f0f]"
                      }`}
                    >
                      {item}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Next arrow button */}
        <button
          onClick={() => pagination.next_page && goToPage(pagination.next_page)}
          disabled={!pagination.next_page}
          className="z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 border-[#0f0f0f] bg-white text-sm font-bold transition-colors hover:bg-[#fecb0d] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
          aria-label="Next page"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function ExplorePage({
  projects,
  pagination,
  seed,
}: {
  projects: (Project & { username: string })[];
  pagination: Pagination;
  seed: number;
}) {
  function goToPage(page: number) {
    router.get("/explore", { page, seed }, { preserveScroll: true });
  }

  return (
    <Layout>
      <PageHeading
        title="Gallery"
        subtitle="Take a look at all of the cool projects submitted to Hack Club: The Game!"
      />

      <div className="mt-8 pl-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <TestProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>

      <SubwayPagination pagination={pagination} goToPage={goToPage} />
    </Layout>
  );
}
