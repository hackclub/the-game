import type { Project } from "@/interfaces/project";
import formatTime from "@/utils/formatTime";
import clockIcon from "@/assets/icons/clock.svg";

interface TestProjectCardProps {
  project: Project & { username?: string };
  variant?: "default" | "homepage";
}

export default function TestProjectCard({
  project,
  variant = "default",
}: TestProjectCardProps) {
  const isHomepage = variant === "homepage";
  const gold = project.high_quality;
  const goldStyle = gold ? { borderColor: "#FFD700" } : undefined;
  return (
    <a
      href={`/projects/${project.id}`}
      className={`group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl transition-transform hover:scale-[1.02] ${isHomepage ? "text-[#3D4042] shadow-[24px_24px_0px_rgba(0,0,0,0.5)]" : ""}`}
    >
      {project.screenshot ? (
        <div className="relative overflow-hidden rounded-t-2xl">
          <img
            src={project.screenshot}
            alt={project.title ?? "Project screenshot"}
            className="h-[105px] w-full rounded-tl-2xl rounded-tr-2xl border-2 border-b-0 border-black object-cover"
            style={goldStyle}
          />
        </div>
      ) : (
        <div
          className="h-[105px] w-full rounded-tl-2xl rounded-tr-2xl border-2 border-b-0 border-black bg-white"
          style={goldStyle}
        />
      )}
      {project.unread_notification_count > 0 && (
        <p className="absolute top-2 left-2 z-10 rounded-full bg-red-500 px-4 py-2 font-semibold text-white">
          {project.unread_notification_count} unread notification
          {project.unread_notification_count != 1 && "s"}
        </p>
      )}
      <div
        className="flex flex-1 flex-col rounded-br-2xl rounded-bl-2xl border-2 border-black bg-white p-6"
        style={goldStyle}
      >
        <div className="flex items-start justify-between gap-2">
          <h2 className="smoothing-black text-4xl font-bold tracking-[-0.03em] wrap-anywhere">
            {project.title}
          </h2>
          <div className="flex shrink-0 items-center gap-1.5">
            <img src={clockIcon} alt="Clock" className="h-5 w-5" />
            <span className="smoothing-black text-2xl tracking-[-0.03em]">
              {formatTime(project.reported_seconds)}
            </span>
          </div>
        </div>
        {project.username && (
          <a
            href={`/users/${project.user_id}`}
            onClick={(e) => e.stopPropagation()}
            className="smoothing-gray text-xl text-gray-600 hover:underline"
          >
            by {project.username}
          </a>
        )}
        {project.desc && (
          <p className="smoothing-black mt-2 max-h-14 overflow-hidden text-xl tracking-[-0.02em] wrap-break-word text-ellipsis">
            {project.desc}
          </p>
        )}
        {project.high_quality && (
          <p className="pt-2 text-center font-semibold text-yellow-600 italic">
            🎫 Golden ticket winner!
          </p>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          {project.demo_link ? (
            <a
              href={project.demo_link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl border-2 border-black bg-white px-4 py-2 text-lg font-semibold tracking-[-0.02em] transition-transform hover:scale-[1.02]"
              style={goldStyle}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
              Demo
            </a>
          ) : (
            <span
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border-2 border-black bg-gray-200 px-4 py-2 text-lg font-semibold tracking-[-0.02em] text-gray-500"
              style={goldStyle}
            >
              No demo
            </span>
          )}
          {project.repo_link ? (
            <a
              href={project.repo_link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl border-2 border-black bg-white px-4 py-2 text-lg font-semibold tracking-[-0.02em] transition-transform hover:scale-[1.02]"
              style={goldStyle}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
              </svg>
              Repository
            </a>
          ) : (
            <span
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border-2 border-black bg-gray-200 px-4 py-2 text-lg font-semibold tracking-[-0.02em] text-gray-500"
              style={goldStyle}
            >
              No repository
            </span>
          )}
        </div>
      </div>
    </a>
  );
}
