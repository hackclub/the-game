import type { Project } from "@/interfaces/project";
import formatTime from "@/utils/formatTime";
import clockIcon from "@/assets/icons/clock.svg";

interface ProjectCardProps {
  project: Project & { username?: string };
  link?: string;
}

export default function ProjectCard({
  project,
  link = `${project.demo_link}`,
}: ProjectCardProps) {
  return (
    <a
      href={link}
      className="group relative cursor-pointer overflow-hidden transition-transform hover:scale-[1.02]"
    >
      {project.screenshot ? (
        <div className="relative overflow-hidden rounded-t-2xl">
          <img
            src={project.screenshot}
            alt={project.title ?? "Project screenshot"}
            className="h-[105px] w-full rounded-tl-2xl rounded-tr-2xl border-2 border-b-0 border-black object-cover"
          />
          {project.high_quality && (
            <div className="absolute top-0 right-0 rounded-tr-2xl rounded-bl-2xl border-2 border-black bg-yellow-400 p-2">
              <p>Golden ticket winner!</p>
            </div>
          )}
        </div>
      ) : (
        <div className="h-[105px] w-full rounded-tl-2xl rounded-tr-2xl border-2 border-b-0 border-black bg-gradient-to-br from-gray-300 to-gray-400" />
      )}
      {project.unread_notification_count > 0 && link !== project.demo_link && (
        <p className="absolute top-2 left-2 z-10 rounded-full bg-red-500 px-4 py-2 font-semibold text-white">
          {project.unread_notification_count} unread notification
          {project.unread_notification_count != 1 && "s"}
        </p>
      )}
      <div className="rounded-br-2xl rounded-bl-2xl border-2 border-black bg-white p-6">
        <div className="flex items-start justify-between gap-2">
          <h2 className="smoothing-black text-4xl font-bold tracking-[-0.03em]">
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
          <p className="smoothing-gray text-xl text-gray-600">
            by {project.username}
          </p>
        )}
        {project.desc && (
          <p className="smoothing-black mt-2 max-h-14 overflow-hidden text-xl tracking-[-0.02em] wrap-break-word text-ellipsis">
            {project.desc}
          </p>
        )}
      </div>
    </a>
  );
}
