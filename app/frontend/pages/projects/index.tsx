import { Link } from "@inertiajs/react";
import Sidebar from "@/components/sidebar";
import ProjectList from "@/components/Projects/ProjectList";

import type { Project } from "@/interfaces/project";

export default function Index({ projects }: { projects: Project[] }) {
  console.log(projects);
  return (
    <div className="flex bg-gray-200 min-h-screen">
      <Sidebar />

      <main className="flex-1 lg:ml-64 p-6">
        <h1 className="text-xl font-bold mt-8 mb-4">Projects</h1>
        <Link
          href="/projects/new"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
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

        <h1 className="text-xl font-bold mt-8 mb-4">Your Projects</h1>
        <ProjectList projects={projects} />
      </main>
    </div>
  );
}
