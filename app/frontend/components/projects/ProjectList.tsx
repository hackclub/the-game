import { Link } from "@inertiajs/react";
import type { Project } from "@/interfaces/project";
import formatTime from "@/utils/formatTime";

export default function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <div
          key={project.id}
          className="rounded-lg border border-gray-300 bg-white p-4 shadow-sm hover:shadow-md"
        >
          <div className="flex flex-row justify-between">
            <h2 className="text-lg font-semibold">{project.title}</h2>
            <span className="text-md font-normal">
              {formatTime(project.total_seconds)}
            </span>
          </div>
          <span className="italic">{project.status}</span>
          <p className="mt-4 text-gray-600">{project.desc}</p>
          <div className="mt-6 flex gap-2">
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
            <br />
          </div>
        </div>
      ))}
      <a
        href="/projects/new"
        className="flex flex-col items-center justify-center rounded-lg border border-gray-300 bg-white p-4 shadow-sm hover:shadow-md"
      >
        <p className="text-6xl font-bold">+</p>
        <p className="text-2xl">Create a new project</p>
      </a>
    </div>
  );
}
