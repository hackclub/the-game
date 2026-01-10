import ProjectEdit from "@/components/Projects/ProjectEdit";
import Sidebar from "@/components/sidebar";
import type { Project } from "@/interfaces/project";

interface Props {
  project: Project;
  hackatime_projects: { id: number; name: string }[];
  project_times: Record<string, number>;
}

export default function EditProject({
  project,
  hackatime_projects,
  project_times,
}: Props) {
  return (
    <div className="flex min-h-screen bg-gray-200">
      <Sidebar />
      <main className="flex-1 p-6 lg:ml-64">
        <h1 className="text-center text-2xl font-bold text-gray-800">
          Edit your Project{" "}
        </h1>
        <ProjectEdit
          project={project}
          hackatime_projects={hackatime_projects}
          project_times={project_times}
        />
      </main>
    </div>
  );
}
