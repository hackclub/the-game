import { router } from "@inertiajs/react";
import type { Project } from "@/interfaces/project";
import formatTime from "@/utils/formatTime";
import clockIcon from "@/assets/figma/clock.svg";

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
      <div className="rounded-bl-2xl rounded-br-2xl border-2 border-black bg-white p-4">
        {project.username && (
          <p className="text-sm text-black/60">by {project.username}</p>
        )}
        <h2 className="text-4xl font-bold tracking-[-0.03em] smoothing-black">
          {project.title}
        </h2>
        <div className="mt-1 flex items-center gap-1.5">
          <img src={clockIcon} alt="Clock" className="h-5 w-5" />
          <span className="text-2xl tracking-[-0.03em] smoothing-black">
            {formatTime(project.total_seconds)}
          </span>
        </div>
        {project.desc && (
          <p className="mt-2 text-xl tracking-[-0.02em] smoothing-black wrap-break-word max-h-14 text-ellipsis overflow-hidden">
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
