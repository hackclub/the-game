import { Link, router } from "@inertiajs/react";
import type { Project } from "@/interfaces/project";
import formatTime from "@/utils/formatTime";

export default function Project({ project }: { project: Project }) {
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
    <div
      key={project.id}
      className="group cursor-pointer overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm hover:shadow-md"
      onClick={() => {
        window.location.pathname = `/projects/${project.id}`;
      }}
    >
      <div className="p-4 pb-0">
        <div className="flex flex-row justify-between">
          <h2 className="text-lg font-semibold">
            {project.title}
            <br />
            <span className="text-base font-normal italic">
              {project.status}
            </span>
          </h2>
          <div className="text-right text-base font-normal">
            {project.real_approved_seconds > 0 && (
              <p className="text-green-700">
                {formatTime(project.real_approved_seconds)} approved
              </p>
            )}
            {project.reported_seconds > project.approved_seconds &&
              project.aasm_state !== "submitted" && (
                <p className="text-yellow-700">
                  {project.approved_seconds > 0 && "+"}{" "}
                  {formatTime(
                    project.reported_seconds - project.approved_seconds,
                  )}{" "}
                  not yet submitted
                </p>
              )}
            {project.total_seconds > project.approved_seconds &&
              project.aasm_state === "submitted" && (
                <p className="text-yellow-700">
                  {project.approved_seconds > 0 && "+"}{" "}
                  {formatTime(project.total_seconds - project.approved_seconds)}{" "}
                  under review
                </p>
              )}
          </div>
        </div>

        <p className="mt-4 text-gray-600">{project.desc}</p>
      </div>
      <div className="relative mt-6 flex w-full transition-all group-hover:bottom-0 md:-bottom-20">
        <Link
          href={`/projects/${project.id}`}
          className="grow bg-blue-400 py-2 text-center"
        >
          {project.aasm_state === "submitted" ? "View" : "Edit"}
        </Link>
        {project.aasm_state !== "submitted" &&
          project.reported_seconds > project.approved_seconds && (
            <button
              className="grow cursor-pointer bg-green-400 py-2 text-center"
              onClick={shipProject}
            >
              {project.approved_seconds > 0 ? "Re-ship" : "Ship"}
            </button>
          )}
        <button
          className="grow cursor-pointer bg-red-400 py-2 text-center"
          onClick={deleteProject}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
