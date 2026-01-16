import ProjectCreate from "@/components/Projects/ProjectCreate";
import Sidebar from "@/components/sidebar";

import type { HackatimeProject } from "@/interfaces/hackatime_project";

interface Props {
  hackatime_projects: HackatimeProject[];
}

export default function NewProject({ hackatime_projects }: Props) {
  return (
    <div className="flex min-h-screen bg-gray-200">
      <Sidebar />
      <main className="flex-1 p-6 lg:ml-64">
        <h1 className="text-center text-2xl font-bold text-gray-800">
          Make your first project!
        </h1>
        <ProjectCreate hackatime_projects={hackatime_projects} />
      </main>
    </div>
  );
}
