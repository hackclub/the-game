import { router } from "@inertiajs/react";
import ProjectForm from "@/components/projects/ProjectForm";
import ProjectReviews from "@/components/projects/ProjectReviews";
import Layout from "@/layouts/layout";
import type { Project } from "@/interfaces/project";
import type { ProjectReview } from "@/interfaces/project_review";
import type { HackatimeProject } from "@/interfaces/hackatime_project";
import type { PublicUser } from "@/interfaces/user";

interface Props {
  project: Project & { reviews: (ProjectReview & { author: PublicUser })[] };
  hackatime_projects: HackatimeProject[];
}

export default function ShowProject({ project, hackatime_projects }: Props) {
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
      <div className="mb-2 flex w-full items-center gap-6">
        <h2 className="text-3xl font-bold">{project.title}</h2>
        <div className="flex gap-4">
          <button
            className="cursor-pointer rounded-md bg-green-500 p-2 font-bold text-white"
            onClick={shipProject}
          >
            {project.aasm_state === "approved" ? "Re-ship" : "Ship"}
          </button>
          <button
            className="cursor-pointer rounded-md bg-red-500 p-2 font-bold text-white"
            onClick={deleteProject}
          >
            Delete
          </button>
        </div>
      </div>
      <p className="italic">{project.status}</p>
      <p>
        <a className="text-blue-500 underline" href={project.demo_link ?? "#"}>
          Demo
        </a>{" "}
        |{" "}
        <a className="text-blue-500 underline" href={project.repo_link ?? "#"}>
          Repo
        </a>
      </p>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <ProjectForm
          project={project}
          hackatime_projects={hackatime_projects}
        />
        {/* <ProjectReviews project={project} /> */}
      </div>
    </Layout>
  );
}
