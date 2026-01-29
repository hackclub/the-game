import { router } from "@inertiajs/react";
import ProjectForm from "@/components/projects/ProjectForm";
import Layout from "@/layouts/layout";
import type { Project } from "@/interfaces/project";
import type { HackatimeProject } from "@/interfaces/hackatime_project";

interface Props {
  project: Project;
  hackatime_projects: HackatimeProject[];
}

export default function EditProject({ project, hackatime_projects }: Props) {
  function shipProject(e: React.MouseEvent) {
    e.stopPropagation();
    if (confirm("Are you sure you want to ship this project?")) {
      router.patch(`/projects/${project.id}/ship`);
    }
  }

  function deleteProject(e: React.MouseEvent) {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this project?")) {
      router.delete(`/projects/${project.id}`);
    }
  }

  return (
    <Layout>
      <div className="mb-2 flex items-center gap-6">
        <h2 className="text-3xl font-bold">{project.title}</h2>
        <div className="flex gap-4">
          <button
            className="cursor-pointer rounded-md bg-green-500 p-2 font-bold text-white"
            onClick={shipProject}
          >
            Ship
          </button>
          <button
            className="cursor-pointer rounded-md bg-red-500 p-2 font-bold text-white"
            onClick={deleteProject}
          >
            Delete
          </button>
        </div>
      </div>
      <ProjectForm project={project} hackatime_projects={hackatime_projects} />
    </Layout>
  );
}
