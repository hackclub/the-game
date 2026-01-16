import Layout from "@/layouts/layout";
import type { Project } from "@/interfaces/project";

export default function ExplorePage({
  projects,
}: {
  projects: (Project & { username: string })[];
}) {
  return (
    <Layout>
      <h1 className="mb-6 text-3xl font-bold">Explore Projects</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div key={project.id} className="rounded-lg border p-4 shadow-sm">
            <h2 className="text-lg font-semibold">{project.title}</h2>
            <p className="text-sm text-gray-500">
              by {project.username || "Unknown"}
            </p>
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
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
