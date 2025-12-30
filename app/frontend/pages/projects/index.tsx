import { Link } from "@inertiajs/react";
import ProjectCreate from "@/components/ProjectCreate";

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

export default function Index({ projects }: { projects: Project[] }) {
  console.log(projects);
  return (
    <>
      <h1> Your Projects</h1>
      {projects.length === 0 && (
        <>
          <h1 className="text-center text-2xl font-bold text-gray-800">
            Make your first project!
          </h1>
        </>
      )}
      <ProjectCreate />

      <h1 className="text-xl font-bold mt-8 mb-4">Your Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div key={project.id} className="p-4 border rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold">{project.title}</h2>
            <p className="text-gray-600 mt-2">{project.desc}</p>
            <div className="mt-4 flex gap-4">
              {project.demo_link && <a href={project.demo_link} className="text-blue-500 hover:underline">Demo</a>}
              {project.repo_link && <a href={project.repo_link} className="text-blue-500 hover:underline">Repo</a>}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
