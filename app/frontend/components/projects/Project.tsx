import { router } from "@inertiajs/react";
import type { Project } from "@/interfaces/project";
import ProjectCard from "./ProjectCard";

export default function Project({ project }: { project: Project }) {
  return (
    <ProjectCard
      project={project}
      onClick={() => router.visit(`/projects/${project.id}`)}
    />
  );
}
