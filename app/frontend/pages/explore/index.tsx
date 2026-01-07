import Sidebar from "@/components/sidebar";
import type { Project } from "@/interfaces/project";

export default function ExplorePage({
  projects,
}: {
  projects: (Project & { username: string })[];
}) {
  return (
    <div className="flex bg-gray-200 min-h-screen">
      <Sidebar />
      <main className="flex-1 lg:ml-64 p-6">
        <h1 className="text-3xl font-bold mb-6">Explore Projects</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div key={project.id} className="p-4 border rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold">{project.title}</h2>
              <p className="text-sm text-gray-500">
                by {project.username || "Unknown"}
              </p>
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
                {project.readme_link && (
                  <a
                    href={project.readme_link}
                    className="text-blue-500 hover:underline"
                  >
                    Readme
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
