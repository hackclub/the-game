import type { Project } from "@/interfaces/project";
import ProjectComponent from "./Project";

export default function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectComponent key={project.id} project={project} />
      ))}
      <a
        href="/projects/new"
        className="group flex flex-col overflow-hidden"
      >
        <div className="h-8 rounded-tl-2xl rounded-tr-2xl border-2 border-b-0 border-black bg-black" />
        <div className="flex flex-1 flex-col items-center justify-center rounded-bl-2xl rounded-br-2xl border-2 border-black bg-white p-6 group-hover:bg-gray-200 transition-colors">
          <p className="text-6xl font-bold text-[#606060]">+</p>
          <p className="text-xl text-[#606060]">Create new project</p>
        </div>
      </a>
    </div>
  );
}
