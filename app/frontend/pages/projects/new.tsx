import ProjectCreate from "@/components/Projects/ProjectCreate";
import Sidebar from "@/components/Sidebar";

interface Project {
  id: number;
  approved: "not_shipped" | "shipped" | null;
  demo_link: string | null;
  desc: string | null;
  hackatime_project_keys: string | null;
  internal_notes: string | null;
  is_deleted: boolean | null;
  project_type: string | null;
  readme_link: string | null;
  repo_link: string | null;
  reported_hours: number | null;
  review_status: "pending" | "approved" | "rejected" | null;
  reviewer_note: string | null;
  shipped: boolean | null;
  submitted_at: string | null;
  title: string | null;
  ysws: string | null;
  created_at: string;
  updated_at: string;
  user_id: number;
}

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
