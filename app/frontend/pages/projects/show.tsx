import { usePage, Link } from "@inertiajs/react";
import ProjectForm from "@/components/projects/ProjectForm";
import ProjectReviews from "@/components/projects/ProjectReviews";
import PageHeading from "@/components/layout/PageHeading";
import formatTime from "@/utils/formatTime";
import Layout from "@/layouts/layout";
import type { Project, ProjectChange } from "@/interfaces/project";
import type { ProjectReview } from "@/interfaces/project_review";
import type { HackatimeProject } from "@/interfaces/hackatime_project";
import type { PublicUser, ReviewerUser } from "@/interfaces/user";
import type { ProjectTag } from "@/interfaces/project_tag";
import clockIcon from "@/assets/icons/clock.svg";

interface Props {
  project: Project & {
    user: ReviewerUser;
    reviews: (ProjectReview & { author: PublicUser })[];
  };
  ships: ProjectChange[];
  hackatime_projects: HackatimeProject[];
  tags: ProjectTag[];
  [key: string]: unknown;
}

export default function ShowProject() {
  const { props } = usePage<Props>();
  const { project, ships, hackatime_projects, tags, user } = props;

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
                {formatTime(project.reported_seconds)}
              </span>
            </div>
            <span className="text-lg text-gray-600 italic">
              {project.status}
            </span>
          </div>

          {project.real_approved_seconds > 0 && (
            <p className="px-4 text-lg text-green-600 md:px-16">
              {formatTime(project.real_approved_seconds)} approved{" "}
              {project.aasm_state === "approved" &&
                project.reported_seconds > project.approved_seconds && (
                  <span className="text-yellow-600">
                    (
                    {formatTime(
                      project.reported_seconds - project.approved_seconds,
                    )}{" "}
                    not yet shipped)
                  </span>
                )}
            </p>
          )}

          {project.aasm_state === "submitted" && (
            <p className="px-4 text-lg text-yellow-600 md:px-16">
              {formatTime(project.total_seconds - project.approved_seconds)}{" "}
              under review{" "}
              {project.reported_seconds > project.total_seconds && (
                <>
                  (
                  {formatTime(project.reported_seconds - project.total_seconds)}{" "}
                  not yet shipped)
                </>
              )}
            </p>
          )}

          {project.high_quality && (
            <p className="px-4 font-semibold text-yellow-600 italic md:px-16">
              🎫 Golden ticket winner!
            </p>
          )}

          {(project.demo_link || project.repo_link) && (
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
          )}

          <ProjectForm
            project={project}
            hackatime_projects={hackatime_projects}
            tags={tags}
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
                {props.user.role === "admin" ? (
                  <Link
                    href={`/users/${project.user!.id}`}
                    className="font-bold text-blue-500 underline"
                  >
                    {project.user!.username} ({project.user!.id})
                  </Link>
                ) : (
                  <p className="font-bold">
                    {project.user!.username} ({project.user!.id})
                  </p>
                )}
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
                  <a
                    href={`https://hackclub.enterprise.slack.com/team/${project.user!.slack_id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {project.user!.slack_id}
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      <ProjectReviews project={project} ships={ships} />
    </Layout>
  );
}
