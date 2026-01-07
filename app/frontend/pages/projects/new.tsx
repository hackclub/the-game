import ProjectCreate from "@/components/Projects/ProjectCreate";
import Sidebar from "@/components/sidebar";

interface Props {
  hackatime_projects: { id: number; name: string }[];
  project_times: Record<string, number>;
}

export default function NewProject({
  hackatime_projects,
  project_times,
}: Props) {
  return (
    <div className="flex bg-gray-200 min-h-screen">
      <Sidebar />
      <main className="flex-1 lg:ml-64 p-6">
        <h1 className="text-center text-2xl font-bold text-gray-800">
          Make your first project!
        </h1>
        <ProjectCreate
          hackatime_projects={hackatime_projects}
          project_times={project_times}
        />
      </main>
    </div>
  );
}
