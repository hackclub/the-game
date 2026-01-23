import type { Project } from "@/interfaces/project";
import ProjectComponent from "./Project";

export default function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectComponent project={project} />
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
