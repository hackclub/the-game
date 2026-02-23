import { router, usePage } from "@inertiajs/react";
import ProjectForm from "@/components/projects/ProjectForm";
import ProjectReviews from "@/components/projects/ProjectReviews";
import PageHeading from "@/components/layout/PageHeading";
import formatTime from "@/utils/formatTime";
import Layout from "@/layouts/layout";
import type { Project } from "@/interfaces/project";
import type { ProjectReview } from "@/interfaces/project_review";
import type { HackatimeProject } from "@/interfaces/hackatime_project";
import type { PublicUser, ReviewerUser } from "@/interfaces/user";
import clockIcon from "@/assets/icons/clock.svg";

interface Props {
  project: Project & {
    user?: ReviewerUser;
    reviews: (ProjectReview & { author: PublicUser })[];
  };
  hackatime_projects: HackatimeProject[];
  [key: string]: unknown;
}

export default function ShowProject() {
  const { props } = usePage<Props>();
  const { project, hackatime_projects, user } = props;

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

  const showUserInfo =
    (user.role === "admin" || user.role === "reviewer") &&
    project.user?.id !== user.id;

  return (
    <Layout>
      <PageHeading
        eyebrow="Projects"
        title={project.title ?? "Untitled Project"}
      />

      <div className={`${showUserInfo && "grid grid-cols-2"}`}>
        <div>
          <div className="mt-6 flex flex-wrap items-center gap-4 px-4 md:px-16">
            <div className="flex items-center gap-1.5">
              <img src={clockIcon} alt="Clock" className="h-5 w-5" />
              <span className="text-2xl tracking-[-0.06em]">
                {formatTime(project.total_seconds)}
              </span>
            </div>
            <span className="text-lg text-gray-600 italic">
              {project.status}
            </span>
            {project.aasm_state === "approved" &&
              project.reported_seconds > project.total_seconds && (
                <span className="text-lg text-yellow-700">
                  +{" "}
                  {formatTime(project.reported_seconds - project.total_seconds)}{" "}
                  not yet approved
                </span>
              )}
          </div>

          {project.high_quality && (
            <p className="px-4 font-semibold text-yellow-600 italic md:px-16">
              🎫 Golden ticket winner!
            </p>
          )}

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

          <ProjectForm
            project={project}
            hackatime_projects={hackatime_projects}
          />
        </div>
        {showUserInfo && (
          <div className="py-5 text-xl">
            <h2 className="mb-2 text-3xl font-bold">User info</h2>
            <div className="flex gap-2">
              <img
                src={project.user!.avatar}
                alt={`Avatar of ${project.user!.username}`}
                className="h-28 w-28"
              />
              <div>
                <p className="font-bold">
                  {project.user!.username} ({project.user!.id})
                </p>
                <p>{project.user!.email}</p>
                <p>
                  <span className="font-semibold">Hackatime ID:</span>{" "}
                  {project.user!.hackatime_id} (
                  <a
                    href={`https://joe.fraud.hackclub.com/profile/${project.user!.hackatime_id}`}
                    className="text-blue-500 underline"
                  >
                    Joe
                  </a>{" "}
                  |{" "}
                  <a
                    href={`https://billy.3kh0.net/?u=${project.user!.hackatime_id}`}
                    className="text-blue-500 underline"
                  >
                    Billy
                  </a>
                  )
                </p>
                <p>
                  <span className="font-semibold">Slack ID:</span>{" "}
                  {project.user!.slack_id}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      <ProjectReviews project={project} />
    </Layout>
  );
}
