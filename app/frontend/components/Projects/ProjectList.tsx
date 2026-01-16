import { Link } from "@inertiajs/react";
import type { Project } from "@/interfaces/project";

export default function ProjectList({ projects }: { projects: Project[] }) {
  const isReviewed = (review_status: string | null) => {
    if (review_status === "approved") {
      return "Approved";
    } else if (review_status === "pending" || review_status === null) {
      return "Pending";
    } else if (review_status === "rejected") {
      return "Rejected";
    }
  };

  const isShipped = (shipStatus: string | null) => {
    if (shipStatus === "shipped") {
      return true;
    }
    return false;
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <div
          key={project.id}
          className="rounded-lg border bg-white p-4 shadow-sm"
        >
          <h2 className="text-lg font-semibold">{project.title}</h2>
          <span className=""> {project.id} </span>{" "}
          {/* For debugging purposes, remember to remove */}
          <br></br>
          <span className=""> {isReviewed(project.review_status)}</span>
          <p className="mt-4 text-gray-600">{project.desc}</p>
          <div className="mt-6 flex gap-2">
            {project.demo_link && (
              <a
                href={project.demo_link}
                className="text-blue-500 hover:underline"
              >
                Demo
              </a>
            )}
            {project.repo_link && (
              <a
                href={project.repo_link}
                className="text-blue-500 hover:underline"
              >
                Repo
              </a>
            )}
            <Link
              href={`/projects/${project.id}/edit`}
              className="text-blue-500 hover:underline"
            >
              Edit
            </Link>

            <span
              className={`text-${isShipped(project.approved) ? "green" : "red"}-500`}
            >
              {isShipped(project.approved) ? "Shipped!" : "Not Shipped!"}
            </span>
            <br />
          </div>
        </div>
      ))}
      <a
        href="/projects/new"
        className="flex items-center justify-center rounded-lg border bg-white p-4 shadow-sm hover:bg-gray-300"
      >
        <p className="text-2xl">Create a new project</p>
      </a>
    </div>
  );
}
