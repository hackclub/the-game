import ProjectCreate from "@/components/Projects/ProjectCreate";
import Layout from "@/layouts/layout";

import type { HackatimeProject } from "@/interfaces/hackatime_project";

interface Props {
  hackatime_projects: HackatimeProject[];
}

export default function NewProject({ hackatime_projects }: Props) {
  return (
    <Layout>
      <h2 className="mb-2 text-3xl font-bold">Create a project</h2>
      <ProjectCreate hackatime_projects={hackatime_projects} />
    </Layout>
  );
}
