import Layout from "@/layouts/layout";
import PageHeading from "@/components/layout/PageHeading";
import TestProjectCard from "@/components/projects/TestProjectCard";
import type { Project } from "@/interfaces/project";
import type { Pagination } from "@/interfaces/pagination";
import { router } from "@inertiajs/react";

export default function TestPage({
  projects,
  pagination,
  seed,
}: {
  projects: (Project & { username: string })[];
  pagination: Pagination;
  seed: number;
}) {
  function goToPage(page: number) {
    router.get("/test", { page, seed }, { preserveScroll: true });
  }

  return (
    <Layout>
      <PageHeading title="Test" subtitle="testing abababababa" />

      <div className="mt-4 flex gap-2 pl-8">
        {pagination.prev_page && (
          <button
            className="cursor-pointer"
            onClick={() => goToPage(pagination.prev_page)}
          >
            ← Prev
          </button>
        )}

        <span>
          Page {pagination.current_page} of {pagination.total_pages}
        </span>

        {pagination.next_page && (
          <button
            className="cursor-pointer"
            onClick={() => goToPage(pagination.next_page)}
          >
            Next →
          </button>
        )}
      </div>

      <div className="mt-8 pl-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <TestProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>

      <div className="mt-4 flex gap-2 pl-8">
        {pagination.prev_page && (
          <button
            className="cursor-pointer"
            onClick={() => goToPage(pagination.prev_page)}
          >
            ← Prev
          </button>
        )}

        <span>
          Page {pagination.current_page} of {pagination.total_pages}
        </span>

        {pagination.next_page && (
          <button
            className="cursor-pointer"
            onClick={() => goToPage(pagination.next_page)}
          >
            Next →
          </button>
        )}
      </div>
    </Layout>
  );
}
