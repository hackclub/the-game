import { Link } from "@inertiajs/react";

export default function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => (
        <div key={project.id} className="p-4 border rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold">{project.title}</h2>
          <p className="text-gray-600 mt-2">{project.desc}</p>
          <div className="mt-4 flex gap-4">
            {project.demo_link && (
              <a
                href={project.demo_link}
                className="text-blue-500 hover:underline"
              >
                Demo
              </a>
            )}
            {project.repo_link && (
              <a
                href={project.repo_link}
                className="text-blue-500 hover:underline"
              >
                Repo
              </a>
            )}
            <Link
              href={`/projects/${project.id}/edit`}
              className="text-blue-500 hover:underline"
            >
              Edit
            </Link>
            <span className="text-gray-500">{project.review_status}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
