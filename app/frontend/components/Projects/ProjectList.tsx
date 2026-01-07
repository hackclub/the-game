import { App, Link } from "@inertiajs/react";

export default function ProjectList({ projects }: { projects: Project[] }) {
  const isReviewed = (review_status: string) => {
    console.log(review_status);
    if (review_status === "approved") {
      return "Approved";
    } else if (review_status === "pending") {
      return "Pending";
    } else if (review_status === "rejected") {
      return "Rejected";
    }
  };

  const isShipped = (shipStatus: string) => {
    if (shipStatus === "shipped") {
      return true;
    }
    return false;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => (
        <div key={project.id} className="p-4 border rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold">{project.title}</h2>
          <span className=""> {project.id} </span>{" "}
          {/* For debugging purposes, remember to remove */}
          <br></br>
          <span className=""> {isReviewed(project.review_status)}</span>
          <p className="text-gray-600 mt-4">{project.desc}</p>
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
    </div>
  );
}
