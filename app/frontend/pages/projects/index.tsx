import Layout from "@/layouts/layout";
import ProjectList from "@/components/projects/ProjectList";

import type { Project } from "@/interfaces/project";

export default function Index({ projects }: { projects: Project[] }) {
  return (
    <Layout>
      <h2 className="mb-2 text-3xl font-bold">Your projects</h2>

      <ProjectList projects={projects} />
    </Layout>
  );
}
