import { router } from "@inertiajs/react";
import type { Project } from "@/interfaces/project";
import ProjectCard from "./ProjectCard";

export default function Project({ project }: { project: Project }) {
  return <ProjectCard project={project} link={`/projects/${project.id}/manage`} />;
}
