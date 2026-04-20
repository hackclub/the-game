import Layout from "@/layouts/layout";
import PageHeading from "@/components/layout/PageHeading";
import ProjectCard from "@/components/projects/ProjectCard";
import type { Project } from "@/interfaces/project";
import type { Pagination } from "@/interfaces/pagination";
import { router } from "@inertiajs/react";

export default function ExplorePage({
  projects,
  pagination,
}: {
  projects: (Project & { username: string })[];
  pagination: Pagination;
}) {
  function goToPage(page: number) {
    router.get("/explore", { page }, { preserveScroll: true });
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
            <ProjectCard key={project.id} project={project} newTab />
          ))}
        </div>
      </div>

      <div className="mt-4 flex gap-2">
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
