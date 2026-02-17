import { router } from "@inertiajs/react";
import type { Project } from "@/interfaces/project";
import formatTime from "@/utils/formatTime";
import clockIcon from "@/assets/icons/clock.svg";

interface ProjectCardProps {
  project: Project & { username?: string };
  link?: string;
  onClick?: () => void;
}

export default function ProjectCard({
  project,
  link = `/projects/${project.id}`,
  onClick,
}: ProjectCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.visit(link);
    }
  };

  const content = (
    <>
      {project.screenshot ? (
        <img
          src={project.screenshot}
          alt={project.title ?? "Project screenshot"}
          className="h-[105px] w-full rounded-tl-2xl rounded-tr-2xl border-2 border-b-0 border-black object-cover"
        />
      ) : (
        <div className="h-[105px] w-full rounded-tl-2xl rounded-tr-2xl border-2 border-b-0 border-black bg-gradient-to-br from-gray-300 to-gray-400" />
      )}
      <div className="rounded-br-2xl rounded-bl-2xl border-2 border-black bg-white p-6">
        <div className="flex items-start justify-between gap-2">
          <h2 className="smoothing-black text-4xl font-bold tracking-[-0.03em]">
            {project.title}
          </h2>
          <div className="flex shrink-0 items-center gap-1.5">
            <img src={clockIcon} alt="Clock" className="h-5 w-5" />
            <span className="smoothing-black text-2xl tracking-[-0.03em]">
              {formatTime(project.total_seconds)}
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
    </>
  );

  if (onClick) {
    return (
      <div
        className="group cursor-pointer overflow-hidden"
        onClick={handleClick}
      >
        {content}
      </div>
    );
  }

  return (
    <a
      href={link}
      className="group cursor-pointer overflow-hidden transition-transform hover:scale-[1.02]"
    >
      {content}
    </a>
  );
}
