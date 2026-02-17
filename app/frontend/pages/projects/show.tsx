import { router } from "@inertiajs/react";
import ProjectForm from "@/components/projects/ProjectForm";
import ProjectReviews from "@/components/projects/ProjectReviews";
import PageHeading from "@/components/layout/PageHeading";
import formatTime from "@/utils/formatTime";
import Layout from "@/layouts/layout";
import type { Project } from "@/interfaces/project";
import type { ProjectReview } from "@/interfaces/project_review";
import type { HackatimeProject } from "@/interfaces/hackatime_project";
import type { PublicUser } from "@/interfaces/user";
import clockIcon from "@/assets/figma/clock.svg";

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
      <PageHeading
        eyebrow="Projects"
        title={project.title ?? "Untitled Project"}
      />

      <div className="mt-6 flex flex-wrap items-center gap-4 px-4 md:px-16">
        <div className="flex items-center gap-1.5">
          <img src={clockIcon} alt="Clock" className="h-5 w-5" />
          <span className="text-2xl tracking-[-0.06em]">
            {formatTime(project.total_seconds)}
          </span>
        </div>
        <span className="text-lg text-gray-600 italic">{project.status}</span>
        {project.tickets !== 0 && (
          <span className="text-lg text-green-700">({project.tickets} 🎫)</span>
        )}
        {project.aasm_state === "approved" &&
          project.reported_seconds > project.total_seconds && (
            <span className="text-lg text-yellow-700">
              + {formatTime(project.reported_seconds - project.total_seconds)}{" "}
              not yet approved
            </span>
          )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 px-4 md:px-16">
        {project.demo_link && (
          <a
            className="text-lg underline"
            href={project.demo_link}
            target="_blank"
            rel="noopener noreferrer"
          >
            Demo
          </a>
        )}
        {project.demo_link && project.repo_link && (
          <span className="text-gray-400">|</span>
        )}
        {project.repo_link && (
          <a
            className="text-lg underline"
            href={project.repo_link}
            target="_blank"
            rel="noopener noreferrer"
          >
            Repo
          </a>
        )}
      </div>

      <div className="mt-4 flex gap-3 px-4 md:px-16">
        {project.aasm_state !== "submitted" && (
          <button
            className="cursor-pointer bg-[#fecb0d] px-6 py-2 text-lg font-bold text-black hover:bg-[#e5b80b]"
            onClick={shipProject}
          >
            {project.aasm_state === "approved" ? "Re-ship" : "Ship"}
          </button>
        )}
        <button
          className="cursor-pointer bg-black px-6 py-2 text-lg font-bold text-white hover:bg-gray-800"
          onClick={deleteProject}
        >
          Delete
        </button>
      </div>

      <div className="mt-8">
        <ProjectForm
          project={project}
          hackatime_projects={hackatime_projects}
        />
        <ProjectReviews project={project} />
      </div>
    </Layout>
  );
}
