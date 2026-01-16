import { Link } from "@inertiajs/react";
import Layout from "@/layouts/layout";
import ProjectList from "@/components/Projects/ProjectList";

import type { Project } from "@/interfaces/project";

export default function Index({ projects }: { projects: Project[] }) {
  return (
    <Layout>
      <h1 className="mt-8 mb-4 text-xl font-bold">Projects</h1>
      <Link
        href="/projects/new"
        className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
      >
        Create Project
      </Link>
      {projects.length === 0 && (
        <>
          <h1 className="text-center text-2xl font-bold text-gray-800">
            Make your first project!
          </h1>
        </>
      )}

      <h1 className="mt-8 mb-4 text-xl font-bold">Your Projects</h1>
      <ProjectList projects={projects} />
    </Layout>
  );
}
