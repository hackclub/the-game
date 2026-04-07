import Layout from "@/layouts/layout";
import PageHeading from "@/components/layout/PageHeading";
import ProjectReviews from "@/components/projects/ProjectReviews";
import formatTime from "@/utils/formatTime";
import type { HackatimeProject } from "@/interfaces/hackatime_project";
import type { Project, ProjectChange } from "@/interfaces/project";
import type { ProjectReview } from "@/interfaces/project_review";
import type { PublicUser, ReviewerUser } from "@/interfaces/user";
import clockIcon from "@/assets/icons/clock.svg";

interface Props {
  project: Project & {
    user: ReviewerUser;
    reviews: (ProjectReview & { author: PublicUser })[];
  };
  ships: ProjectChange[];
  hackatime_projects: HackatimeProject[];
}

export default function ReviewShow({
  project,
  ships,
  hackatime_projects,
}: Props) {
  return (
    <Layout>
      <PageHeading
        eyebrow="Review"
        title={project.title ?? "Untitled Project"}
      />
      <div className="px-8 py-6">
        <div className="flex gap-6">
          <div className="min-w-0 flex-1">
            <div className="mt-2 flex flex-wrap items-center gap-4">
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

            {project.approved_seconds > 0 && (
              <p className="mt-1 text-lg text-green-600">
                {formatTime(project.approved_seconds)} approved
                {project.aasm_state === "approved" &&
                  project.reported_seconds > project.approved_seconds && (
                    <span className="text-yellow-600">
                      {" "}
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
              <>
                <p className="mt-1 text-lg text-yellow-600">
                  {formatTime(project.total_seconds - project.approved_seconds)}{" "}
                  under review
                  {project.reported_seconds > project.total_seconds && (
                    <>
                      {" "}
                      (
                      {formatTime(
                        project.reported_seconds - project.total_seconds,
                      )}{" "}
                      not yet shipped)
                    </>
                  )}
                </p>
                {hackatime_projects.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-semibold text-gray-600">
                      Hackatime projects:
                    </p>
                    <ul className="mt-1 list-inside list-disc text-sm text-gray-600">
                      {hackatime_projects.map((hp) => (
                        <li key={hp.id}>
                          {hp.name}{" "}
                          <span className="text-gray-500">
                            ({formatTime(hp.total_seconds)})
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}

            {project.high_quality && (
              <p className="mt-1 font-semibold text-yellow-600 italic">
                🎫 Golden ticket winner!
              </p>
            )}

            {project.screenshot && (
              <div className="mt-6 mb-6">
                <img
                  src={project.screenshot}
                  alt={`Screenshot of ${project.title}`}
                  className="max-h-72 rounded-md border border-gray-200 object-contain"
                />
              </div>
            )}

            {project.desc && (
              <div className="mb-6">
                <h2 className="mb-1 text-xl font-semibold">Description</h2>
                <p className="max-w-2xl text-lg wrap-break-word text-gray-700">
                  {project.desc}
                </p>
              </div>
            )}

            <div className="mb-6 flex flex-wrap gap-3">
              {project.demo_link && (
                <a
                  href={project.demo_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-md bg-black px-5 py-2.5 text-lg font-bold text-white transition-colors hover:bg-gray-800"
                >
                  Open Demo ↗
                </a>
              )}
              {project.repo_link && (
                <a
                  href={project.repo_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-md border-2 border-black bg-white px-5 py-2.5 text-lg font-bold text-black transition-colors hover:bg-gray-100"
                >
                  Open Repo ↗
                </a>
              )}
              <a
                href={`/projects/${project.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-md border-2 border-gray-300 bg-white px-5 py-2.5 text-lg font-bold text-gray-600 transition-colors hover:bg-gray-50"
              >
                View Project Page ↗
              </a>
            </div>
          </div>

          <div className="w-72 shrink-0 self-start rounded-md border border-gray-200 bg-gray-50 p-5">
            <h2 className="mb-3 text-2xl font-bold">User Info</h2>
            <div className="flex flex-col gap-3">
              <img
                src={project.user!.avatar}
                alt={`Avatar of ${project.user!.username}`}
                className="h-20 w-20 rounded-md"
              />
              <div className="text-lg">
                <p className="font-bold">
                  <a
                    href={`/users/${project.user!.id}`}
                    className="text-blue-500 underline hover:text-blue-700"
                  >
                    {project.user!.username}
                  </a>{" "}
                  ({project.user!.id})
                </p>
                <p className="text-gray-600">{project.user!.email}</p>
                <p>
                  <span className="font-semibold">Hackatime:</span>{" "}
                  {project.user!.hackatime_id} (
                  <a
                    href={`https://joe.fraud.hackclub.com/profile/${project.user!.hackatime_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    Joe
                  </a>{" "}
                  |{" "}
                  <a
                    href={`https://billy.3kh0.net/?u=${project.user!.hackatime_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    Billy
                  </a>
                  )
                </p>
                <p>
                  <span className="font-semibold">Slack:</span>{" "}
                  {project.user!.slack_id}
                </p>
              </div>
            </div>
          </div>
        </div>

        <ProjectReviews project={project} ships={ships} />
      </div>
    </Layout>
  );
}
