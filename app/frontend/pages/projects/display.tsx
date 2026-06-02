import Layout from "@/layouts/layout";
import PageHeading from "@/components/layout/PageHeading";
import formatTime from "@/utils/formatTime";
import clockIcon from "@/assets/icons/clock.svg";
import { usePage } from "@inertiajs/react";
import type { Project } from "@/interfaces/project";
import type { PublicUser } from "@/interfaces/user";

interface Props {
  project: Project & { user: PublicUser | null };
}

export default function DisplayProject({ project }: Props) {
  const { user } = usePage<{ user?: { role: string } }>().props;
  const isAdmin = user?.role === "admin";

  return (
    <Layout>
      <PageHeading
        eyebrow="Projects"
        title={project.title ?? "Untitled Project"}
      />

      <div className="px-4 md:px-16">
        <div className="mt-4 flex items-center justify-between gap-3">
          {project.user && (
            <div className="flex items-center gap-3">
              <img
                src={project.user.avatar}
                alt={`Avatar of ${project.user.username}`}
                className="h-10 w-10 rounded-full"
              />
              <span className="text-lg">by {project.user.username}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <img src={clockIcon} alt="Clock" className="h-5 w-5" />
            <span className="text-lg">{formatTime(project.approved_seconds)}</span>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-6 md:flex-row">
          {project.screenshot && (
            <div className="md:w-1/2 shrink-0">
              <img
                src={project.screenshot}
                alt={project.title ?? "Project screenshot"}
                className="w-full rounded-2xl border-2 border-black object-cover"
              />
            </div>
          )}

          <div className={`flex flex-col ${project.screenshot ? "md:w-1/2" : "w-full"}`}>
            <div className="flex flex-1 items-center justify-center">
              {project.desc && (
                <p className="text-center text-lg whitespace-pre-wrap">{project.desc}</p>
              )}
            </div>

            <div className="flex flex-col gap-3 pt-4">
              {project.demo_link && (
                <a
                  href={project.demo_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl border-2 border-black bg-white px-4 py-3 text-lg font-semibold tracking-[-0.02em] transition-transform hover:scale-[1.02]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                  Demo
                </a>
              )}
              {project.repo_link && (
                <a
                  href={project.repo_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl border-2 border-black bg-white px-4 py-3 text-lg font-semibold tracking-[-0.02em] transition-transform hover:scale-[1.02]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
                  </svg>
                  Repository
                </a>
              )}
            </div>
          </div>
        </div>
        {isAdmin && (
          <div className="mt-8">
            <a
              href={`/projects/${project.id}/manage`}
              className="inline-block rounded-xl border-2 border-black bg-white px-4 py-3 text-lg font-semibold tracking-[-0.02em] transition-transform hover:scale-[1.02]"
            >
              Admin View
            </a>
          </div>
        )}
      </div>
    </Layout>
  );
}
